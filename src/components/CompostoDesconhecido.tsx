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
  Clock,
  MessageCircle,
  FileText,
  Printer,
  Heart,
  Atom,
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
  const [showLaudoModal, setShowLaudoModal] = useState(false);
  const [expandedEssay, setExpandedEssay] = useState<number | null>(1); // Expand first essay by default

  // Proposal declaration text state in Laudo
  const [declarationText, setDeclarationText] = useState<string>(
    'Reação química confirmada: Nossos componentes moleculares são 100% compatíveis. Diante de todas as análises e evidências catalogadas ao longo destes 14 ensaios, só existe uma conclusão lógica: quer namorar comigo e começar nossa história oficial?'
  );

  // Live countdown state to next 18:00 release
  const [nextEssay, setNextEssay] = useState<CompoundEssay | null>(null);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number; isToday: boolean } | null>(null);

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

  // Find next locked essay for countdown
  useEffect(() => {
    const visible = essays.filter((e) => e.unlockDate && e.unlockDate.trim() !== '');
    const upcoming = visible.find((e) => !isTimeUnlocked(e));
    setNextEssay(upcoming || null);
  }, [essays]);

  // Ticking countdown effect
  useEffect(() => {
    if (!nextEssay || !nextEssay.unlockDate) {
      setCountdown(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const target = new Date(`${nextEssay.unlockDate}T${nextEssay.unlockTime || '18:00'}`);
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown(null);
        return;
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;
      const isToday = now.toDateString() === target.toDateString();

      setCountdown({ hours, minutes, seconds, isToday });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextEssay]);

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

  // WhatsApp reminder URL for target number +55 55 9161-4151
  const whatsappReminderUrl = `https://wa.me/555591614151?text=${encodeURIComponent(
    'Aviso do Nós: faltam 10 minutos para liberar a nova amostra das 18:00!'
  )}`;

  // Filter visible essays
  const visibleEssays = essays.filter((e) => e.unlockDate && e.unlockDate.trim() !== '');

  // Progress calculations
  const unlockedCount = visibleEssays.filter((e) => isTimeUnlocked(e)).length;
  const answeredCount = visibleEssays.filter((e) => hasUserHypothesis(e.essayNumber)).length;

  // Ensaio 13 unlock condition for Laudo Oficial PDF button
  const essay13 = visibleEssays.find((e) => e.essayNumber === 13);
  const isEnsaio13Unlocked = essay13 ? isTimeUnlocked(essay13) : false;

  return (
    <div id="composto-desconhecido" className="w-full bg-[#FAF6F0]/95 backdrop-blur-md border border-rose-200/80 rounded-3xl p-5 md:p-8 shadow-xs transition-all duration-300 relative overflow-hidden">
      
      {/* Background laboratory & romantic glow accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-200/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-xs flex items-center justify-center">
              <FlaskConical size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-rose-100/90 text-rose-800 border border-rose-200">
                  Protocolo de Investigação
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-semibold">
                  Amostra #014
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl text-rose-600 font-cursive tracking-wide select-none leading-none mt-0.5">
                Composto Desconhecido
              </h2>
            </div>
          </div>
        </div>

        {/* Controls & Progress stats */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="bg-white/80 border border-rose-200/80 px-3 py-1.5 rounded-xl flex items-center gap-3 text-xs font-mono shadow-2xs">
            <div>
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Liberados:</span>
              <span className="font-extrabold text-rose-700">{unlockedCount}/14</span>
            </div>
            <div className="h-6 w-px bg-rose-200/80" />
            <div>
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Respostas:</span>
              <span className="font-extrabold text-amber-700">{answeredCount}/14</span>
            </div>
          </div>

          {isEnsaio13Unlocked && (
            <button
              onClick={() => setShowLaudoModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-mono font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Gerar Laudo Oficial em PDF"
            >
              <FileText size={14} />
              <span>Laudo Oficial PDF</span>
            </button>
          )}

          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-800 text-xs font-mono font-bold rounded-xl border border-rose-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Ver histórico de hipóteses salvas"
          >
            <History size={14} className="text-rose-600" />
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {/* COUNTDOWN BANNER TO NEXT 18:00 RELEASE */}
      {nextEssay && countdown && (
        <div className="mt-6 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-amber-50 rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden border border-rose-800/40 group">
          {/* Animated Chemical Effervescent Rising Bubbles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute w-3 h-3 bg-rose-400 rounded-full blur-[1px] animate-bounce top-12 left-8 transition-all" />
            <div className="absolute w-2 h-2 bg-amber-300 rounded-full blur-[1px] animate-ping top-4 left-1/4" />
            <div className="absolute w-4 h-4 bg-rose-300 rounded-full blur-[1px] animate-pulse bottom-2 left-1/2" />
            <div className="absolute w-2.5 h-2.5 bg-rose-200 rounded-full blur-[1px] animate-ping bottom-6 right-1/3" />
            <div className="absolute w-3 h-3 bg-amber-200 rounded-full blur-[1px] animate-bounce top-6 right-12" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-ping top-10 right-1/4" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase bg-rose-500/25 text-rose-300 border border-rose-400/40 px-2.5 py-0.5 rounded-full shadow-xs">
                  <Atom size={13} className="animate-spin text-rose-300" />
                  Efervescência Química de Amor em Andamento
                </span>
                <span className="text-xs font-mono font-bold text-amber-200/90 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800">
                  Ensaio #{String(nextEssay.essayNumber).padStart(2, '0')}
                </span>
              </div>
              <h4 className="text-sm md:text-base font-serif font-bold text-white flex items-center gap-2">
                <span>Próxima amostra liberada às 18:00</span>
                <span className="text-rose-300 text-xs font-mono">({nextEssay.unlockDate?.split('-').reverse().join('/')})</span>
              </h4>
              <p className="text-[10px] font-mono text-rose-200/80 italic">
                A reação química de curiosidade e chamego está sob pressão controlada... 🧪✨
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Ticking Clock Display */}
              <div className="bg-stone-950/90 border border-rose-500/40 rounded-2xl px-4 py-2 flex items-center gap-2 text-center font-mono shadow-inner">
                <div>
                  <span className="text-xl md:text-2xl font-black text-rose-300 tracking-tight">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] block text-stone-400 font-bold uppercase">horas</span>
                </div>
                <span className="text-rose-400 font-bold text-xl mb-2 animate-pulse">:</span>
                <div>
                  <span className="text-xl md:text-2xl font-black text-rose-300 tracking-tight">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] block text-stone-400 font-bold uppercase">min</span>
                </div>
                <span className="text-rose-400 font-bold text-xl mb-2 animate-pulse">:</span>
                <div>
                  <span className="text-xl md:text-2xl font-black text-rose-300 animate-pulse tracking-tight">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] block text-stone-400 font-bold uppercase">seg</span>
                </div>
              </div>

              {/* WhatsApp Reminder Button */}
              <a
                href={whatsappReminderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-mono font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                title="Avisar por WhatsApp: Aviso do Nós: faltam 10 minutos para liberar a nova amostra das 18:00!"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Lembrar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY EXACT INTRO TEXT */}
      <div className="mt-6 bg-gradient-to-r from-rose-50/90 via-amber-50/70 to-stone-50/80 border border-rose-200/80 rounded-2xl p-5 shadow-2xs relative">
        <div className="flex items-start gap-3">
          <FileSearch size={22} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-stone-700 text-xs md:text-sm leading-relaxed space-y-2 font-sans">
            <p className="font-bold text-stone-900 font-serif text-base">
              Bem vinda ao Composto Desconhecido.
            </p>
            <p>
              Uma amostra não identificada foi catalogada e está sob investigação. Nos próximos dias, novos ensaios vão ser liberados, um de cada vez, sempre no horário programado. Cada ensaio traz uma pergunta sobre as propriedades da amostra. Responda com o que você acha que é, e uma nova informação sobre o conteúdo de uma caixa vai ser revelada.
            </p>
            <p className="font-medium text-rose-800">
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
                    ? 'border-rose-200 bg-white shadow-2xs'
                    : 'border-stone-200/80 bg-stone-50/60'
                }`}
              >
                {/* Card Header Bar */}
                <div
                  onClick={() => setExpandedEssay(isExpanded ? null : essay.essayNumber)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-rose-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold shadow-2xs ${
                        hasHyp
                          ? 'bg-rose-600 text-white'
                          : timeReached
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
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
                          <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-md font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
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
                        <span>Liberação: {formattedDate} às {essay.unlockTime || '18:00'}</span>
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
                      className="border-t border-rose-100 bg-rose-50/20 p-5 md:p-6 space-y-5"
                    >
                      {/* Enigma Question Box */}
                      {essay.enigma && (
                        <div className="bg-white border border-rose-200/80 p-4 rounded-xl space-y-1.5 shadow-2xs">
                          <span className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-wider block">
                            🧪 Enigma do Ensaio {String(essay.essayNumber).padStart(2, '0')}:
                          </span>
                          <p className="text-xs md:text-sm text-stone-800 font-sans leading-relaxed font-medium">
                            "{essay.enigma}"
                          </p>
                        </div>
                      )}

                      {/* Recorded Hypotheses List if present */}
                      {userHypList.length > 0 && (
                        <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-xl space-y-2">
                          <span className="text-[10px] font-mono font-bold text-rose-900 uppercase tracking-wider block">
                            📋 Hipótese Salva no Laboratório:
                          </span>
                          <div className="space-y-1.5">
                            {userHypList.map((h) => (
                              <div key={h.id} className="text-xs text-stone-700 font-sans bg-white p-2.5 rounded-lg border border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                  <strong className="text-rose-800 font-semibold">{h.author}:</strong>{' '}
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
                              className="flex-1 px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-sans focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                            />
                            <button
                              onClick={() => handleSaveHypothesis(essay.essayNumber)}
                              disabled={submittingEssay === essay.essayNumber || !inputAnswers[essay.essayNumber]?.trim()}
                              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 text-white text-xs font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                            >
                              <Send size={13} />
                              <span>{submittingEssay === essay.essayNumber ? 'Salvando...' : 'Registrar Hipótese'}</span>
                            </button>
                          </div>

                          {savedNoticeEssay === essay.essayNumber && (
                            <p className="text-[11px] font-mono text-rose-700 flex items-center gap-1 font-bold pt-1">
                              <Check size={13} /> Hipótese registrada, amostra liberada abaixo.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-stone-100/90 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
                          <Lock size={18} className="text-stone-400 shrink-0" />
                          <div className="text-xs font-mono text-stone-600 leading-snug">
                            <span className="font-bold text-stone-800 block">Campo de Resposta Indisponível</span>
                            O campo de resposta e a Amostra Liberada estarão disponíveis em <strong>{formattedDate} às {essay.unlockTime || '18:00'}</strong>.
                          </div>
                        </div>
                      )}

                      {/* Amostra Liberada (ONLY VISIBLE WHEN TIME HAS ARRIVED OR ANSWERED) */}
                      {timeReached || hasHyp ? (
                        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border-2 border-rose-300 p-4 rounded-xl space-y-1.5 relative overflow-hidden shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={14} className="text-rose-600" />
                              Amostra Liberada
                            </span>
                            <span className="text-[9px] font-mono text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md">
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

      {/* LAUDO OFICIAL EM PDF MODAL */}
      <AnimatePresence>
        {showLaudoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-stone-300 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl my-auto font-sans"
            >
              {/* Top Controls Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-emerald-700" />
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    Laudo Oficial de Compatibilidade Molecular
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer size={14} />
                    <span>Imprimir / Salvar PDF</span>
                  </button>
                  <button
                    onClick={() => setShowLaudoModal(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Printable Document Body */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
                {/* Official Header */}
                <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
                      DEPARTAMENTO DE ANÁLISES MOLECULARES & AFETIVAS
                    </span>
                    <h1 className="text-2xl font-serif font-black text-stone-900 tracking-tight mt-1">
                      LAUDO DE COMPATIBILIDADE #014
                    </h1>
                  </div>
                  <div className="text-right font-mono text-[10px] text-stone-500">
                    <div><strong>Data do Laudo:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
                    <div><strong>Status:</strong> COMPATIBILIDADE TOTAL (100%)</div>
                  </div>
                </div>

                {/* Result Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-[9px] text-stone-400 uppercase font-bold block">Amostra Analisada</span>
                    <span className="font-extrabold text-stone-800">Composto Desconhecido #014</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[9px] text-emerald-700 uppercase font-bold block">Afinidade Identificada</span>
                    <span className="font-extrabold text-emerald-900">Extrema / Irreversível</span>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-[9px] text-teal-700 uppercase font-bold block">Ensaios Concluídos</span>
                    <span className="font-extrabold text-teal-900">14 de 14 Protocolos</span>
                  </div>
                </div>

                {/* Ensaio Hypotheses & Revelations Catalog */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1">
                    Histórico de Ensaios & Propriedades Identificadas
                  </h4>
                  <div className="space-y-2">
                    {essays.map((e) => {
                      const userHyp = hypotheses.filter((h) => h.essayNumber === e.essayNumber);
                      return (
                        <div key={e.id} className="p-3 bg-stone-50/80 border border-stone-200/80 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between font-mono font-bold text-stone-800">
                            <span>Ensaio {String(e.essayNumber).padStart(2, '0')} - {e.title}</span>
                            <span className="text-stone-400 font-normal">{e.unlockDate?.split('-').reverse().join('/') || 'Em andamento'}</span>
                          </div>
                          {e.enigma && <p className="text-stone-600 text-[11px] italic">"Enigma: {e.enigma}"</p>}
                          {userHyp.length > 0 && (
                            <p className="text-emerald-800 font-medium">
                              <strong>Hipótese Registrada:</strong> "{userHyp[userHyp.length - 1].hypothesis}"
                            </p>
                          )}
                          {e.sampleReleased && (
                            <p className="text-teal-800 text-[11px] font-semibold">
                              <strong>Revelação:</strong> "{e.sampleReleased}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex justify-end shrink-0">
                <button
                  onClick={() => setShowLaudoModal(false)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs rounded-xl transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                            {essay.unlockDate ? essay.unlockDate.split('-').reverse().join('/') : 'A definir'} às {essay.unlockTime || '18:00'}
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
