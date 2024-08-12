const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tradingJourney: [
    {
      holder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Asset', AssetSchema);
