const Ticket = require('../models/Ticket');
const User = require('../models/User');

const aiService = require('../services/aiService');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    // Call AI auto-tagging
    const aiPrediction = await aiService.predictCategoryAndPriority(title, description);

    const ticket = await Ticket.create({
      title,
      description,
      category: category || aiPrediction.category,
      priority: priority || aiPrediction.priority,
      createdBy: req.user._id,
    });

    await ticket.populate('createdBy', 'name email role');

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get all tickets (role-filtered)
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    let query = {};

    // Regular users only see their own tickets
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }
    // Agents see tickets assigned to them OR unassigned open tickets
    else if (req.user.role === 'agent') {
      query = {
        $or: [{ assignedTo: req.user._id }, { assignedTo: null }],
      };
    }
    // Admins see everything

    // Filtering
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.category) query.category = req.query.category;

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Regular users can only view their own tickets
    if (
      req.user.role === 'user' &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ticket (title, description, category, priority)
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Only the creator or admin can update ticket details
    if (
      req.user.role === 'user' &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    const { title, description, category, priority } = req.body;

    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, description, category, priority },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (admin only)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    await ticket.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change ticket status
// @route   PATCH /api/tickets/:id/status
// @access  Private (agent, admin)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign ticket to an agent
// @route   PATCH /api/tickets/:id/assign
// @access  Private (admin only)
exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (agentId) {
      const agent = await User.findById(agentId);
      if (!agent || !['agent', 'admin'].includes(agent.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent: user not found or does not have agent/admin role',
        });
      }
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: agentId || null },
      { new: true }
    )
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all agents (for assignment dropdown)
// @route   GET /api/tickets/agents
// @access  Private (admin)
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: { $in: ['agent', 'admin'] } }).select(
      'name email role'
    );
    res.json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Summary of conversation
// @route   GET /api/tickets/:id/ai-summary
// @access  Private
exports.getTicketSummary = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const Comment = require('../models/Comment');
    const comments = await Comment.find({ ticketId: ticket._id }).populate('userId', 'name role');

    const summary = await aiService.generateSummary(ticket, comments);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Suggested Reply for agents/admins
// @route   GET /api/tickets/:id/ai-suggested-reply
// @access  Private (agent, admin)
exports.getSuggestedReply = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const Comment = require('../models/Comment');
    const comments = await Comment.find({ ticketId: ticket._id }).populate('userId', 'name role');

    const reply = await aiService.generateSuggestedReply(ticket, comments);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Detect duplicate tickets
// @route   GET /api/tickets/:id/ai-duplicates
// @access  Private
exports.getDuplicates = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const allTickets = await Ticket.find({});
    const duplicates = await aiService.detectDuplicates(ticket, allTickets);
    res.json({ success: true, duplicates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

