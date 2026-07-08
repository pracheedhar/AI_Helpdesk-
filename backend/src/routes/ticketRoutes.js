const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  assignTicket,
  getAgents,
  getTicketSummary,
  getSuggestedReply,
  getDuplicates,
} = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController');
const { addAttachment, getAttachments } = require('../controllers/attachmentController');
const { protect, authorize } = require('../middleware/authMiddleware');


// Get agents list (admin only) - must be before /:id routes
router.get('/agents', protect, authorize('admin'), getAgents);

// Base routes
router
  .route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

// Single ticket routes
router
  .route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, authorize('admin'), deleteTicket);

// Status change - agents and admins
router.patch('/:id/status', protect, authorize('agent', 'admin'), updateTicketStatus);

// Assign ticket - admin only
router.patch('/:id/assign', protect, authorize('admin'), assignTicket);

// Comments nested routes
router
  .route('/:ticketId/comments')
  .post(protect, addComment)
  .get(protect, getComments);

// Attachments nested routes
router
  .route('/:ticketId/attachments')
  .post(protect, addAttachment)
  .get(protect, getAttachments);

// AI helpers routes
router.get('/:id/ai-summary', protect, getTicketSummary);
router.get('/:id/ai-suggested-reply', protect, authorize('agent', 'admin'), getSuggestedReply);
router.get('/:id/ai-duplicates', protect, getDuplicates);

module.exports = router;


