import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function MiniGameGuideBanner({
  instruction,
  hint,
  tag = "PANDUAN",
  onOpenHelp
}) {
  return (
    <div className="prominent-guide-banner" role="region" aria-label="Panduan Utama Permainan">
      <div className="guide-banner-content">
        <div className="guide-tag-row">
          <span className="guide-pill-badge">
            <Sparkles size={13} />
            <span>{tag}</span>
          </span>
          {hint && <span className="guide-sub-hint">{hint}</span>}
        </div>

        <h3 className="guide-main-instruction">{instruction}</h3>
      </div>

      {onOpenHelp && (
        <button
          className="guide-help-action-btn"
          onClick={() => {
            soundManager.playClickSound();
            onOpenHelp();
          }}
          title="Buka Bantuan & Petunjuk Bertahap"
        >
          <HelpCircle size={16} />
          <span>Bantuan</span>
        </button>
      )}
    </div>
  );
}
