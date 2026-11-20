import React, { useState } from 'react';
import { Lightbulb, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

// Panduan Ringkas & Fungsional (Sedikit teks, fokus pada tindakan)
export default function MiniGameGuideBanner({
  title,
  tag,
  steps = [],
  onOpenHelp,
  tip
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="cue-bar">
      <div className="cue-bar-main">
        {tag && <span className="cue-tag">{tag}</span>}
        <span className="cue-title">{title}</span>
        {steps.length > 0 && !expanded && (
          <span className="cue-short-hint">— {steps[0]}</span>
        )}
      </div>

      <div className="cue-bar-actions">
        {(steps.length > 1 || tip) && (
          <button
            className="cue-toggle-btn"
            onClick={() => {
              soundManager.playClickSound();
              setExpanded(v => !v);
            }}
            aria-expanded={expanded}
          >
            <span>{expanded ? 'Ringkas' : 'Detail Langkah'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}

        {onOpenHelp && (
          <button
            className="cue-help-btn"
            onClick={() => {
              soundManager.playClickSound();
              onOpenHelp();
            }}
            title="Buka Petunjuk Bertahap"
          >
            <HelpCircle size={15} />
            <span>Bantuan</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="cue-expanded-panel">
          <div className="cue-steps-row">
            {steps.map((step, i) => (
              <div key={i} className="cue-step-chip">
                <span className="cue-step-num">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          {tip && (
            <div className="cue-tip-inline">
              <Lightbulb size={14} />
              <span>{tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
