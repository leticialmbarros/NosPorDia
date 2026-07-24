/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Beaker,
  Sparkles,
  Info,
  Layers,
  Heart,
  Database,
  Calendar,
  Atom,
  FlaskConical,
} from 'lucide-react';
import { CalendarEvent } from './types';
import { dataService } from './services/dataService';
import { isFirebaseConfigured } from './firebase';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ProfileSelector } from './components/ProfileSelector';
import { AboutModal } from './components/AboutModal';
import { CurcuminMolecule } from './components/CurcuminMolecule';
import { MemoryAlbum } from './components/MemoryAlbum';
import { ChemistryBackdrop } from './components/ChemistryBackdrop';
import { CriandoReacoes } from './components/CriandoReacoes';
import { CompostoDesconhecido } from './components/CompostoDesconhecido';
import { DateChecklist } from './components/DateChecklist';
import { CapsulaDoTempo } from './components/CapsulaDoTempo';

// Dynamically compute current date matching the system/local date to keep metrics updated automatically!
const now = new Date();
const INITIAL_YEAR = now.getFullYear();
const INITIAL_MONTH = now.getMonth(); // 0-indexed (e.g. 5 for June)
const TODAY_STRING = `${INITIAL_YEAR}-${String(INITIAL_MONTH + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentProfile, setCurrentProfile] = useState<string>('Letícia');

  // Pulse Connection system (Melhoria C)
  const [receivedPulse, setReceivedPulse] = useState<{ sender: string; timestamp: string } | null>(null);
  const [showPulseOverlay, setShowPulseOverlay] = useState(false);

  // Calendar View Month/Year
  const [viewedYear, setViewedYear] = useState<number>(INITIAL_YEAR);
  const [viewedMonth, setViewedMonth] = useState<number>(INITIAL_MONTH);

  // Dedicated Route Navigation ('home' vs 'composto-desconhecido')
  const [currentRoute, setCurrentRoute] = useState<'home' | 'composto-desconhecido'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('composto-desconhecido') || hash.includes('composto-desconhecido')) {
        return 'composto-desconhecido';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('composto-desconhecido') || hash.includes('composto-desconhecido')) {
        setCurrentRoute('composto-desconhecido');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: 'home' | 'composto-desconhecido') => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      if (route === 'composto-desconhecido') {
        window.history.pushState({}, '', '/composto-desconhecido');
      } else {
        window.history.pushState({}, '', '/');
      }
    }
  };

  // About panel toggle
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load and subscribe to real-time events and postits on mount
  useEffect(() => {
    // Current identity saved in local storage
    const savedProfile = localStorage.getItem('curcumina_current_profile');
    if (savedProfile) {
      setCurrentProfile(savedProfile);
    }

    const unsubEvents = dataService.subscribeEvents((loadedEvents) => {
      setEvents(loadedEvents);
    });

    return () => {
      unsubEvents();
    };
  }, []);

  // Real-time peer-to-peer Ocitocina pulses
  useEffect(() => {
    const mountTime = Date.now();
    const unsubPulse = dataService.subscribeOcitocinaPulse((pulse) => {
      if (pulse && pulse.sender !== currentProfile) {
        const pulseTime = new Date(pulse.timestamp).getTime();
        // Only trigger if pulse was sent since the component was rendered, to avoid trigger on startup load
        const isNew = pulseTime > mountTime - 3000;
        const isRecent = Date.now() - pulseTime < 45000;
        if (isNew && isRecent) {
          setReceivedPulse(pulse);
          setShowPulseOverlay(true);
        }
      }
    });

    return () => {
      unsubPulse();
    };
  }, [currentProfile]);

  const handleProfileChange = (selectedName: string) => {
    setCurrentProfile(selectedName);
    localStorage.setItem('curcumina_current_profile', selectedName);
  };

  const handleAddEvent = async (eventPayload: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    await dataService.addEvent(eventPayload);
  };

  const handleUpdateEvent = async (id: string, updatedFields: Partial<CalendarEvent>) => {
    await dataService.updateEvent(id, updatedFields);
  };

  const handleDeleteEvent = async (id: string) => {
    await dataService.deleteEvent(id);
  };

  const handleMonthViewChange = (year: number, month: number) => {
    setViewedYear(year);
    setViewedMonth(month);
  };

  const monthNamesBr = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F5] text-stone-800 flex flex-col font-sans transition-colors duration-500 relative notranslate">
      
      {/* Dynamic Background scientific grids with custom color overlays */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(to_right,#EADCDD_1px,transparent_1px),linear-gradient(to_bottom,#EADCDD_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Beautiful drawings of flasks, DNA spirals and elements from our uploaded references */}
      <ChemistryBackdrop />

      {/* Decorative floating molecule behind the app on large screens */}
      <div className="absolute left-10 top-44 w-60 h-auto opacity-[0.25] hidden xl:block z-0 pointer-events-none">
        <CurcuminMolecule />
      </div>

      {/* Upper-level API key warning banner if firebase hasn't been executed in UI yet */}
      {!isFirebaseConfigured && (
        <div id="offline-banner" className="bg-amber-600/5 border-b border-amber-200/40 px-4 py-2 text-center text-[11px] font-mono font-medium text-amber-850 z-10 flex items-center justify-center gap-2 bg-[#FAF6E2]">
          <Database size={12} className="text-amber-600 shrink-0" />
          <span>Banco de dados local com persistência offline-first ativo • Sincronização em nuvem inativa</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="underline hover:text-amber-800 font-bold ml-1"
          >
            Configurações
          </button>
        </div>
      )}

      {/* Page Header */}
      <header className="relative border-b z-20 px-3.5 py-3 md:px-8 bg-[#FCF6F2]/85 border-rose-100 backdrop-blur-md text-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo element */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500 shadow-xs flex items-center justify-center text-white font-sans font-bold text-xl sm:text-2xl border border-rose-450 shrink-0">
              ⚢
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-rose-600 font-cursive select-none leading-none tracking-wide mt-1">
                  NósPorDia
                </h1>
                <span className="hidden sm:inline-flex leading-none items-center gap-1.5 text-[9px] px-1.5 py-0.5 rounded-md font-extrabold font-mono tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                  C<sub>21</sub>H<sub>20</sub>O<sub>6</sub>
                </span>
              </div>
              <p className="text-[8.5px] sm:text-[9.5px] text-stone-550 font-mono tracking-tight mt-0.5 uppercase font-semibold flex items-center gap-1">
                <span>Síntese Harmônica de Curcumina, Ocitocina & Doses Diárias de Chamego</span>
                <Beaker size={11} className="text-rose-500 animate-pulse shrink-0" />
              </p>
            </div>
          </div>

          {/* Action triggers: Quick Scroll & Profile selector */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            <button
              onClick={() => {
                const el = document.getElementById('composto-desconhecido');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700 cursor-pointer"
            >
              <FlaskConical size={14} />
              <span className="inline">Amostra #014</span>
            </button>

            <ProfileSelector
              currentProfile={currentProfile}
              onProfileChange={handleProfileChange}
            />
          </div>
        </div>
      </header>

      {/* Primary Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-8 z-10 flex flex-col gap-6">
        
        {/* Core dynamic metrics dashboard values */}
        <Dashboard
          events={events}
          todayStr={TODAY_STRING}
          viewedYear={viewedYear}
          viewedMonth={viewedMonth}
          viewedMonthName={monthNamesBr[viewedMonth]}
        />

        {/* Composto Desconhecido - Investigação Laboratorial (Destaque no topo da página) */}
        <CompostoDesconhecido currentProfile={currentProfile} />

        {/* Calendar Workspace Grid */}
        <div id="main-deck-grid" className="w-full">
          <CalendarView
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            currentProfile={currentProfile}
            viewedYear={viewedYear}
            viewedMonth={viewedMonth}
            onViewChange={handleMonthViewChange}
          />
        </div>

        {/* Our Chemistry Memory Album */}
        <MemoryAlbum events={events} />

        {/* Laboratório Criando Reações */}
        <CriandoReacoes currentProfile={currentProfile} />

        {/* Nosso Checklist de Dates */}
        <DateChecklist currentProfile={currentProfile} />

        {/* Cápsula do Tempo / Cartinhas Secretas */}
        <CapsulaDoTempo currentProfile={currentProfile} />
      </main>

      {/* Footer bar */}
      <footer className="mt-auto border-t border-slate-150 bg-white/40 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Atom size={12} className="text-amber-500" />
            <span>C<sub>21</sub>H<sub>20</sub>O<sub>6</sub> é uma molécula fácil de explicar, a gente nem tanto.</span>
          </div>
          <div>
            <span>nóspordia &bull; 2026 &bull; Sintonização Estável</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Ocitocina Pulse Waves Overlay */}
      <AnimatePresence>
        {showPulseOverlay && receivedPulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-md overflow-hidden"
          >
            {/* Dynamic Senoidal waves floating across viewport */}
            <div className="absolute inset-0 flex flex-col justify-center gap-16 opacity-30 pointer-events-none">
              <svg className="w-full h-24 text-rose-300" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 C150,90 350,10 500,50 C650,90 850,10 1000,50 C1150,90 1350,10 1500,50 L1500,100 L0,100 Z"
                  fill="currentColor"
                  animate={{ x: [-300, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
              </svg>
              <svg className="w-full h-24 text-rose-400 rotate-180" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 C150,90 350,10 500,50 C650,90 850,10 1000,50 C1150,90 1350,10 1500,50 L1500,100 L0,100 Z"
                  fill="currentColor"
                  animate={{ x: [0, -300] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Pulsing hearts / ripple circular waves in center portion */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="w-40 h-40 rounded-full border-2 border-rose-500/50 absolute"
              />
              <motion.div
                animate={{ scale: [1, 3.5], opacity: [0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
                className="w-40 h-40 rounded-full border border-rose-400/30 absolute"
              />
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1, ease: 'easeOut' }}
                className="w-40 h-40 rounded-full bg-rose-500/10 absolute"
              />
            </div>

            {/* Main Glassmorphism modal content */}
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-white/95 border border-rose-200/90 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 text-center flex flex-col items-center select-none"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-rose-300 relative">
                <Heart className="fill-white animate-pulse" size={28} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif text-stone-900 mt-5">
                Pulso de Ocitocina Recebido!
              </h3>
              
              <p className="text-sm text-stone-700 mt-2.5 leading-relaxed font-sans px-2">
                A <strong className="text-rose-600 font-extrabold">{receivedPulse.sender}</strong> acabou de pensar em você neste exato milésimo de segundo e enviou este sinal químico do coração! 🧪❤️
              </p>

              <span className="text-[9.5px] uppercase tracking-widest font-mono font-bold text-rose-500/80 mt-4 leading-none bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100/50">
                Sintonia Estável Ativa
              </span>

              <button
                onClick={() => setShowPulseOverlay(false)}
                className="mt-6 w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] uppercase font-mono tracking-wider rounded-xl transition-all"
              >
                Retornar à Bancada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up explaining the scientific project layout */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
