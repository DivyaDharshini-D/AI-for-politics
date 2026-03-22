const mongoose = require('mongoose');

const newsCacheSchema = new mongoose.Schema({
  query: { type: String, required: true },
  source: { type: String, enum: ['newsdata', 'gnews', 'newsapi'], required: true },
  articles: [{ title: String, description: String, url: String, publishedAt: Date, source: String, sentiment: Number }],
  fetchedAt: { type: Date, default: Date.now, expires: 3600 }, // TTL: 1 hour
});

newsCacheSchema.index({ query: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('NewsCache', newsCacheSchema);
