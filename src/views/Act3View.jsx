import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, HeartHandshake, CheckCircle2, AlertCircle, Check, Flame, ThermometerSnowflake, Thermometer, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_3_PERSONAS, PANTRY_INGREDIENTS, evaluateCustomRecipe } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';
import VisitorSceneIllustration from '../components/VisitorSceneIllustration.jsx';
import Item3DViewer from '../components/Item3DViewer.jsx';

export default function Act3View({ onCompleteAct, onOpenHelp, onSubStepChange, sessionIndex = 0 }) {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: needs, 2: recipe, 3: delivery, 4: serving cutscene
  const [serveCutsceneBeat, setServeCutsceneBeat] = useState('pouring'); // 'pouring' | 'offering' | 'receiving' | 'tasting'
  const serveTimersRef = useRef([]);

  useEffect(() => {
    if (onSubStepChange) onSubStepChange(`act3:${currentPhase}`);
  }, [currentPhase, onSubStepChange]);

  const clearServeTimers = () => {
    serveTimersRef.current.forEach(t => clearTimeout(t));
    serveTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearServeTimers();
  }, []);

  const currentPersona = useMemo(() => {
    return ACT_3_PERSONAS[sessionIndex % ACT_3_PERSONAS.length];
  }, [sessionIndex]);

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState(['jahe', 'serai']);
  const [servingTemp, setServingTemp] = useState('hangat_panas');
  const [selectedDecision, setSelectedDecision] = useState(null);

  useEffect(() => {
    clearServeTimers();
    setCurrentPhase(1);
    setSelectedNeed(null);
    setSelectedIngredients(['jahe', 'serai']);
    setServingTemp('hangat_panas');
    setSelectedDecision(null);
    setServeCutsceneBeat('pouring');
  }, [currentPersona]);

  const evaluation = useMemo(() => {
    return evaluateCustomRecipe(currentPersona.id, selectedIngredients, servingTemp);
  }, [currentPersona.id, selectedIngredients, servingTemp]);

  const handleToggleIngredient = (ingId) => {
    soundManager.playClickSound();
    setSelectedIngredients(prev =>
      prev.includes(ingId) ? prev.filter(id => id !== ingId) : [...prev, ingId]
    );
  };

  // Animasi Penyerahan Wedang 5 Detik (5000ms) yang Halus dalam 3 Fase Berurutan
  const handleFinalServe = () => {
    clearServeTimers();
    soundManager.playCupServe();
    setServeCutsceneBeat('pouring');
    setCurrentPhase(4);

    const t1 = setTimeout(() => {
      setServeCutsceneBeat('offering');
    }, 1700);

    const t2 = setTimeout(() => {
      setServeCutsceneBeat('receiving');
    }, 3500);

    const t3 = setTimeout(() => {
      soundManager.playPlaceSuccess();
      setServeCutsceneBeat('tasting');
    }, 5000);

    serveTimersRef.current = [t1, t2, t3];
  };

  // Kutipan respons pengunjung berdasarkan tingkat kesesuaian racikan
  const visitorResponseQuote = useMemo(() => {
    if (evaluation.tier === 'sangat_sesuai') return currentPersona.resolutionQuote;
    if (evaluation.tier === 'cukup_sesuai') return currentPersona.resolutionQuoteOk;
    return currentPersona.resolutionQuoteCold;
  }, [evaluation.tier, currentPersona]);

  const selectedIngredientNames = PANTRY_INGREDIENTS
    .filter(p => selectedIngredients.includes(p.id))
    .map(p => p.name);

  return (
    <div className="game-content-area">
      {/* Header Babak 3 */}
      <div className="act-header-banner">
        <div>
          <span className="act-zone-kicker">Zona Karya Kita Berkontribusi</span>
          <h2 className="act-main-title">Babak 3: Untuk Siapa Racikan Ini?</h2>
        </div>

        <div className="act-subtabs">
          <button
            className={`subtab-btn ${currentPhase === 1 ? 'active' : ''}`}
            onClick={() => { soundManager.playClickSound(); setCurrentPhase(1); }}
          >
            <span>1. Kebutuhan</span>
            {selectedNeed?.isCorrect && <Check size={14} />}
          </button>

          <button
            className={`subtab-btn ${currentPhase === 2 ? 'active' : ''}`}
            disabled={!selectedNeed?.isCorrect}
            onClick={() => {
              if (selectedNeed?.isCorrect) {
                soundManager.playClickSound();
                setCurrentPhase(2);
              }
            }}
          >
            <span>2. Racikan Bebas</span>
            {currentPhase >= 3 && <Check size={14} />}
          </button>

          <button
            className={`subtab-btn ${currentPhase >= 3 ? 'active' : ''}`}
            disabled={currentPhase < 3}
            onClick={() => {
              if (currentPhase >= 3) {
                soundManager.playClickSound();
                setCurrentPhase(3);
              }
            }}
          >
            <span>3. Penyajian</span>
            {currentPhase === 4 && <Check size={14} />}
          </button>
        </div>
      </div>

      {/* Panduan Singkat 1 Baris per Tahap */}
      {currentPhase === 1 && (
        <MiniGameGuideBanner
          tag="TAHAP 1"
          instruction={`Pilih tanggapan yang tepat untuk ${currentPersona.name}.`}
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 2 && (
        <MiniGameGuideBanner
          tag="TAHAP 2"
          instruction="Pilih rempah 3D dan suhu minuman."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 3 && (
        <MiniGameGuideBanner
          tag="TAHAP 3"
          instruction={`Pilih sapaan saat menyajikan wedang ke ${currentPersona.name}.`}
          onOpenHelp={onOpenHelp}
        />
      )}

      {/* LAYOUT UTAMA BABAK 3 */}
      <div className="customer-encounter-panel">
        {/* Kiri: Ilustrasi Suasana Malioboro + Profil Singkat Pengunjung */}
        <aside className="customer-scene-card">
          <VisitorSceneIllustration
            personaId={currentPersona.id}
            weatherType={currentPersona.weatherType}
            isServed={currentPhase === 4 && serveCutsceneBeat === 'tasting'}
            servingTier={currentPhase === 4 ? evaluation.tier : null}
          />

          <div className="customer-scene-info">
            <div className="customer-head-line">
              <h3>{currentPersona.name}</h3>
              <span className="weather-tag-mini">{currentPersona.contextBadge}</span>
            </div>
            <p className="customer-condition-line">{currentPersona.condition}</p>

            <blockquote className="customer-quote-bubble">
              “{currentPersona.story}”
            </blockquote>
          </div>
        </aside>

        {/* Kanan: Area Aksi Interaktif */}
        <section key={currentPhase} className="brewing-workshop subview-enter">
          {/* FASE 1: KEBUTUHAN */}
          {currentPhase === 1 && (
            <div className="phase-stack">
              <div className="phase-heading-block">
                <h3>Apa yang dibutuhkan {currentPersona.name}?</h3>
              </div>

              <div className="choice-list-clean">
                {currentPersona.needsAnalysis.map((need) => {
                  const isSelected = selectedNeed?.id === need.id;

                  return (
                    <button
                      key={need.id}
                      className={`choice-item-btn ${isSelected ? (need.isCorrect ? 'chosen-valid' : 'chosen-wrong') : ''}`}
                      onClick={() => {
                        need.isCorrect ? soundManager.playPlaceSuccess() : soundManager.playGentleWrong();
                        setSelectedNeed(need);
                      }}
                    >
                      <div className="choice-main">
                        <strong>{need.title}</strong>
                        <span>{need.desc}</span>
                      </div>
                      {isSelected && (
                        <div className={`choice-feedback-line ${need.isCorrect ? 'ok' : 'err'}`}>
                          {need.isCorrect ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                          <span>{need.feedback}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="phase-footer-actions right">
                <button
                  className="btn-primary-action"
                  disabled={!selectedNeed?.isCorrect}
                  onClick={() => {
                    soundManager.playClickSound();
                    setCurrentPhase(2);
                  }}
                >
                  <span>Lanjut Meracik</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: RACIKAN BEBAS (VISUAL-FIRST) */}
          {currentPhase === 2 && (
            <div className="phase-stack">
              <div className="phase-heading-block with-cup">
                <h3>Pilih Rempah & Suhu</h3>
                <div className="cup-counter-badge">
                  <span>{selectedIngredients.length} Dipilih</span>
                </div>
              </div>

              {/* Grid 6 Bahan Rempah dengan Model 3D Langsung */}
              <div className="pantry-selection-grid">
                {PANTRY_INGREDIENTS.map((item) => {
                  const isChecked = selectedIngredients.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`pantry-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => handleToggleIngredient(item.id)}
                      aria-pressed={isChecked}
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      <span className="pantry-check-dot">
                        {isChecked && <Check size={12} color="#FFF" />}
                      </span>

                      <div className="pantry-3d-box" style={{ width: '100%', height: '104px', position: 'relative', marginBottom: '2px' }}>
                        <Item3DViewer
                          modelPath={item.model3d}
                          itemName={item.name}
                          fallbackImage={item.image}
                          height={104}
                          compact={true}
                          showBadge={false}
                          autoRotateSpeed={isChecked ? 2.4 : 1.2}
                        />
                      </div>

                      <strong className="pantry-name">{item.name}</strong>
                    </button>
                  );
                })}
              </div>

              {/* Pemilih Suhu Seduhan */}
              <div className="temp-selector-row">
                <span className="temp-label">Suhu:</span>
                <div className="temp-buttons">
                  <button
                    type="button"
                    className={`temp-btn ${servingTemp === 'hangat_panas' ? 'active warm' : ''}`}
                    onClick={() => { soundManager.playClickSound(); setServingTemp('hangat_panas'); }}
                  >
                    <Flame size={15} />
                    <span>Hangat Panas</span>
                  </button>
                  <button
                    type="button"
                    className={`temp-btn ${servingTemp === 'hangat_sedang' ? 'active mild' : ''}`}
                    onClick={() => { soundManager.playClickSound(); setServingTemp('hangat_sedang'); }}
                  >
                    <Thermometer size={15} />
                    <span>Hangat Teduh</span>
                  </button>
                  <button
                    type="button"
                    className={`temp-btn ${servingTemp === 'dingin_es' ? 'active cold' : ''}`}
                    onClick={() => { soundManager.playClickSound(); setServingTemp('dingin_es'); }}
                  >
                    <ThermometerSnowflake size={15} />
                    <span>Es Dingin</span>
                  </button>
                </div>
              </div>

              {/* Evaluasi Singkat 1 Baris */}
              <div className={`tier-eval-card ${evaluation.tier}`}>
                <div className="tier-eval-head">
                  <span className="tier-badge-pill">{evaluation.badge}</span>
                  <span className="tier-ingredients-summary">
                    {selectedIngredientNames.length > 0 ? selectedIngredientNames.join(' + ') : 'Belum ada bahan'}
                  </span>
                </div>
                <p className="tier-analysis-text" style={{ marginBottom: 0 }}>{evaluation.analysis}</p>
              </div>

              <div className="phase-footer-actions split">
                <button className="btn-secondary-action" onClick={() => setCurrentPhase(1)}>
                  Kembali
                </button>

                <button
                  className="btn-primary-action"
                  disabled={selectedIngredients.length === 0}
                  onClick={() => {
                    soundManager.playPlaceSuccess();
                    setCurrentPhase(3);
                  }}
                >
                  <span>Lanjut Penyajian</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 3: PENYAJIAN */}
          {currentPhase === 3 && (
            <div className="phase-stack">
              <div className="phase-heading-block">
                <h3>Pilih sapaan untuk {currentPersona.name}</h3>
              </div>

              <div className="decision-options-group">
                {currentPersona.presentationDecisions.map((dec) => {
                  const isSelected = selectedDecision?.id === dec.id;

                  return (
                    <button
                      key={dec.id}
                      type="button"
                      className={`decision-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        soundManager.playClickSound();
                        setSelectedDecision(dec);
                      }}
                    >
                      <HeartHandshake size={24} color={isSelected ? 'var(--color-teal-dark)' : 'var(--color-teal)'} style={{ flexShrink: 0 }} />
                      <div>
                        <strong className="decision-quote">“{dec.quote}”</strong>
                        <span className="decision-tone">{dec.tone}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="phase-footer-actions split">
                <button className="btn-secondary-action" onClick={() => setCurrentPhase(2)}>
                  Ubah Racikan
                </button>
                <button
                  className="btn-primary-action"
                  disabled={!selectedDecision}
                  onClick={handleFinalServe}
                >
                  <span>Sajikan Wedang</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 4: ANIMASI PENYERAHAN WEDANG 5 DETIK & RESPONS PENGUNJUNG */}
          {currentPhase === 4 && (
            <div className="serving-cutscene-panel">
              <div className="serving-stage-box">
                {serveCutsceneBeat !== 'tasting' ? (
                  <div className={`serving-beat-pouring beat-${serveCutsceneBeat}`}>
                    {servingTemp !== 'dingin_es' && (
                      <div className="steam-wrap">
                        <div className="steam-smoke" />
                        <div className="steam-smoke" />
                        <div className="steam-smoke" />
                      </div>
                    )}

                    <div className={`serving-cup-motion-wrap beat-${serveCutsceneBeat}`}>
                      <Item3DViewer
                        modelPath="/assets/models/items/cangkir.glb"
                        itemName="Cangkir Blirik Wedang"
                        fallbackImage="/background/cangkir.png"
                        height={155}
                        showBadge={false}
                        interactive={false}
                        autoRotateSpeed={serveCutsceneBeat === 'offering' ? 1.4 : 2.2}
                      />
                    </div>

                    <p key={serveCutsceneBeat} className="serving-beat-caption">
                      {serveCutsceneBeat === 'pouring' && 'Menyiapkan wedang di cangkir blirik...'}
                      {serveCutsceneBeat === 'offering' && `Menyerahkan cangkir hangat ke ${currentPersona.name}...`}
                      {serveCutsceneBeat === 'receiving' && `${currentPersona.name} menerima dan mencicipi...`}
                    </p>

                    <div className="serving-progress-track" aria-hidden="true">
                      <div className="serving-progress-fill" />
                    </div>
                  </div>
                ) : (
                  <div className="serving-beat-reaction">
                    <div className="reaction-cup-row">
                      <img src="/background/cangkir.png" alt="" className="reaction-cup-mini" />
                      <div>
                        <span className="reaction-status-chip">
                          {evaluation.tier === 'kurang_sesuai' ? 'Tanggapan Tamu' : `${currentPersona.name} Merasa Nyaman`}
                        </span>
                        <div className="reaction-served-list">
                          {selectedIngredientNames.join(' + ')} ({servingTemp === 'dingin_es' ? 'Dingin' : 'Hangat'})
                        </div>
                      </div>
                    </div>

                    <blockquote className="visitor-reaction-quote">
                      “{visitorResponseQuote}”
                    </blockquote>

                    <div className="learning-reflection-note">
                      <div className="reflection-head">
                        <Sparkles size={15} color="var(--color-orange)" />
                        <span>Makna</span>
                      </div>
                      <p>{currentPersona.learningNote}</p>
                    </div>

                    <div className="phase-footer-actions right">
                      <button
                        className="btn-primary-action"
                        onClick={() => {
                          soundManager.playActCompletion();
                          onCompleteAct();
                        }}
                      >
                        <span>Menuju Epilog: Toples Kawruh</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
