/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Camera, 
  Play, 
  Film, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Compass
} from 'lucide-react';
import { CalendarEvent } from '../types';
import { formatDateBr } from '../utils/dashboardCalculations';

interface MemoryAlbumProps {
  events: CalendarEvent[];
}

interface AlbumItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  date: string;
  creator: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  imageIndex?: number; // 1, 2 or 3
}

export const MemoryAlbum: React.FC<MemoryAlbumProps> = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 9;

  // Flatten events into separate photos/videos for a real "photo dump"
  const albumItems: AlbumItem[] = [];

  events.forEach((evt) => {
    if (evt.imageUrl) {
      albumItems.push({
        id: `${evt.id}-img1`,
        eventId: evt.id,
        title: evt.title,
        description: evt.description || '',
        date: evt.date,
        creator: evt.creator,
        mediaUrl: evt.imageUrl,
        mediaType: 'image',
        imageIndex: 1,
      });
    }
    if (evt.imageUrl2) {
      albumItems.push({
        id: `${evt.id}-img2`,
        eventId: evt.id,
        title: `${evt.title} (Dump #2)`,
        description: evt.description || '',
        date: evt.date,
        creator: evt.creator,
        mediaUrl: evt.imageUrl2,
        mediaType: 'image',
        imageIndex: 2,
      });
    }
    if (evt.imageUrl3) {
      albumItems.push({
        id: `${evt.id}-img3`,
        eventId: evt.id,
        title: `${evt.title} (Dump #3)`,
        description: evt.description || '',
        date: evt.date,
        creator: evt.creator,
        mediaUrl: evt.imageUrl3,
        mediaType: 'image',
        imageIndex: 3,
      });
    }
    if (evt.videoUrl) {
      albumItems.push({
        id: `${evt.id}-vid`,
        eventId: evt.id,
        title: `${evt.title} (Vídeo)`,
        description: evt.description || '',
        date: evt.date,
        creator: evt.creator,
        mediaUrl: evt.videoUrl,
        mediaType: 'video',
      });
    }
  });

  // Romantics default placeholders if list is empty
  const defaultSeeds: AlbumItem[] = [
    {
      id: 'default-album-1',
      eventId: 'default-1',
      title: 'Nosso Primeiro Encontro de Proveta',
      description: 'O início de reações em cadeia estáveis. Afinidade molecular espontânea!',
      date: '2026-02-14',
      creator: 'Érica',
      mediaUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
      mediaType: 'image',
    },
    {
      id: 'default-album-2',
      eventId: 'default-2',
      title: 'Monografia de Sintese Termorregulada',
      description: 'Superando o frio com muito dengo, calor latente corporal constante.',
      date: '2026-04-12',
      creator: 'Letícia',
      mediaUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600',
      mediaType: 'image',
    }
  ];

  const displayedAlbumItems = albumItems.length > 0 ? albumItems : defaultSeeds;
  const totalPages = Math.ceil(displayedAlbumItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = displayedAlbumItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers for Lightbox Navigation
  const handlePrevItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedAlbumItems.length - 1));
    }
  };

  const handleNextItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < displayedAlbumItems.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') handlePrevItem();
        if (e.key === 'ArrowRight') handleNextItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div
      id="romantic-memory-album"
      className="bg-[#FCFAF6] border border-amber-250/50 rounded-2xl p-5 md:p-8 mt-6 relative overflow-hidden shadow-xs"
    >
      {/* Decorative background layer */}
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
            Nosso Álbum de Recordações
          </span>
          <h3 className="text-3xl sm:text-4xl text-rose-600 font-cursive tracking-wide select-none flex items-center gap-2 mt-1 leading-none">
            Mural de Afetos Estáveis 
          </h3>
          <p className="text-xs text-stone-605 font-bold font-mono mt-0.5">
            Colecionando dump de fotos e vídeos dos nossos dias especiais juntas.
          </p>
        </div>
      </div>

      {/* Grid Scrapbook Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-4 relative z-10 justify-items-center">
        {paginatedItems.map((item, index) => {
          // Calculate overall index in displayedAlbumItems for lightbox trigger
          const overallIndex = startIndex + index;

          // Preset random look rotations
          const rotations = ['rotate-[-2deg]', 'rotate-[2.5deg]', 'rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-3deg]', 'rotate-[1.2deg]'];
          const rotationClass = rotations[index % rotations.length];
          const isCustom = !item.id.startsWith('default-album');

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setLightboxIndex(overallIndex)}
              className={`bg-[#FFFFFF] ${rotationClass} p-4 pb-6 border border-stone-250 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] hover:rotate-0 hover:z-20 transition-all duration-300 w-full max-w-[260px] relative group cursor-pointer`}
            >
              {/* Scrapbook Tape effect at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-100/60 border-x border-dashed border-amber-300 rotate-[-5deg] select-none pointer-events-none" />

              {/* Photo Viewport */}
              <div className="w-full aspect-square bg-[#FAF8F5] overflow-hidden relative border border-stone-200/80 shadow-3xs">
                {item.mediaType === 'video' ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover opacity-80"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-stone-900/80 border border-white flex items-center justify-center text-white shadow-md">
                        <Play size={16} className="fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-900/80 text-white font-mono text-[7px] font-bold rounded flex items-center gap-1 uppercase">
                      <Film size={8} /> Vídeo
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Date tag */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white font-mono text-[8px] rounded-md tracking-wider font-extrabold">
                  {formatDateBr(item.date)}
                </div>
              </div>

              {/* Caption Area (Responsive height & scrolling support to prevent overflow) */}
              <div className="mt-4 text-center space-y-1.5 px-1 flex flex-col h-[105px] justify-between">
                <div>
                  <h4 className="font-handwritten text-base font-extrabold text-rose-600 capitalize tracking-wide leading-tight break-words truncate">
                    {item.title.toLowerCase()}
                  </h4>
                  
                  {/* Scrolling description box allows reading everything cleanly without clipping! */}
                  <div className="text-[10.5px] text-stone-650 leading-relaxed font-bold font-sans overflow-y-auto max-h-[50px] pr-1 mt-1 scrollbar-thin scrollbar-thumb-stone-200">
                    {item.description ? `"${item.description}"` : 'Sem descrição cadastrada'}
                  </div>
                </div>

                {/* Sub-label */}
                <div className="pt-2 border-t border-dashed border-amber-200/50 font-mono text-[8px] uppercase tracking-wide text-stone-500 font-extrabold flex items-center justify-between">
                  <span>Por: {item.creator}</span>
                  {isCustom ? (
                    <span className="flex items-center gap-0.5 text-rose-500 font-extrabold">
                      <Heart size={7} className="fill-rose-500" /> Real
                    </span>
                  ) : (
                    <span className="text-amber-600 font-extrabold">Exemplo</span>
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

      {/* STICKERS DE LABORATÓRIO */}
      <div className="mt-10 pt-6 border-t border-amber-250/55 flex flex-wrap justify-center md:justify-between items-center gap-4 text-stone-400 select-none z-10 relative">
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-stone-600">
          <BookOpen size={11} className="text-rose-600" />
          <span>Fórmula de Afinidade: Solução química contra a saudade</span>
        </div>

        {/* Beautiful vector sticker board */}
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
            <span>Foco = Multi-análise de lembranças</span>
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
        </div>
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && displayedAlbumItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4"
          >
            {/* Top Close Bar */}
            <div className="w-full flex justify-between items-center max-w-5xl py-2 z-10 text-stone-300 font-mono text-[10px] uppercase font-bold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Sparkles size={13} className="animate-pulse" />
                <span>Memória {lightboxIndex + 1} de {displayedAlbumItems.length}</span>
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Media Body & navigation keys */}
            <div className="flex-1 w-full flex items-center justify-between max-w-5xl relative gap-2">
              {/* Left Arrow */}
              <button
                onClick={handlePrevItem}
                className="absolute left-2 md:left-4 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all z-10 outline-none border border-white/10"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Media Content */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <motion.div
                  key={lightboxIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-h-[70vh] max-w-full flex items-center justify-center relative overflow-hidden"
                >
                  {displayedAlbumItems[lightboxIndex].mediaType === 'video' ? (
                    <video
                      src={displayedAlbumItems[lightboxIndex].mediaUrl}
                      controls
                      autoPlay
                      className="max-h-[70vh] max-w-[90vw] md:max-w-2xl object-contain rounded-lg shadow-2xl border border-white/10"
                    />
                  ) : (
                    <img
                      src={displayedAlbumItems[lightboxIndex].mediaUrl}
                      alt={displayedAlbumItems[lightboxIndex].title}
                      className="max-h-[70vh] max-w-[90vw] md:max-w-3xl object-contain rounded-lg shadow-2xl border border-white/10 select-none"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </motion.div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextItem}
                className="absolute right-2 md:right-4 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all z-10 outline-none border border-white/10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Legend Details panel */}
            <div className="w-full max-w-2xl bg-stone-900/80 border border-white/10 rounded-2xl p-5 mb-4 text-center space-y-2 backdrop-blur-xs shadow-2xl">
              <span className="px-2.5 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/40 font-mono text-[9px] uppercase font-bold tracking-wider rounded-full inline-block">
                {formatDateBr(displayedAlbumItems[lightboxIndex].date)}
              </span>

              <h3 className="text-lg md:text-xl font-bold font-serif text-white tracking-tight leading-tight">
                {displayedAlbumItems[lightboxIndex].title}
              </h3>

              {displayedAlbumItems[lightboxIndex].description && (
                <p className="text-xs text-stone-300 leading-relaxed max-w-lg mx-auto font-medium">
                  "{displayedAlbumItems[lightboxIndex].description}"
                </p>
              )}

              <div className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest pt-1">
                <span>Registrado por: </span>
                <strong className="text-stone-300">{displayedAlbumItems[lightboxIndex].creator}</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
