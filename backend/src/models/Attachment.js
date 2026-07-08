const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please add a file URL'],
    },
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attachmentSchema.index({ ticketId: 1 });

module.exports = mongoose.model('Attachment', attachmentSchema);
