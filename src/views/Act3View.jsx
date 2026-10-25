import React, { useState } from 'react';
import { ArrowRight, Sparkles, User, Flame, Coffee, HeartHandshake, CheckCircle2, AlertCircle, Lightbulb, Check } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_3_DATA } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act3View({ onCompleteAct, onOpenHelp }) {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: needs, 2: recipe, 3: delivery, 4: resolution
  
  // Phase 1: Analisis Kebutuhan
  const [selectedNeed, setSelectedNeed] = useState(null);

  // Phase 2: Peracikan Bahan
  const [jaheLevel, setJaheLevel] = useState(3);
  const [serehLevel, setSerehLevel] = useState(2);
  const [gulaLevel, setGulaLevel] = useState(2);

  // Phase 3: Sikap & Tutur Kata
  const [selectedDecision, setSelectedDecision] = useState(null);

  const handleSelectNeed = (need) => {
    soundManager.playClickSound();
    setSelectedNeed(need);
  };

  const handleSelectDecision = (decision) => {
    soundManager.playClickSound();
    setSelectedDecision(decision);
  };

  const handleBrew = () => {
    soundManager.playPlaceSuccess();
    setCurrentPhase(3);
  };

  const handleFinalServe = () => {
    soundManager.playActCompletion();
    setCurrentPhase(4);
  };

  // Harmoni Rasa Validator
  const isJaheHarmonious = jaheLevel >= 3 && jaheLevel <= 4;
  const isSerehHarmonious = serehLevel >= 2 && serehLevel <= 4;
  const isGulaHarmonious = gulaLevel >= 2 && gulaLevel <= 3;
  const isRecipeBalanced = isJaheHarmonious && isSerehHarmonious && isGulaHarmonious;

  return (
    <div className="game-content-area">
      {/* Header Babak */}
      <div className="act-header-banner">
        <div>
          <div className="act-subtitle">
            <Sparkles size={14} />
            Zona {ACT_3_DATA.zone}
          </div>
          <h2 className="act-main-title">{ACT_3_DATA.title}</h2>
        </div>

        {/* Step Pills Navigasi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { soundManager.playClickSound(); setCurrentPhase(1); }}
            style={{
              background: currentPhase >= 1 ? 'var(--color-teal-soft)' : '#FFF',
              border: `1.5px solid ${currentPhase === 1 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
              color: currentPhase >= 1 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {selectedNeed && selectedNeed.id === 'na-2' ? <Check size={13} color="var(--color-teal)" /> : <span>1.</span>}
            Kebutuhan
          </button>

          <button
            onClick={() => {
              if (selectedNeed && selectedNeed.id === 'na-2') {
                soundManager.playClickSound();
                setCurrentPhase(2);
              }
            }}
            disabled={!selectedNeed || selectedNeed.id !== 'na-2'}
            style={{
              background: currentPhase >= 2 ? 'var(--color-teal-soft)' : '#FFF',
              border: `1.5px solid ${currentPhase === 2 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
              color: currentPhase >= 2 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: (!selectedNeed || selectedNeed.id !== 'na-2') ? 'not-allowed' : 'pointer',
              opacity: (!selectedNeed || selectedNeed.id !== 'na-2') ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {currentPhase >= 3 ? <Check size={13} color="var(--color-teal)" /> : <span>2.</span>}
            Takaran Rempah
          </button>

          <button
            onClick={() => {
              if (currentPhase >= 3) {
                soundManager.playClickSound();
                setCurrentPhase(3);
              }
            }}
            disabled={currentPhase < 3}
            style={{
              background: currentPhase >= 3 ? 'var(--color-teal-soft)' : '#FFF',
              border: `1.5px solid ${currentPhase === 3 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
              color: currentPhase >= 3 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: currentPhase < 3 ? 'not-allowed' : 'pointer',
              opacity: currentPhase < 3 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {currentPhase === 4 ? <Check size={13} color="var(--color-teal)" /> : <span>3.</span>}
            Tutur Kata Penyajian
          </button>
        </div>
      </div>

      {/* Mini Game Guide Banner sesuai Fase Aktif */}
      {currentPhase === 1 && (
        <MiniGameGuideBanner
          tag="Tahap 1 dari 3 • Analisis Kebutuhan"
          title="Cara Menemukan Akar Kebutuhan Pelanggan"
          steps={[
            "Simak cerita dan keluhan Mas Danang pada kartu profil di sebelah kiri.",
            "Pilih salah satu dari 3 opsi pendekatan di panel kanan yang paling menyentuh kebutuhan fisik dan batinnya.",
            "Baca umpan balik evaluasi. Jika sudah memilih pendekatan yang tepat, tekan tombol 'Lanjut ke Penakaran Rempah'."
          ]}
          tip="Mas Danang tidak sekadar butuh pelepas dahaga; ia kedinginan hingga ke tulang dan butuh pengingat bahwa ia tidak sendirian."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 2 && (
        <MiniGameGuideBanner
          tag="Tahap 2 dari 3 • Penakaran Komposisi Rasa"
          title="Cara Menakar Bahan Wedang Uwuh Luhur"
          steps={[
            "Gunakan tombol (-) dan (+) untuk menyesuaikan takaran Jahe Emprit, Sereh, dan Gula Aren.",
            "Perhatikan 3 indikator harmoni seduhan di bawah: Kehangatan, Ketenangan Aroma, dan Keseimbangan Manis.",
            "Rasio ideal: Jahe level 3–4 (hangat mendalam), Sereh level 2–3 (aroma menentramkan), dan Gula Aren level 2–3 (manis alami peneguh stamina).",
            "Setelah komposisi seimbang, klik tombol 'Seduh & Siapkan Penyajian'."
          ]}
          tip="Terlalu banyak gula akan menenggelamkan khasiat rempah; terlalu sedikit jahe tidak akan mampu mengusir gigilan dingin."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 3 && (
        <MiniGameGuideBanner
          tag="Tahap 3 dari 3 • Sikap & Tutur Kata Penyajian"
          title="Cara Menyajikan Wedang dengan Empati dan Budi Pekerti"
          steps={[
            "Pilih salah satu tutur kata dan sikap penyajian wedang hangat kepada Mas Danang.",
            "Pilihlah sapaan yang mengandung ketulusan, doa kebaikan, dan budi pekerti khas Yogyakarta.",
            "Tekan tombol 'Sajikan ke Mas Danang' untuk menyaksikan dampak kehangatan racikanmu."
          ]}
          tip="Di Angkringan Pak Ilmu, tutur kata ramah dan doa yang tulus adalah separuh dari khasiat wedang itu sendiri."
          onOpenHelp={onOpenHelp}
        />
      )}

      <div className="customer-encounter-panel">
        {/* Panel Sisi Kiri: Profil Pelanggan & Dialog */}
        <div className="customer-profile-card">
          <div className="rain-badge">🌧️ Hujan Deras Yogyakarta</div>

          <div className="customer-avatar-frame">
            <User size={52} />
          </div>

          <h3 className="customer-name">{ACT_3_DATA.customer.name}</h3>
          <span className="customer-status">{ACT_3_DATA.customer.condition}</span>

          <div className="customer-dialogue-balloon">
            <p>“{ACT_3_DATA.customer.story}”</p>
          </div>

          <div style={{
            marginTop: '20px',
            width: '100%',
            background: 'var(--bg-parchment)',
            border: '1.5px solid var(--border-natural)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            textAlign: 'left'
          }}>
            <strong style={{ color: 'var(--color-teal-dark)', display: 'block', marginBottom: '4px' }}>
              Isyarat Kebutuhan Pelanggan:
            </strong>
            Pelanggan membutuhkan perpaduan hawa panas jahe untuk mengusir kedinginan tubuh dan aroma sereh cengkeh untuk menenangkan kegundahan batin.
          </div>
        </div>

        {/* Panel Sisi Kanan: Ruang Aksi Interaktif */}
        <div>
          {/* FASE 1: ANALISIS KEBUTUHAN */}
          {currentPhase === 1 && (
            <div className="brewing-workshop">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-orange)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Langkah 1 dari 3: Analisis Kebutuhan
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Pendekatan Apa yang Paling Tepat untuk Mas Danang?
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Pilihlah solusi yang menyentuh akar masalah fisik sekaligus memulihkan semangat batinnya.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {ACT_3_DATA.needsAnalysis.map((need) => {
                  const isSelected = selectedNeed && selectedNeed.id === need.id;

                  return (
                    <div
                      key={need.id}
                      onClick={() => handleSelectNeed(need)}
                      style={{
                        background: isSelected ? 'var(--color-teal-soft)' : '#FFF',
                        border: `2px solid ${isSelected ? 'var(--color-teal)' : 'var(--border-natural)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.22s',
                        boxShadow: 'var(--shadow-soft)',
                        position: 'relative'
                      }}
                    >
                      {!isSelected && (
                        <div className="interactive-cue-badge" style={{ fontSize: '0.66rem' }}>
                          👆 Klik Pilihan Ini
                        </div>
                      )}
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: isSelected ? 'var(--color-teal-dark)' : 'var(--text-primary)' }}>
                        {need.title}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                        {need.desc}
                      </p>
                      {isSelected && (
                        <div style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px dashed var(--border-strong)',
                          fontSize: '0.85rem',
                          color: need.id === 'na-2' ? 'var(--color-teal-dark)' : 'var(--color-bata-dark)',
                          lineHeight: '1.45',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {need.id === 'na-2' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          <span>Umpan Balik: {need.feedback}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  className="btn-primary-action"
                  disabled={!selectedNeed || selectedNeed.id !== 'na-2'}
                  onClick={() => {
                    soundManager.playClickSound();
                    setCurrentPhase(2);
                  }}
                >
                  <span>Lanjut ke Penakaran Rempah</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: PERACIKAN BAHAN DENGAN CANGKIR BLIRIK ASLI */}
          {currentPhase === 2 && (
            <div className="brewing-workshop">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-orange)', fontWeight: 800, textTransform: 'uppercase' }}>
                    Langkah 2 dari 3: Penakaran Komposisi Rasa
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    Takaran Rempah Tradisional Wedang Uwuh Luhur
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Atur perbandingan bahan rempah agar kehangatan, aroma, dan kemanisan berpadu harmonis.
                  </p>
                </div>

                <img
                  src="/background/cangkir.png"
                  alt="Cangkir Blirik Tradisional"
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <div className="ingredient-selectors-grid">
                {/* Jahe Emprit */}
                <div className="ingredient-tweak-box active">
                  <Flame size={30} color="var(--color-orange)" style={{ marginBottom: '8px' }} />
                  <span className="tweak-name">Jahe Emprit Bakar</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Pengusir Dingin Inti</span>
                  <div className="tweak-meter">
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setJaheLevel(Math.max(1, jaheLevel - 1)); }}
                      title="Kurangi Jahe"
                      aria-label="Kurangi takaran jahe"
                    >-</button>
                    <span className="meter-val">{jaheLevel}</span>
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setJaheLevel(Math.min(5, jaheLevel + 1)); }}
                      title="Tambah Jahe"
                      aria-label="Tambah takaran jahe"
                    >+</button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isJaheHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', fontWeight: 700, marginTop: '6px' }}>
                    {isJaheHarmonious ? '✓ Takaran Pas' : (jaheLevel < 3 ? 'Perlu Ditambah' : 'Terlalu Pedas')}
                  </span>
                </div>

                {/* Sereh Wangi */}
                <div className="ingredient-tweak-box active">
                  <Coffee size={30} color="var(--color-teal)" style={{ marginBottom: '8px' }} />
                  <span className="tweak-name">Batang Sereh Memar</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Penyegar Pernapasan</span>
                  <div className="tweak-meter">
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setSerehLevel(Math.max(1, serehLevel - 1)); }}
                      title="Kurangi Sereh"
                      aria-label="Kurangi takaran sereh"
                    >-</button>
                    <span className="meter-val">{serehLevel}</span>
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setSerehLevel(Math.min(5, serehLevel + 1)); }}
                      title="Tambah Sereh"
                      aria-label="Tambah takaran sereh"
                    >+</button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isSerehHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', fontWeight: 700, marginTop: '6px' }}>
                    {isSerehHarmonious ? '✓ Aroma Pas' : (serehLevel < 2 ? 'Aroma Lemah' : 'Terlalu Wangi')}
                  </span>
                </div>

                {/* Gula Aren */}
                <div className="ingredient-tweak-box active">
                  <Sparkles size={30} color="var(--color-gold-deep)" style={{ marginBottom: '8px' }} />
                  <span className="tweak-name">Gula Jawa Aren Asli</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Peneguh Daya & Stamina</span>
                  <div className="tweak-meter">
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setGulaLevel(Math.max(1, gulaLevel - 1)); }}
                      title="Kurangi Gula Aren"
                      aria-label="Kurangi takaran gula aren"
                    >-</button>
                    <span className="meter-val">{gulaLevel}</span>
                    <button
                      className="meter-btn"
                      onClick={() => { soundManager.playClickSound(); setGulaLevel(Math.min(5, gulaLevel + 1)); }}
                      title="Tambah Gula Aren"
                      aria-label="Tambah takaran gula aren"
                    >+</button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isGulaHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', fontWeight: 700, marginTop: '6px' }}>
                    {isGulaHarmonious ? '✓ Manis Pas' : (gulaLevel < 2 ? 'Kurang Manis' : 'Terlalu Manis')}
                  </span>
                </div>
              </div>

              {/* Indikator Harmoni Seduhan */}
              <div style={{
                background: isRecipeBalanced ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
                border: `1.5px solid ${isRecipeBalanced ? 'var(--color-teal)' : 'var(--border-natural)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                textAlign: 'center',
                transition: 'all 0.25s'
              }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Intensitas Hangat</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-orange)', marginTop: '2px' }}>
                    {jaheLevel >= 3 ? 'Hangat Mendalam 🔥' : 'Kurang Menggigit'}
                  </div>
                </div>
                <div style={{ borderLeft: '1.5px solid var(--border-natural)', borderRight: '1.5px solid var(--border-natural)', padding: '0 24px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Ketenangan Aroma</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginTop: '2px' }}>
                    {serehLevel >= 2 ? 'Harum Menentramkan 🌿' : 'Aroma Tipis'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Keseimbangan Manis</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#8C6505', marginTop: '2px' }}>
                    {gulaLevel >= 2 ? 'Manis Gurih Pas 🍯' : 'Tawar'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  className="btn-secondary-action"
                  onClick={() => setCurrentPhase(1)}
                >
                  Kembali ke Analisis
                </button>
                <button
                  className="btn-primary-action"
                  onClick={handleBrew}
                >
                  <span>Seduh & Siapkan Penyajian</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 3: KEPUTUSAN PENYAJIAN & TUTUR KATA */}
          {currentPhase === 3 && (
            <div className="brewing-workshop">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-orange)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Langkah 3 dari 3: Sikap & Tutur Kata Penyajian
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Bagaimana Caramu Menyerahkan Cangkir Wedang Ini?
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Penyajian bukan sekadar serah terima fisik, melainkan penyampaian rasa kemanusiaan dan empati.
                </p>
              </div>

              <div className="decision-options-group">
                {ACT_3_DATA.presentationDecisions.map((dec) => {
                  const isSelected = selectedDecision && selectedDecision.id === dec.id;

                  return (
                    <div
                      key={dec.id}
                      className={`decision-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectDecision(dec)}
                      style={{ position: 'relative' }}
                    >
                      {!isSelected && (
                        <div className="interactive-cue-badge" style={{ fontSize: '0.66rem' }}>
                          👆 Klik Pilihan Ini
                        </div>
                      )}
                      <HeartHandshake size={32} color={isSelected ? 'var(--color-teal-dark)' : 'var(--color-teal)'} style={{ flexShrink: 0 }} />
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.96rem', display: 'block', marginBottom: '4px' }}>
                          “{dec.quote}”
                        </span>
                        <span style={{ fontSize: '0.78rem', color: isSelected ? 'var(--color-teal-dark)' : 'var(--text-muted)', fontWeight: 700 }}>
                          Sikap: {dec.tone}
                        </span>
                        {isSelected && (
                          <span style={{ display: 'block', marginTop: '6px', fontSize: '0.82rem', color: 'var(--color-teal-dark)', fontWeight: 600 }}>
                            💡 {dec.impact}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                <button
                  className="btn-secondary-action"
                  onClick={() => setCurrentPhase(2)}
                >
                  Kembali ke Racikan
                </button>
                <button
                  className="btn-primary-action"
                  disabled={!selectedDecision}
                  onClick={handleFinalServe}
                >
                  <span>Sajikan ke Mas Danang</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 4: RESOLUSI & DAMPAK KONTRIBUSI */}
          {currentPhase === 4 && (
            <div className="brewing-workshop" style={{ textAlign: 'center', padding: '36px 28px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--color-teal-soft)',
                border: '2px solid var(--color-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--color-teal-dark)'
              }}>
                <CheckCircle2 size={38} />
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Kehangatan Meresap ke Relung Jiwa
              </h3>

              <p style={{
                fontSize: '0.96rem',
                lineHeight: '1.65',
                color: 'var(--text-secondary)',
                maxWidth: '620px',
                margin: '0 auto 20px auto'
              }}>
                Mas Danang menyesap wedang hangat dari cangkir blirik dengan kedua tangannya yang gemetar. 
                Hawa jahe membakar dingin di tulangnya, aroma sereh menjernihkan kepalanya, dan tutur katamu mengusir rasa putus asa yang sempat membelenggunya.
              </p>

              <div style={{
                background: '#FFFDF9',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '18px 24px',
                fontStyle: 'italic',
                fontSize: '0.92rem',
                maxWidth: '560px',
                margin: '0 auto 24px auto',
                boxShadow: 'var(--shadow-paper)',
                border: '1.5px solid var(--border-natural)'
              }}>
                “Matur nuwun sanget... Ternyata yang kubutuhkan bukan sekadar minuman penghalau dahaga, tetapi pengingat bahwa di tanah ini, kita tidak pernah berjuang sendirian.”
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn-primary-action"
                  style={{ padding: '14px 36px', fontSize: '1.05rem' }}
                  onClick={onCompleteAct}
                >
                  <span>Menuju Epilog: Toples Kawruh</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
