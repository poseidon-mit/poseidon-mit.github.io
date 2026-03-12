import { useEffect, useRef } from 'react';

export function CryptographicVault() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      
      ctx.clearRect(0, 0, width, height);

      const drawRing = (radius: number, segments: number, dashArray: number[], speed: number, width: number, opacity: number, innerHashes = false) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * speed);
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(234, 179, 8, ${opacity})`;
        ctx.lineWidth = width;
        if (dashArray.length) ctx.setLineDash(dashArray);
        ctx.stroke();
        
        if (innerHashes) {
          ctx.setLineDash([]);
          ctx.fillStyle = `rgba(234, 179, 8, ${opacity * 0.8})`;
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * (radius - 12);
            const y = Math.sin(angle) * (radius - 12);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            
            // Random hex
            const char = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            if (Math.random() > 0.8) ctx.fillText(char, 0, 0);
            
            ctx.restore();
          }
        }
        
        ctx.restore();
      };

      // Background pulse
      const pulse = Math.sin(time * 3) * 0.1 + 0.9;

      // Outer security ring
      drawRing(140, 0, [40, 20], 0.2, 2, 0.4);
      
      // Data track 1
      drawRing(115, 60, [2, 8], -0.3, 8, 0.6, true);
      
      // Core containment ring
      drawRing(85, 0, [100, 10, 20, 10], 0.5, 4, 0.8 * pulse);
      
      // Inner mechanism
      drawRing(60, 24, [10, 5], -0.8, 2, 0.5);
      
      // Center Vault Core
      ctx.save();
      ctx.translate(cx, cy);
      
      ctx.beginPath();
      // Hexagon
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time;
        const x = Math.cos(angle) * 35;
        const y = Math.sin(angle) * 35;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.fillStyle = `rgba(234, 179, 8, ${0.15 * pulse})`;
      ctx.fill();
      
      ctx.strokeStyle = `rgba(234, 179, 8, ${0.9 * pulse})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
      
      // Inner glowing core
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(234, 179, 8, ${0.8 * pulse})`;
      ctx.fill();
      
      ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
      ctx.shadowBlur = 20;
      ctx.fill();
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none pb-4">
      <canvas ref={canvasRef} width={400} height={400} className="w-[300px] h-[300px] max-w-full drop-shadow-[0_0_20px_rgba(234,179,8,0.2)]" />
      <div className="absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1),transparent_60%)] blur-2xl z-[-1]" />
    </div>
  );
}
