import { AICard } from '../components/AICard';

export default function CoreIntelligenceSection() {
  return (
    <section id="section-core" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Core Intelligence</div>
          <div className="pv-section-subtitle">Sentiment analysis, forecasting & emotional mapping</div>
        </div>
      </div>
      <div className="pv-grid-2">
        <AICard
          module="speech-sim"
          title="People Response Simulator"
          badge={{ type: 'ai', label: 'AI Module' }}
          tagline="Predict reactions before the speech leaves the podium"
          body="Simulates how different audience segments will emotionally and politically respond to a draft speech, policy note, or social post."
          inputType="textarea"
          placeholder="Paste your draft speech, tweet, or policy summary here..."
          labelOverride="Draft speech, post, or policy summary"
          runLabel="Simulate Reaction"
        />
        <AICard
          module="opinion-forecast"
          title="Opinion Forecasting & Early Warnings"
          badge={{ type: 'ai', label: 'AI Module' }}
          tagline="See the curve bend before the poll does"
          body="Forecasts support, opposition, and neutral sentiment with trend inflection detection over the coming 7 days."
          inputType="input"
          placeholder="e.g. fuel price hike, farm bill, education policy..."
          labelOverride="Topic to forecast"
          runLabel="Forecast Opinion"
        />
        <AICard
          module="sentiment-pulse"
          title="Real-Time Sentiment Pulse"
          badge={{ type: 'green', label: 'Live Feed' }}
          tagline="Continuously sampled mood across news & social"
          body="Aggregates sentiment from news and social platforms to estimate current public mood on your topic."
          inputType="input"
          placeholder="e.g. education reform, inflation, unemployment..."
          labelOverride="Keyword or topic"
          runLabel="Analyze Sentiment"
        />
        <AICard
          module="emotional-heatmap"
          title="Emotional Heatmaps"
          badge={{ type: 'ai', label: 'AI Module' }}
          tagline="Where anger, trust, and fear live on the map"
          body="Visualizes dominant emotions across segments or regions, helping you see where narratives are most fragile."
          inputType="input"
          placeholder="e.g. unemployment, border security, healthcare..."
          labelOverride="Issue to map"
          runLabel="Map Emotions"
        />
      </div>
    </section>
  );
}
