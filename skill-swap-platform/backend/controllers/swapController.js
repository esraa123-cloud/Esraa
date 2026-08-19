const SwapRequest = require('../models/SwapRequest');
const Skill = require('../models/Skill');
const User = require('../models/User');

const formatSwap = (swapDoc, currentUserId) => {
  const swap = swapDoc.toObject ? swapDoc.toObject() : swapDoc;
  const proposerName = swap.proposer && swap.proposer.fname
    ? (String(swap.proposer._id) === String(currentUserId) ? 'أنت' : `${swap.proposer.fname} ${swap.proposer.lname}`)
    : 'مستخدم';
  const receiverName = swap.receiver && swap.receiver.fname
    ? (String(swap.receiver._id) === String(currentUserId) ? 'أنت' : `${swap.receiver.fname} ${swap.receiver.lname}`)
    : 'مستخدم';

  return {
    id: swap._id,
    _id: swap._id,
    proposer: proposerName,
    proposerId: swap.proposer && swap.proposer._id ? swap.proposer._id : swap.proposer,
    receiver: receiverName,
    receiverId: swap.receiver && swap.receiver._id ? swap.receiver._id : swap.receiver,
    offeredSkill: swap.offeredSkill,
    requestedSkill: swap.requestedSkill,
    status: swap.status,
    date: new Date(swap.createdAt).toLocaleDateString('ar-EG')
  };
};

// @route POST /api/swaps
// body: { skillId, offeredSkill, requestedSkill }
const createSwap = async (req, res, next) => {
  try {
    const { skillId, offeredSkill, requestedSkill } = req.body;

    if (!skillId || !offeredSkill || !requestedSkill) {
      return res.status(400).json({ success: false, message: 'يرجى تعبئة جميع بيانات طلب التبادل' });
    }

    const targetSkill = await Skill.findById(skillId);
    if (!targetSkill) {
      return res.status(404).json({ success: false, message: 'المهارة المطلوبة غير موجودة' });
    }

    if (String(targetSkill.owner) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'لا يمكنك تبادل مهارتك مع نفسك' });
    }

    const swap = await SwapRequest.create({
      proposer: req.user._id,
      receiver: targetSkill.owner,
      skill: targetSkill._id,
      offeredSkill,
      requestedSkill
    });

    const populated = await swap.populate([
      { path: 'proposer', select: 'fname lname' },
      { path: 'receiver', select: 'fname lname' }
    ]);

    res.status(201).json({ success: true, message: 'تم إرسال طلب التبادل بنجاح', swap: formatSwap(populated, req.user._id) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/swaps
// Returns every swap where the current user is proposer or receiver.
const getMySwaps = async (req, res, next) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ proposer: req.user._id }, { receiver: req.user._id }]
    })
      .populate('proposer', 'fname lname')
      .populate('receiver', 'fname lname')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: swaps.length,
      swaps: swaps.map((s) => formatSwap(s, req.user._id))
    });
  } catch (err) {
    next(err);
  }
};

const setStatus = (allowedFrom, newStatus) => async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'طلب التبادل غير موجود' });
    }

    const isReceiver = String(swap.receiver) === String(req.user._id);
    const isProposer = String(swap.proposer) === String(req.user._id);

    if (!isReceiver && !isProposer) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل هذا الطلب' });
    }

    // Accept/Reject can only be performed by the receiver of the request.
    if ((newStatus === 'accepted' || newStatus === 'rejected') && !isReceiver) {
      return res.status(403).json({ success: false, message: 'فقط الطرف المستقبل يمكنه قبول أو رفض الطلب' });
    }

    if (!allowedFrom.includes(swap.status)) {
      return res.status(400).json({ success: false, message: `لا يمكن تغيير الحالة من "${swap.status}" إلى "${newStatus}"` });
    }

    swap.status = newStatus;
    await swap.save();

    if (newStatus === 'completed') {
      await User.findByIdAndUpdate(swap.proposer, { $inc: { swapsCompleted: 1 } });
      await User.findByIdAndUpdate(swap.receiver, { $inc: { swapsCompleted: 1 } });
    }

    const populated = await swap.populate([
      { path: 'proposer', select: 'fname lname' },
      { path: 'receiver', select: 'fname lname' }
    ]);

    res.json({ success: true, message: 'تم تحديث حالة الطلب', swap: formatSwap(populated, req.user._id) });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/swaps/:id/accept
const acceptSwap = setStatus(['pending'], 'accepted');
// @route PATCH /api/swaps/:id/reject
const rejectSwap = setStatus(['pending'], 'rejected');
// @route PATCH /api/swaps/:id/complete
const completeSwap = setStatus(['accepted'], 'completed');

// @route PATCH /api/swaps/:id  body: { status }
// Generic status update matching the frontend's updateSwapStatus(id, status) call.
const updateSwapStatus = async (req, res, next) => {
  const { status } = req.body;
  const map = {
    accepted: acceptSwap,
    rejected: rejectSwap,
    completed: completeSwap
  };
  const handler = map[status];
  if (!handler) {
    return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
  }
  return handler(req, res, next);
};

module.exports = { createSwap, getMySwaps, acceptSwap, rejectSwap, completeSwap, updateSwapStatus };
