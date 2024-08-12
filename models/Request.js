const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proposedPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'denied'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Request', RequestSchema);
