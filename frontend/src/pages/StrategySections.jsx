import { AICard, InfoCard } from '../components/AICard';

export function ContentEngineSection() {
  return (
    <section id="section-content" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Content & Messaging Engine</div>
          <div className="pv-section-subtitle">Optimize speeches, score virality, track meme culture</div>
        </div>
      </div>
      <div className="pv-grid-3">
        <AICard
          module="speech-optimizer"
          title="Speech & Post Optimizer"
          badge={{ type: 'ai', label: 'AI Tool' }}
          tagline="Turn policy notes into human language with emotional grip"
          body="Highlights missing empathy, overuse of attack language, and opportunities to anchor on tangible gains."
          inputType="textarea"
          placeholder="Paste speech excerpt, tweet, or post caption..."
          labelOverride="Draft text for optimization"
          runLabel="Suggest Improvements"
        />
        <AICard
          module="viral-scorer"
          title="Viral Potential Scorer"
          badge={{ type: 'ai', label: 'AI Tool' }}
          tagline="Estimate how far your content can travel organically"
          body="Analyzes campaign slogans and hashtags for shareability and memorability factors."
          inputType="input"
          placeholder="#JobsNotJargon or 'No one left behind'"
          labelOverride="Campaign hashtag or slogan"
          runLabel="Score Viral Potential"
        />
        <AICard
          module="meme-analyzer"
          title="Meme Trend Analyzer"
          badge={{ type: 'ai', label: 'AI Tool' }}
          tagline="Track how your message mutates in meme culture"
          body="Observe whether you are the hero, villain, or punchline of emerging memes on social platforms."
          inputType="input"
          placeholder="e.g. politician name, policy, party..."
          labelOverride="Subject to analyze"
          runLabel="Analyze Meme Culture"
        />
      </div>
    </section>
  );
}

export function SimulationSection() {
  return (
    <section id="section-simulation" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Simulation & Prediction</div>
          <div className="pv-section-subtitle">Rehearse scenarios before they go live</div>
        </div>
        <span className="pv-badge badge-sim"><span className="pv-badge-dot" />Simulation Engine</span>
      </div>
      <div className="pv-grid-2">
        <AICard
          module="mirror-sim"
          endpoint="/simulation/run"
          title="Mirror AI Reaction Simulator"
          badge={{ type: 'sim', label: 'Simulation' }}
          tagline="Rehearse reactions from supporters, neutrals, and opposition"
          body="Test how each bloc would respond if you dialed up empathy, aggression, or policy detail."
          inputType="textarea"
          placeholder="Describe the statement or scenario you want to simulate..."
          labelOverride="Scenario or statement"
          runLabel="Run Simulation"
        />
        <AICard
          module="backlash-forecast"
          endpoint="/simulation/run"
          title="Backlash Risk Forecaster"
          badge={{ type: 'sim', label: 'Simulation' }}
          tagline="Quantify how close you are to triggering anger storms"
          body="Uses spikes in negative sentiment and prior scandals to estimate organized backlash risk."
          inputType="textarea"
          placeholder="Describe the action or announcement to assess..."
          labelOverride="Scenario to assess"
          runLabel="Forecast Backlash"
        />
        <AICard
          module="media-predictor"
          endpoint="/simulation/run"
          title="Media Coverage Predictor"
          badge={{ type: 'sim', label: 'Simulation' }}
          tagline="Forecast headlines before they are written"
          body="Maps statements to likely media frames: conflict, policy detail, drama, or leadership."
          inputType="textarea"
          placeholder="Describe the statement or event..."
          labelOverride="Statement or event"
          runLabel="Predict Coverage"
        />
        <AICard
          module="controversy-model"
          endpoint="/simulation/run"
          title="Controversy Escalation Model"
          badge={{ type: 'sim', label: 'Simulation' }}
          tagline="See how a small gaffe could grow into a crisis"
          body="Chains social amplification, opposition attacks, and media echo to show worst-case arcs."
          inputType="textarea"
          placeholder="Describe the gaffe or controversial action..."
          labelOverride="Incident to model"
          runLabel="Model Escalation"
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <AICard
            module="reputation-estimator"
            endpoint="/simulation/run"
            title="Reputation Impact Estimator"
            badge={{ type: 'sim', label: 'Simulation' }}
            tagline="Measure long-tail damage or gains after a major event"
            body="Estimates shifts in trust, competence, and authenticity scores at 30, 90, and 180 days."
            inputType="textarea"
            placeholder="Describe the major event or announcement to simulate..."
            labelOverride="Event or scenario"
            runLabel="Estimate Reputation Impact"
          />
        </div>
      </div>
    </section>
  );
}

export function GeoSection() {
  return (
    <section id="section-geo" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Geo & Field Intelligence</div>
          <div className="pv-section-subtitle">On-ground data, rally impact, and turnout modeling</div>
        </div>
      </div>
      <div className="pv-grid-3">
        <AICard
          module="rally-analyzer"
          title="Rally Impact Analyzer"
          badge={{ type: 'green', label: 'On-ground boost' }}
          tagline="Did the rally move hearts, or just fill chairs?"
          body="Links field events with local sentiment trends to estimate whether rallies converted attention into durable support."
          inputType="textarea"
          placeholder="e.g. Chennai rally on 15 March, ~50,000 attendees, focused on employment..."
          labelOverride="Rally details"
          runLabel="Analyze Rally"
        />
        <AICard
          module="turnout-engine"
          title="Turnout Probability Engine"
          badge={{ type: 'shield', label: 'Energy index' }}
          tagline="Estimate who will actually show up on election day"
          body="Combines historical turnout, economic stress indicators, and current enthusiasm to project participation by region."
          inputType="textarea"
          placeholder="e.g. Tamil Nadu assembly election 2026, urban constituencies in Chennai..."
          labelOverride="Election scenario"
          runLabel="Project Turnout"
        />
        <AICard
          module="geo-snapshot"
          title="Geo & Econ Data Snapshot"
          badge={{ type: 'green', label: 'Open data' }}
          tagline="Pull a quick read of objective context"
          body="Quick economic and demographic context for any country or region relevant to political analysis."
          inputType="input"
          placeholder="e.g. Tamil Nadu, Maharashtra, Germany, Brazil..."
          labelOverride="Country or region"
          runLabel="Load Snapshot"
        />
      </div>
    </section>
  );
}
