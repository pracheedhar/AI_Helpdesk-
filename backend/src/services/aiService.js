const { OpenAI } = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Fallback rule-based heuristics when API key is missing
const fallbackCategoryAndPriority = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();
  
  let category = 'General Inquiry';
  let priority = 'medium';

  if (text.includes('password') || text.includes('login') || text.includes('account') || text.includes('access')) {
    category = 'Account Access';
    priority = 'high';
  } else if (text.includes('bill') || text.includes('payment') || text.includes('invoice') || text.includes('charge')) {
    category = 'Billing';
    priority = 'medium';
  } else if (text.includes('bug') || text.includes('crash') || text.includes('error') || text.includes('broken')) {
    category = 'Bug Report';
    priority = 'high';
  } else if (text.includes('feature') || text.includes('request') || text.includes('suggest')) {
    category = 'Feature Request';
    priority = 'low';
  } else if (text.includes('server down') || text.includes('critical') || text.includes('broken completely')) {
    category = 'Technical Issue';
    priority = 'critical';
  } else if (text.includes('technical') || text.includes('network') || text.includes('wifi')) {
    category = 'Technical Issue';
    priority = 'medium';
  }

  return { category, priority };
};

// Heuristic Jaccard Similarity for Duplicate Detection
const calculateJaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return Math.round((intersection.size / union.size) * 100);
};

// @desc    AI categorizer & priority classifier
exports.predictCategoryAndPriority = async (title, description) => {
  if (!openai) {
    console.log('OpenAI key missing. Using rule-based fallback classification.');
    return fallbackCategoryAndPriority(title, description);
  }

  try {
    const prompt = `You are a support classification assistant. Analyze the ticket title and description.
    Classify it into one of these categories:
    [Technical Issue, Account Access, Billing, Feature Request, Bug Report, General Inquiry, Other]
    
    Predict the priority from:
    [low, medium, high, critical]

    Ticket Title: "${title}"
    Ticket Description: "${description}"

    Return ONLY a valid JSON object with keys "category" and "priority".
    Format: {"category": "CategoryName", "priority": "priorityvalue"}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content.trim());
    return {
      category: result.category || 'General Inquiry',
      priority: result.priority || 'medium',
    };
  } catch (error) {
    console.error('OpenAI classification error:', error.message);
    return fallbackCategoryAndPriority(title, description);
  }
};

// @desc    AI Suggested Replies generator
exports.generateSuggestedReply = async (ticket, comments = []) => {
  const contextText = comments
    .map(c => `${c.userId?.name || 'User'} (${c.userId?.role || 'user'}): ${c.comment}`)
    .join('\n');

  if (!openai) {
    return `Hi ${ticket.createdBy?.name || 'Customer'},\n\nThank you for reaching out regarding "${ticket.title}". We have categorized this as a ${ticket.category} issue and assigned it a priority of ${ticket.priority}.\n\nAn agent will investigate your ticket details shortly.\n\nBest regards,\nSupport Team`;
  }

  try {
    const prompt = `You are an expert customer support agent. Generate a concise, polite, and helpful suggested reply for the agent to send.
    
    Ticket Title: "${ticket.title}"
    Description: "${ticket.description}"
    Current Status: "${ticket.status}"
    Category: "${ticket.category}"
    Priority: "${ticket.priority}"
    
    Conversation History:
    ${contextText}

    Provide the draft reply directly without quotes, intros or explanation. Keep it friendly and professional.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI reply error:', error.message);
    return 'Thank you for your patience. We are reviewing your request and will get back to you shortly.';
  }
};

// @desc    AI conversation summarization
exports.generateSummary = async (ticket, comments = []) => {
  if (comments.length === 0) {
    return `Ticket "${ticket.title}" opened. No comment discussion has occurred yet. Description: ${ticket.description.slice(0, 100)}...`;
  }

  const contextText = comments
    .map(c => `${c.userId?.name || 'User'}: ${c.comment}`)
    .join('\n');

  if (!openai) {
    return `Summary (Heuristic): Ticket focuses on "${ticket.title}". Discussion includes ${comments.length} updates. Latest status is ${ticket.status}.`;
  }

  try {
    const prompt = `Summarize the following support conversation into a short paragraph. Highlight the core issue and what steps have been proposed/taken.
    
    Ticket: "${ticket.title}"
    Description: "${ticket.description}"
    
    Conversation Log:
    ${contextText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI summarizer error:', error.message);
    return 'Summary unavailable at this time due to processing difficulties.';
  }
};

// @desc    Duplicate ticket finder using cosine-like text similarity
exports.detectDuplicates = async (currentTicket, allTickets = []) => {
  const matches = [];

  for (const t of allTickets) {
    if (t._id.toString() === currentTicket._id.toString()) continue;
    
    // Compare titles and descriptions
    const score = calculateJaccardSimilarity(
      `${currentTicket.title} ${currentTicket.description}`,
      `${t.title} ${t.description}`
    );

    if (score >= 40) { // return matches with at least 40% similarity
      matches.push({
        ticketId: t._id,
        title: t.title,
        status: t.status,
        score,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
};
