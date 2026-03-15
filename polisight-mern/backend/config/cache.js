const NodeCache = require('node-cache');

// Shared cache — stdTTL 5 min, auto-cleanup every 60s
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60, useClones: false });

module.exports = cache;
