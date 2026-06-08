/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Pin, BookOpen, Camera, Award, HelpCircle } from 'lucide-react';
import { CalendarEvent } from '../types';
import { formatDateBr } from '../utils/dashboardCalculations';

interface MemoryAlbumProps {
  events: CalendarEvent[];
}

export const MemoryAlbum: React.FC<MemoryAlbumProps> = ({ events }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filter events of type 'Date' or any event that has a custom imageUrl attached
  const photoEvents = events.filter((evt) => evt.imageUrl);

  // Fallback romantic template placeholders if no custom photos are uploaded yet
  // This simulates the scrapbook and encourages the user to upload theirs
  const defaultSeeds = [
    {
      id: 'default-album-1',
      title: 'Nosso Primeiro Encontro de Proveta',
      description: 'O início de reações em cadeia estáveis. Afinidade molecular espontânea!',
      date: '2026-02-14',
      creator: 'Érica',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600', // Romantic hand holding
    },
    {
      id: 'default-album-2',
      title: 'Monografia de Sintese Termorregulada',
      description: 'Superando o frio com muito dengo, calor latente corporal constante.',
      date: '2026-04-12',
      creator: 'Letícia',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600', // Sparkling lights couple outline
    }
  ];

  // Combine real photo events with fallback defaults if list is very short
  const displayedAlbumItems = photoEvents.length > 0 ? photoEvents : defaultSeeds;

  const totalPages = Math.ceil(displayedAlbumItems.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = displayedAlbumItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div
      id="romantic-memory-album"
      className="bg-[#FCFAF6] border border-amber-250/50 rounded-2xl p-5 md:p-8 mt-6 relative overflow-hidden shadow-xs"
    >
      {/* Decorative Curcumin flower background layer */}
      <div className="absolute right-4 top-2 opacity-[0.04] pointer-events-none select-none z-0">
        <svg width="220" height="220" viewBox="0 0 200 200" fill="currentColor" className="text-amber-800">
          <path d="M100 20 C110 50 140 50 140 80 C140 110 110 110 100 140 C90 110 60 110 60 80 C60 50 90 50 100 20 Z" />
          <path d="M100 80 C120 70 140 90 160 100 C130 110 120 130 100 140 C110 120 110 100 100 80 Z" />
          <path d="M100 80 C80 70 60 90 40 100 C70 110 80 130 100 140 C90 120 90 100 100 80 Z" />
          <circle cx="100" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-amber-250/50 relative z-10 gap-2">
        <div>
          <span className="text-[10px] text-rose-500 font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Camera size={12} className="stroke-[2.2]" />
            Nosso Livro de ATAS
          </span>
          <h3 className="text-2xl font-bold font-serif text-stone-900 flex items-center gap-2 mt-1">
            Álbum de Reações Estáveis
          </h3>
          <p className="text-xs text-stone-600 font-bold font-mono mt-0.5 animate-pulse">
            Ainda faltam testes, mas suspeito que exista compatibilidade química.
          </p>
        </div>


      </div>

      {/* Sticky Photo Scrapbook Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-4 relative z-10 justify-items-center">
        {paginatedItems.map((item, index) => {
          // Preset rotations to look casual, handwritten, and custom-positioned
          const rotations = ['rotate-[-2.5deg]', 'rotate-[3deg]', 'rotate-[-1.5deg]', 'rotate-[2deg]', 'rotate-[-3deg]', 'rotate-[1deg]'];
          const rotationClass = rotations[index % rotations.length];

          const isCustom = !item.id.startsWith('default-album');

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-[#FFFFFF] ${rotationClass} p-4 pb-7 border border-stone-250 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] hover:rotate-0 hover:z-20 transition-all duration-300 w-full max-w-[260px] relative group`}
            >
              {/* Scrapbook Cute Washi Tape effect at top */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/70 border-x border-dashed border-amber-300 backdrop-blur-xs rotate-[-6deg] select-none pointer-events-none" />

              {/* Photo Viewport Container */}
              <div className="w-full aspect-square bg-[#FAF8F5] overflow-hidden relative border border-stone-200 shadow-xs">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover filter brightness-[1.01] contrast-[0.98]"
                  referrerPolicy="no-referrer"
                />

                {/* Date sticker inside photo */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white font-mono text-[8.5px] rounded-md tracking-wider font-extrabold">
                  {formatDateBr(item.date)}
                </div>
              </div>

              {/* Custom Cursive Caption Area (Reference to cursive aesthetic) */}
              <div className="mt-4 text-center space-y-1 px-1">
                <h4 className="font-handwritten text-lg font-bold text-rose-600 capitalize tracking-wide leading-tight break-words">
                  {item.title.toLowerCase()}
                </h4>
                
                <p className="text-[11.5px] text-stone-700 leading-relaxed italic break-words py-1 font-bold">
                  "{item.description || 'Pelo menos a temperatura corpórea esteve muito alta de carinho.'}"
                </p>

                {/* Sub-label showing creator/category */}
                <div className="pt-2 border-t border-dashed border-amber-200/50 font-mono text-[8px] uppercase tracking-wide text-stone-500 font-extrabold flex items-center justify-between">
                  <span>Foto por: {item.creator}</span>
                  {isCustom ? (
                    <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                      <Heart size={7} className="fill-rose-500" /> Real
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold">Exemplo</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 pb-2 relative z-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              currentPage === 1
                ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-amber-100/30 text-[#6B5D4D] hover:text-amber-800 border-amber-250/45 hover:border-amber-300 shadow-2xs'
            }`}
          >
            &larr; Anterior
          </button>
          <span className="text-xs font-mono text-stone-550">
            Página <strong className="text-stone-850 font-bold">{currentPage}</strong> de <strong className="text-stone-850 font-bold">{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              currentPage === totalPages
                ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-amber-100/30 text-[#6B5D4D] hover:text-amber-800 border-amber-250/45 hover:border-amber-300 shadow-2xs'
            }`}
          >
            Próxima &rarr;
          </button>
        </div>
      )}

      {/* Bottom Stickers row inspired by Image 3 and 5 (Laboratory Stickers & Love elements) */}
      <div className="mt-10 pt-6 border-t border-amber-250/55 flex flex-wrap justify-center md:justify-between items-center gap-4 text-stone-400 select-none z-10 relative">
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-stone-605">
          <BookOpen size={11} className="text-rose-600" />
          <span>Fórmula de Afinidade: Forte solução pra matar a saudade</span>
        </div>

        {/* Beautiful vector laboratory & romantic fusion elements sticker board */}
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
            <span>Foco = Comprovações fotográficas de dates</span>
          </div>

          {/* Feniletilamina element card (Pe) */}
          <div className="w-9 h-9 bg-pink-100/75 text-pink-850 font-mono text-center flex flex-col items-center justify-center border border-pink-300 rounded shadow-2xs leading-none rotate-3 hover:rotate-0 transition-transform cursor-pointer font-bold animate-pulse">
            <span className="text-[7px] font-bold">11</span>
            <span className="text-xs font-bold leading-none -mt-0.5">Pe</span>
            <span className="text-[5.5px] opacity-75 uppercase">Feniletila.</span>
          </div>

          {/* Carbon element (C) */}
          <div className="w-9 h-9 bg-slate-50/70 text-slate-800 font-mono text-center flex flex-col items-center justify-center border border-slate-200 rounded shadow-2xs leading-none rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7px] font-bold">6</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">C</span>
            <span className="text-[5.5px] opacity-75">Carbono</span>
          </div>

          {/* Nitrogen element (N) */}
          <div className="w-9 h-9 bg-sky-50/70 text-sky-850 font-mono text-center flex flex-col items-center justify-center border border-sky-250 rounded shadow-2xs leading-none rotate-6 hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7.5px] font-bold">7</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">N</span>
            <span className="text-[5px] opacity-85 uppercase font-mono">Nitrogênio</span>
          </div>

          {/* Cute Beaker with eyes sticker */}
          <div className="p-1 px-2.5 bg-[#FAF3E3] text-amber-805 border border-amber-300 rounded-full flex items-center gap-1 hover:skew-x-2 transition-transform text-[9px] font-mono leading-none font-bold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-bounce">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Ph = 8 (Neutro de Reclamações)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
