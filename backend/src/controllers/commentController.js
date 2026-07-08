const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

// @desc    Add comment to a ticket
// @route   POST /api/tickets/:ticketId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const ticketId = req.params.ticketId;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role restrictions: user can only comment on their own tickets
    if (
      req.user.role === 'user' &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to comment on this ticket' });
    }

    const commentObj = await Comment.create({
      ticketId,
      userId: req.user._id,
      comment,
    });

    await commentObj.populate('userId', 'name email role');

    res.status(201).json({ success: true, data: commentObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for a ticket
// @route   GET /api/tickets/:ticketId/comments
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role restrictions: user can only view comments on their own tickets
    if (
      req.user.role === 'user' &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view comments for this ticket' });
    }

    const comments = await Comment.find({ ticketId })
      .populate('userId', 'name email role')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
