const User = require('../models/User');
const { sanitizeUser } = require('./authController');

// @route GET /api/users/profile  (own profile)
const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/:id  (public profile)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['fname', 'lname', 'title', 'location', 'bio', 'avatar', 'country', 'name'];
    const updates = {};

    // The frontend edits a combined "name" field in some flows; split it if provided.
    if (req.body.name && !req.body.fname && !req.body.lname) {
      const parts = String(req.body.name).trim().split(' ');
      updates.fname = parts[0] || req.user.fname;
      updates.lname = parts.slice(1).join(' ') || req.user.lname;
    }

    allowedFields.forEach((field) => {
      if (field === 'name') return;
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Array.isArray(req.body.skillsTeach)) {
      updates.skillsTeach = req.body.skillsTeach;
    }
    if (Array.isArray(req.body.skillsLearn)) {
      updates.skillsLearn = req.body.skillsLearn;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'تم تحديث الملف الشخصي', user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/profile/skills-teach
const addTeachSkill = async (req, res, next) => {
  try {
    const { skill } = req.body;
    if (!skill || !skill.trim()) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المهارة' });
    }
    req.user.skillsTeach.push(skill.trim());
    await req.user.save();
    res.json({ success: true, user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/profile/skills-learn
const addLearnSkill = async (req, res, next) => {
  try {
    const { skill } = req.body;
    if (!skill || !skill.trim()) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المهارة' });
    }
    req.user.skillsLearn.push(skill.trim());
    await req.user.save();
    res.json({ success: true, user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users?search=&skill=&category=
// Search users by name/username, and filter by a skill they teach.
const searchUsers = async (req, res, next) => {
  try {
    const { search = '', skill = '' } = req.query;
    const query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fname: regex }, { lname: regex }, { username: regex }, { title: regex }];
    }

    if (skill.trim()) {
      query.skillsTeach = { $regex: new RegExp(skill.trim(), 'i') };
    }

    const users = await User.find(query).limit(50);
    res.json({ success: true, count: users.length, users: users.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getUserById,
  updateProfile,
  addTeachSkill,
  addLearnSkill,
  searchUsers
};
