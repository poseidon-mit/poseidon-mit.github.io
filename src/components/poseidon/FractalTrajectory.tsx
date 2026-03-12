import { useEffect, useRef } from 'react';

export function FractalTrajectory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const drawBranch = (startX: number, startY: number, endX: number, endY: number, cpX1: number, cpY1: number, cpX2: number, cpY2: number, lineWidth: number, opacity: number, progress: number) => {
        const eX = startX + (endX - startX) * progress;
        const eY = startY + (endY - startY) * progress;
        const cx1 = startX + (cpX1 - startX) * progress;
        const cy1 = startY + (cpY1 - startY) * progress;
        const cx2 = startX + (cpX2 - startX) * progress;
        const cy2 = startY + (cpY2 - startY) * progress;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, eX, eY);
        
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Glow pass
        if (opacity > 0.4) {
          ctx.beginPath();
          ctx.bezierCurveTo(cx1, cy1, cx2, cy2, eX, eY);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
          ctx.lineWidth = lineWidth * 3;
          ctx.stroke();
        }

        return { x: eX, y: eY };
      };

      const drawNode = (x: number, y: number, size: number, opacity: number) => {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
        ctx.fill();
      };

      const p = (Math.sin(time * 0.5) + 1) / 2 * 0.15 + 0.85; // Organic pulsing progress
      const pulse = Math.sin(time * 2) * 0.2 + 0.8;

      // Main trunk
      const endMain = drawBranch(40, height - 40, width - 60, 60, 150, height - 40, width - 200, 60, 4, 0.9, p);
      
      // Upper branch
      const endUpper = drawBranch(200, height - 120, width - 100, 140, 250, height - 140, width - 250, 140, 2.5, 0.7, p * 0.9);
      
      // Lower branch
      const endLower = drawBranch(300, height - 160, width - 80, 240, 350, height - 170, width - 180, 240, 1.5, 0.5, p * 0.85);

      // Early split branch
      const endSplit = drawBranch(100, height - 80, 180, 70, 120, height - 120, 150, 70, 2, 0.5, p * 0.95);

      drawNode(endMain.x, endMain.y, 6, 0.9 * pulse);
      drawNode(endUpper.x, endUpper.y, 4, 0.7 * pulse);
      drawNode(endLower.x, endLower.y, 3, 0.5 * pulse);
      drawNode(endSplit.x, endSplit.y, 4, 0.6 * pulse);
      
      // Floating particles along the main path
      for (let i = 0; i < 15; i++) {
        const tOffset = (time * 0.5 + i / 15) % 1;
        const xOffset = Math.sin(time + i * 13) * 15;
        const yOffset = Math.cos(time * 0.8 + i * 21) * 15;
        const x = 40 + (width - 100) * tOffset + xOffset;
        const y = height - 40 - (height - 100) * Math.pow(tOffset, 0.8) + yOffset;
        drawNode(x, y, 1.5, 0.6 * Math.sin(time * 4 + i));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} width={500} height={400} className="w-[400px] h-[320px] max-w-full drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_65%)] blur-2xl z-[-1]" />
    </div>
  );
}
