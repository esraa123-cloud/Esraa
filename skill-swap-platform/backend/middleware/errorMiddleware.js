/**
 * Handles requests to undefined routes.
 */
const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `المسار غير موجود: ${req.originalUrl}` });
};

/**
 * Central error handler. Any `next(err)` call anywhere in the app lands here.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  let message = err.message || 'حدث خطأ في الخادم';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field === 'email' ? 'البريد الإلكتروني مستخدم بالفعل' : field === 'username' ? 'اسم المستخدم مستخدم بالفعل' : 'قيمة مكررة غير مسموح بها';
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'معرّف غير صالح';
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
