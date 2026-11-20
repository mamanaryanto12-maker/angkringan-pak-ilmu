import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ExhibitionBackdrop from './components/ExhibitionBackdrop.jsx';
import OrderTicketModal from './components/OrderTicketModal.jsx';
import NotebookModal from './components/NotebookModal.jsx';
import HelpModal from './components/HelpModal.jsx';
import WalkthroughModal from './components/WalkthroughModal.jsx';
import ActWelcomeModal from './components/ActWelcomeModal.jsx';
import OpeningView from './views/OpeningView.jsx';
import Act1View from './views/Act1View.jsx';
import Act2View from './views/Act2View.jsx';
import Act3View from './views/Act3View.jsx';
import EpilogueView from './views/EpilogueView.jsx';
import SummaryView from './views/SummaryView.jsx';
import { soundManager } from './utils/audio.js';
import { ORDER_TICKETS } from './data/gameData.js';

export default function App() {
  const [sessionIndex, setSessionIndex] = useState(() => {
    const saved = localStorage.getItem('angkringan_session_index');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    return localStorage.getItem('angkringan_current_step') || 'intro';
  });

  const [gameMode, setGameMode] = useState(() => {
    return localStorage.getItem('angkringan_game_mode') || 'solo';
  });

  const [collectedNotes, setCollectedNotes] = useState(() => {
    const saved = localStorage.getItem('angkringan_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [inspectedObjects, setInspectedObjects] = useState(() => {
    const saved = localStorage.getItem('angkringan_inspected');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedActs, setCompletedActs] = useState(() => {
    const saved = localStorage.getItem('angkringan_completed_acts');
    return saved ? JSON.parse(saved) : [];
  });

  const [seenWelcomeActs, setSeenWelcomeActs] = useState(() => {
    const saved = localStorage.getItem('angkringan_seen_welcome');
    return saved ? JSON.parse(saved) : [];
  });
  const [welcomeModalAct, setWelcomeModalAct] = useState(null);

  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [volumeLevel, setVolumeLevel] = useState(soundManager.volume);

  // Mulai audio otomatis setelah interaksi pertama sesuai kebijakan autoplay browser
  useEffect(() => {
    const unlockAudio = () => {
      if (soundManager.isMuted || soundManager.isBgmPlaying) return;
      soundManager.startBgm().then((started) => {
        if (started) {
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
        }
      });
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Sesuaikan suara suasana hujan saat memasuki Babak 3
  useEffect(() => {
    soundManager.setWeatherAmbience(currentStep === 'act3');
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('angkringan_session_index', sessionIndex.toString());
  }, [sessionIndex]);

  useEffect(() => {
    localStorage.setItem('angkringan_current_step', currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('angkringan_game_mode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('angkringan_notes', JSON.stringify(collectedNotes));
  }, [collectedNotes]);

  useEffect(() => {
    localStorage.setItem('angkringan_inspected', JSON.stringify(inspectedObjects));
  }, [inspectedObjects]);

  useEffect(() => {
    localStorage.setItem('angkringan_completed_acts', JSON.stringify(completedActs));
  }, [completedActs]);

  useEffect(() => {
    localStorage.setItem('angkringan_seen_welcome', JSON.stringify(seenWelcomeActs));
  }, [seenWelcomeActs]);

  useEffect(() => {
    if (['act1', 'act2', 'act3', 'epilogue'].includes(currentStep)) {
      if (!seenWelcomeActs.includes(currentStep)) {
        setWelcomeModalAct(currentStep);
        setSeenWelcomeActs(prev => [...prev, currentStep]);
      }
    }
  }, [currentStep]);

  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted && !soundManager.isBgmPlaying) {
      soundManager.startBgm();
    }
  };

  const handleVolumeChange = (val) => {
    setVolumeLevel(val);
    soundManager.setVolume(val);
    if (val > 0 && soundManager.isMuted) {
      const nextMuted = soundManager.toggleMute();
      setIsMuted(nextMuted);
    }
    if (val > 0 && !soundManager.isBgmPlaying) {
      soundManager.startBgm();
    }
  };

  const handleStartGame = () => {
    setCurrentStep('act1');
  };

  const handleCompleteAct1 = () => {
    setCompletedActs(prev => [...prev, 'act1']);
    setCurrentStep('act2');
  };

  const handleCompleteAct2 = () => {
    setCompletedActs(prev => [...prev, 'act2']);
    setCurrentStep('act3');
  };

  const handleCompleteAct3 = () => {
    setCompletedActs(prev => [...prev, 'act3']);
    setCurrentStep('epilogue');
  };

  const handleCompleteEpilogue = () => {
    setCompletedActs(prev => [...prev, 'epilogue']);
    setCurrentStep('summary');
  };

  const handleResetGame = () => {
    localStorage.removeItem('angkringan_current_step');
    localStorage.removeItem('angkringan_notes');
    localStorage.removeItem('angkringan_inspected');
    localStorage.removeItem('angkringan_completed_acts');
    localStorage.removeItem('angkringan_seen_welcome');

    const nextSession = (sessionIndex + 1) % 3;
    localStorage.setItem('angkringan_session_index', nextSession.toString());
    setSessionIndex(nextSession);

    setCollectedNotes([]);
    setInspectedObjects([]);
    setCompletedActs([]);
    setSeenWelcomeActs([]);
    setWelcomeModalAct(null);
    setCurrentStep('intro');
  };

  const activeTicket = ORDER_TICKETS[sessionIndex % ORDER_TICKETS.length];

  return (
    <div className={`game-viewport ${currentStep === 'act3' ? 'rainy-night' : ''}`}>
      {/* Latar Belakang Asli Aset Pameran */}
      <ExhibitionBackdrop currentStep={currentStep} />

      {/* Navbar Atas */}
      <Navbar
        currentStep={currentStep}
        onOpenTicket={() => setIsTicketOpen(true)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onResetGame={handleResetGame}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        volumeLevel={volumeLevel}
        onChangeVolume={handleVolumeChange}
        hasUnreadNotes={collectedNotes.length > 0}
      />

      {/* Stage Permainan dengan Transisi Halus */}
      <main key={currentStep} className="stage-transition-frame">
        {currentStep === 'intro' && (
          <OpeningView
            onStartGame={handleStartGame}
            gameMode={gameMode}
            setGameMode={setGameMode}
            onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            sessionIndex={sessionIndex}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            volumeLevel={volumeLevel}
            onChangeVolume={handleVolumeChange}
          />
        )}

        {currentStep === 'act1' && (
          <Act1View
            onCompleteAct={handleCompleteAct1}
            collectedNotes={collectedNotes}
            setCollectedNotes={setCollectedNotes}
            inspectedObjects={inspectedObjects}
            setInspectedObjects={setInspectedObjects}
            onOpenTicket={() => setIsTicketOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            sessionIndex={sessionIndex}
          />
        )}

        {currentStep === 'act2' && (
          <Act2View
            onCompleteAct={handleCompleteAct2}
            gameMode={gameMode}
            onOpenHelp={() => setIsHelpOpen(true)}
            sessionIndex={sessionIndex}
          />
        )}

        {currentStep === 'act3' && (
          <Act3View
            onCompleteAct={handleCompleteAct3}
            onOpenHelp={() => setIsHelpOpen(true)}
            sessionIndex={sessionIndex}
          />
        )}

        {currentStep === 'epilogue' && (
          <EpilogueView
            onCompleteEpilogue={handleCompleteEpilogue}
            onOpenHelp={() => setIsHelpOpen(true)}
            sessionIndex={sessionIndex}
          />
        )}

        {currentStep === 'summary' && (
          <SummaryView
            onRestartGame={handleResetGame}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            sessionIndex={sessionIndex}
          />
        )}
      </main>

      <ActWelcomeModal
        isOpen={Boolean(welcomeModalAct)}
        onClose={() => setWelcomeModalAct(null)}
        currentStep={welcomeModalAct || currentStep}
      />

      <OrderTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        ticketData={activeTicket}
      />

      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        collectedNotes={collectedNotes}
        inspectedObjects={inspectedObjects}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        currentStep={currentStep}
        onOpenActWelcome={() => setWelcomeModalAct(currentStep)}
      />

      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onStartFromWalkthrough={() => {
          if (currentStep === 'intro') {
            handleStartGame();
          }
        }}
      />
    </div>
  );
}
