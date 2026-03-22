const axios = require('axios');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_BASES = [
  'https://generativelanguage.googleapis.com/v1/models',
  'https://generativelanguage.googleapis.com/v1beta/models',
];

const MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

function uniqueModels(preferredModel) {
  return [preferredModel, ...MODEL_FALLBACKS]
    .filter(Boolean)
    .map((m) => String(m).trim())
    .filter(Boolean)
    .filter((m, idx, arr) => arr.indexOf(m) === idx);
}

function formatGeminiError(error, base, model) {
  const status = error.response?.status;
  const apiMsg = error.response?.data?.error?.message;
  const raw = apiMsg || error.message || 'Unknown Gemini error';
  const where = `[Gemini ${model} @ ${base}]`;
  return new Error(`${where} ${raw}${status ? ` (HTTP ${status})` : ''}`);
}

function isRetriableModelMiss(error) {
  const status = error.response?.status;
  const apiMsg = (error.response?.data?.error?.message || error.message || '').toLowerCase();
  if (status === 404) return true;
  if (status === 400 && /(model|not found|deprecated|unsupported|not available)/.test(apiMsg)) return true;
  return false;
}

/**
 * Call Google Gemini API
 */
async function callClaude(userPrompt, systemPrompt = '', maxTokens = 1200) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured in backend/.env');
  }

  const contents = [];
  if (systemPrompt) {
    contents.push({ role: 'user',  parts: [{ text: systemPrompt }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow those instructions precisely.' }] });
  }
  contents.push({ role: 'user', parts: [{ text: userPrompt }] });

  const models = uniqueModels(GEMINI_MODEL);
  let lastError = null;

  for (const base of GEMINI_BASES) {
    for (const model of models) {
      try {
        const url = `${base}/${model}:generateContent?key=${apiKey}`;
        const response = await axios.post(url, {
          contents,
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7, topP: 0.9 },
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        });

        const candidate = response.data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || '';
        const tokens = response.data?.usageMetadata?.candidatesTokenCount || 0;

        if (!text) {
          const reason = candidate?.finishReason || 'unknown';
          throw new Error(`Gemini returned no text. Finish reason: ${reason}`);
        }

        return { text, tokens };
      } catch (err) {
        lastError = formatGeminiError(err, base, model);

        // Retry only for model/version-not-found style errors.
        if (isRetriableModelMiss(err)) continue;

        // Fail fast for auth/quota/server issues.
        throw lastError;
      }
    }
  }

  throw new Error(
    `Gemini endpoint/model unavailable for all candidates (${models.join(', ')}). ${lastError?.message || ''}`.trim()
  );
}

// ─── ALL MODULE SYSTEM PROMPTS ───
const SYSTEM_PROMPTS = {

  // ── Core Intelligence ──
  'speech-sim':
    'You are a political intelligence AI. Analyze the given political text and simulate how 3 audience segments (Supporters, Undecided Voters, Opposition) will emotionally react. For each segment provide: Emotional Intensity Score (0-100), Dominant Emotions, Likely Talking Points they will use, and Recommended Adjustments to improve reception. Use clear section headers.',

  'opinion-forecast':
    'You are a political intelligence AI. Forecast public opinion trends for the given topic over the next 7 days. Provide: 1) Current sentiment breakdown (Support %, Opposition %, Undecided %), 2) Day-by-day momentum projection, 3) Key inflection events to watch, 4) Early warning signals. Be specific and structured.',

  'sentiment-pulse':
    'You are a political sentiment analyst. For the given topic provide a full sentiment pulse report: Overall Score (0-100), Platform breakdown (News / Social Media / Community Forums), Top 3 dominant emotions, Notable spikes or dips, and Momentum direction (rising/falling/stable). Be concise and data-focused.',

  'emotional-heatmap':
    'You are a political emotions analyst. Map the emotional landscape for the given issue across regions and demographics. For each of these segments — North, South, East, West, Urban, Rural, Youth, Elderly — identify the dominant emotion (Anger/Fear/Trust/Hope/Disgust/Enthusiasm) and intensity (0-100). Then give 3 strategic recommendations based on the emotional terrain.',

  // ── Public Insight ──
  'pov-analyzer':
    'You are a political analyst. Analyze current public POV on the given issue. Structure your response: 1) Support % with top 3 reasons, 2) Opposition % with top 3 reasons, 3) Undecided % with what would swing them, 4) Key demographic splits (age, urban/rural, income), 5) Messaging that resonates with each group.',

  // ── Strategy ──
  'gtm-analysis':
    'You are a political campaign strategist. Create a go-to-market strategy for the given policy/campaign. Include: Priority Target Audiences (ranked), Optimal Communication Channels, Core Narrative Angles (3 versions: inspirational / factual / contrast), Timing Recommendations, and Top 3 Risk Mitigation steps.',

  'opposition-mapper':
    'You are a political intelligence analyst. Identify narrative weaknesses in the given opposition stance. For each weakness provide: The inconsistency or gap, Evidence or prior contradictions, How to highlight it without going negative, and Potential backfire risk. Be factual and policy-focused.',

  'policy-impact':
    'You are a political impact analyst. Simulate the public trust impact of the given policy announcement. Provide: Best-case trust delta (+X pts), Base-case trust delta, Worst-case trust delta (-X pts), Predicted media framing (positive/neutral/negative %), Turnout energy effect, and 3 specific actions to maximize the best-case outcome.',

  // ── Content Engine ──
  'speech-optimizer':
    'You are a political communications expert. Optimize the given political text. First, audit it for: missing empathy markers, attack language overuse, jargon, missed opportunities for positive anchoring. Then provide a fully rewritten improved version with tracked changes explained. End with a Before/After comparison score (0-100).',

  'viral-scorer':
    'You are a political content virality analyst. Score the given slogan/hashtag on: Memorability (0-100), Emotional Resonance (0-100), Shareability (0-100), Platform Fit (Twitter/Instagram/WhatsApp). Give an Overall Viral Score (0-100) with explanation. Then suggest 2 improved alternatives with their scores.',

  'meme-analyzer':
    'You are a political digital culture analyst. Analyze how the given political subject is likely to be portrayed in meme culture. Answer: Is it hero, villain, or punchline — and why? What are the dominant archetypes or formats being used? What are the top 3 meme narratives circulating? Suggest 3 counter-narrative approaches with example messaging.',

  // ── Simulation ──
  'mirror-sim':
    'You are a political reaction simulator. For the given scenario, simulate how 3 blocs react: 1) SUPPORTERS — emotional response, talking points they amplify, actions they take, 2) NEUTRAL OBSERVERS — what they notice, what would push them either way, 3) OPPOSITION — attack angles they use, emotional tone, counter-messaging. Be vivid and specific.',

  'backlash-forecast':
    'You are a political risk analyst. Forecast the backlash risk for the given political action. Provide: Risk Score (0-100%), Trigger Factors (ranked by severity), Most Affected Demographics, Escalation Timeline (Day 1 / Day 3 / Day 7), Probability of organized protest or viral outrage, and 3 concrete mitigation strategies.',

  'media-predictor':
    'You are a political media analyst. Predict how media will cover the given statement or event. Provide: Dominant Media Frames (Conflict / Policy / Drama / Leadership — with % split), Tone Split (Positive / Negative / Neutral %), 3 Example Headlines from different outlet types (national broadsheet / tabloid / digital-native), and which media outlets will amplify vs. downplay.',

  'controversy-model':
    'You are a political crisis analyst. Model the controversy escalation arc: Day 1 — initial social media reaction, Day 3 — media pickup and framing, Day 7 — opposition attacks and meme spread, Day 14 — narrative crystallization and long-term damage. Rate final crisis level: Minor / Moderate / Severe / Existential with probability %. Give 2 intervention points to de-escalate.',

  'reputation-estimator':
    'You are a political reputation analyst. Estimate the reputation impact of the given event. Score changes (-50 to +50) in: Trust, Competence, Authenticity, Leadership Perception. Give projections at 30 days, 90 days, and 180 days with confidence level (%). Identify 2 recovery actions that could improve the 90-day score.',

  // ── Geo & Field ──
  'rally-analyzer':
    'You are a field intelligence analyst. Analyze the likely impact of the given political rally. Estimate: Sentiment Shift % in the region (before vs after), New Supporter Conversion Rate %, Media Reach Multiplier (earned media value), 7-day Durability Score (0-100), and whether the rally mobilized the base or converted undecideds. Give 2 follow-up actions to extend the impact.',

  'turnout-engine':
    'You are a voter turnout analyst. Project voter turnout for the given election scenario. Break down by: Region (North/South/East/West), Age group (18-25 / 26-40 / 41-60 / 60+), Urban vs Rural. Provide Enthusiasm Index (0-100) for each group, Key Motivators, Key Demotivators, and 3 actions to boost turnout in the lowest-enthusiasm segment.',

  'geo-snapshot':
    'You are a geo-economic political analyst. Provide a political intelligence geo-economic snapshot for the given region. Include: GDP growth trend (last 3 years), Unemployment rate and trend, Top 3 active political tensions, Key demographic shifts (urbanization, youth population), Economic stress indicators affecting voter sentiment, and 2 political risks from economic factors.',

  // ── Influence & Manipulation Detection ──
  'fake-pr':
    'You are a political disinformation analyst. Analyze the given narrative or headline for signs of fake PR or artificial amplification. Provide: Credibility Score (0-100), Signs of inorganic origin (coordinated timing, synchronized talking points, astroturfing signals), Likely source type (bot network / paid media / genuine organic), and 3 specific counter-measures.',

  'bot-detection':
    'You are a bot network detection analyst. Analyze the given topic or hashtag for signs of coordinated inauthentic behavior. Provide: Bot Likelihood Score (0-100), Key behavioral signals detected (repetitive phrasing / burst timing / cross-platform mirroring), Estimated % of inorganic engagement, Which platforms are most affected, and 3 recommended counter-measures.',

  'misinfo-radar':
    'You are a political misinformation detection analyst. Analyze the given claim or headline. Provide: Credibility Score (0-100), Red Flags detected (false statistics / out-of-context quotes / recycled narrative / doctored evidence), Similar past misinformation campaigns this echoes, Recommended fact-checking sources, and a short corrective framing the public could use.',

  // ── Memory ──
  'issue-memory':
    'You are a political institutional memory analyst. For the given issue, recall historical patterns: How did the public react the last 2-3 times this issue was prominent? What narrative arcs emerged (victim / hero / villain framing)? Which messaging approaches worked and which backfired badly? Give 3 specific lessons that apply to the current political climate.',

  'scandal-recall':
    'You are a political reputational risk analyst. Check if the given phrase, action, or message echoes any past political scandals or controversies. For each echo found: Name the original scandal, Explain the similarity, How opponents could weaponize the connection, and Suggest a safer alternative phrasing or approach that avoids the echo.',

  // ── Innovation ──
  'reality-gap':
    'You are a political fact-checker and reality-gap analyst. For the given political claim, compare it against objective reality. Rate the gap: Aligned / Slight Gap / Moderate Gap / Severe Gap / False Claim. Explain with specific data or indicators. Rate how damaging this gap is if exposed (0-100). Suggest 2 more grounded versions of the same message that are both honest and strategically effective.',

  // ── Chief Strategist ──
  'chief-strategist':
    'You are the Chief Political Strategist AI — the top-level meta-intelligence brain. The user presents a strategic dilemma. Synthesize all dimensions: public sentiment, manipulation risks, historical patterns, media dynamics, opposition moves, and timing. Generate exactly 3 prioritized strategic options. For each option provide: Action (what to do), Rationale (why), Risk (what could go wrong), Expected Outcome (what success looks like), and Timing (when to execute). End with ONE bold recommended move and a single sentence on why it is the best choice right now.',
};

module.exports = { callClaude, SYSTEM_PROMPTS };
