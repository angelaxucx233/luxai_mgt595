import { useEffect, useRef } from 'react';

/**
 * Lux — lightbulb tutor with warm caramel hair and a friendly smile.
 * Drawn on canvas; scales to any `size`.
 */
export default function LuxAvatar({ size = 56, animated = false, className = '' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const cx = size / 2;
    const cy = size / 2 + 1;
    const k = size / 56;

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, size, size);

      const pulse = animated ? 0.7 + 0.3 * Math.sin(time / 500) : 0.85;

      const glow = ctx.createRadialGradient(cx, cy - 2 * k, 2 * k, cx, cy, size * 0.52);
      glow.addColorStop(0, `rgba(212, 173, 122, ${0.35 * pulse})`);
      glow.addColorStop(0.45, `rgba(74, 143, 212, ${0.35 * pulse})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy - 4 * k);
      ctx.scale(k, k);

      const hair = '#c49a6c';
      const hairDark = '#9a7048';
      const hairHi = '#e0c090';

      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.moveTo(-18, 20);
      ctx.bezierCurveTo(-21, 4, -14, -14, 0, -15);
      ctx.bezierCurveTo(14, -14, 21, 4, 18, 20);
      ctx.bezierCurveTo(10, 22, -10, 22, -18, 20);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hairHi;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      [[-16, 8, -18, 16], [16, 8, 18, 16], [-12, -2, -14, 10], [12, -2, 14, 10]].forEach(
        ([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(x1 - 2, (y1 + y2) / 2, x2, y2);
          ctx.stroke();
        }
      );

      const bulbGrad = ctx.createLinearGradient(-14, -18, 14, 14);
      bulbGrad.addColorStop(0, '#fffef5');
      bulbGrad.addColorStop(0.4, '#fde047');
      bulbGrad.addColorStop(1, '#eab308');
      ctx.fillStyle = bulbGrad;
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, -2, 15, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-5, -10);
      ctx.lineTo(-2, 0);
      ctx.lineTo(1, -9);
      ctx.stroke();

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-15, 5, 3.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(15, 5, 3.2, 0, Math.PI * 2);
      ctx.stroke();

      const drawEye = (ex) => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(ex, 3, 5.5, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.ellipse(ex, 3.5, 3.2, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ex + (ex < 0 ? 1.5 : -1.5), 2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#5c4030';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ex - 6, 0);
        ctx.quadraticCurveTo(ex, -2, ex + 6, 0);
        ctx.stroke();
      };
      drawEye(-5.5);
      drawEye(5.5);

      ctx.strokeStyle = '#e879a9';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6.5, 10);
      ctx.quadraticCurveTo(0, 15, 6.5, 10);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-5, 10.5);
      ctx.quadraticCurveTo(0, 13.5, 5, 10.5);
      ctx.stroke();

      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.moveTo(-15, -6);
      ctx.lineTo(15, -6);
      ctx.quadraticCurveTo(15, -11, 0, -12);
      ctx.quadraticCurveTo(-15, -11, -15, -6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = hairDark;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-15, -6);
      ctx.lineTo(15, -6);
      ctx.stroke();

      ctx.strokeStyle = hairDark;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      [[-17, 0, -16, 14], [17, 0, 16, 14]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 - 3, 6, x2 + 1, 10, x2, y2);
        ctx.stroke();
      });

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-9, 14);
      ctx.lineTo(9, 14);
      ctx.lineTo(7, 17);
      ctx.lineTo(-7, 17);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-10, 17);
      ctx.lineTo(10, 17);
      ctx.quadraticCurveTo(12, 19.5, 10, 22);
      ctx.lineTo(-10, 22);
      ctx.quadraticCurveTo(-12, 19.5, -10, 17);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#286dc0';
      ctx.beginPath();
      ctx.arc(-4, 19, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    if (!animated) {
      draw(0);
      return () => {};
    }

    const start = performance.now();
    const loop = (now) => {
      draw(now - start);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [size, animated]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Lux, your AI tutor"
      className={className}
    />
  );
}
