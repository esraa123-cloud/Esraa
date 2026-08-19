const User = require('../models/User');
const { hashPassword, comparePassword } = require('../services/passwordService');
const { generateToken } = require('../services/tokenService');
const { revokeToken } = require('../services/tokenBlacklistService');

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.password;
  return user;
};

// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const {
      fname,
      lname,
      email,
      password,
      cpassword,
      username,
      country,
      job,
      skillsTeach,
      skillsLearn
    } = req.body;

    if (!fname || !lname || !email || !password || !username || !job) {
      return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' });
    }

    if (cpassword !== undefined && password !== cpassword) {
      return res.status(400).json({ success: false, message: 'كلمتا السر غير متطابقتين' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'كلمة السر يجب أن تكون 6 أحرف على الأقل' });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: existing.email === email.toLowerCase() ? 'البريد الإلكتروني مستخدم بالفعل' : 'اسم المستخدم مستخدم بالفعل'
      });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      fname,
      lname,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashed,
      title: job,
      country: country || '',
      location: country || '',
      skillsTeach: Array.isArray(skillsTeach) ? skillsTeach : [],
      skillsLearn: Array.isArray(skillsLearn) ? skillsLearn : []
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    if (req.token) {
      revokeToken(req.token);
    }
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe, sanitizeUser };
