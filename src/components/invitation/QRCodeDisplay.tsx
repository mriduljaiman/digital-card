'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface QRCodeDisplayProps {
  url: string;
  initials?: string;
}

// Draw a heart shape centered at (cx, cy) with given size
function drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size * 0.48;
  ctx.save();
  ctx.translate(cx, cy + s * 0.2);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.5);
  // Left curve
  ctx.bezierCurveTo(-s * 0.05, s * 0.8, -s, s * 0.6, -s, s * 0.1);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.3, -s * 0.6, 0, -s * 0.2);
  // Right curve
  ctx.bezierCurveTo(s * 0.3, -s * 0.6, s, -s * 0.4, s, s * 0.1);
  ctx.bezierCurveTo(s, s * 0.6, s * 0.05, s * 0.8, 0, s * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Rounded square for finder patterns (the 3 corner squares)
function drawRoundedSquare(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export default function QRCodeDisplay({ url, initials = 'M&V' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { generateQR(); }, [url]);

  async function generateQR() {
    try {
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Get the QR module matrix
      const qr = (QRCode as any).create(url, { errorCorrectionLevel: 'H' });
      const size = qr.modules.size as number;
      const modules = qr.modules.data as Uint8Array;

      const canvasSize = 320;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      const padding = canvasSize * 0.035;
      const cellSize = (canvasSize - padding * 2) / size;

      // Finder pattern zones (7x7 blocks in 3 corners)
      const isFinderZone = (r: number, c: number) => {
        return (
          (r < 9 && c < 9) ||                        // top-left
          (r < 9 && c >= size - 8) ||                // top-right
          (r >= size - 8 && c < 9)                   // bottom-left
        );
      };

      // Draw data modules as hearts, finder zones as rounded squares
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const isDark = modules[row * size + col] === 1;
          if (!isDark) continue;

          const x = padding + col * cellSize;
          const y = padding + row * cellSize;
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;

          ctx.fillStyle = '#CC0000';

          if (isFinderZone(row, col)) {
            // Draw rounded squares for finder patterns
            const pad = cellSize * 0.08;
            drawRoundedSquare(ctx, x + pad, y + pad, cellSize - pad * 2, cellSize * 0.25);
          } else {
            // Draw hearts for all data modules
            drawHeart(ctx, cx, cy, cellSize);
          }
        }
      }

      // Center logo — white backing + gold circle + M&V text
      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const logoR = canvasSize * 0.11;

      // White backing (clears QR behind logo)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, logoR + 5, 0, Math.PI * 2);
      ctx.fill();

      // Thin red ring
      ctx.strokeStyle = 'rgba(180,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, logoR + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Gold gradient fill
      const grad = ctx.createRadialGradient(cx - logoR * 0.25, cy - logoR * 0.25, 0, cx, cy, logoR);
      grad.addColorStop(0, '#FFD700');
      grad.addColorStop(0.55, '#C9A84C');
      grad.addColorStop(1, '#8B6914');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
      ctx.fill();

      // MV text
      const fontSize = Math.round(logoR * 0.7);
      ctx.fillStyle = '#3d2000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${fontSize}px serif`;
      ctx.fillText(initials, cx, cy);

      setDataUrl(canvas.toDataURL('image/png'));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  const downloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'mridul-vijaya-wedding-qr.png';
    a.click();
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* QR frame */}
      <div
        className="relative p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #FFF8E7, #FFF0D0)',
          border: '2px solid rgba(212,175,55,0.5)',
          boxShadow: '0 12px 40px rgba(180,130,40,0.2)',
        }}
      >
        {/* Corner ornaments */}
        {[
          { top: '8px', left: '8px' },
          { top: '8px', right: '8px' },
          { bottom: '8px', left: '8px' },
          { bottom: '8px', right: '8px' },
        ].map((pos, i) => (
          <div key={i} className="absolute text-sm" style={{ ...pos, color: 'rgba(212,175,55,0.7)' }}>✦</div>
        ))}

        {loading && (
          <div className="w-[240px] h-[240px] flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.3)', borderTopColor: '#FFD700' }}
            />
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: '240px',
            height: '240px',
            display: loading ? 'none' : 'block',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-[4px]"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Scan to Open Invitation
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: 'rgba(160,120,60,0.5)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          mridulvijaya.vercel.app
        </p>
      </div>

      {/* Download button */}
      {!loading && dataUrl && (
        <motion.button
          onClick={downloadQR}
          className="px-6 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            color: '#3d2000',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '1px',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(212,175,55,0.35)',
          }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ⬇ Download QR Code
        </motion.button>
      )}
    </motion.div>
  );
}
