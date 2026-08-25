const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['tech', 'design', 'photo', 'business', 'languages', 'music']
    },
    icon: { type: String, default: '💡' },
    bg: { type: String, default: 'linear-gradient(135deg, #f5a623, #1de9b6)' },
    wants: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5 },
    location: { type: String, default: '' }
  },
  { timestamps: true }
);

SkillSchema.index({ title: 'text', wants: 'text' });

module.exports = mongoose.model('Skill', SkillSchema);
