/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Beaker,
  Sparkles,
  Droplet,
  Flame,
  Music,
  Settings,
  Check,
  RefreshCw,
  Heart,
  Volume2,
  Trash2,
  Play,
  Plus,
  ListMusic,
  ExternalLink,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { PlaylistItem } from '../types';

interface HiddenSong {
  id: string;
  containerName: string;
  description: string;
  reagentName: string;
  reagentIcon: 'droplet' | 'flame' | 'shake';
  defaultTitle: string;
  customTitle?: string;
  defaultUrl: string; // This stores the Spotify Embed URL
  customUrl?: string; // Tries to override embed url
  colorTheme: {
    liquid: string;
    bg: string;
    border: string;
    accent: string;
    text: string;
  };
}

/**
 * Intelligent helper to extract a valid Spotify embed URL from either raw sharing links,
 * full raw iframe embed blocks, or pre-formatted generator links.
 */
function extractSpotifyEmbedUrl(input: string): string {
  const trimmed = input.trim();
  
  // 1. If it's a full <iframe> raw tag
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. Extract standard Spotify sharing URLs (e.g., https://open.spotify.com/track/3dG6nMYT9DIv0aUizubtFr?si=xxxx)
  if (trimmed.includes('open.spotify.com/')) {
    let clean = trimmed;
    // Remove enclosing quotes if any
    clean = clean.replace(/['"]/g, '');
    
    // If it's already an embed URL, use it directly (with generator if exists)
    if (clean.includes('/embed/')) {
      return clean;
    }

    // Convert standard URLs to embed URLs
    clean = clean.replace('open.spotify.com/track/', 'open.spotify.com/embed/track/');
    clean = clean.replace('open.spotify.com/album/', 'open.spotify.com/embed/album/');
    clean = clean.replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/');
    clean = clean.replace('open.spotify.com/artist/', 'open.spotify.com/embed/artist/');
    
    // Ensure utm_source query param appended
    if (!clean.includes('?')) {
      clean += '?utm_source=generator';
    } else if (!clean.includes('utm_source=')) {
      clean += '&utm_source=generator';
    }
    return clean;
  }

  return trimmed;
}

interface CriandoReacoesProps {
  currentProfile: string;
}

export const CriandoReacoes: React.FC<CriandoReacoesProps> = ({ currentProfile }) => {
  const [isSendingPulse, setIsSendingPulse] = useState(false);

  const handleSendPulse = async () => {
    setIsSendingPulse(true);
    try {
      await dataService.sendOcitocinaPulse(currentProfile);
    } catch (err) {
      console.error('Error sending pulse:', err);
    }
    setTimeout(() => {
      setIsSendingPulse(false);
    }, 2800);
  };

  // Initialize the three containers specifically matching the user's Spotify dedications!
  const [songs, setSongs] = useState<HiddenSong[]>(() => {
    const saved = localStorage.getItem('curcumina_reactions_songs_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse from localStorage:', e);
      }
    }
    return [
      {
        id: 'reaction-dengo',
        containerName: 'Recipiente 01: Solução de Ocitocina & Dengo',
        description: 'Alivia os sintomas agudos de saudade e induz relaxamento instantâneo nas pálpebras.',
        reagentName: 'Gotejar Gotas de Ocitocina',
        reagentIcon: 'droplet',
        defaultTitle: 'Dengo - AnaVitória',
        defaultUrl: 'https://open.spotify.com/embed/track/3dG6nMYT9DIv0aUizubtFr?utm_source=generator',
        colorTheme: {
          liquid: 'bg-rose-500/85',
          bg: 'bg-rose-50/50',
          border: 'border-rose-200/90',
          accent: 'rose',
          text: 'text-rose-800',
        },
      },
      {
        id: 'reaction-presenca',
        containerName: 'Recipiente 02: Catalisador de Calor Humano',
        description: 'Aquece o peito e desacelera as batidas da ansiedade. Libera lembranças de abraços demorados.',
        reagentName: 'Aumentar a Temperatura',
        reagentIcon: 'flame',
        defaultTitle: 'Acalento e Presença',
        defaultUrl: 'https://open.spotify.com/embed/track/2KKNljHCnHhH8brX2n4cYT?utm_source=generator',
        colorTheme: {
          liquid: 'bg-indigo-500/85',
          bg: 'bg-indigo-50/50',
          border: 'border-indigo-200/90',
          accent: 'indigo',
          text: 'text-indigo-850',
        },
      },
      {
        id: 'reaction-vibe',
        containerName: 'Recipiente 03: Efervescência de Date de Exploração',
        description: 'Desperta risadas bobas, sintonia farmacológica ideal e energia térmica para novos roteiros.',
        reagentName: 'Agitar Intensamente',
        reagentIcon: 'shake',
        defaultTitle: 'Se Joga Na Minha Vida',
        defaultUrl: 'https://open.spotify.com/embed/track/6gKVvN4rex186vmhxGzHBt?utm_source=generator',
        colorTheme: {
          liquid: 'bg-amber-500/85',
          bg: 'bg-amber-50/55',
          border: 'border-amber-200/90',
          accent: 'amber',
          text: 'text-amber-800',
        },
      },
    ];
  });

  // Track reaction states in local storage or state
  const [activeReactions, setActiveReactions] = useState<Record<string, 'idle' | 'reacting' | 'completed'>>(() => {
    const saved = localStorage.getItem('curcumina_reactions_states');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure any transient 'reacting' state is reset to 'idle' so it doesn't freeze or get stuck on page reloads/glitches
        const sanitized: Record<string, 'idle' | 'reacting' | 'completed'> = {};
        for (const key in parsed) {
          if (parsed[key] === 'reacting') {
            sanitized[key] = 'idle';
          } else {
            sanitized[key] = parsed[key];
          }
        }
        return sanitized;
      } catch (_) {}
    }
    return {};
  });

  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<Record<string, Array<{ id: number; delay: number; left: number; size: number }>>>({});

  // Temp editing fields
  const [tempTitle, setTempTitle] = useState('');
  const [tempUrl, setTempUrl] = useState('');

  // Playlist states
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [activePlaylistItem, setActivePlaylistItem] = useState<PlaylistItem | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [songIdToDelete, setSongIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribePlaylist((data) => {
      setPlaylist(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim() || !newTrackUrl.trim()) return;
    const embedUrl = extractSpotifyEmbedUrl(newTrackUrl);
    try {
      await dataService.addPlaylistItem(newTrackTitle.trim(), embedUrl, currentProfile, newTrackArtist.trim());
      setNewTrackTitle('');
      setNewTrackArtist('');
      setNewTrackUrl('');
      setIsAddingSong(false);
    } catch (err) {
      console.error('Error adding song to playlist:', err);
    }
  };

  const handleDeleteSong = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await dataService.deletePlaylistItem(id);
      if (activePlaylistItem?.id === id) {
        setActivePlaylistItem(null);
      }
      setSongIdToDelete(null);
    } catch (err) {
      console.error('Error deleting playlist item:', err);
    }
  };

  // Persist customized links
  useEffect(() => {
    localStorage.setItem('curcumina_reactions_songs_v4', JSON.stringify(songs));
  }, [songs]);

  // Persist completed states so chemistry stays fused across session refreshes!
  useEffect(() => {
    localStorage.setItem('curcumina_reactions_states', JSON.stringify(activeReactions));
  }, [activeReactions]);

  const initBubbleEffect = (id: string) => {
    // Generate 18 randomized bubbles for boiling animations
    const arr = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10, // 10% to 90%
      size: Math.random() * 9 + 4,   // 4px to 13px
      delay: Math.random() * 1.5,
    }));
    setBubbles((prev) => ({ ...prev, [id]: arr }));
  };

  const handleTriggerReaction = (song: HiddenSong) => {
    const id = song.id;
    if (activeReactions[id] === 'reacting') return;

    // Trigger reacting animation
    setActiveReactions((prev) => ({ ...prev, [id]: 'reacting' }));
    initBubbleEffect(id);

    // Synthesis time delay (precipitating molecules)
    setTimeout(() => {
      setActiveReactions((prev) => ({ ...prev, [id]: 'completed' }));
    }, 2500); // 2.5s reaction synthesis
  };

  const handleResetContainer = (id: string) => {
    setActiveReactions((prev) => ({
      ...prev,
      [id]: 'idle',
    }));
  };

  const startEditing = (song: HiddenSong) => {
    setEditingSongId(song.id);
    setTempTitle(song.customTitle || song.defaultTitle);
    setTempUrl(song.customUrl || song.defaultUrl);
  };

  const saveEditing = (id: string) => {
    const processedUrl = extractSpotifyEmbedUrl(tempUrl);
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            customTitle: tempTitle.trim() || undefined,
            customUrl: processedUrl.trim() || undefined,
          };
        }
        return s;
      })
    );
    setEditingSongId(null);
  };

  return (
    <div
      id="criando-reacoes-root"
      className="bg-stone-50/70 border border-rose-250/30 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden mt-10"
    >
      {/* Decorative side beaker background pattern element */}
      <div className="absolute right-[-24px] bottom-[-24px] text-rose-100 opacity-25 pointer-events-none select-none">
        <Beaker size={150} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 relative z-10 border-b border-stone-200/50 pb-6">
        <div className="max-w-xl">
          <div id="reacoes-header" className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl">
              <Sparkles className="text-rose-500 animate-pulse" size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-rose-600">
              LABSOM
            </span>
          </div>
          <h2 id="reacoes-title" className="text-3xl md:text-4xl text-stone-900 font-serif font-bold tracking-tight">
            Criando Reações
          </h2>
          <p id="reacoes-desc" className="text-[11px] text-stone-605 font-mono leading-relaxed mt-2 uppercase font-bold tracking-tight text-slate-500">
            Combine os ingredientes térmicos abaixo para realizar o ensaio de síntese molecular.
            Ao completar, os reagentes serão purificados revelando resultados!
          </p>
        </div>

        {/* Pulse Generator Box (Melhoria C) */}
        <div className="shrink-0 bg-white border border-rose-200/60 rounded-2xl p-4 shadow-2xs flex flex-col items-center text-center max-w-full md:max-w-[240px] w-full self-start md:self-center">
          <div className="relative mb-2 flex items-center justify-center">
            {/* Pulsating background ring when sending */}
            <AnimatePresence>
              {isSendingPulse && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute w-10 h-10 rounded-full border-2 border-rose-400 pointer-events-none"
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={isSendingPulse ? { scale: [1, 1.2, 0.95, 1.15, 1] } : {}}
              transition={{ duration: 0.8 }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors border ${
                isSendingPulse ? 'bg-rose-500 text-white border-rose-600' : 'bg-rose-50 border-rose-100 text-rose-500'
              }`}
            >
              <Heart className={isSendingPulse ? "fill-white animate-pulse" : "fill-none"} size={18} />
            </motion.div>
          </div>
          <button
            onClick={handleSendPulse}
            disabled={isSendingPulse}
            className={`w-full py-2.5 px-3 text-[9.5px] font-mono font-extrabold uppercase tracking-widest text-center rounded-xl transition-all border flex items-center justify-center gap-1.5 shadow-3xs active:translate-y-0.5 ${
              isSendingPulse
                ? 'bg-rose-50 text-rose-600 border-rose-200/50 cursor-not-allowed'
                : 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600 cursor-pointer active:scale-[0.98]'
            }`}
          >
            <span>{isSendingPulse ? 'Sinal Conectando...' : 'Emitir Pulso de Ocitocina'}</span>
          </button>
          <span className="text-[7.5px] font-mono font-bold text-stone-400 mt-1.5 uppercase tracking-wider block">
            A outra pessoa sentirá o pulso na hora ⚡
          </span>
        </div>
      </div>

      {/* Grid of 3 Containers for Spotify dedications */}
      <div id="reacoes-experiments-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {songs.map((song) => {
          const state = activeReactions[song.id] || 'idle';
          const currentUrl = song.customUrl || song.defaultUrl;
          const currentTitle = song.customTitle || song.defaultTitle;

          return (
            <div
              key={song.id}
              id={`container-${song.id}`}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                state === 'completed'
                  ? `${song.colorTheme.bg}/70 ${song.colorTheme.border} md:col-span-1`
                  : 'bg-white border-stone-200/90 shadow-2xs hover:border-rose-200'
              }`}
            >
              <div className="space-y-4">
                {/* Visual Label indicators */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-mono font-bold text-stone-400 tracking-wider">
                      {song.containerName.split(':')[0]}
                    </h3>
                    {state === 'completed' && (
                      <span className="text-[8.5px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono font-bold rounded-full border border-emerald-100 flex items-center gap-0.5 uppercase">
                        <Heart className="fill-emerald-600 inline" size={8} /> Sintetizado
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 font-serif leading-tight mt-1">
                    {song.containerName.split(': ')[1]}
                  </h4>
                  {state !== 'completed' && (
                    <p className="text-[10.5px] text-stone-500 leading-relaxed font-mono mt-1.5 font-medium">
                      {song.description}
                    </p>
                  )}
                </div>

                {/* VISUAL VESSEL STAGE (Only shown in idle or reacting state) */}
                {state !== 'completed' && (
                  <div className="relative h-28 bg-[#FAF8F5]/80 rounded-xl border border-stone-200/60 overflow-hidden flex items-center justify-center">
                    
                    {/* Boiling Bubbles effect */}
                    {state === 'reacting' && (
                      <div className="absolute inset-0 z-10 pointer-events-none">
                        {bubbles[song.id]?.map((b) => (
                          <motion.div
                            key={b.id}
                            className={`absolute bottom-0 rounded-full ${song.colorTheme.liquid} opacity-70`}
                            style={{
                              left: `${b.left}%`,
                              width: `${b.size}px`,
                              height: `${b.size}px`,
                            }}
                            initial={{ y: 110, opacity: 0.8 }}
                            animate={{ y: -30, opacity: 0 }}
                            transition={{
                              duration: 1.4,
                              delay: b.delay,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                        {/* Swirling text */}
                        <div className="absolute top-2 inset-x-0 flex justify-center text-rose-500 text-[10px] font-extrabold font-mono animate-pulse uppercase tracking-wider">
                          PRECIPITANDO AFETO...
                        </div>
                      </div>
                    )}

                    {/* Scientific Flask Visual */}
                    <motion.div 
                      className="relative w-16 h-20 flex flex-col justify-end items-center"
                      animate={
                        state === 'reacting'
                          ? {
                              x: [0, -3, 3, -3, 3, -1, 1, 0],
                              y: [0, -1, 1, -1, 1, 0, 0, 0],
                              rotate: [0, -3, 3, -3, 3, -1, 1, 0]
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.5,
                        repeat: state === 'reacting' ? Infinity : 0
                      }}
                    >
                      <div className="w-5 h-8 border-2 border-stone-850 rounded-t-sm absolute top-0 bg-transparent flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-stone-700 absolute top-1" />
                      </div>

                      <div className="w-14 h-13 border-2 border-stone-850 rounded-full-bottom absolute bottom-0 bg-transparent flex items-center justify-center overflow-hidden">
                        <motion.div
                          className={`absolute bottom-0 inset-x-0 ${song.colorTheme.liquid} rounded-b-xl z-0`}
                          initial={{ height: '30%' }}
                          animate={
                            state === 'reacting'
                              ? { height: ['30%', '85%', '70%'] }
                              : { height: '30%' }
                          }
                          transition={{ duration: 2.5 }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* TRIGGER OR LOADING BAR (idle or reacting) */}
                {state !== 'completed' && (
                  <div className="pt-1">
                    <AnimatePresence mode="wait">
                      {state === 'idle' ? (
                        <motion.button
                          id={`trigger-btn-${song.id}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          onClick={() => handleTriggerReaction(song)}
                          className={`w-full py-2.5 bg-stone-900 border border-stone-800 text-white font-extrabold font-mono text-[9.5px] tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 active:translate-y-0.5 hover:scale-[1.01] transition-all`}
                        >
                          {song.reagentIcon === 'droplet' && <Droplet size={11} className="text-rose-400 fill-rose-300" />}
                          {song.reagentIcon === 'flame' && <Flame size={11} className="text-orange-400" />}
                          {song.reagentIcon === 'shake' && <RefreshCw size={11} className="text-amber-500 animate-spin-slow" />}
                          <span>{song.reagentName}</span>
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-2.5 bg-amber-50/40 font-mono text-[9px] font-bold text-amber-800 text-center uppercase tracking-widest rounded-xl border border-amber-250/40"
                        >
                          Catalisando Solutos...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* THE CRYSTALLIZED SONG RESULT (Spotify Embed Iframe) */}
                {state === 'completed' && (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className="relative shadow-md rounded-xl overflow-hidden bg-black/5">
                      {/* Premium Spotify Player Iframe Embed */}
                      <iframe
                        src={currentUrl}
                        width="100%"
                        height="352"
                        style={{ borderRadius: '12px' }}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`Spotify Player - ${currentTitle}`}
                        className="w-full h-[352px] border-0 rounded-xl"
                      />
                    </div>

                    {/* Footer Utility toolbar for completed song */}
                    <div className="flex items-center justify-between text-stone-600 px-1 py-1 rounded-lg bg-stone-100/50 border border-stone-200/50 text-[10px] font-mono">
                      <button
                        onClick={() => handleResetContainer(song.id)}
                        className="font-bold uppercase hover:text-rose-700 transition-colors flex items-center gap-1 hover:underline"
                        title="Resetar ensaio"
                      >
                        <RefreshCw size={10} className="text-stone-400" />
                        <span>Sintetizar Novamente</span>
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(song)}
                          className="font-bold uppercase text-stone-500 hover:text-stone-800 flex items-center gap-1"
                          title="Alterar música Spotify"
                        >
                          <Settings size={10} className="text-stone-400" />
                          <span>Mudar Link</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* SPOTIFY MUSIC LINK WRITER DRAWER */}
              <AnimatePresence>
                {editingSongId === song.id && (
                  <motion.div
                    id={`editor-panel-${song.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-dashed border-stone-250/70 space-y-2 text-stone-800"
                  >
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-extrabold font-mono uppercase text-slate-500">
                        Identificador / Nome do Som
                      </label>
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder="Ex: Minha Dedicação Spotify"
                        className="w-full text-[10.5px] px-2 py-1.5 border border-stone-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-200 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-extrabold font-mono uppercase text-slate-500">
                        Link de Compartilhamento Spotify ou Código Embed
                      </label>
                      <textarea
                        rows={2}
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="Cole o link de compartilhar música do Spotify ou a tag <iframe> embed do player"
                        className="w-full text-[9px] px-2 py-1.5 border border-stone-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-200 font-mono"
                      />
                    </div>
                    <div className="flex gap-1.5 justify-end pt-1">
                      <button
                        id={`cancel-edit-${song.id}`}
                        onClick={() => setEditingSongId(null)}
                        className="px-2 py-1 bg-stone-150 hover:bg-stone-200 text-stone-700 font-mono text-[9px] font-extrabold rounded-md"
                      >
                        Cancelar
                      </button>
                      <button
                        id={`save-edit-${song.id}`}
                        onClick={() => saveEditing(song.id)}
                        className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-extrabold rounded-md flex items-center gap-1"
                      >
                        <Check size={9} />
                        <span>Confirmar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* COMPACT SHARED PLAYLIST SECTION */}
      <div className="mt-8 pt-8 border-t border-amber-250/40 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-rose-500 font-mono font-extrabold uppercase text-[10px] tracking-wider">
              <ListMusic size={14} className="animate-pulse" />
              <span>Playlist Compartilhada</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900 leading-tight">
              Síntese Melódica
            </h3>
            <p className="text-[10px] text-stone-500 font-mono leading-normal mt-0.5 uppercase tracking-wide">
              Músicas sugeridas por vocês para escutarem juntas. Adicione novos reagentes harmônicos!
            </p>
          </div>

          <button
            onClick={() => setIsAddingSong(!isAddingSong)}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono text-[9px] font-bold tracking-wide uppercase rounded-xl flex items-center gap-1.5 self-start shadow-3xs"
          >
            <Plus size={12} className={isAddingSong ? 'rotate-45 transition-transform' : 'transition-transform'} />
            <span>{isAddingSong ? 'Fechar Cadastro' : 'Adicionar Música'}</span>
          </button>
        </div>

        {/* Inline form to add song */}
        <AnimatePresence>
          {isAddingSong && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <form onSubmit={handleAddSong} className="bg-white border border-rose-200/40 rounded-2xl p-4 shadow-3xs space-y-3 max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-extrabold font-mono uppercase text-slate-500">
                      Nome da Música *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Te Amar Demais, Flores..."
                      value={newTrackTitle}
                      onChange={(e) => setNewTrackTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-stone-50/50 rounded-xl focus:outline-none focus:border-rose-400 font-semibold text-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-extrabold font-mono uppercase text-slate-500">
                      Cantor / Artista
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: AnaVitória, Marília Mendonça..."
                      value={newTrackArtist}
                      onChange={(e) => setNewTrackArtist(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-stone-50/50 rounded-xl focus:outline-none focus:border-rose-400 font-semibold text-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-extrabold font-mono uppercase text-slate-500">
                      Link Spotify ou Código Embed *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cole o link do Spotify..."
                      value={newTrackUrl}
                      onChange={(e) => setNewTrackUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-stone-50/50 rounded-xl focus:outline-none focus:border-rose-400 font-mono font-bold text-stone-700 placeholder:font-sans placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSong(false);
                      setNewTrackTitle('');
                      setNewTrackArtist('');
                      setNewTrackUrl('');
                    }}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono text-[9px] font-bold rounded-lg uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-bold rounded-lg uppercase flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check size={10} />
                    <span>Salvar na Playlist</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Player Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Active Player (Left column) */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {activePlaylistItem ? (
                <motion.div
                  key={activePlaylistItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/5 p-1 rounded-2xl border border-rose-200/30 overflow-hidden shadow-xs relative"
                >
                  <iframe
                    src={activePlaylistItem.url}
                    width="100%"
                    height="352"
                    style={{ borderRadius: '12px' }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify Player - ${activePlaylistItem.title}`}
                    className="w-full h-[352px] border-0 rounded-xl"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[8px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    Tocando Agora ⚡
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[352px] border border-dashed border-amber-250/50 bg-amber-50/25 rounded-2xl flex flex-col items-center justify-center text-center p-6"
                >
                  <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                    <Music size={24} />
                  </div>
                  <h4 className="text-sm font-bold font-serif text-stone-850">Resonância em Espera</h4>
                  <p className="text-[10px] text-stone-500 font-mono max-w-[200px] leading-relaxed mt-2 uppercase font-semibold">
                    Escolha um reagente da playlist ao lado para ativar a síntese melódica! 🧪❤️
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tracklist List (Right columns) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div className="space-y-2 max-h-[352px] overflow-y-auto pr-1">
              {playlist.length === 0 ? (
                <div className="p-8 border border-dashed border-stone-200/80 bg-white rounded-2xl text-center flex flex-col items-center justify-center h-full min-h-[220px]">
                  <p className="text-xs text-stone-400 font-mono font-bold">Nenhuma música cadastrada na playlist por enquanto.</p>
                  <p className="text-[9px] text-stone-400 font-mono mt-1 font-semibold uppercase">Clique em "Adicionar Música" acima e comece a construir sua sintonia especial!</p>
                </div>
              ) : (
                playlist.map((track, index) => {
                  const isActive = activePlaylistItem?.id === track.id;
                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => setActivePlaylistItem(track)}
                      className={`p-3 border rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-rose-50/70 border-rose-200 shadow-3xs'
                          : 'bg-white hover:bg-stone-50 border-stone-150 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number or active icon */}
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10.5px] font-mono font-bold shrink-0">
                          {isActive ? (
                            <Volume2 size={13} className="text-rose-500 animate-pulse" />
                          ) : (
                            <span className="text-stone-400">{(index + 1).toString().padStart(2, '0')}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold leading-tight flex items-center flex-wrap gap-1.5 ${isActive ? 'text-rose-700 font-extrabold' : 'text-stone-900'}`}>
                            <span>{track.title}</span>
                            {track.artist && (
                              <span className="text-stone-500 font-normal text-[10px] italic">
                                por {track.artist}
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8.5px] font-mono text-stone-400 block">
                              Adicionado por: <strong className="text-stone-600">{track.creator}</strong>
                            </span>
                            {track.url && (
                              <a
                                href={track.url.replace('/embed/', '/')}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-0.5 text-[8.5px] font-mono font-bold text-rose-500 hover:text-rose-600 hover:underline"
                                title="Abrir no Spotify"
                              >
                                <span>Link</span>
                                <ExternalLink size={8} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Play or delete buttons */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {songIdToDelete === track.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleDeleteSong(track.id, e)}
                              className="px-1.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[8px] font-mono font-bold rounded-md uppercase transition-colors"
                              title="Confirmar exclusão"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setSongIdToDelete(null)}
                              className="px-1.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[8px] font-mono font-bold rounded-md uppercase transition-colors"
                              title="Cancelar"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlaylistItem(isActive ? null : track);
                              }}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isActive
                                  ? 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
                              }`}
                              title={isActive ? 'Pausar Player' : 'Tocar Som'}
                            >
                              <Play size={10} className={isActive ? 'fill-white' : ''} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSongIdToDelete(track.id);
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              title="Excluir da playlist"
                            >
                              <Trash2 size={10} />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Quick status bar */}
            <div className="mt-4 p-2.5 bg-[#FCFAF6] rounded-xl border border-stone-200/50 flex items-center justify-between text-[9px] font-mono text-stone-500">
              <span className="flex items-center gap-1">
                <Music size={11} className="text-rose-500" />
                <span>Total: <strong className="text-stone-700">{playlist.length} faixas</strong></span>
              </span>
              <span>Sintonização Compartilhada Ativa ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
