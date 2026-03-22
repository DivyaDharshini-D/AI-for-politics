import { useState, useEffect } from 'react';
import { AICard, InfoCard } from '../components/AICard';
import { useLocation } from '../context/LocationContext';
import api from '../services/api';

export function InfluenceDetectionSection() {
  return (
    <section id="section-influence" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Influence & Manipulation Detection</div>
          <div className="pv-section-subtitle">Identify bots, fake PR, and misinformation early</div>
        </div>
        <span className="pv-badge badge-shield"><span className="pv-badge-dot" />Integrity Shield</span>
      </div>
      <div className="pv-grid-3">
        <AICard
          module="fake-pr"
          title="Fake PR Detection"
          badge={{ type: 'shield', label: 'Integrity' }}
          tagline="Spot artificial narrative boosting before it becomes 'reality'"
          body="Detects inorganic amplification of a talking point — paste a narrative or news headline to analyze."
          inputType="textarea"
          placeholder="Paste a narrative, headline, or talking point to check for artificial amplification..."
          labelOverride="Narrative or headline to analyze"
        />
        <AICard
          module="bot-detection"
          title="Bot Network Identification"
          badge={{ type: 'shield', label: 'Integrity' }}
          tagline="Separate real people from synthetic crowds"
          body="Analyzes a topic or hashtag for signs of coordinated bot activity — repetitive phrasing, burst posting, cross-platform mirroring."
          inputType="input"
          placeholder="e.g. #ElectionFraud, party name, campaign hashtag..."
          labelOverride="Topic or hashtag to scan"
          chips={['Repetitive phrasing', 'Burst posting', 'Cross-platform mirroring']}
        />
        <AICard
          module="misinfo-radar"
          title="Misinformation Radar"
          badge={{ type: 'shield', label: 'Integrity' }}
          tagline="Catch fake stories while they are still small"
          body="Flags low-credibility claims, recycled narratives, and doctored content patterns."
          inputType="textarea"
          placeholder="Paste a headline, claim, or news snippet to fact-check..."
          labelOverride="Claim or headline to fact-check"
        />
      </div>
    </section>
  );
}

export function PublicInsightSection() {
  const [regional, setRegional] = useState([]);
  const { locationLabel, country, state, party, countryData } = useLocation();

  useEffect(() => {
    api.get('/analytics/regional', {
      params: {
        country: countryData.name,
        state,
        party,
        region: locationLabel || countryData.name,
      },
    }).then((r) => setRegional(r.data.regional || [])).catch(() => {});
  }, [country, state, party, locationLabel, countryData.name]);

  const defaultRegional = [
    { region: 'North', support: 43, opposition: 36, undecided: 21 },
    { region: 'South', support: 51, opposition: 31, undecided: 18 },
    { region: 'East', support: 47, opposition: 33, undecided: 20 },
    { region: 'West', support: 45, opposition: 35, undecided: 20 },
    { region: 'Urban', support: 49, opposition: 32, undecided: 19 },
    { region: 'Rural', support: 44, opposition: 37, undecided: 19 },
  ];
  const rows = regional.length ? regional : defaultRegional;

  return (
    <section id="section-public" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Public Insight & POV</div>
          <div className="pv-section-subtitle">What people actually think — not just what they click</div>
        </div>
      </div>
      <div className="pv-grid-2">
        <AICard
          module="pov-analyzer"
          title="Current People POV Analyzer"
          badge={{ type: 'green', label: 'Ground truth lens' }}
          tagline="Blends live sentiment with regional splits to summarize public position"
          body="Summarize public position across support, opposition, and undecided cohorts for any issue."
          inputType="input"
          placeholder="e.g. farm bill, fuel price, student loans..."
          labelOverride="Issue or keyword"
        />
        <InfoCard
          title="Regional Sentiment Index"
          badge={{ type: 'shield', label: 'Geo splits' }}
          tagline="Compare mood across key regions"
          body={`Current sentiment snapshot${locationLabel ? ` · ${locationLabel}` : ''}:`}
        >
          <div className="pv-divider" />
          {rows.map(r => (
            <div key={r.region} className="pv-regional-row">
              <span className="pv-regional-name">{r.region}</span>
              <span>
                <span className="pv-pill positive">Support {r.support}%</span>
                <span className="pv-pill negative">Opp. {r.opposition}%</span>
                <span className="pv-pill neutral">Undecided {r.undecided}%</span>
              </span>
            </div>
          ))}
        </InfoCard>
      </div>
    </section>
  );
}

export function StrategySection() {
  return (
    <section id="section-strategy" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Strategy & Market Intelligence</div>
          <div className="pv-section-subtitle">Launch planning, opposition mapping, and trust forecasting</div>
        </div>
      </div>
      <div className="pv-grid-3">
        <AICard
          module="gtm-analysis"
          title="Go-To-Market Analysis"
          badge={{ type: 'green', label: 'Launch advisory' }}
          tagline="Design launches like product rollouts, not press releases"
          body="Maps audiences, channels, and narrative angles for safest, highest-yield rollout."
          inputType="input"
          placeholder="e.g. National clean energy guarantee for all households"
          labelOverride="Policy / campaign one-liner"
        />
        <AICard
          module="opposition-mapper"
          title="Opposition Weakness Mapper"
          badge={{ type: 'shield', label: 'Contrast engine' }}
          tagline="Identify narrative blind spots without going negative"
          body="Highlights areas where opposition messaging is inconsistent with public memory or prior commitments."
          inputType="input"
          placeholder="e.g. their stance on healthcare spending..."
          labelOverride="Opposition stance to analyze"
        />
        <AICard
          module="policy-impact"
          title="Policy Impact Simulator"
          badge={{ type: 'shield', label: 'Trust delta' }}
          tagline="Estimate trust gain/loss before announcing"
          body="Projects changes to trust, turnout energy, and media framing under best, base, and worst case scenarios."
          inputType="textarea"
          placeholder="Describe the policy you plan to announce..."
          labelOverride="Policy to simulate"
        />
      </div>
    </section>
  );
}
