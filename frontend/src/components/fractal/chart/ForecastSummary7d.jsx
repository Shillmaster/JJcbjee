import React from 'react';

/**
 * BLOCK 72.1 — 7D Mini Summary Panel
 * 
 * Minimal institutional summary for 7D timing horizon:
 * - Expected Move
 * - Confidence  
 * - Matches
 * - Hit Rate
 * - Timing Action
 */

export function ForecastSummary7d({ focusPack, currentPrice }) {
  if (!focusPack) return null;
  
  const { overlay } = focusPack;
  const stats = overlay?.stats || {};
  const distributionSeries = overlay?.distributionSeries || {};
  
  // Get last day (day 7) P50
  const p50 = distributionSeries.p50?.[distributionSeries.p50?.length - 1] ?? stats.medianReturn ?? 0;
  const p10 = distributionSeries.p10?.[distributionSeries.p10?.length - 1] ?? stats.p10Return ?? -0.15;
  const p90 = distributionSeries.p90?.[distributionSeries.p90?.length - 1] ?? stats.p90Return ?? 0.15;
  
  // Bias
  const bias = p50 > 0.005 ? 'BULLISH' : p50 < -0.005 ? 'BEARISH' : 'NEUTRAL';
  const biasColor = bias === 'BULLISH' ? '#16a34a' : bias === 'BEARISH' ? '#dc2626' : '#6b7280';
  const biasSymbol = bias === 'BULLISH' ? '↑' : bias === 'BEARISH' ? '↓' : '→';
  
  // Stats
  const sampleSize = stats.sampleSize || overlay?.matches?.length || 0;
  const hitRate = stats.hitRate ?? 0.5;
  
  // Confidence
  const dispersion = Math.abs(p90 - p10);
  const dispersionPenalty = Math.min(dispersion / Math.max(Math.abs(p50), 0.01), 1) * 0.3;
  const confidence = Math.min(100, Math.max(0, (hitRate * 100) * (1 - dispersionPenalty) * (sampleSize >= 10 ? 1 : 0.8)));
  
  // Timing action
  let timing = 'WAIT';
  if (bias === 'BULLISH' && confidence > 50) timing = 'ENTER';
  else if (bias === 'BEARISH' && confidence > 50) timing = 'EXIT';
  
  const timingColor = timing === 'ENTER' ? '#16a34a' : timing === 'EXIT' ? '#dc2626' : '#f59e0b';
  
  // Target price
  const targetPrice = currentPrice * (1 + p50);

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {/* Bias & Expected */}
        <div style={styles.biasSection}>
          <div style={{ ...styles.biasBadge, backgroundColor: `${biasColor}15`, borderColor: biasColor, color: biasColor }}>
            {biasSymbol} {bias}
          </div>
          <div style={styles.expectedValue}>
            <span style={{ color: p50 >= 0 ? '#16a34a' : '#dc2626' }}>
              {p50 >= 0 ? '+' : ''}{(p50 * 100).toFixed(2)}%
            </span>
            <span style={styles.targetPrice}>
              → ${targetPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
        
        {/* Stats */}
        <div style={styles.statsSection}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Conf</span>
            <span style={{ ...styles.statValue, color: confidence > 55 ? '#16a34a' : confidence > 40 ? '#f59e0b' : '#dc2626' }}>
              {confidence.toFixed(0)}%
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Matches</span>
            <span style={styles.statValue}>{sampleSize}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Hit Rate</span>
            <span style={styles.statValue}>{(hitRate * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Timing Action */}
        <div style={styles.timingSection}>
          <div style={styles.timingLabel}>TIMING</div>
          <div style={{ ...styles.timingValue, color: timingColor }}>{timing}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FAFAFA',
    border: '1px solid #EAEAEA',
    borderRadius: 8,
    padding: '12px 16px',
    marginTop: 8,
  },
  
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  
  biasSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  
  biasBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    border: '1.5px solid',
  },
  
  expectedValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  
  targetPrice: {
    fontSize: 11,
    color: '#888',
    fontWeight: 500,
  },
  
  statsSection: {
    display: 'flex',
    gap: 20,
  },
  
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  
  statLabel: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase',
  },
  
  statValue: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  timingSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px 16px',
    backgroundColor: '#fff',
    borderRadius: 6,
    border: '1px solid #EAEAEA',
  },
  
  timingLabel: {
    fontSize: 8,
    color: '#888',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  
  timingValue: {
    fontSize: 14,
    fontWeight: 700,
  },
};

export default ForecastSummary7d;
