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

  useEffect(() => {
    generateQR();
  }, [url]);

  async function generateQR() {
    try {
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const size = 300;
      canvas.width = size;
      canvas.height = size;

      // Generate QR to a temp canvas
      const tempCanvas = document.createElement('canvas');
      await QRCode.toCanvas(tempCanvas, url, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#6B0000',   // dark red dots
          light: '#FFF8E7',  // cream background
        },
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw QR onto main canvas
      ctx.drawImage(tempCanvas, 0, 0);

      // Center logo — gold circle with MV text
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.13;

      // White backing circle (to clear QR dots behind logo)
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8E7';
      ctx.fill();

      // Gold gradient circle
      const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
      grad.addColorStop(0, '#FFD700');
      grad.addColorStop(0.6, '#C9A84C');
      grad.addColorStop(1, '#8B6914');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Thin dark ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(107,80,16,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // MV text
      ctx.fillStyle = '#3d2000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${r * 0.75}px Cinzel, serif`;
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
          border: '1.5px solid rgba(212,175,55,0.5)',
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
          <div key={i} className="absolute text-sm" style={{ ...pos, color: 'rgba(212,175,55,0.6)' }}>✦</div>
        ))}

        {loading && (
          <div className="w-[200px] h-[200px] flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.3)', borderTopColor: '#FFD700' }}
            />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="rounded-xl block"
          style={{
            width: '200px',
            height: '200px',
            display: loading ? 'none' : 'block',
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
          className="px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            color: '#3d2000',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '1px',
            fontSize: '11px',
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
