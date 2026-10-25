import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, User, HeartHandshake, CheckCircle2, AlertCircle, Check, CloudRain } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_3_PERSONAS } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act3View({ onCompleteAct, onOpenHelp, sessionIndex = 0 }) {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: needs, 2: recipe, 3: delivery, 4: resolution
  
  // Ambil persona pengunjung aktif berdasarkan variasi sesi (Mas Danang, Mbak Sari, atau Pak Broto)
  const currentPersona = useMemo(() => {
    return ACT_3_PERSONAS[sessionIndex % ACT_3_PERSONAS.length];
  }, [sessionIndex]);

  // Phase 1: Analisis Kebutuhan
  const [selectedNeed, setSelectedNeed] = useState(null);

  // Phase 2: Peracikan Bahan (Mulai dari kondisi netral/kosong Level 1, BUKAN langsung terisi sempurna)
  const [jaheLevel, setJaheLevel] = useState(1);
  const [serehLevel, setSerehLevel] = useState(1);
  const [gulaLevel, setGulaLevel] = useState(1);

  // Phase 3: Sikap & Tutur Kata
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Reset state jika persona berganti
  useEffect(() => {
    setCurrentPhase(1);
    setSelectedNeed(null);
    setJaheLevel(1);
    setSerehLevel(1);
    setGulaLevel(1);
    setSelectedDecision(null);
  }, [currentPersona]);

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

  // Validasi Harmoni Rasa Berdasarkan Kebutuhan Persona Pengunjung yang Aktif
  const isJaheHarmonious = jaheLevel >= currentPersona.idealRatios.jaheMin && jaheLevel <= currentPersona.idealRatios.jaheMax;
  const isSerehHarmonious = serehLevel >= currentPersona.idealRatios.serehMin && serehLevel <= currentPersona.idealRatios.serehMax;
  const isGulaHarmonious = gulaLevel >= currentPersona.idealRatios.gulaMin && gulaLevel <= currentPersona.idealRatios.gulaMax;
  const isRecipeBalanced = isJaheHarmonious && isSerehHarmonious && isGulaHarmonious;

  return (
    <div className="game-content-area">
      {/* Header Babak */}
      <div className="act-header-banner">
        <div>
          <div className="act-subtitle">
            <Sparkles size={14} />
            Zona Karya Kita Berkontribusi • Variasi Sesi {sessionIndex + 1}
          </div>
          <h2 className="act-main-title">Babak 3: Untuk Siapa Racikan Ini?</h2>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {selectedNeed && selectedNeed.isCorrect && <Check size={13} color="var(--color-teal)" />}
            1. Analisis Kebutuhan
          </button>

          <button
            onClick={() => {
              if (selectedNeed && selectedNeed.isCorrect) {
                soundManager.playClickSound();
                setCurrentPhase(2);
              }
            }}
            disabled={!selectedNeed || !selectedNeed.isCorrect}
            style={{
              background: currentPhase >= 2 ? 'var(--color-teal-soft)' : '#FFF',
              border: `1.5px solid ${currentPhase === 2 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
              color: currentPhase >= 2 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: (!selectedNeed || !selectedNeed.isCorrect) ? 'not-allowed' : 'pointer',
              opacity: (!selectedNeed || !selectedNeed.isCorrect) ? 0.6 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {currentPhase >= 3 && <Check size={13} color="var(--color-teal)" />}
            2. Takaran Rempah
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {currentPhase === 4 && <Check size={13} color="var(--color-teal)" />}
            3. Tutur Kata Penyajian
          </button>
        </div>
      </div>

      {/* Mini Game Guide Banner sesuai Fase Aktif */}
      {currentPhase === 1 && (
        <MiniGameGuideBanner
          tag="Tahap 1 dari 3: Analisis Kebutuhan"
          title={`Memahami Permasalahan: ${currentPersona.name}`}
          steps={[
            "Simak cerita dan keluhan pengunjung pada kartu profil di sebelah kiri.",
            "Pilih salah satu pendekatan di panel kanan yang menyentuh akar permasalahan raga dan batinnya.",
            "Baca umpan balik evaluasi. Jika sudah memilih pendekatan yang tepat, tekan 'Lanjut ke Penakaran Rempah'."
          ]}
          tip={currentPersona.clue}
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 2 && (
        <MiniGameGuideBanner
          tag="Tahap 2 dari 3: Penakaran Komposisi Rempah"
          title={`Menakar Ramuan Tradisional untuk ${currentPersona.name}`}
          steps={[
            "Takaran awal sengaja dimulai dari level 1. Gunakan tombol (-) dan (+) untuk mengatur intensitas bahan.",
            "Perhatikan 3 indikator harmoni seduhan di bawah: Tingkat Kehangatan, Ketenangan Aroma, dan Keseimbangan Manis.",
            "Sesuaikan komposisi dengan kebutuhan khusus pengunjung: " + currentPersona.idealDesc,
            "Setelah komposisi seimbang dan selaras, klik tombol 'Seduh & Siapkan Penyajian'."
          ]}
          tip="Rasio takaran harus seimbang antara pembakar dingin, pelega pernapasan, dan pemulih stamina."
          onOpenHelp={onOpenHelp}
        />
      )}

      {currentPhase === 3 && (
        <MiniGameGuideBanner
          tag="Tahap 3 dari 3: Sikap & Tutur Kata Penyajian"
          title={`Menyerahkan Cangkir Wedang kepada ${currentPersona.name}`}
          steps={[
            "Pilih salah satu tutur kata dan sikap penyajian wedang hangat dari opsi yang tersedia.",
            "Pilihlah sapaan yang mengandung ketulusan, doa kebaikan, dan budi pekerti khas Yogyakarta.",
            "Tekan tombol 'Sajikan Wedang' untuk menyaksikan dampak kehangatan racikanmu terhadap semangat pengunjung."
          ]}
          tip="Di Angkringan Pak Ilmu, tutur kata ramah dan doa yang tulus adalah separuh dari khasiat obat itu sendiri."
          onOpenHelp={onOpenHelp}
        />
      )}

      <div className="customer-encounter-panel">
        {/* Panel Sisi Kiri: Profil Pelanggan & Dialog */}
        <div className="customer-profile-card">
          <div className="rain-badge">
            <CloudRain size={14} />
            <span>{currentPersona.contextBadge}</span>
          </div>

          <div className="customer-avatar-frame">
            <User size={52} />
          </div>

          <h3 className="customer-name">{currentPersona.name}</h3>
          <span className="customer-status">{currentPersona.condition}</span>

          <div className="customer-dialogue-balloon">
            <p>“{currentPersona.story}”</p>
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
              Isyarat Kebutuhan Pengunjung:
            </strong>
            {currentPersona.clue}
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
                  Pendekatan Apa yang Paling Tepat untuk {currentPersona.name}?
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Pilihlah solusi yang menyentuh akar masalah fisik sekaligus memulihkan semangat batinnya.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentPersona.needsAnalysis.map((need) => {
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
                          <span>Pilih Pendekatan Ini</span>
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
                          color: need.isCorrect ? 'var(--color-teal-dark)' : 'var(--color-bata-dark)',
                          lineHeight: '1.45',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {need.isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
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
                  disabled={!selectedNeed || !selectedNeed.isCorrect}
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

          {/* FASE 2: PERACIKAN BAHAN DENGAN ILUSTRASI REMPAH ASLI */}
          {currentPhase === 2 && (
            <div className="brewing-workshop">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-orange)', fontWeight: 800, textTransform: 'uppercase' }}>
                    Langkah 2 dari 3: Penakaran Komposisi Rempah
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    Menakar Rempah Tradisional di Cangkir Blirik
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Mulai dari takaran awal, sesuaikan dosis rempah agar kehangatan, aroma, dan kemanisan berpadu harmonis.
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
                {/* Jahe Emprit Bakar (Menggunakan Ilustrasi jahe.svg Asli) */}
                <div className="ingredient-tweak-box active">
                  <img
                    src="/assets/spices/jahe.svg"
                    alt="Rimpang Jahe Emprit Bakar"
                    className="spice-svg-icon"
                  />
                  <span className="tweak-name">Jahe Emprit Bakar</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Bara Pengusir Dingin</span>
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
                  <span style={{
                    fontSize: '0.72rem',
                    color: isJaheHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)',
                    fontWeight: 700,
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isJaheHarmonious ? <><Check size={12} /> Takaran Pas</> : (jaheLevel < currentPersona.idealRatios.jaheMin ? 'Perlu Ditambah' : 'Terlalu Pedas')}
                  </span>
                </div>

                {/* Batang Sereh Wangi (Menggunakan Ilustrasi sereh.svg Asli) */}
                <div className="ingredient-tweak-box active">
                  <img
                    src="/assets/spices/sereh.svg"
                    alt="Batang Sereh Wangi Memar"
                    className="spice-svg-icon"
                  />
                  <span className="tweak-name">Batang Sereh Memar</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Aroma Pelega Napas</span>
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
                  <span style={{
                    fontSize: '0.72rem',
                    color: isSerehHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)',
                    fontWeight: 700,
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isSerehHarmonious ? <><Check size={12} /> Aroma Pas</> : (serehLevel < currentPersona.idealRatios.serehMin ? 'Aroma Lemah' : 'Terlalu Wangi')}
                  </span>
                </div>

                {/* Gula Jawa Aren (Menggunakan Ilustrasi gula_aren.svg Asli) */}
                <div className="ingredient-tweak-box active">
                  <img
                    src="/assets/spices/gula_aren.svg"
                    alt="Gula Jawa Aren Asli"
                    className="spice-svg-icon"
                  />
                  <span className="tweak-name">Gula Jawa Aren</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Peneguh Daya Stamina</span>
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
                  <span style={{
                    fontSize: '0.72rem',
                    color: isGulaHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)',
                    fontWeight: 700,
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isGulaHarmonious ? <><Check size={12} /> Manis Pas</> : (gulaLevel < currentPersona.idealRatios.gulaMin ? 'Kurang Manis' : 'Terlalu Manis')}
                  </span>
                </div>
              </div>

              {/* Indikator Harmoni Seduhan Sesuai Persona Aktif */}
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
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Intensitas Hangat Jahe</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isJaheHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', marginTop: '2px' }}>
                    {isJaheHarmonious ? 'Kehangatan Pas' : (jaheLevel < currentPersona.idealRatios.jaheMin ? 'Kurang Menghangatkan' : 'Terlalu Menyengat')}
                  </div>
                </div>
                <div style={{ borderLeft: '1.5px solid var(--border-natural)', borderRight: '1.5px solid var(--border-natural)', padding: '0 24px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Ketenangan Aroma Sereh</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isSerehHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', marginTop: '2px' }}>
                    {isSerehHarmonious ? 'Harum Menenteramkan' : (serehLevel < currentPersona.idealRatios.serehMin ? 'Aroma Terlalu Tipis' : 'Aroma Terlalu Tajam')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Keseimbangan Manis Aren</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isGulaHarmonious ? 'var(--color-teal-dark)' : 'var(--color-orange)', marginTop: '2px' }}>
                    {isGulaHarmonious ? 'Manis Alami Pas' : (gulaLevel < currentPersona.idealRatios.gulaMin ? 'Kurang Asupan Tenaga' : 'Terlalu Manis')}
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
                  disabled={!isRecipeBalanced}
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
                  Bagaimana Caramu Menyerahkan Cangkir Wedang kepada {currentPersona.name}?
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Penyajian bukan sekadar serah terima fisik, melainkan penyampaian rasa kemanusiaan dan empati.
                </p>
              </div>

              <div className="decision-options-group">
                {currentPersona.presentationDecisions.map((dec) => {
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
                          <span>Pilih Tutur Kata Ini</span>
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
                            {dec.impact}
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
                  <span>Sajikan Wedang</span>
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
                {currentPersona.resolutionDesc}
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
                “{currentPersona.resolutionQuote}”
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
