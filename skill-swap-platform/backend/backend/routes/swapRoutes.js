const express = require('express');
const router = express.Router();
const {
  createSwap,
  getMySwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
  updateSwapStatus
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMySwaps);
router.post('/', protect, createSwap);
router.patch('/:id', protect, updateSwapStatus); // body: { status }
router.patch('/:id/accept', protect, acceptSwap);
router.patch('/:id/reject', protect, rejectSwap);
router.patch('/:id/complete', protect, completeSwap);

module.exports = router;
