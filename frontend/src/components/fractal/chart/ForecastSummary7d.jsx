import React from 'react';

/**
 * BLOCK 72 — 7D Timing Bias Panel
 * 
 * Institutional-grade summary for 7D horizon:
 * - Bias (BULLISH/BEARISH/NEUTRAL)
 * - Expected (P50)
 * - Range (P10-P90)
 * - Confidence
 * - Tail Risk
 * - Timing Action (ENTER/WAIT/EXIT)
 */

export function ForecastSummary7d({ focusPack, currentPrice }) {
  if (!focusPack) return null;
  
  const { overlay, meta } = focusPack;
  const stats = overlay?.stats || {};
  const distributionSeries = overlay?.distributionSeries || {};
  
  // Get last day (day 7) quantiles
  const p10 = distributionSeries.p10?.[distributionSeries.p10?.length - 1] ?? stats.p10Return ?? -0.15;
  const p25 = distributionSeries.p25?.[distributionSeries.p25?.length - 1] ?? -0.05;
  const p50 = distributionSeries.p50?.[distributionSeries.p50?.length - 1] ?? stats.medianReturn ?? 0;
  const p75 = distributionSeries.p75?.[distributionSeries.p75?.length - 1] ?? 0.05;
  const p90 = distributionSeries.p90?.[distributionSeries.p90?.length - 1] ?? stats.p90Return ?? 0.15;
  
  // Bias logic
  let bias = 'NEUTRAL';
  if (p50 > 0.005 && p25 > -0.02) bias = 'BULLISH';
  else if (p50 < -0.005 && p75 < 0.02) bias = 'BEARISH';
  
  const biasColor = bias === 'BULLISH' ? '#22c55e' : bias === 'BEARISH' ? '#ef4444' : '#6b7280';
  const biasEmoji = bias === 'BULLISH' ? '↑' : bias === 'BEARISH' ? '↓' : '→';
  
  // Confidence from stats
  const sampleSize = stats.sampleSize || overlay?.matches?.length || 0;
  const hitRate = stats.hitRate ?? 0.5;
  const dispersion = Math.abs(p90 - p10);
  const dispersionPenalty = Math.min(dispersion / Math.max(Math.abs(p50), 0.01), 1) * 0.3;
  const confidence = Math.min(100, Math.max(0, (hitRate * 100) * (1 - dispersionPenalty) * (sampleSize >= 10 ? 1 : 0.8)));
  
  // Timing action based on edge
  let timingAction = 'WAIT';
  if (bias === 'BULLISH' && confidence > 55 && p50 > 0.015) timingAction = 'ENTER';
  else if (bias === 'BEARISH' && confidence > 55 && p50 < -0.015) timingAction = 'EXIT';
  
  const actionColor = timingAction === 'ENTER' ? '#22c55e' : timingAction === 'EXIT' ? '#ef4444' : '#f59e0b';
  
  // Tail risk (P10 as proxy for worst case)
  const tailRisk = Math.abs(p10);
  
  // Price projections
  const priceP50 = currentPrice * (1 + p50);
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.title}>7D OUTLOOK</span>
          <span style={styles.subtitle}>Timing Signal</span>
        </div>
        <div style={{
          ...styles.biasBadge,
          backgroundColor: `${biasColor}15`,
          borderColor: biasColor,
          color: biasColor
        }}>
          <span style={styles.biasEmoji}>{biasEmoji}</span>
          {bias}
        </div>
      </div>
      
      <div style={styles.grid}>
        {/* Main Stats Column */}
        <div style={styles.mainStats}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Expected (P50)</span>
            <span style={{
              ...styles.statValue,
              color: p50 >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {p50 >= 0 ? '+' : ''}{(p50 * 100).toFixed(2)}%
            </span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Target Price</span>
            <span style={styles.statValueSmall}>
              ${priceP50.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Range (P10→P90)</span>
            <span style={styles.statValueSmall}>
              {(p10 * 100).toFixed(1)}% → {(p90 * 100).toFixed(1)}%
            </span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Working Zone (P25→P75)</span>
            <span style={styles.statValueSmall}>
              {(p25 * 100).toFixed(1)}% → {(p75 * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Risk Column */}
        <div style={styles.riskStats}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Confidence</span>
            <span style={{
              ...styles.statValue,
              color: confidence > 60 ? '#22c55e' : confidence > 40 ? '#f59e0b' : '#ef4444'
            }}>
              {confidence.toFixed(0)}%
            </span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Sample Size</span>
            <span style={styles.statValueSmall}>{sampleSize} matches</span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Tail Risk (P10)</span>
            <span style={{ ...styles.statValue, color: '#ef4444' }}>
              -{(tailRisk * 100).toFixed(1)}%
            </span>
          </div>
          
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Hit Rate</span>
            <span style={styles.statValueSmall}>{(hitRate * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Action Column */}
        <div style={styles.actionStats}>
          <div style={styles.actionBox}>
            <span style={styles.actionLabel}>TIMING</span>
            <span style={{
              ...styles.actionValue,
              color: actionColor
            }}>
              {timingAction}
            </span>
          </div>
          
          <div style={styles.actionHint}>
            {timingAction === 'ENTER' && 'Favorable short-term setup detected'}
            {timingAction === 'EXIT' && 'Negative short-term pressure'}
            {timingAction === 'WAIT' && 'Insufficient edge for timing trade'}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EAEAEA',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #EAEAEA',
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '0.5px',
  },
  
  subtitle: {
    fontSize: 11,
    color: '#888',
  },
  
  biasBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    border: '1.5px solid',
    letterSpacing: '0.5px',
  },
  
  biasEmoji: {
    fontSize: 14,
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 20,
  },
  
  mainStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  
  riskStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingLeft: 20,
    borderLeft: '1px solid #EAEAEA',
  },
  
  actionStats: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 20,
    borderLeft: '1px solid #EAEAEA',
  },
  
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  
  statValue: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  
  statValueSmall: {
    fontSize: 11,
    fontWeight: 500,
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  
  actionBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  
  actionLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  
  actionValue: {
    fontSize: 18,
    fontWeight: 700,
  },
  
  actionHint: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    lineHeight: 1.4,
  },
};

export default ForecastSummary7d;
