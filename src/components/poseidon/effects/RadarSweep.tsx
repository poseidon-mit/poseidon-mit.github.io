import React, { useEffect, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export function RadarSweep({ size = 500, className = '' }: { size?: number, className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    if (reducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let angle = 0;
    
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = Math.min(cx, cy) - 10;
    
    // Some random static nodes to display on the radar
    const nodes = [
      { r: radius * 0.4, theta: Math.PI * 0.2, type: 'safe' },
      { r: radius * 0.7, theta: Math.PI * 0.8, type: 'warning' },
      { r: radius * 0.6, theta: Math.PI * 1.5, type: 'critical' },
      { r: radius * 0.3, theta: Math.PI * 1.8, type: 'safe' },
      { r: radius * 0.8, theta: Math.PI * 0.5, type: 'safe' }
    ];

    const draw = () => {
      // Clear with very slight trailing effect (alpha 0.1)
      ctx.fillStyle = 'rgba(6, 6, 10, 0.1)';
      ctx.fillRect(0, 0, cw, ch);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.lineWidth = 1;
      
      // Concentric circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();
      
      // Calculate start and end angle for the sweep gradient
      const endAngle = angle;
      const startAngle = angle - Math.PI / 4; // Sweep arc length
      
      // Draw the sweep gradient arc
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle, false);
      ctx.closePath();
      
      // Create a conical gradient using createPattern or simple fill
      // In canvas 2D, createConicGradient is supported in modern browsers
      if (typeof ctx.createConicGradient === 'function') {
        const gradient = ctx.createConicGradient(angle, cx, cy);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.0)');
        gradient.addColorStop(0.8, 'rgba(34, 197, 94, 0.1)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.fill();
      }
      
      // Draw the sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw nodes
      nodes.forEach(node => {
        const nx = cx + Math.cos(node.theta) * node.r;
        const ny = cy + Math.sin(node.theta) * node.r;
        
        let color = 'rgba(34, 197, 94, 0.6)'; // default safe
        if (node.type === 'warning') color = 'rgba(245, 158, 11, 0.8)';
        if (node.type === 'critical') color = 'rgba(239, 68, 68, 0.9)';
        
        // Highlight logic if sweep passes over node
        // Normalize angle to 0-2PI
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const nodeAngle = node.theta;
        
        // Check if node is within the sweep tail
        const distance = (normalizedAngle - nodeAngle + Math.PI * 2) % (Math.PI * 2);
        
        let nodeRadius = 3;
        let opacity = 0.5;
        
        if (distance < 0.5) {
          // It just got hit by the sweep! Enhance it!
          nodeRadius = 6;
          opacity = 1;
        }

        ctx.beginPath();
        ctx.arc(nx, ny, nodeRadius, 0, Math.PI * 2);
        
        if (node.type === 'critical') {
            ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
            ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
            ctx.shadowBlur = 10;
        } else if (node.type === 'warning') {
            ctx.fillStyle = `rgba(245, 158, 11, ${opacity})`;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
            ctx.shadowBlur = 8;
        } else {
            ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
      
      angle += 0.02; // speed
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas 
        ref={canvasRef} 
        width={size * 2} // Double resolution for retina
        height={size * 2}
        className="w-full h-full"
      />
      {reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-[var(--engine-protect)]/30 backdrop-blur-sm">
          <div className="w-1/2 h-1/2 rounded-full border border-[var(--engine-protect)]/20" />
          <div className="absolute w-1 h-full bg-[var(--engine-protect)]/20 rounded-full rotate-45" />
          <div className="absolute h-1 w-full bg-[var(--engine-protect)]/20 rounded-full -rotate-45" />
        </div>
      )}
    </div>
  );
}
