const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },

    title: { type: String, default: '' }, // job / specialty
    country: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },

    skillsTeach: { type: [String], default: [] },
    skillsLearn: { type: [String], default: [] },

    rating: { type: Number, default: 5 },
    swapsCompleted: { type: Number, default: 0 }
  },
  { timestamps: true }
);

UserSchema.virtual('name').get(function () {
  return `${this.fname} ${this.lname}`.trim();
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
