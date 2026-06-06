/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Beaker, Atom, Heart, Sparkles, BookOpen } from 'lucide-react';
import { CurcuminMolecule } from './CurcuminMolecule';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="about-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="about-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            id="about-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-[#FCFAF6] border border-amber-300 rounded-2xl shadow-xl overflow-hidden z-10 p-6 md:p-8"
          >
            {/* Background molecular pattern ornament */}
            <div className="absolute right-0 top-0 w-64 h-64 opacity-5 pointer-events-none text-amber-600">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Close button */}
            <button
              id="about-modal-close"
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-xl text-stone-500 hover:text-amber-800 hover:bg-amber-100/50 transition-colors"
              title="Fechar"
            >
              <X size={18} className="stroke-[1.8]" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100/50 text-amber-800 rounded-xl">
                <Beaker size={22} className="stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight text-stone-900">
                  NósPorDia
                </h2>
                <p className="text-xs font-mono text-amber-800 font-semibold uppercase">
                  Fórmula de Organização Afetiva &bull; C₂₁H₂₀O₆
                </p>
              </div>
            </div>

            {/* Core Description */}
            <div className="mb-6 p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl">
              <p className="text-sm md:text-[15px] pb-1 leading-relaxed text-stone-900 font-serif">
                <strong>NósPorDia</strong> é um calendário compartilhado estruturado para sincronizar e catalogar compromissos, rotas de viagem e recados de afeto.
              </p>
            </div>

            <div className="space-y-4 text-stone-700 text-xs md:text-sm leading-relaxed">
              <p>
                Inspirado pelas propriedades moleculares, estabilidade isomérica e biodisponibilidade da <strong>Curcumina</strong> (composto dicarbonílico simétrico contendo dois núcleos guaiacol ligados por uma cadeia heptadienona), este diário de bordo foi planejado sob a rigorosa ótica de pesquisa em síntese orgânica e ensaios bioativos de farmacologia.
              </p>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5 font-sans uppercase text-[11.5px] tracking-wider text-amber-850">
                  <Atom size={14} className="text-amber-600 shrink-0 stroke-[1.8]" />
                  Simetria e Sintonização Farmacocinética
                </h4>
                <p>
                  Assim como os anéis fenólicos da curcumina ligam-se em perfeita harmonia estrutural, as idas para <strong>Santa Maria</strong> e os períodos em <strong>Porto Alegre</strong> desenham as pontes da nossa rotina. Com atualizações em tempo real, cada evento atua como um ligante receptor para diminuir a distância física e fixar estados estáveis de convivência.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5 font-sans uppercase text-[11.5px] tracking-wider text-amber-850">
                  <Heart size={14} className="text-rose-500 shrink-0 stroke-[1.8]" />
                  Catalisador de Interação: Quadro de Mensagens
                </h4>
                <p>
                  Pequenos bio-estímulos e lembretes diários são consolidados no quadro rápido. Para assegurar foco terapêutico e leveza, restringimos a ocupação do quadro a exatamente <strong>6 slots individuais ativos</strong>. Ao limpar um nicho, o espaço se renova para novas mensagens.
                </p>
              </div>
            </div>

            {/* Footer with clean styling */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-stone-400 uppercase tracking-widest">
                  <BookOpen size={11} className="stroke-[1.8]" /> Farmacopeia
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-stone-400 uppercase tracking-widest">
                  <Sparkles size={11} className="text-amber-500 stroke-[1.8]" /> Biodisponibilidade
                </span>
              </div>
              <button
                id="close-btn-footer"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold font-mono tracking-widest uppercase text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all"
              >
                FECHAR
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
