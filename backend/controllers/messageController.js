const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  const { text, recipient, isPrivate } = req.body;
  const message = await Message.create({
    sender: req.user._id,
    recipient,
    text,
    isPrivate,
  });
  res.status(201).json(message);
};

const getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id, isPrivate: true }],
  }).populate('sender recipient', 'username');
  res.json(messages);
};

module.exports = { sendMessage, getMessages };