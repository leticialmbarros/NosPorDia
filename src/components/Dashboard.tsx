/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Bus, MapPin, CalendarDays, Heart, Sparkles, BookOpen, FlaskConical } from 'lucide-react';
import { CalendarEvent, CATEGORY_COLORS, EventCategory } from '../types';
import { calculateDashboardStats, formatDateBr, formatShortDateBr } from '../utils/dashboardCalculations';

interface DashboardProps {
  events: CalendarEvent[];
  todayStr: string;
  viewedYear: number;
  viewedMonth: number; // 0-indexed
  viewedMonthName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  events,
  todayStr,
  viewedYear,
  viewedMonth,
  viewedMonthName,
}) => {
  const stats = calculateDashboardStats(events, todayStr, viewedYear, viewedMonth);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', sharpness: 200 } },
  };

  return (
    <div id="dashboard-sector-panel" className="bg-[#FCFAF6] border border-amber-250/50 rounded-2xl p-5 md:p-6 shadow-xs relative text-stone-800">
      {/* Title block matching standard section format */}
      <div className="mb-5 border-b border-stone-200/60 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg">
            <Sparkles className="text-rose-500 animate-pulse" size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-rose-600">
            Visão Geral
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-rose-600 font-cursive tracking-wide select-none leading-none">
          Painel de Reações
        </h2>
        <p className="text-[10.5px] text-stone-550 font-mono leading-relaxed mt-1">
          Análise de Equilíbrio Químico, Saturação Afetiva & Estados Estáveis de Convivência ❤️
        </p>
      </div>

      <motion.div
        id="dashboard-grid-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-stone-800 mb-6"
      >
        <motion.div
          id="kpi-santa-maria"
          variants={cardVariants}
          className="relative overflow-hidden bg-white/95 border border-emerald-400/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-102 transition-all hover:duration-200 duration-350 group flex flex-col justify-between min-h-[145px]"
        >
          {/* Glass Beaker Rim & Lip */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-200/10 via-emerald-300/30 to-emerald-200/10 border-b border-emerald-300/20 pointer-events-none" />
          <div className="absolute top-0 left-4 w-4 h-1.5 bg-emerald-200/20 rounded-b-md pointer-events-none" /> {/* Spout/Lip */}
          
          {/* Beaker Measuring Graduation Scale */}
          <div className="absolute left-2.5 top-6 bottom-6 flex flex-col justify-between pointer-events-none select-none text-[6.5px] font-mono text-emerald-600/30 border-l border-emerald-200/40 pl-1 z-10">
            <span>— 100ml</span>
            <span>— 75ml</span>
            <span>— 50ml</span>
            <span>— 25ml</span>
          </div>

          {/* Liquid backdrop rising from bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-emerald-500/6 via-emerald-400/2 to-transparent pointer-events-none border-t border-emerald-300/10" />

          {/* Sparkly / Bubbling active effects */}
          <div className="absolute right-4 bottom-3 flex flex-col gap-2 pointer-events-none z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/30 animate-ping" />
            <span className="w-1 h-1 rounded-full bg-emerald-400/40 animate-pulse" />
          </div>

          <div className="absolute top-2 right-2 w-10 h-10 bg-emerald-500/5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none z-10">
            <Bus size={14} className="text-emerald-500 stroke-[1.8]" />
          </div>

          <div className="z-10 pl-6">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              CASA DA MÃE
            </span>
            {stats.nextSantaMaria.date ? (
              <div>
                <h3 className="text-[11px] font-bold text-stone-800 truncate pr-6 mb-0.5 font-mono uppercase tracking-tight">
                  {stats.nextSantaMaria.title}
                </h3>
                <p className="text-[23px] font-bold text-emerald-800 font-serif tracking-tight leading-none my-1">
                  {formatShortDateBr(stats.nextSantaMaria.date)}
                </p>
                <p className="text-[9.5px] text-stone-605 font-mono mt-1">
                  {stats.nextSantaMaria.daysLeft === 0 ? (
                    <span className="text-orange-600 font-bold uppercase">Viagem hoje! 🏠</span>
                  ) : stats.nextSantaMaria.daysLeft === 1 ? (
                    <span className="text-stone-705 font-medium">Viagem amanhã!</span>
                  ) : (
                    <span className="font-medium text-stone-705">Faltam <strong className="text-stone-900 font-bold">{stats.nextSantaMaria.daysLeft}</strong> dias</span>
                  )}
                </p>
              </div>
            ) : (
              <div className="min-h-[56px] flex flex-col justify-center">
                <p className="text-xs text-stone-400 italic font-serif">Nenhuma viagem</p>
                <p className="text-[9.5px] text-stone-400 font-mono mt-1">Planeje o próximo retorno</p>
              </div>
            )}
          </div>

          {/* Diagonal Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </motion.div>

        {/* CARD 2: Próximo Encontro - Style: Erlenmeyer Flask (Erlenmeyer) */}
        <motion.div
          id="kpi-next-date"
          variants={cardVariants}
          className="relative overflow-hidden bg-white/95 border border-rose-400/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-102 transition-all hover:duration-200 duration-350 group flex flex-col justify-between min-h-[145px]"
        >
          {/* Glass cork / cap stopper effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-amber-800/10 rounded-b-sm border-x border-amber-800/5 pointer-events-none z-15" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-rose-300/20 rounded-full pointer-events-none" />

          {/* Erlenmeyer Measuring Scale */}
          <div className="absolute right-2.5 top-6 bottom-6 flex flex-col justify-between pointer-events-none select-none text-[6.5px] font-mono text-rose-600/30 border-r border-rose-200/40 pr-1 z-10 text-right">
            <span>80ml —</span>
            <span>60ml —</span>
            <span>40ml —</span>
            <span>20ml —</span>
          </div>

          {/* Liquid backdrop rising from bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-rose-500/6 via-rose-400/2 to-transparent pointer-events-none border-t border-rose-300/10" />

          {/* Sparkly bubbling animation */}
          <div className="absolute left-4 bottom-3 flex flex-col gap-1.5 pointer-events-none z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400/30 animate-ping" />
            <span className="w-1 h-1 rounded-full bg-rose-300/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>

          <div className="absolute top-2 right-2 w-10 h-10 bg-rose-500/5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none z-10">
            <Heart size={14} className="text-rose-500 stroke-[1.8]" />
          </div>

          <div className="z-10 pr-6">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              PRÓXIMO ENCONTRO
            </span>
            {stats.nextDateExploracao ? (
              <div>
                <h3 className="text-[11px] font-bold text-stone-800 truncate pr-6 mb-0.5 font-mono uppercase tracking-tight">
                  {stats.nextDateExploracao.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[21px] font-bold text-rose-800 font-serif tracking-tight leading-none">
                    {formatDateBr(stats.nextDateExploracao.date!)}
                  </p>
                  <span
                    className={`text-[7.5px] px-1 py-0.2 rounded border tracking-wider font-mono uppercase font-bold ${
                      CATEGORY_COLORS['Dates de Exploração']?.bg || 'bg-indigo-100/90'
                    } ${CATEGORY_COLORS['Dates de Exploração']?.text || 'text-indigo-900'} ${
                      CATEGORY_COLORS['Dates de Exploração']?.border || 'border-indigo-400'
                    }`}
                  >
                    Exploração
                  </span>
                </div>
                <p className="text-[9.5px] text-stone-605 font-mono mt-1">
                  {stats.nextDateExploracao.daysLeft === 0 ? (
                    <span className="text-rose-800 font-bold uppercase">É hoje! ✨</span>
                  ) : stats.nextDateExploracao.daysLeft === 1 ? (
                    <span className="text-stone-705 font-medium">Amanhã!</span>
                  ) : (
                    <span className="text-stone-705 font-medium">Ocorrerá em <strong className="text-stone-900 font-bold">{stats.nextDateExploracao.daysLeft}</strong> dias</span>
                  )}
                </p>
              </div>
            ) : (
              <div className="min-h-[56px] flex flex-col justify-center">
                <p className="text-xs text-stone-400 italic font-serif">Sem dates futuros</p>
                <p className="text-[9.5px] text-stone-400 font-mono mt-1">Sintonização pendente</p>
              </div>
            )}
          </div>

          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </motion.div>



        {/* CARD 4: Eventos no Mês - Style: Test Tube structure (Tubo de Ensaio) with very rounded bottom */}
        <motion.div
          id="kpi-month-events-count"
          variants={cardVariants}
          className="relative overflow-hidden bg-white/95 border border-amber-400/15 rounded-t-2xl rounded-b-[42px] p-5 shadow-sm hover:shadow-md hover:scale-102 transition-all hover:duration-200 duration-350 group flex flex-col justify-between min-h-[145px]"
        >
          {/* Test Tube Rim collar */}
          <div className="absolute top-0 inset-x-4 h-1.5 bg-gradient-to-r from-amber-200/20 to-amber-300/30 rounded-b-md pointer-events-none" />

          {/* Graduation markings vertically centered right */}
          <div className="absolute right-3.5 top-6 bottom-12 flex flex-col justify-between pointer-events-none select-none text-[6.5px] font-mono text-amber-600/30 border-r border-amber-200/40 pr-1 z-10 text-right">
            <span>10ml —</span>
            <span>8.0ml —</span>
            <span>5.0ml —</span>
            <span>2.0ml —</span>
          </div>

          {/* Liquid backdrop rising from very rounded bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-amber-500/6 via-amber-400/2 to-transparent pointer-events-none border-b-[40px] border-amber-300/5 rounded-b-[42px]" />

          {/* Slow rising bubbles */}
          <div className="absolute left-5 bottom-8 flex flex-col gap-2 pointer-events-none z-10">
            <span className="w-1 h-1 rounded-full bg-amber-400/30 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-350/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="absolute top-2 right-2 w-10 h-10 bg-amber-500/5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none z-10">
            <Sparkles size={14} className="text-amber-600 stroke-[1.8]" />
          </div>

          <div className="z-10 pr-6">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5 mb-1.5">
              <BookOpen size={9} className="text-amber-600 stroke-[1.8]" />
              SINTONIA NO MÊS
            </span>
            <div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-[34px] font-extrabold text-amber-600 tracking-tight font-serif leading-none">
                  {stats.monthEventsCount}
                </span>
                <span className="text-xs font-semibold text-stone-605 font-mono">
                  vezes juntas
                </span>
              </div>
              <p className="text-[9.5px] text-stone-605 font-mono mt-1 leading-tight font-medium uppercase tracking-tight text-amber-800 font-bold">
                {viewedMonthName}
              </p>
            </div>
          </div>

          {/* Curved glass reflection edge */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </motion.div>

        {/* CARD 5: Dias tentando te entender - Style: Reagent Vial Flask (Frasco de Reagente com Rolha) */}
        <motion.div
          id="kpi-trial-period"
          variants={cardVariants}
          className="relative overflow-hidden bg-white/95 border border-indigo-400/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-102 transition-all hover:duration-200 duration-350 group flex flex-col justify-between min-h-[145px]"
        >
          {/* Glass Stopper/Cork at top neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-amber-800/10 rounded-b border-x border-amber-900/5 pointer-events-none z-15 shadow-inner" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-300/20 rounded-full pointer-events-none" />

          {/* Graduation scale column */}
          <div className="absolute left-2.5 top-6 bottom-6 flex flex-col justify-between pointer-events-none select-none text-[6.5px] font-mono text-indigo-600/30 border-l border-indigo-200/40 pl-1 z-10">
            <span>— Vol Max</span>
            <span>— 100%</span>
            <span>— 75%</span>
            <span>— 50%</span>
            <span>— Min</span>
          </div>

          {/* Liquid backdrop rising from bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-indigo-500/6 via-indigo-400/2 to-transparent pointer-events-none border-t border-indigo-300/10" />

          {/* Rising bubbles representing active evaluation */}
          <div className="absolute right-4 bottom-3 flex flex-col gap-1.5 pointer-events-none z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/30 animate-ping" />
            <span className="w-1 h-1 rounded-full bg-indigo-300/40 animate-pulse" />
          </div>

          <div className="absolute top-2 right-2 w-10 h-10 bg-indigo-500/5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none z-10">
            <FlaskConical size={14} className="text-indigo-600 stroke-[1.8]" />
          </div>

          <div className="z-10 pl-5">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-550 font-mono flex items-center gap-1.5 mb-1.5 animate-pulse">
              <FlaskConical size={9} className="text-indigo-600" />
              DIAS TENTANDO TE ENTENDER
            </span>
            <div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-[34px] font-extrabold text-indigo-600 tracking-tight font-serif leading-none">
                  {stats.trialPeriod.daysElapsed}
                </span>
                <span className="text-xs font-semibold text-stone-605 font-mono">
                  dias
                </span>
              </div>
              <p className="text-[9px] text-stone-605 font-mono mt-1 leading-snug font-medium italic pr-2">
                {stats.trialPeriod.status}
              </p>
            </div>
          </div>

          {/* Vial reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Bottom Stickers row for the metrics section, with Dopamina Periodic Elements */}
      <div className="mt-8 pt-6 border-t border-amber-250/55 flex flex-wrap justify-center md:justify-between items-center gap-4 text-stone-400 select-none z-10 relative">
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-stone-605">
          <BookOpen size={11} className="text-rose-600" />
          <span>Fórmula de Afinidade: Solução supersaturada de carinho (agite com abraços antes de usar!)</span>
        </div>

        {/* Elegant vector laboratory & romantic fusion elements sticker board - Dopamina Theme */}
        <div className="flex items-center gap-4 pb-2">
          {/* Microscope sticker with heart */}
          <div className="px-2 py-1 bg-amber-50/65 rounded-lg flex items-center gap-1.5 border border-amber-200/55 text-[9.5px] text-stone-650 font-mono font-bold shadow-2xs hover:scale-105 transition-transform">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-600">
              <path d="M6 18h8" />
              <path d="M3 22h18" />
              <path d="M14 22a7 7 0 1 0-7-7" />
              <path d="M9 14h2" />
              <path d="M9 12a3 3 0 0 1 6 0v5" />
            </svg>
            <span>Foco = mais de nós duas</span>
          </div>

          {/* Dopamina element card (Dp) */}
          <div className="w-9 h-9 bg-rose-100/60 text-rose-800 font-mono text-center flex flex-col items-center justify-center border border-rose-300 rounded shadow-2xs leading-none rotate-3 hover:rotate-0 transition-transform cursor-pointer font-bold animate-pulse">
            <span className="text-[7px] font-bold">10</span>
            <span className="text-xs font-bold leading-none -mt-0.5">Dp</span>
            <span className="text-[5px] opacity-75 uppercase">Dopamina</span>
          </div>

          {/* Carbon element (C) */}
          <div className="w-9 h-9 bg-slate-50/75 text-slate-800 font-mono text-center flex flex-col items-center justify-center border border-slate-200 rounded shadow-2xs leading-none rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7px] font-bold">6</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">C</span>
            <span className="text-[5.5px] opacity-75">Carbono</span>
          </div>

          {/* Oxygen element (O) */}
          <div className="w-9 h-9 bg-teal-50/70 text-teal-800 font-mono text-center flex flex-col items-center justify-center border border-teal-200 rounded shadow-2xs leading-none rotate-6 hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7.5px] font-bold">8</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">O</span>
            <span className="text-[5.5px] opacity-85 uppercase">Oxigênio</span>
          </div>

          {/* Cute Beaker sticker */}
          <div className="p-1 px-2.5 bg-[#FAF3E3] text-amber-805 border border-amber-300 rounded-full flex items-center gap-1 hover:skew-x-2 transition-transform text-[9px] font-mono leading-none font-bold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-bounce">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Ph = 7 (Neutro de Brigas)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
