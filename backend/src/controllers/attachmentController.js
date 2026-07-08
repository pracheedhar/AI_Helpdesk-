const Attachment = require('../models/Attachment');
const Ticket = require('../models/Ticket');

// @desc    Add attachment to a ticket
// @route   POST /api/tickets/:ticketId/attachments
// @access  Private
exports.addAttachment = async (req, res) => {
  try {
    const { fileUrl, fileName } = req.body;
    const ticketId = req.params.ticketId;

    if (!fileUrl || !fileName) {
      return res.status(400).json({ success: false, message: 'Please provide fileUrl and fileName' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role restrictions: user can only attach to their own tickets
    if (
      req.user.role === 'user' &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to add attachments to this ticket' });
    }

    const attachment = await Attachment.create({
      ticketId,
      fileUrl,
      fileName,
      uploadedBy: req.user._id,
    });

    await attachment.populate('uploadedBy', 'name email role');

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attachments for a ticket
// @route   GET /api/tickets/:ticketId/attachments
// @access  Private
exports.getAttachments = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role restrictions
    if (
      req.user.role === 'user' &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view attachments for this ticket' });
    }

    const attachments = await Attachment.find({ ticketId })
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: attachments.length, data: attachments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
