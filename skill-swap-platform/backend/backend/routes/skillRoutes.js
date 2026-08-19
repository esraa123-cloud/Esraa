const express = require('express');
const router = express.Router();
const { getSkills, getMySkills, createSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// Browsing skills is public so visitors can explore the marketplace before signing up.
router.get('/', getSkills); // GET /api/skills?search=&category=
router.get('/mine', protect, getMySkills);
router.post('/', protect, createSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
