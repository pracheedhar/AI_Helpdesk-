const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [2000, 'Comment cannot be more than 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for query optimization
commentSchema.index({ ticketId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
