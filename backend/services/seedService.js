/**
 * Optional helper to seed the database with a demo user and a few skills,
 * so the frontend has something to display right after a fresh setup.
 * Run with: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');
const Skill = require('../models/Skill');
const { hashPassword } = require('./passwordService');

const demoSkills = [
  { title: 'تطوير مواقع React', category: 'tech', icon: '💻', wants: 'تصميم شعارات', bg: 'linear-gradient(135deg,#6a5af9,#1de9b6)' },
  { title: 'تصميم واجهات UI/UX', category: 'design', icon: '🎨', wants: 'تعلم التصوير الفوتوغرافي', bg: 'linear-gradient(135deg,#f5a623,#f76b8a)' },
  { title: 'مونتاج فيديو احترافي', category: 'photo', icon: '📸', wants: 'تعلم اللغة الإنجليزية', bg: 'linear-gradient(135deg,#00c6ff,#0072ff)' }
];

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'demo@mahara.io' });
  let demoUser = existing;
  if (!demoUser) {
    const hashed = await hashPassword('Demo@1234');
    demoUser = await User.create({
      fname: 'مستخدم',
      lname: 'تجريبي',
      username: 'demo_user',
      email: 'demo@mahara.io',
      password: hashed,
      title: 'مطور ويب',
      country: 'مصر',
      location: 'القاهرة، مصر',
      bio: 'حساب تجريبي لتجربة منصة مهارة.',
      skillsTeach: ['برمجة الويب'],
      skillsLearn: ['تصميم الجرافيك']
    });
    console.log('Created demo user: demo@mahara.io / Demo@1234');
  }

  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany(
      demoSkills.map((s) => ({
        ...s,
        owner: demoUser._id,
        location: demoUser.location
      }))
    );
    console.log('Seeded demo skills.');
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
