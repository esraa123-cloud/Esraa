const express = require('express');
const router = express.Router();
const {
  getProfile,
  getUserById,
  updateProfile,
  addTeachSkill,
  addLearnSkill,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, searchUsers); // GET /api/users?search=&skill=
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/skills-teach', protect, addTeachSkill);
router.post('/profile/skills-learn', protect, addLearnSkill);
router.get('/:id', protect, getUserById);

module.exports = router;
