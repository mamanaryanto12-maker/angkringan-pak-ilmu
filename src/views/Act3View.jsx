import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, HeartHandshake, CheckCircle2, AlertCircle, Check, Flame, ThermometerSnowflake, Thermometer, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_3_PERSONAS, PANTRY_INGREDIENTS, evaluateCustomRecipe } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';
import VisitorSceneIllustration from '../components/VisitorSceneIllustration.jsx';
import Item3DViewer from '../components/Item3DViewer.jsx';

export default function Act3View({ onCompleteAct, onOpenHelp, sessionIndex = 0 }) {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: needs, 2: recipe, 3: delivery, 4: serving cutscene
  const [serveCutsceneBeat, setServeCutsceneBeat] = useState('placing'); // 'placing' | 'tasting'

  const currentPersona = useMemo(() => {
    return ACT_3_PERSONAS[sessionIndex % ACT_3_PERSONAS.length];
  }, [sessionIndex]);

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState(['jahe', 'serai']);
  const [servingTemp, setServingTemp] = useState('hangat_panas');
  const [selectedDecision, setSelectedDecision] = useState(null);

  useEffect(() => {
    setCurrentPhase(1);
    setSelectedNeed(null);
    setSelectedIngredients(['jahe', 'serai']);
    setServingTemp('hangat_panas');
    setSelectedDecision(null);
    setServeCutsceneBeat('placing');
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

  const handleFinalServe = () => {
    soundManager.playCupServe();
    setServeCutsceneBeat('placing');
    setCurrentPhase(4);
    setTimeout(() => {
      soundManager.playPlaceSuccess();
      setServeCutsceneBeat('tasting');
    }, 1000);
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

      {/* Panduan Utama yang Jelas Sesuai Tahapan */}
      {currentPhase === 1 && (
        <MiniGameGuideBanner
          tag="TAHAP 1"
          instruction={`Pahami keluhan ${currentPersona.name} lalu pilih solusi yang tepat.`}
          hint="Amati situasi dan cerita pengunjung di panel kiri."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 2 && (
        <MiniGameGuideBanner
          tag="TAHAP 2"
          instruction={`Pilih bahan rempah 3D dan suhu penyajian untuk ${currentPersona.name}.`}
          hint="Ketuk kartu rempah untuk menambah atau mengurangi bahan."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 3 && (
        <MiniGameGuideBanner
          tag="TAHAP 3"
          instruction={`Pilih tutur kata tulus saat menyerahkan wedang kepada ${currentPersona.name}.`}
          hint="Tutur kata yang hangat melengkapi kebaikan racikanmu."
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
        <section className="brewing-workshop">
          {/* FASE 1: ANALISIS KEBUTUHAN */}
          {currentPhase === 1 && (
            <div className="phase-stack">
              <div className="phase-heading-block">
                <span className="phase-kicker">Langkah 1 • Kepekaan</span>
                <h3>Apa yang paling dibutuhkan {currentPersona.name} saat ini?</h3>
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

          {/* FASE 2: RACIKAN BEBAS (2+ BAHAN + SUHU + EVALUASI KONTEKSTUAL) */}
          {currentPhase === 2 && (
            <div className="phase-stack">
              <div className="phase-heading-block with-cup">
                <div>
                  <span className="phase-kicker">Langkah 2 • Komposisi Bebas</span>
                  <h3>Pilih Kombinasi Rempah & Suhu Penyajian</h3>
                </div>
                <div className="cup-counter-badge">
                  <span>{selectedIngredients.length} Bahan Terpilih</span>
                </div>
              </div>

              {/* Grid 6 Bahan Rempah dengan Model 3D Asli Langsung */}
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

                      {/* Model 3D Interaktif Langsung pada Kartu Rempah */}
                      <div className="pantry-3d-box" style={{ width: '100%', height: '115px', position: 'relative', marginBottom: '6px' }}>
                        <Item3DViewer
                          modelPath={item.model3d}
                          itemName={item.name}
                          fallbackImage={item.image}
                          height={115}
                          compact={true}
                          autoRotateSpeed={isChecked ? 2.4 : 1.2}
                        />
                      </div>

                      <strong className="pantry-name">{item.name}</strong>
                      <span className="pantry-prop">{item.property}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pemilih Suhu Seduhan */}
              <div className="temp-selector-row">
                <span className="temp-label">Suhu Sajian:</span>
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

              {/* Evaluasi Kesesuaian Racikan Kontekstual */}
              <div className={`tier-eval-card ${evaluation.tier}`}>
                <div className="tier-eval-head">
                  <span className="tier-badge-pill">{evaluation.badge}</span>
                  <span className="tier-ingredients-summary">
                    {selectedIngredientNames.length > 0 ? selectedIngredientNames.join(' + ') : 'Belum ada bahan'}
                  </span>
                </div>
                <p className="tier-analysis-text">{evaluation.analysis}</p>
                <span className="tier-rec-line">{evaluation.recommendation}</span>
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
                  <span>
                    {evaluation.tier === 'sangat_sesuai'
                      ? 'Lanjut Penyajian'
                      : 'Sajikan Racikan Ini'}
                  </span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 3: TUTUR KATA PENYAJIAN */}
          {currentPhase === 3 && (
            <div className="phase-stack">
              <div className="phase-heading-block">
                <span className="phase-kicker">Langkah 3 • Tutur Kata</span>
                <h3>Pilih cara menyerahkan cangkir kepada {currentPersona.name}</h3>
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
                      <HeartHandshake size={28} color={isSelected ? 'var(--color-teal-dark)' : 'var(--color-teal)'} style={{ flexShrink: 0 }} />
                      <div>
                        <strong className="decision-quote">“{dec.quote}”</strong>
                        <span className="decision-tone">Sikap: {dec.tone}</span>
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

          {/* FASE 4: ANIMASI PENYAJIAN, RESPONS PENGUNJUNG, & CATATAN PEMBELAJARAN */}
          {currentPhase === 4 && (
            <div className="serving-cutscene-panel">
              {/* Tahap 1 Animasi: Cangkir Diletakkan & Mengepul */}
              <div className="serving-stage-box">
                {serveCutsceneBeat === 'placing' ? (
                  <div className="serving-beat-pouring">
                    {servingTemp !== 'dingin_es' && (
                      <div className="steam-wrap">
                        <div className="steam-smoke" />
                        <div className="steam-smoke" />
                        <div className="steam-smoke" />
                      </div>
                    )}
                    <div style={{ width: '160px', height: '140px', margin: '0 auto 8px', position: 'relative' }}>
                      <Item3DViewer
                        modelPath="/assets/models/items/cangkir.glb"
                        itemName="Cangkir Blirik Wedang"
                        fallbackImage="/background/cangkir.png"
                        height={140}
                        showBadge={false}
                        autoRotateSpeed={2.8}
                      />
                    </div>
                    <p className="serving-beat-caption">Menyerahkan cangkir dengan dua tangan...</p>
                  </div>
                ) : (
                  <div className="serving-beat-reaction">
                    <div className="reaction-cup-row">
                      <img src="/background/cangkir.png" alt="" className="reaction-cup-mini" />
                      <div>
                        <span className="reaction-status-chip">
                          {evaluation.tier === 'kurang_sesuai' ? 'Catatan Reflektif Tamu' : `${currentPersona.name} Merasa Lebih Nyaman`}
                        </span>
                        <div className="reaction-served-list">
                          Racikanmu: {selectedIngredientNames.join(', ')} ({servingTemp === 'dingin_es' ? 'Dingin' : 'Hangat'})
                        </div>
                      </div>
                    </div>

                    {/* Dialog Respons Kontekstual Pengunjung */}
                    <blockquote className="visitor-reaction-quote">
                      “{visitorResponseQuote}”
                    </blockquote>

                    {selectedDecision && (
                      <p className="visitor-decision-impact">{selectedDecision.impact}</p>
                    )}

                    {/* Catatan Pembelajaran Singkat */}
                    <div className="learning-reflection-note">
                      <div className="reflection-head">
                        <Sparkles size={15} color="var(--color-orange)" />
                        <span>Catatan Pembelajaran</span>
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
