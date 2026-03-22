const { callClaude, SYSTEM_PROMPTS } = require('../services/claudeService');
const Analysis = require('../models/Analysis');

const SIM_MODULES = ['mirror-sim', 'backlash-forecast', 'media-predictor', 'controversy-model', 'reputation-estimator'];

exports.runSimulation = async (req, res) => {
  const module = req.params.module;
  try {
    const { input, region, timeRange } = req.body;

    if (!SIM_MODULES.includes(module)) {
      return res.status(400).json({ success: false, message: `Unknown simulation module: "${module}"` });
    }

    if (!input?.trim()) {
      return res.status(400).json({ success: false, message: 'Input text is required' });
    }

    // Check Gemini key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: '⚠ Gemini API key not configured. Add GEMINI_API_KEY to backend/.env then restart the server.',
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[module];
    const { text, tokens } = await callClaude(input.trim(), systemPrompt, 1200);

    try {
      await Analysis.create({
        userId: req.user._id,
        module,
        input: input.trim().substring(0, 2000),
        output: text.substring(0, 10000),
        region: region || 'global',
        timeRange: timeRange || '24h',
        tokensUsed: tokens,
      });
    } catch (dbErr) {
      console.error('DB save error (non-fatal):', dbErr.message);
    }

    res.json({ success: true, output: text, module, tokensUsed: tokens });
  } catch (err) {
    console.error(`[${module || 'unknown-module'}] Simulation error:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
