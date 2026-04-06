'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface QRCodeDisplayProps {
  url: string;
  initials?: string;
}

export default function QRCodeDisplay({ url, initials = 'M&V' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { generateQR(); }, [url]);

  async function generateQR() {
    try {
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Step 1 — get QR module matrix
      const qr = (QRCode as any).create(url, { errorCorrectionLevel: 'H' });
      const moduleCount: number = qr.modules.size;
      const modules: Uint8Array = qr.modules.data;

      const CANVAS_SIZE = 400;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d')!;

      // Cream background
      ctx.fillStyle = '#FFFDF5';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const margin = CANVAS_SIZE * 0.04;
      const cell = (CANVAS_SIZE - margin * 2) / moduleCount;

      // Finder pattern zones (top-left, top-right, bottom-left — 8x8 with quiet zone)
      const isFinder = (r: number, c: number) =>
        (r < 9 && c < 9) ||
        (r < 9 && c >= moduleCount - 8) ||
        (r >= moduleCount - 8 && c < 9);

      // Step 2 — draw each module
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (!modules[row * moduleCount + col]) continue;

          const x = margin + col * cell;
          const y = margin + row * cell;
          const cx = x + cell / 2;
          const cy = y + cell / 2;

          ctx.fillStyle = '#CC0000';

          if (isFinder(row, col)) {
            // Rounded squares for finder patterns (keeps QR scannable)
            const r = cell * 0.22;
            const pad = cell * 0.06;
            const sw = cell - pad * 2;
            const sx = x + pad;
            const sy = y + pad;
            ctx.beginPath();
            ctx.moveTo(sx + r, sy);
            ctx.arcTo(sx + sw, sy, sx + sw, sy + sw, r);
            ctx.arcTo(sx + sw, sy + sw, sx, sy + sw, r);
            ctx.arcTo(sx, sy + sw, sx, sy, r);
            ctx.arcTo(sx, sy, sx + sw, sy, r);
            ctx.closePath();
            ctx.fill();
          } else {
            // ❤ heart emoji as text — most reliable cross-platform approach
            const fontSize = Math.round(cell * 1.05);
            ctx.font = `${fontSize}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤', cx, cy + cell * 0.04);
          }
        }
      }

      // Step 3 — center M&V gold logo
      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      const logoR = CANVAS_SIZE * 0.1;

      // White backing circle
      ctx.fillStyle = '#FFFDF5';
      ctx.beginPath();
      ctx.arc(cx, cy, logoR + 5, 0, Math.PI * 2);
      ctx.fill();

      // Gold gradient
      const grad = ctx.createRadialGradient(cx - logoR * 0.3, cy - logoR * 0.3, 1, cx, cy, logoR);
      grad.addColorStop(0, '#FFE566');
      grad.addColorStop(0.5, '#C9A84C');
      grad.addColorStop(1, '#8B6914');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
      ctx.fill();

      // Dark ring
      ctx.strokeStyle = 'rgba(100,70,10,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
      ctx.stroke();

      // M&V text
      const fSize = Math.round(logoR * 0.68);
      ctx.fillStyle = '#2d1500';
      ctx.font = `bold ${fSize}px Cinzel, Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, cx, cy);

      setDataUrl(canvas.toDataURL('image/png'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
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
      className="flex flex-col items-center gap-5 w-full"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* QR frame */}
      <div
        className="relative p-3 rounded-2xl w-full"
        style={{
          maxWidth: '320px',
          background: 'linear-gradient(145deg, #FFF8E7, #FFF0D0)',
          border: '2px solid rgba(212,175,55,0.5)',
          boxShadow: '0 12px 40px rgba(180,130,40,0.2)',
        }}
      >
        {[
          { top: '8px', left: '8px' },
          { top: '8px', right: '8px' },
          { bottom: '8px', left: '8px' },
          { bottom: '8px', right: '8px' },
        ].map((pos, i) => (
          <div key={i} className="absolute text-sm" style={{ ...pos, color: 'rgba(212,175,55,0.7)' }}>✦</div>
        ))}

        {loading && (
          <div className="flex items-center justify-center" style={{ height: '280px' }}>
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.3)', borderTopColor: '#FFD700' }}
            />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center text-center p-8" style={{ height: '280px' }}>
            <p style={{ color: '#8B6914', fontFamily: 'var(--font-playfair)', fontSize: '14px' }}>
              QR generation failed. Please refresh the page.
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            display: loading || error ? 'none' : 'block',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-[4px]"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}>
          Scan to Open Invitation
        </p>
        <p className="text-xs mt-1"
          style={{ color: 'rgba(160,120,60,0.5)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
          mridulvijaya.vercel.app
        </p>
      </div>

      {/* Download */}
      {!loading && !error && dataUrl && (
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
          transition={{ delay: 0.3 }}
        >
          ⬇ Download QR Code
        </motion.button>
      )}
    </motion.div>
  );
}
