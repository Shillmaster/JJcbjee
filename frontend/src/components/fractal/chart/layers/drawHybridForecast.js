/**
 * STEP A — Hybrid Forecast Renderer
 * 
 * Draws two projections on same canvas:
 * - Synthetic (green) - model forecast
 * - Replay (purple) - primary historical match aftermath
 * 
 * Uses Catmull-Rom spline for smooth curves.
 */

export function drawHybridForecast(
  ctx,
  forecast,
  primaryMatch,
  xRightAnchor,
  y,
  plotW,
  marginTop,
  marginBottom,
  canvasHeight
) {
  if (!forecast?.pricePath?.length) return;
  
  const pricePath = forecast.pricePath;
  const replayPath = primaryMatch?.replayPath || [];
  const N = pricePath.length;
  
  // Forecast zone width
  const forecastZoneWidth = Math.min(plotW * 0.55, 380) - 70;
  const dayToX = (day) => xRightAnchor + (day / N) * forecastZoneWidth;
  
  // === 1. FORECAST ZONE BACKGROUND ===
  ctx.save();
  const bgGradient = ctx.createLinearGradient(
    xRightAnchor, 0,
    xRightAnchor + forecastZoneWidth, 0
  );
  bgGradient.addColorStop(0, "rgba(0,0,0,0.03)");
  bgGradient.addColorStop(1, "rgba(0,0,0,0.01)");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(
    xRightAnchor,
    marginTop,
    forecastZoneWidth + 70,
    canvasHeight - marginTop - marginBottom
  );
  ctx.restore();
  
  // === 2. NOW SEPARATOR ===
  ctx.save();
  ctx.strokeStyle = "rgba(180, 0, 0, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(xRightAnchor, marginTop);
  ctx.lineTo(xRightAnchor, canvasHeight - marginBottom);
  ctx.stroke();
  ctx.restore();
  
  // === 3. NOW LABEL ===
  ctx.save();
  ctx.fillStyle = "#dc2626";
  ctx.font = "bold 10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("NOW", xRightAnchor, marginTop - 6);
  ctx.restore();
  
  // === 4. SYNTHETIC LINE (green) with spline ===
  const syntheticPoints = [{ x: xRightAnchor, y: y(pricePath[0]) }];
  for (let i = 0; i < N; i++) {
    syntheticPoints.push({ x: dayToX(i + 1), y: y(pricePath[i]) });
  }
  
  ctx.save();
  ctx.shadowColor = 'rgba(22, 163, 74, 0.25)';
  ctx.shadowBlur = 6;
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  drawSpline(ctx, syntheticPoints);
  ctx.stroke();
  ctx.restore();
  
  // === 5. REPLAY LINE (purple) with spline ===
  if (replayPath.length > 0) {
    const replayLen = Math.min(replayPath.length, N);
    const replayPoints = [{ x: xRightAnchor, y: y(replayPath[0]) }];
    for (let i = 0; i < replayLen; i++) {
      replayPoints.push({ x: dayToX(i + 1), y: y(replayPath[i]) });
    }
    
    ctx.save();
    ctx.shadowColor = 'rgba(139, 92, 246, 0.2)';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([6, 4]);
    
    drawSpline(ctx, replayPoints);
    ctx.stroke();
    ctx.restore();
  }
  
  // === 6. END MARKERS ===
  const lastSyntheticY = y(pricePath[N - 1]);
  const endX = dayToX(N);
  
  // Synthetic end marker
  ctx.save();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(endX, lastSyntheticY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(endX, lastSyntheticY, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // Replay end marker
  if (replayPath.length > 0) {
    const lastReplayY = y(replayPath[Math.min(replayPath.length, N) - 1]);
    ctx.save();
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(endX, lastReplayY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(endX, lastReplayY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // === 7. LEGEND ===
  const legendX = xRightAnchor + 12;
  const legendY = marginTop + 20;
  
  ctx.save();
  ctx.font = "bold 10px system-ui";
  
  // Synthetic legend
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(legendX, legendY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#444';
  ctx.textAlign = 'left';
  ctx.fillText('Synthetic', legendX + 10, legendY + 3);
  
  // Replay legend
  if (replayPath.length > 0) {
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(legendX, legendY + 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#444';
    ctx.fillText('Replay', legendX + 10, legendY + 19);
    
    // Similarity badge
    if (primaryMatch?.similarity) {
      ctx.font = "9px system-ui";
      ctx.fillStyle = '#888';
      ctx.fillText(`(${(primaryMatch.similarity * 100).toFixed(0)}% sim)`, legendX + 50, legendY + 19);
    }
  }
  
  ctx.restore();
  
  // === 8. HORIZON LABEL ===
  ctx.save();
  ctx.font = "bold 10px system-ui";
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.textAlign = "center";
  ctx.fillText(`${N}d`, endX, lastSyntheticY - 12);
  ctx.restore();
}

// Helper: Catmull-Rom spline
function drawSpline(ctx, points) {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}
