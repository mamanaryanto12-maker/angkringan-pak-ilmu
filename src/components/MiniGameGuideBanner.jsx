import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function MiniGameGuideBanner({
  title,
  tag = "Cara Bermain Mini Game Ini",
  steps = [],
  onOpenHelp,
  tip
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mini-game-guide-banner">
      <div className="mini-game-guide-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div className="mini-game-guide-tag">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-teal)' }} />
            {tag}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {isCollapsed ? (
              <><span>Tampilkan Instruksi</span> <ChevronDown size={14} /></>
            ) : (
              <><span>Sembunyikan</span> <ChevronUp size={14} /></>
            )}
          </button>
        </div>

        <div className="mini-game-guide-title">{title}</div>

        {!isCollapsed && (
          <div className="mini-game-guide-steps">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--color-teal)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {tip && (
              <div style={{
                marginTop: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-orange)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Lightbulb size={14} />
                <span>Kiat: {tip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="mini-game-guide-btn"
        onClick={() => {
          soundManager.playClickSound();
          if (onOpenHelp) onOpenHelp();
        }}
      >
        <Lightbulb size={15} color="var(--color-gold-deep)" />
        <span>Petunjuk Bertahap</span>
      </button>
    </div>
  );
}
