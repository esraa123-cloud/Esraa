const mongoose = require('mongoose');

/**
 * Connects to MongoDB using MONGO_URI environment variable.
 * Reuses existing connection in serverless / hot environments.
 * In production, connects strictly to MONGO_URI and never uses MongoMemoryServer.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skill_swap_platform';
  const isProd = process.env.NODE_ENV === 'production';

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedIfNeeded();
    return conn;
  } catch (err) {
    if (isProd) {
      console.error(`Production MongoDB connection error: ${err.message}`);
      throw err;
    }

    console.log(`Local MongoDB server not responding on ${uri} (${err.message}). Starting MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        binary: {
          version: '6.0.14'
        }
      });
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`Connected to MongoMemoryServer: ${conn.connection.host}/${conn.connection.name}`);
      await autoSeedIfNeeded();
      return conn;
    } catch (memErr) {
      console.error(`Failed to start MongoMemoryServer: ${memErr.message}`);
      process.exit(1);
    }
  }
};

/**
 * Seeds initial demo data if database is empty so UI has default demo users/skills.
 */
const autoSeedIfNeeded = async () => {
  try {
    const User = require('../models/User');
    const Skill = require('../models/Skill');
    const { hashPassword } = require('../services/passwordService');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial demo users and skills...');
      const defaultPassword = await hashPassword('Demo@1234');

      const demoUsers = [
        {
          fname: 'أحمد',
          lname: 'رضا',
          username: 'ahmed_react',
          email: 'ahmed@mahara.io',
          password: defaultPassword,
          title: 'مطور ويب متخصص React',
          country: 'مصر',
          location: 'مصر - القاهرة',
          bio: 'شغوف بتطوير واجهات المستخدم التفاعلية وصناعة تجارب رقمية ممتازة.',
          skillsTeach: ['تطوير React', 'JavaScript', 'HTML/CSS'],
          skillsLearn: ['تصميم UI/UX', 'Figma', 'إدارة المشاريع'],
          rating: 4.9,
          swapsCompleted: 12
        },
        {
          fname: 'إسراء',
          lname: 'صلاح',
          username: 'esraa_nova',
          email: 'esraa@mahara.io',
          password: defaultPassword,
          title: 'مهندسة برمجيات وواجهات',
          country: 'مصر',
          location: 'مصر - الجيزة',
          bio: 'عضو فريق Codex_Nova المطور لمنصة مهارة. أحب البرمجة وتبادل الخبرات المعرفية.',
          skillsTeach: ['تطوير الويب', 'تصميم واجهات', 'حل المشكلات'],
          skillsLearn: ['ذكاء اصطناعي', 'تطوير تطبيقات الجوال'],
          rating: 5.0,
          swapsCompleted: 18
        },
        {
          fname: 'سارة',
          lname: 'منصور',
          username: 'sara_design',
          email: 'sara@mahara.io',
          password: defaultPassword,
          title: 'مصممة جرافيك وهويات بصرية',
          country: 'السعودية',
          location: 'السعودية - الرياض',
          bio: 'خبرة 5 سنوات في تصميم الشعارات وتصميم الهويات البصرية للشركات الناشئة.',
          skillsTeach: ['تصميم جرافيك', 'Photoshop', 'Illustrator'],
          skillsLearn: ['محاسبة', 'إدارة الأعمال'],
          rating: 4.8,
          swapsCompleted: 9
        }
      ];

      const createdUsers = await User.insertMany(demoUsers);
      console.log(`Created ${createdUsers.length} demo users.`);

      const u1 = createdUsers[0];
      const u2 = createdUsers[1];
      const u3 = createdUsers[2];

      const initialSkills = [
        { owner: u1._id, title: 'تطوير مواقع ويب – React', category: 'tech', icon: '💻', location: 'القاهرة', wants: 'تصميم UI', rating: 5, bg: 'linear-gradient(135deg, #1a2540, #0f1a30)' },
        { owner: u3._id, title: 'تصميم جرافيك احترافي', category: 'design', icon: '🎨', location: 'الرياض', wants: 'محاسبة', rating: 4.8, bg: 'linear-gradient(135deg, #1a1f30, #121830)' },
        { owner: u2._id, title: 'تصميم واجهات المستخدم UI/UX', category: 'design', icon: '🎨', location: 'الجيزة', wants: 'ذكاء اصطناعي', rating: 5, bg: 'linear-gradient(135deg, #241e12, #18140c)' },
        { owner: u1._id, title: 'إدارة الحملات الإعلانية', category: 'business', icon: '📊', location: 'القاهرة', wants: 'تصميم هوية', rating: 4.7, bg: 'linear-gradient(135deg, #241420, #180d16)' }
      ];

      await Skill.insertMany(initialSkills);
      console.log('Seeded demo skills successfully.');
    }
  } catch (err) {
    console.error('Auto seed warning:', err.message);
  }
};

module.exports = connectDB;
