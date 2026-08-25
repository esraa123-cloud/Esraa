const { verifyToken } = require('../services/tokenService');
const { isRevoked } = require('../services/tokenBlacklistService');
const User = require('../models/User');

/**
 * Protects a route by requiring a valid Bearer JWT in the Authorization header.
 * Attaches the authenticated user (without password) to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'غير مصرح، الرجاء تسجيل الدخول' });
    }

    const token = authHeader.split(' ')[1];

    if (isRevoked(token)) {
      return res.status(401).json({ success: false, message: 'تم تسجيل الخروج من هذه الجلسة، الرجاء تسجيل الدخول مجدداً' });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
  }
};

module.exports = { protect };
