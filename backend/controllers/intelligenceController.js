const { callClaude, SYSTEM_PROMPTS } = require('../services/claudeService');
const Analysis = require('../models/Analysis');

// Generic handler for all AI modules
exports.runModule = async (req, res) => {
  const module = req.params.module;
  try {
    const { input, region, timeRange } = req.body;

    // Validate input
    if (!input || !input.trim()) {
      return res.status(400).json({ success: false, message: 'Input text is required' });
    }

    // Validate module exists
    const systemPrompt = SYSTEM_PROMPTS[module];
    if (!systemPrompt) {
      return res.status(400).json({
        success: false,
        message: `Unknown module: "${module}". Please restart the backend server.`,
      });
    }

    // Check Gemini key before calling
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: '⚠ Gemini API key not configured. Add GEMINI_API_KEY to backend/.env then restart the server.',
      });
    }

    const { text, tokens } = await callClaude(input.trim(), systemPrompt, 1200);

    // Save to MongoDB (wrapped separately so AI result still returns even if DB fails)
    try {
      await Analysis.create({
        userId: req.user._id,
        module,
        input: input.trim().substring(0, 2000), // cap input length stored
        output: text.substring(0, 10000),        // cap output length stored
        region: region || 'global',
        timeRange: timeRange || '24h',
        tokensUsed: tokens,
      });
    } catch (dbErr) {
      console.error('DB save error (non-fatal):', dbErr.message);
      // Don't fail the request - return AI result even if DB write fails
    }

    res.json({ success: true, output: text, module, tokensUsed: tokens });
  } catch (err) {
    console.error(`[${module || 'unknown-module'}] Intelligence module error:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get analysis history for current user
exports.getHistory = async (req, res) => {
  try {
    const { module, limit = 20, page = 1 } = req.query;
    const filter = { userId: req.user._id };
    if (module) filter.module = module;

    const [analyses, total] = await Promise.all([
      Analysis.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .select('-userId'),
      Analysis.countDocuments(filter),
    ]);

    res.json({
      success: true,
      analyses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get usage stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [stats, totalAnalyses] = await Promise.all([
      Analysis.aggregate([
        { $match: { userId } },
        { $group: { _id: '$module', count: { $sum: 1 }, totalTokens: { $sum: '$tokensUsed' }, lastUsed: { $max: '$createdAt' } } },
        { $sort: { count: -1 } },
      ]),
      Analysis.countDocuments({ userId }),
    ]);
    res.json({ success: true, stats, totalAnalyses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
