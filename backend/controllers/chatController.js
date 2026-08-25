const Chat = require('../models/Chat');
const User = require('../models/User');

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

const formatChat = (chatDoc, currentUserId) => {
  const chat = chatDoc.toObject ? chatDoc.toObject() : chatDoc;
  const peer = chat.participants.find((p) => String(p._id) === String(currentUserId)) === undefined
    ? chat.participants[0]
    : chat.participants.find((p) => String(p._id) !== String(currentUserId));

  return {
    id: chat._id,
    _id: chat._id,
    peerId: peer ? peer._id : null,
    peerName: peer ? `${peer.fname} ${peer.lname}` : 'مستخدم',
    peerAvatar: peer && peer.avatar ? peer.avatar : (peer ? peer.fname.charAt(0) : 'ع'),
    messages: chat.messages.map((m) => ({
      id: m._id,
      sender: String(m.sender) === String(currentUserId) ? 'me' : 'peer',
      text: m.text,
      time: formatTime(m.createdAt)
    }))
  };
};

// @route GET /api/chats
const getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'fname lname avatar')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: chats.length, chats: chats.map((c) => formatChat(c, req.user._id)) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/chats/start   body: { peerId } OR { peerName }
// Finds an existing 1:1 chat with the peer, or creates one.
const startChat = async (req, res, next) => {
  try {
    const { peerId, peerName } = req.body;

    let peer = null;
    if (peerId) {
      peer = await User.findById(peerId);
    } else if (peerName) {
      const parts = peerName.trim().split(' ');
      peer = await User.findOne({ fname: parts[0], ...(parts[1] ? { lname: parts.slice(1).join(' ') } : {}) });
      if (!peer) {
        // Fall back to a loose name match so demo/seed owners still resolve.
        peer = await User.findOne({
          $expr: { $eq: [{ $concat: ['$fname', ' ', '$lname'] }, peerName.trim()] }
        });
      }
    }

    if (!peer) {
      return res.status(404).json({ success: false, message: 'تعذر إيجاد هذا المستخدم لبدء محادثة معه' });
    }

    if (String(peer._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'لا يمكنك بدء محادثة مع نفسك' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, peer._id], $size: 2 }
    }).populate('participants', 'fname lname avatar');

    if (!chat) {
      chat = await Chat.create({ participants: [req.user._id, peer._id], messages: [] });
      chat = await chat.populate('participants', 'fname lname avatar');
    }

    res.status(201).json({ success: true, chat: formatChat(chat, req.user._id) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/chats/:id/messages   body: { text }
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'لا يمكن إرسال رسالة فارغة' });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'المحادثة غير موجودة' });
    }

    if (!chat.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بإرسال رسائل في هذه المحادثة' });
    }

    chat.messages.push({ sender: req.user._id, text: text.trim() });
    await chat.save();

    const populated = await chat.populate('participants', 'fname lname avatar');
    res.status(201).json({ success: true, chat: formatChat(populated, req.user._id) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyChats, startChat, sendMessage };
