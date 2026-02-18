/**
 * BLOCK 72.2 — 7D Compact Institutional Arrow
 * 
 * Minimalist approach:
 * - Small diagonal arrow from NOW point
 * - No floating panels
 * - No capsules
 * - Integrated into price context
 * 
 * This is how institutional desks show short-term bias.
 */

export function draw7dArrow(
  ctx,
  distribution,
  currentPrice,
  xRightAnchor,
  y,
  marginTop,
  marginBottom,
  canvasHeight
) {
  if (!distribution) return;
  
  const { p50 } = distribution;
  
  // Determine direction
  const direction = p50 > 0.005 ? 'BULLISH' : p50 < -0.005 ? 'BEARISH' : 'NEUTRAL';
  
  // Colors
  const colors = {
    BULLISH: '#22c55e',
    BEARISH: '#ef4444',
    NEUTRAL: '#9ca3af'
  };
  const color = colors[direction];
  
  // === 1. FORECAST ZONE BACKGROUND (very subtle) ===
  ctx.save();
  const zoneWidth = 120;
  const bgGradient = ctx.createLinearGradient(
    xRightAnchor, 0,
    xRightAnchor + zoneWidth, 0
  );
  bgGradient.addColorStop(0, "rgba(0,0,0,0.02)");
  bgGradient.addColorStop(1, "rgba(0,0,0,0.005)");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(
    xRightAnchor,
    marginTop,
    zoneWidth,
    canvasHeight - marginTop - marginBottom
  );
  ctx.restore();
  
  // === 2. NOW SEPARATOR (subtle) ===
  ctx.save();
  ctx.strokeStyle = "rgba(200, 50, 50, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(xRightAnchor, marginTop);
  ctx.lineTo(xRightAnchor, canvasHeight - marginBottom);
  ctx.stroke();
  ctx.restore();
  
  // === 3. NOW LABEL (small) ===
  ctx.save();
  ctx.fillStyle = "rgba(200, 50, 50, 0.6)";
  ctx.font = "bold 9px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("NOW", xRightAnchor, marginTop - 4);
  ctx.restore();
  
  // === 4. ARROW CALCULATION ===
  const nowX = xRightAnchor;
  const nowY = y(currentPrice);
  
  // Arrow parameters
  const maxLength = 50;
  const baseLength = 30;
  const forecastPct = Math.abs(p50 * 100);
  
  // Scale length by forecast magnitude (capped)
  const scaledLength = Math.min(maxLength, baseLength + forecastPct * 1.5);
  
  // Angle: ±30° for bullish/bearish, 0° for neutral
  let angle;
  if (direction === 'BULLISH') {
    angle = -Math.PI / 6; // -30° (pointing up-right)
  } else if (direction === 'BEARISH') {
    angle = Math.PI / 6;  // +30° (pointing down-right)
  } else {
    angle = 0; // horizontal
  }
  
  const endX = nowX + scaledLength * Math.cos(angle);
  const endY = nowY + scaledLength * Math.sin(angle);
  
  // === 5. DRAW ARROW LINE ===
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(nowX, nowY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
  
  // === 6. DRAW ARROW HEAD ===
  ctx.save();
  ctx.fillStyle = color;
  
  const headSize = 8;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headSize * Math.cos(angle - Math.PI / 7),
    endY - headSize * Math.sin(angle - Math.PI / 7)
  );
  ctx.lineTo(
    endX - headSize * Math.cos(angle + Math.PI / 7),
    endY - headSize * Math.sin(angle + Math.PI / 7)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // === 7. COMPACT LABEL (near arrow tip) ===
  ctx.save();
  ctx.font = "bold 11px system-ui";
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  
  // Position label near arrow end
  const labelX = endX + 8;
  const labelY = direction === 'BULLISH' ? endY - 4 : 
                 direction === 'BEARISH' ? endY + 12 : 
                 endY + 4;
  
  // Direction + percentage
  const sign = p50 >= 0 ? '+' : '';
  ctx.fillText(`${sign}${(p50 * 100).toFixed(1)}%`, labelX, labelY);
  
  // Small "7D" label
  ctx.font = "9px system-ui";
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillText("7D", labelX, labelY + 12);
  
  ctx.restore();
}
