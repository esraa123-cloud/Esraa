const express = require('express');
const router = express.Router();
const { getMyChats, startChat, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyChats);
router.post('/start', protect, startChat);
router.post('/:id/messages', protect, sendMessage);

module.exports = router;
