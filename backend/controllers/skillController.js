const Skill = require('../models/Skill');

const CATEGORY_BACKGROUNDS = {
  tech: 'linear-gradient(135deg,#6a5af9,#1de9b6)',
  design: 'linear-gradient(135deg,#f5a623,#f76b8a)',
  photo: 'linear-gradient(135deg,#00c6ff,#0072ff)',
  business: 'linear-gradient(135deg,#43cea2,#185a9d)',
  languages: 'linear-gradient(135deg,#ff9966,#ff5e62)',
  music: 'linear-gradient(135deg,#a18cd1,#fbc2eb)'
};

const formatSkill = (skillDoc) => {
  const skill = skillDoc.toObject ? skillDoc.toObject() : skillDoc;
  return {
    id: skill._id,
    _id: skill._id,
    title: skill.title,
    category: skill.category,
    icon: skill.icon,
    bg: skill.bg,
    wants: skill.wants,
    rating: skill.rating,
    location: skill.location,
    owner: skill.owner && skill.owner.fname ? `${skill.owner.fname} ${skill.owner.lname}` : 'مستخدم',
    ownerId: skill.owner && skill.owner._id ? skill.owner._id : skill.owner,
    createdAt: skill.createdAt
  };
};

// @route GET /api/skills?search=&category=
const getSkills = async (req, res, next) => {
  try {
    const { search = '', category = 'all' } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { wants: regex }];
    }

    const skills = await Skill.find(query).populate('owner', 'fname lname').sort({ createdAt: -1 });
    res.json({ success: true, count: skills.length, skills: skills.map(formatSkill) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/skills/mine
const getMySkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ owner: req.user._id }).populate('owner', 'fname lname').sort({ createdAt: -1 });
    res.json({ success: true, count: skills.length, skills: skills.map(formatSkill) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/skills
const createSkill = async (req, res, next) => {
  try {
    const { title, category, wants, icon } = req.body;

    if (!title || !category || !wants) {
      return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' });
    }

    const skill = await Skill.create({
      owner: req.user._id,
      title,
      category,
      wants,
      icon: icon || '💡',
      bg: CATEGORY_BACKGROUNDS[category] || CATEGORY_BACKGROUNDS.tech,
      location: req.user.location || req.user.country || ''
    });

    // Keep the profile's "skills I can teach" list in sync.
    if (!req.user.skillsTeach.includes(title)) {
      req.user.skillsTeach.push(title);
      await req.user.save();
    }

    const populated = await skill.populate('owner', 'fname lname');

    res.status(201).json({ success: true, message: 'تمت إضافة المهارة بنجاح', skill: formatSkill(populated) });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/skills/:id
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'المهارة غير موجودة' });
    }
    if (String(skill.owner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذه المهارة' });
    }
    await skill.deleteOne();
    res.json({ success: true, message: 'تم حذف المهارة' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSkills, getMySkills, createSkill, deleteSkill, formatSkill };
