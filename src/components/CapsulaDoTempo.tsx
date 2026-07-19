/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Unlock, 
  Send, 
  Calendar, 
  Activity, 
  Heart, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Eye
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { SecretLetter } from '../types';

interface CapsulaDoTempoProps {
  currentProfile: string;
}

export const CapsulaDoTempo: React.FC<CapsulaDoTempoProps> = ({ currentProfile }) => {
  const [letters, setLetters] = useState<SecretLetter[]>([]);
  const [pulseCount, setPulseCount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockType, setUnlockType] = useState<'date' | 'pulses'>('date');
  const [unlockDate, setUnlockDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [unlockPulses, setUnlockPulses] = useState(10);

  // Read Modal state
  const [readingLetter, setReadingLetter] = useState<SecretLetter | null>(null);

  useEffect(() => {
    // Subscribe to letters list
    const unsubLetters = dataService.subscribeLetters((data) => {
      setLetters(data);
    });

    // Subscribe to global pulse counter
    const unsubStats = dataService.subscribePulseStats((stats) => {
      setPulseCount(stats.count);
    });

    return () => {
      unsubLetters();
      unsubStats();
    };
  }, []);

  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const recipient = currentProfile === 'Érica' ? 'Letícia' : 'Érica';
    const unlockValue = unlockType === 'date' ? unlockDate : String(unlockPulses);

    try {
      await dataService.addLetter(
        title.trim(),
        content.trim(),
        currentProfile,
        recipient,
        unlockType,
        unlockValue,
        pulseCount
      );

      // Reset form
      setTitle('');
      setContent('');
      setUnlockType('date');
      setIsAdding(false);
    } catch (err) {
      console.error('Erro ao adicionar carta:', err);
    }
  };

  const handleDeleteLetter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening
    if (confirm('Deseja excluir esta carta permanentemente?')) {
      try {
        await dataService.deleteLetter(id);
      } catch (err) {
        console.error('Erro ao excluir carta:', err);
      }
    }
  };

  const handleOpenLetter = async (letter: SecretLetter) => {
    if (!isUnlocked(letter)) return;

    setReadingLetter(letter);

    // If it hasn't been opened yet, mark it as opened in the database
    if (!letter.isOpened) {
      try {
        await dataService.updateLetter(letter.id, { isOpened: true });
      } catch (err) {
        console.error('Erro ao atualizar estado de abertura da carta:', err);
      }
    }
  };

  // Helper to determine if a letter is unlocked
  const isUnlocked = (letter: SecretLetter): boolean => {
    if (letter.unlockType === 'date') {
      const todayStr = new Date().toISOString().split('T')[0];
      return todayStr >= letter.unlockValue;
    } else {
      const targetCount = (letter.createdPulseCount || 0) + Number(letter.unlockValue);
      return pulseCount >= targetCount;
    }
  };

  // Get unlock description text
  const getUnlockDetails = (letter: SecretLetter) => {
    if (letter.unlockType === 'date') {
      const dateBr = letter.unlockValue.split('-').reverse().join('/');
      return {
        label: `Apenas em ${dateBr}`,
        icon: <Calendar size={12} />,
        unlocked: isUnlocked(letter)
      };
    } else {
      const targetCount = (letter.createdPulseCount || 0) + Number(letter.unlockValue);
      const remaining = Math.max(0, targetCount - pulseCount);
      return {
        label: remaining > 0 
          ? `Faltam ${remaining} pulsos de Ocitocina (Progresso: ${pulseCount}/${targetCount})` 
          : `Desbloqueado! (${pulseCount}/${targetCount} pulsos)`,
        icon: <Activity size={12} />,
        unlocked: isUnlocked(letter)
      };
    }
  };

  return (
    <div id="time-capsule-panel" className="bg-white border border-amber-250/35 rounded-3xl p-6 md:p-8 shadow-xs relative mt-4 text-stone-850">
      
      {/* Decorative top header details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-rose-50 border border-rose-100 rounded-lg">
              <Mail className="text-rose-500 animate-pulse" size={16} />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-rose-600">
              Cápsula do Tempo & Cartinhas
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl text-stone-900 font-serif font-bold tracking-tight">
            Baú de Cartas Secretas
          </h2>
          <p className="text-[10.5px] text-stone-500 font-mono leading-relaxed max-w-xl">
            Escreva cartinhas de amor confidenciais para a Letícia ou Érica, seladas no tempo. Defina datas de aniversário ou metas de chamego (pulsos de Ocitocina) para revelar os segredos!
          </p>
        </div>

        {/* Global pulse status indicator */}
        <div className="bg-[#FFFDF9] border border-amber-200/55 rounded-2xl px-4 py-3 shadow-3xs flex items-center gap-3 self-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
            <Heart size={20} className="fill-white animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-stone-400 block leading-none">
              Ocitocímetro Acumulado
            </span>
            <span className="text-lg font-mono font-black text-rose-600 leading-none mt-1 block">
              {pulseCount} <span className="text-xs font-bold text-stone-500">pulsos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="mb-6">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold text-[10px] tracking-wide uppercase rounded-xl shadow-2xs hover:scale-[1.01] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Send size={13} className={isAdding ? 'rotate-45 transition-transform' : 'transition-transform'} />
          <span>{isAdding ? 'Ver Minhas Cartas' : 'Escrever Nova Cartinha ✍️'}</span>
        </button>
      </div>

      {/* Creation form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleCreateLetter} className="bg-[#FAF8F5]/80 border border-amber-250/45 rounded-2xl p-5 md:p-6 space-y-4 max-w-2xl">
              <h3 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500 animate-pulse" /> Selar Nova Cartinha de Amor
              </h3>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono uppercase text-slate-500 block">
                  Título ou Embalagem da Carta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Para abrir quando estiver com saudade..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-rose-400 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono uppercase text-slate-500 block">
                  O conteúdo íntimo da sua carta *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva seus sentimentos com carinho..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-rose-400 font-medium leading-relaxed resize-y"
                />
              </div>

              {/* Unlock Condition configuration */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[9px] font-bold font-mono uppercase text-slate-500 block">
                  Condição de Desbloqueio (Selagem)
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setUnlockType('date')}
                    className={`px-3 py-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                      unlockType === 'date'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    <Calendar size={13} />
                    Liberar por Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnlockType('pulses')}
                    className={`px-3 py-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                      unlockType === 'pulses'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    <Activity size={13} />
                    Metas de Ocitocina (+ Pulsos)
                  </button>
                </div>

                {unlockType === 'date' ? (
                  <div className="space-y-1 bg-white border border-stone-200/50 p-4 rounded-xl max-w-sm">
                    <label className="text-[8.5px] font-bold font-mono text-stone-500 block uppercase">
                      Escolha a Data Futura de Abertura:
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-rose-400"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 bg-white border border-stone-200/50 p-4 rounded-xl max-w-sm">
                    <label className="text-[8.5px] font-bold font-mono text-stone-500 block uppercase">
                      Número Adicional de Pulsos Requeridos:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="2"
                        max="50"
                        step="1"
                        value={unlockPulses}
                        onChange={(e) => setUnlockPulses(Number(e.target.value))}
                        className="flex-1 accent-rose-500 h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100/50 w-12 text-center">
                        +{unlockPulses}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-medium text-stone-400 block leading-normal">
                      A carta será selada e só abrirá quando acumularem mais {unlockPulses} novos pulsos de Ocitocina (Meta acumulada: {pulseCount + unlockPulses} pulsos).
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200/50">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono text-[9px] font-bold rounded-lg uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-bold rounded-lg uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Lock size={11} />
                  <span>Selar & Enviar à Cápsula</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letters listing */}
      {letters.length === 0 ? (
        <div className="bg-stone-50 border border-dashed border-stone-200 p-8 rounded-2xl text-center">
          <p className="text-xs text-stone-500 font-bold font-mono">Cápsula vazia no momento.</p>
          <p className="text-[10px] text-stone-400 font-mono mt-1 font-semibold uppercase">Envie a primeira cartinha para começar a guardar momentos incríveis!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((item) => {
            const unlocked = isUnlocked(item);
            const { label: unlockLabel, icon: unlockIcon } = getUnlockDetails(item);
            const sentByMe = item.sender === currentProfile;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => unlocked && handleOpenLetter(item)}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 shadow-3xs transition-all relative overflow-hidden group select-none ${
                  unlocked 
                    ? 'bg-white border-rose-100 hover:border-rose-200 hover:shadow-2xs cursor-pointer' 
                    : 'bg-stone-50 border-stone-200 opacity-90'
                }`}
              >
                {/* Visual envelope flap decor */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-extrabold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200/50">
                      De: {item.sender} &rarr; {item.recipient}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {unlocked ? (
                        item.isOpened ? (
                          <span className="text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Eye size={10} /> Aberta
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded animate-pulse">
                            Não lida
                          </span>
                        )
                      ) : null}

                      <button
                        onClick={(e) => handleDeleteLetter(item.id, e)}
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Deletar cartinha"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-serif font-bold text-stone-900 leading-tight group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h4>
                </div>

                {/* Unlock criteria or content teaser */}
                <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
                  <div className={`text-[9.5px] font-mono font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${
                    unlocked 
                      ? 'bg-emerald-50/50 text-emerald-800 border-emerald-100/50' 
                      : 'bg-amber-50/50 text-amber-800 border-amber-100/50'
                  }`}>
                    {unlocked ? <Unlock size={11} className="text-emerald-600 animate-pulse" /> : <Lock size={11} className="text-amber-600 animate-pulse" />}
                    <span className="truncate flex-1 font-semibold">{unlockLabel}</span>
                  </div>

                  {!unlocked && (
                    <span className="text-[8px] font-mono font-medium text-stone-400 uppercase tracking-tight block">
                      🔒 Conteúdo selado até cumprir os requisitos
                    </span>
                  )}
                  {unlocked && (
                    <span className="text-[8px] font-mono font-extrabold text-rose-500 uppercase tracking-wide flex items-center gap-1 animate-pulse">
                      Clique para abrir e ler a carta 💌
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      <AnimatePresence>
        {readingLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReadingLetter(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF9] border-2 border-amber-200 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[350px]"
            >
              {/* Visual red hearts watermarks */}
              <div className="absolute right-[-20px] bottom-[-20px] text-rose-500 opacity-[0.03] pointer-events-none select-none">
                <Heart size={200} className="fill-current animate-pulse" />
              </div>

              <div>
                {/* Letter Header */}
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 mb-4 text-[10px] font-mono font-extrabold text-stone-500 uppercase">
                  <span>De: <strong className="text-rose-600">{readingLetter.sender}</strong></span>
                  <span>Para: <strong className="text-rose-600">{readingLetter.recipient}</strong></span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-serif font-black text-stone-900 mb-3 tracking-tight">
                  {readingLetter.title}
                </h3>

                {/* Hand-written styled content */}
                <div className="text-sm md:text-base text-stone-800 leading-relaxed font-serif italic py-2 whitespace-pre-wrap pl-3 border-l-2 border-rose-300">
                  {readingLetter.content}
                </div>
              </div>

              {/* Signatures & Footer info */}
              <div className="mt-8 border-t border-stone-200/50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono text-stone-400">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Escrita em: {new Date(readingLetter.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                  onClick={() => setReadingLetter(null)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-mono font-extrabold text-[10px] uppercase rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 size={12} />
                  <span>Fechar Leitura</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
