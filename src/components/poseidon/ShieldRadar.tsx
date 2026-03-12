import { useEffect, useRef } from 'react';

export function ShieldRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      angle += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, width, height);

      // Grid circles
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)'; // engine-protect
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Radar sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, Math.PI / 4.5);
      ctx.lineTo(0, 0);
      
      const gradient = ctx.createLinearGradient(0, 0, radius * Math.cos(Math.PI / 8), radius * Math.sin(Math.PI / 8));
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Leading edge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      ctx.restore();

      // Blips (anomalies) matching the 6 mapped threats
      const blips = [
        { r: 0.8, theta: 45, size: 4 },
        { r: 0.5, theta: 120, size: 3.5 },
        { r: 0.9, theta: 210, size: 4 },
        { r: 0.3, theta: 300, size: 2.5 },
        { r: 0.7, theta: 340, size: 4 },
        { r: 0.6, theta: 80, size: 3 },
      ];

      blips.forEach(blip => {
        const blipAngle = (blip.theta * Math.PI) / 180;
        const dist = blip.r * radius;
        const bx = cx + dist * Math.cos(blipAngle);
        const by = cy + dist * Math.sin(blipAngle);

        let diff = (angle % (Math.PI * 2)) - blipAngle;
        if (diff < 0) diff += Math.PI * 2;

        const maxAge = Math.PI / 2;
        const opacity = diff < maxAge ? 1 - (diff / maxAge) : 0.15;

        ctx.beginPath();
        ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.fill();

        if (opacity > 0.5) {
          ctx.beginPath();
          ctx.arc(bx, by, blip.size * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${(opacity - 0.5) * 2})`;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none pb-4">
      <canvas ref={canvasRef} width={400} height={400} className="w-[300px] h-[300px] max-w-full drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
      <div className="absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_60%)] blur-2xl" />
    </div>
  );
}
