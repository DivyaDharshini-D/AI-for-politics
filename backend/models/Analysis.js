const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: {
    type: String,
    required: true,
    enum: [
      'speech-sim', 'opinion-forecast', 'sentiment-pulse', 'emotional-heatmap',
      'pov-analyzer', 'gtm-analysis', 'opposition-mapper', 'policy-impact',
      'speech-optimizer', 'viral-scorer', 'meme-analyzer',
      'mirror-sim', 'backlash-forecast', 'media-predictor', 'controversy-model', 'reputation-estimator',
      'rally-analyzer', 'turnout-engine', 'geo-snapshot',
      'issue-memory', 'scandal-recall', 'reality-gap',
      'chief-strategist', 'misinfo-radar', 'fake-pr', 'bot-detection'
    ]
  },
  input: { type: String, required: true },
  output: { type: String, required: true },
  region: { type: String, default: 'global' },
  timeRange: { type: String, default: '24h' },
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

analysisSchema.index({ userId: 1, module: 1 });
analysisSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
