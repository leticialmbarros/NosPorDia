/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Send,
  History,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Check,
  Info,
  Trash2,
} from 'lucide-react';
import { CompoundEssay, CompoundHypothesis } from '../types';
import { dataService, DEFAULT_COMPOUND_ESSAYS } from '../services/dataService';

interface CompostoDesconhecidoProps {
  currentProfile: string;
}

export const CompostoDesconhecido: React.FC<CompostoDesconhecidoProps> = ({ currentProfile }) => {
  const [essays, setEssays] = useState<CompoundEssay[]>(DEFAULT_COMPOUND_ESSAYS);
  const [hypotheses, setHypotheses] = useState<CompoundHypothesis[]>([]);
  const [inputAnswers, setInputAnswers] = useState<Record<number, string>>({});
  const [submittingEssay, setSubmittingEssay] = useState<number | null>(null);
  const [savedNoticeEssay, setSavedNoticeEssay] = useState<number | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [expandedEssay, setExpandedEssay] = useState<number | null>(1); // Expand first essay by default

  useEffect(() => {
    const unsubEssays = dataService.subscribeCompoundEssays((loadedEssays) => {
      setEssays(loadedEssays);
    });

    const unsubHypotheses = dataService.subscribeCompoundHypotheses((loadedHyp) => {
      setHypotheses(loadedHyp);
    });

    return () => {
      unsubEssays();
      unsubHypotheses();
    };
  }, []);

  // Helper to check if scheduled date AND 18:00 time has arrived
  const isTimeUnlocked = (essay: CompoundEssay): boolean => {
    if (!essay.unlockDate || essay.unlockDate.trim() === '') return false;
    const now = new Date();
    const unlockDateTime = new Date(`${essay.unlockDate}T${essay.unlockTime || '18:00'}`);
    return now >= unlockDateTime;
  };

  // Helper to check if a user hypothesis was recorded
  const hasUserHypothesis = (essayNumber: number): boolean => {
    return hypotheses.some((h) => h.essayNumber === essayNumber && h.hypothesis.trim().length > 0);
  };

  const handleSaveHypothesis = async (essayNumber: number) => {
    const answerText = inputAnswers[essayNumber]?.trim();
    if (!answerText) return;

    setSubmittingEssay(essayNumber);
    try {
      await dataService.saveCompoundHypothesis(essayNumber, answerText, currentProfile);
      setSavedNoticeEssay(essayNumber);
      setTimeout(() => setSavedNoticeEssay(null), 4000);
    } catch (err) {
      console.error('Erro ao salvar hipótese:', err);
    } finally {
      setSubmittingEssay(null);
    }
  };

  const handleClearAllHypotheses = async () => {
    if (window.confirm('Tem certeza que deseja apagar todas as hipóteses e respostas registradas? Esta ação limpa o histórico.')) {
      await dataService.clearCompoundHypotheses();
      setInputAnswers({});
    }
  };

  // Filter visible essays: Items 13 and 14 only appear when they have a defined date!
  const visibleEssays = essays.filter((e) => e.unlockDate && e.unlockDate.trim() !== '');

  // Progress calculations
  const unlockedCount = visibleEssays.filter((e) => isTimeUnlocked(e)).length;
  const answeredCount = visibleEssays.filter((e) => hasUserHypothesis(e.essayNumber)).length;

  return (
    <div id="composto-desconhecido" className="w-full bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-3xl p-5 md:p-8 shadow-sm transition-all duration-300 relative overflow-hidden">
      
      {/* Background laboratory glow accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs flex items-center justify-center">
              <FlaskConical size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Protocolo de Investigação
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-semibold">
                  Amostra #014
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight mt-0.5">
                Composto Desconhecido
              </h2>
            </div>
          </div>
        </div>

        {/* Controls & Progress stats */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Liberados:</span>
              <span className="font-extrabold text-emerald-700">{unlockedCount}/14</span>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Respostas:</span>
              <span className="font-extrabold text-teal-700">{answeredCount}/14</span>
            </div>
          </div>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-mono font-bold rounded-xl border border-stone-200/80 flex items-center gap-1.5 transition-all"
            title="Ver histórico de hipóteses salvas"
          >
            <History size={14} className="text-emerald-600" />
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {/* MANDATORY EXACT INTRO TEXT */}
      <div className="mt-6 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-stone-50/80 border border-emerald-200/80 rounded-2xl p-5 shadow-2xs relative">
        <div className="flex items-start gap-3">
          <FileSearch size={22} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-stone-700 text-xs md:text-sm leading-relaxed space-y-2 font-sans">
            <p className="font-bold text-stone-900 font-serif text-base">
              Bem vinda ao Composto Desconhecido.
            </p>
            <p>
              Uma amostra não identificada foi catalogada e está sob investigação. Nos próximos dias, novos ensaios vão ser liberados, um de cada vez, sempre no horário programado. Cada ensaio traz uma pergunta sobre as propriedades da amostra. Responda com o que você acha que é, e uma nova informação sobre o conteúdo de uma caixa vai ser revelada.
            </p>
            <p className="font-medium text-emerald-800">
              Não existe resposta errada. Registre sua hipótese e continue a investigação.
            </p>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="mt-8 space-y-4">
        {visibleEssays.length === 0 ? (
          <div className="text-center py-10 text-stone-400 font-mono text-xs border border-dashed border-stone-200 rounded-2xl">
            Nenhum ensaio com data agendada no momento.
          </div>
        ) : (
          visibleEssays.map((essay) => {
            const timeReached = isTimeUnlocked(essay);
            const hasHyp = hasUserHypothesis(essay.essayNumber);
            const isExpanded = expandedEssay === essay.essayNumber;
            const userHypList = hypotheses.filter((h) => h.essayNumber === essay.essayNumber);
            const formattedDate = essay.unlockDate ? essay.unlockDate.split('-').reverse().join('/') : '';

            return (
              <div
                key={essay.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  timeReached
                    ? 'border-emerald-200/90 bg-white shadow-xs'
                    : 'border-stone-200/80 bg-stone-50/70'
                }`}
              >
                {/* Card Header Bar */}
                <div
                  onClick={() => setExpandedEssay(isExpanded ? null : essay.essayNumber)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold shadow-2xs ${
                        hasHyp
                          ? 'bg-emerald-600 text-white'
                          : timeReached
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {String(essay.essayNumber).padStart(2, '0')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold font-serif text-stone-900 tracking-tight">
                          Ensaio {String(essay.essayNumber).padStart(2, '0')} de 14
                        </h3>

                        {hasHyp ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} />
                            Hipótese Registrada
                          </span>
                        ) : timeReached ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-md font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <Unlock size={11} />
                            Aberto para Resposta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-md font-mono font-bold bg-stone-100 text-stone-500 border border-stone-200">
                            <Lock size={11} />
                            Horário Agendado
                          </span>
                        )}
                      </div>

                      <p className="text-[10.5px] font-mono text-stone-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar size={11} className="text-stone-400" />
                        <span>Liberação: {formattedDate} às {essay.unlockTime || '20:00'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-stone-400">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Card Body (Expanded Content) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-stone-100 bg-stone-50/30 p-5 md:p-6 space-y-5"
                    >
                      {/* Enigma Question Box */}
                      {essay.enigma && (
                        <div className="bg-white border border-stone-200/80 p-4 rounded-xl space-y-1.5 shadow-2xs">
                          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                            🧪 Enigma do Ensaio {String(essay.essayNumber).padStart(2, '0')}:
                          </span>
                          <p className="text-xs md:text-sm text-stone-800 font-sans leading-relaxed font-medium">
                            "{essay.enigma}"
                          </p>
                        </div>
                      )}

                      {/* Recorded Hypotheses List if present */}
                      {userHypList.length > 0 && (
                        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2">
                          <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block">
                            📋 Hipótese Salva no Laboratório:
                          </span>
                          <div className="space-y-1.5">
                            {userHypList.map((h) => (
                              <div key={h.id} className="text-xs text-stone-700 font-sans bg-white/90 p-2.5 rounded-lg border border-emerald-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                  <strong className="text-emerald-800 font-semibold">{h.author}:</strong>{' '}
                                  <span>"{h.hypothesis}"</span>
                                </div>
                                <span className="text-[9px] font-mono text-stone-400 shrink-0">
                                  {new Date(h.submittedAt).toLocaleDateString('pt-BR')} às {new Date(h.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Response Input Section (ONLY ACTIVE AND VISIBLE WHEN TIME ARRIVES) */}
                      {timeReached ? (
                        <div className="space-y-2">
                          <label className="text-[10.5px] font-mono font-bold text-stone-600 block uppercase tracking-wide">
                            Sua Hipótese de Resposta:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="Digite sua resposta ou o que você acha que é..."
                              value={inputAnswers[essay.essayNumber] ?? ''}
                              onChange={(e) =>
                                setInputAnswers({ ...inputAnswers, [essay.essayNumber]: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveHypothesis(essay.essayNumber);
                              }}
                              className="flex-1 px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-sans focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <button
                              onClick={() => handleSaveHypothesis(essay.essayNumber)}
                              disabled={submittingEssay === essay.essayNumber || !inputAnswers[essay.essayNumber]?.trim()}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-xs font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                            >
                              <Send size={13} />
                              <span>{submittingEssay === essay.essayNumber ? 'Salvando...' : 'Registrar Hipótese'}</span>
                            </button>
                          </div>

                          {savedNoticeEssay === essay.essayNumber && (
                            <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-bold pt-1">
                              <Check size={13} /> Hipótese registrada, amostra liberada abaixo.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-stone-100/90 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
                          <Lock size={18} className="text-stone-400 shrink-0" />
                          <div className="text-xs font-mono text-stone-600 leading-snug">
                            <span className="font-bold text-stone-800 block">Campo de Resposta Indisponível</span>
                            O campo de resposta e a Amostra Liberada estarão disponíveis em <strong>{formattedDate} às {essay.unlockTime || '20:00'}</strong>.
                          </div>
                        </div>
                      )}

                      {/* Amostra Liberada (ONLY VISIBLE WHEN TIME HAS ARRIVED OR ANSWERED) */}
                      {timeReached || hasHyp ? (
                        <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-400/80 p-4 rounded-xl space-y-1.5 relative overflow-hidden shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={14} className="text-emerald-600" />
                              Amostra Liberada
                            </span>
                            <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              Revelada
                            </span>
                          </div>
                          <p className="text-xs md:text-sm font-sans font-semibold text-stone-800 leading-relaxed pt-1">
                            "{essay.sampleReleased}"
                          </p>
                        </div>
                      ) : (
                        <div className="bg-stone-100/60 border border-stone-200/60 p-3.5 rounded-xl text-center">
                          <span className="text-[11px] font-mono text-stone-400 font-medium">
                            🔒 Amostra Liberada oculta até o horário de liberação.
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* HISTÓRICO COMPLETO MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-emerald-600" />
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    Histórico de Hipóteses do Laboratório
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {hypotheses.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs font-mono">
                    Nenhuma hipótese registrada ainda.
                  </div>
                ) : (
                  essays.map((essay) => {
                    const essayHyp = hypotheses.filter((h) => h.essayNumber === essay.essayNumber);
                    if (essayHyp.length === 0) return null;

                    return (
                      <div key={essay.id} className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2">
                        <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                          <span className="text-xs font-bold font-mono text-emerald-800 uppercase">
                            Ensaio {String(essay.essayNumber).padStart(2, '0')} de 14
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {essay.unlockDate ? essay.unlockDate.split('-').reverse().join('/') : 'A definir'} às {essay.unlockTime || '20:00'}
                          </span>
                        </div>
                        {essay.enigma && <p className="text-xs text-stone-600 italic">"{essay.enigma}"</p>}
                        <div className="space-y-1.5 pt-1">
                          {essayHyp.map((h) => (
                            <div key={h.id} className="bg-white p-2.5 rounded-xl border border-stone-200 text-xs flex justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-emerald-700">{h.author}:</span>{" "}
                                <span className="text-stone-800">"{h.hypothesis}"</span>
                              </div>
                              <span className="text-[9px] font-mono text-stone-400 shrink-0">
                                {new Date(h.submittedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                {hypotheses.length > 0 ? (
                  <button
                    onClick={handleClearAllHypotheses}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Limpar Todas as Respostas</span>
                  </button>
                ) : <div />}
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs rounded-xl transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
