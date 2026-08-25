const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [MessageSchema]
  },
  { timestamps: true }
);

// A pair of participants should only ever have one chat thread.
ChatSchema.index({ participants: 1 });

module.exports = mongoose.model('Chat', ChatSchema);
