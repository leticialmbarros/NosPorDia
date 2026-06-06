/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  RotateCw,
  Clock,
  User,
  X,
  AlertTriangle,
  Sparkles,
  Beaker,
  Camera,
  Video,
  BookOpen,
} from 'lucide-react';
import { CalendarEvent, CATEGORY_COLORS, EventCategory } from '../types';
import { isEventOnDate, parseLocalDate, formatDateBr } from '../utils/dashboardCalculations';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  currentProfile: string;
  viewedYear: number;
  viewedMonth: number; // 0-indexed
  onViewChange: (year: number, month: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  currentProfile,
  viewedYear,
  viewedMonth,
  onViewChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<EventCategory>('Outros');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState(14); // default quinzenal
  const [imageUrl, setImageUrl] = useState('');

  // Camera Capture Feature states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 480, height: 480 }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      // Wait a tick for videoRef element to mount
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400; // Perfect square for polaroid!
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop the video feed to make a perfect square
        const size = Math.min(video.videoWidth, video.videoHeight);
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;
        
        ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImageUrl(dataUrl);
      }
      stopCamera();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Por segurança para persistência offline, envie fotos com menos de 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
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

  // Navigate Months
  const handlePrevMonth = () => {
    if (viewedMonth === 0) {
      onViewChange(viewedYear - 1, 11);
    } else {
      onViewChange(viewedYear, viewedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewedMonth === 11) {
      onViewChange(viewedYear + 1, 0);
    } else {
      onViewChange(viewedYear, viewedMonth + 1);
    }
  };

  // Generate Year/Month Array of days
  const firstDayOfWeek = new Date(viewedYear, viewedMonth, 1).getDay();
  const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(viewedYear, viewedMonth, 0).getDate();

  const calendarCells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dVal = prevMonthTotalDays - i;
    const prevMonthIdx = viewedMonth === 0 ? 11 : viewedMonth - 1;
    const prevYearVal = viewedMonth === 0 ? viewedYear - 1 : viewedYear;
    const dStr = `${prevYearVal}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dVal).padStart(2, '0')}`;
    calendarCells.push({ dateStr: dStr, dayNum: dVal, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dateStr: dStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month leading days to complete full weeks (max 42 grid cells)
  const missingSlots = 42 - calendarCells.length;
  for (let d = 1; d <= missingSlots; d++) {
    const nextMonthIdx = viewedMonth === 11 ? 0 : viewedMonth + 1;
    const nextYearVal = viewedMonth === 11 ? viewedYear + 1 : viewedYear;
    const dStr = `${nextYearVal}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dateStr: dStr, dayNum: d, isCurrentMonth: false });
  }

  // Day click triggers management modal
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsEditorOpen(true);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEndDate('');
    setCategory('Outros');
    setIsRecurring(false);
    setRecurringDays(14);
    setImageUrl('');
    setEditingEvent(null);
    stopCamera();
  };

  const handleEditInit = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setEndDate(evt.endDate || '');
    setCategory(evt.category);
    setIsRecurring(evt.isRecurring);
    setRecurringDays(evt.recurringDays || 14);
    setImageUrl(evt.imageUrl || '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;

    const payload = {
      title,
      description,
      date: selectedDate,
      endDate: endDate || undefined,
      category,
      isRecurring,
      recurringDays: isRecurring ? Number(recurringDays) : undefined,
      creator: currentProfile,
      imageUrl: imageUrl || undefined,
    };

    try {
      if (editingEvent) {
        await onUpdateEvent(editingEvent.id, payload);
      } else {
        await onAddEvent(payload);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este compromisso?')) {
      try {
        await onDeleteEvent(id);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Get active events for selected date in modal
  const selectedDayEvents = selectedDate
    ? events.filter((evt) => isEventOnDate(evt, selectedDate))
    : [];

  return (
    <div id="calendar-view-panel" className="bg-[#FCFAF6] border border-amber-250/50 rounded-2xl p-5 md:p-6 shadow-xs relative text-stone-800">
      {/* Calendar Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl md:text-5xl text-rose-600 font-cursive tracking-wide select-none flex items-center gap-1.5 leading-none">
            <span>{months[viewedMonth].toLowerCase()}</span>
            <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider">
              {viewedYear}
            </span>
          </h2>
          <span className="text-[9.5px] text-rose-600 font-semibold font-mono uppercase tracking-wider flex items-center gap-1">
            <Beaker size={11} className="text-rose-500 animate-pulse shrink-0" />
            Sintonia Farmacocinética: Dosagem Diária de Dengo, Ocitocina & Curcumina em Agitação Térmica Constante ❤️
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 md:p-2 bg-[#F5EFE0]/40 outline-none hover:bg-amber-100/50 text-[#6B5D4D] hover:text-amber-800 border border-amber-200/30 rounded-xl transition-all"
            title="Mês Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => {
              const d = new Date();
              onViewChange(d.getFullYear(), d.getMonth());
            }}
            className="px-2.5 py-1 text-[10px] font-bold font-mono tracking-wider bg-amber-100/40 hover:bg-amber-100/80 text-amber-800 border border-amber-200/45 rounded-lg transition-all"
          >
            HOJE
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 md:p-2 bg-[#F5EFE0]/40 outline-none hover:bg-amber-100/50 text-[#6B5D4D] hover:text-amber-800 border border-amber-200/30 rounded-xl transition-all"
            title="Próximo Mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekdays.map((wd) => (
          <span key={wd} className="text-[10px] font-bold font-mono tracking-widest uppercase text-slate-400">
            {wd}
          </span>
        ))}
      </div>

      {/* Grid Days */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendarCells.map((cell, idx) => {
          const cellsEvents = events.filter((evt) => isEventOnDate(evt, cell.dateStr));
          const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

          return (
            <div
              key={`cell-${idx}-${cell.dateStr}`}
              onClick={() => handleDayClick(cell.dateStr)}
              className={`min-h-[70px] md:min-h-[85px] p-1.5 md:p-2 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                cell.isCurrentMonth
                  ? 'bg-white border-stone-250 hover:bg-[#FAF8F5]'
                  : 'bg-stone-50/50 border-stone-200/40 opacity-45 hover:bg-[#FAF8F5]/30'
              } ${
                isToday
                  ? 'ring-2 ring-amber-500 border-transparent bg-amber-50/30'
                  : 'hover:border-amber-400'
              }`}
            >
              {/* Day Number Info */}
              <div className="flex justify-between items-center">
                {isToday ? (
                  <span className="text-[9px] font-mono tracking-wider text-amber-700 bg-amber-100 px-1 rounded-sm uppercase font-bold">
                    Hoje
                  </span>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-1.5">
                  {cellsEvents.some((evt) => evt.imageUrl) && (
                    <Camera size={11} className="text-amber-600 shrink-0 select-none animate-pulse" title="Contém registro fotográfico" />
                  )}
                  <span
                    className={`text-xs font-mono font-bold ${
                      isToday
                        ? 'text-amber-700'
                        : 'text-stone-800'
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                </div>
              </div>

              {/* Event Indicators list (Desktop uses mini text blocks, Mobile uses dots) */}
              <div className="w-full mt-1.5 space-y-1 block max-h-[45px] overflow-hidden">
                {/* Mobile: Dots only */}
                <div className="flex md:hidden flex-wrap gap-1">
                  {cellsEvents.map((evt) => (
                    <span
                      key={evt.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        CATEGORY_COLORS[evt.category]?.dot || 'bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Desktop: Mini Badge labels */}
                <div className="hidden md:flex flex-col gap-1">
                  {cellsEvents.slice(0, 3).map((evt) => {
                    const colors = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Outros'];
                    return (
                      <div
                        key={evt.id}
                        className={`text-[9px] px-1 py-0.5 rounded-md border ${colors.bg} ${colors.text} ${colors.border} flex items-center gap-0.5 truncate select-none leading-none`}
                        title={`${evt.title} (${evt.category})`}
                      >
                        {evt.isRecurring && <RotateCw size={6} className="shrink-0 animate-spin-slow" />}
                        <span className="truncate">{evt.title}</span>
                      </div>
                    );
                  })}
                  {cellsEvents.length > 3 && (
                    <div className="text-[8px] font-mono font-semibold text-slate-400 leading-none pl-1">
                      + {cellsEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Stickers row for the Calendar section, with Norepinefrina Periodic Elements */}
      <div className="mt-10 pt-6 border-t border-amber-250/55 flex flex-wrap justify-center md:justify-between items-center gap-4 text-stone-400 select-none z-10 relative">
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-stone-605">
          <BookOpen size={11} className="text-rose-600 animate-pulse" />
          <span>Fórmula de Afinidade: Energia ativa, batimentos elevados e sintonização diária (norepinefrina pura)</span>
        </div>

        {/* Elegant vector laboratory & romantic fusion elements sticker board - Norepinefrina Theme */}
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
            <span>foco = reduzir a saudade</span>
          </div>

          {/* Norepinefrina element card (Nr) */}
          <div className="w-9 h-9 bg-orange-100/70 text-orange-900 font-mono text-center flex flex-col items-center justify-center border border-orange-200 rounded shadow-2xs leading-none rotate-3 hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7px] font-bold">34</span>
            <span className="text-xs font-bold leading-none -mt-0.5">Nr</span>
            <span className="text-[5.5px] opacity-75 uppercase">Norepi.</span>
          </div>

          {/* Nitrogen element (N) */}
          <div className="w-9 h-9 bg-sky-50/70 text-sky-850 font-mono text-center flex flex-col items-center justify-center border border-sky-200 rounded shadow-2xs leading-none rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7px] font-bold">7</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">N</span>
            <span className="text-[5px] opacity-75">Nitrogênio</span>
          </div>

          {/* Hydrogen element (H) */}
          <div className="w-9 h-9 bg-purple-50/70 text-purple-850 font-mono text-center flex flex-col items-center justify-center border border-purple-250 rounded shadow-2xs leading-none rotate-6 hover:rotate-0 transition-transform cursor-pointer font-bold">
            <span className="text-[7.5px] font-bold">1</span>
            <span className="text-xs font-bold leading-none -mt-0.5 font-sans">H</span>
            <span className="text-[5px] opacity-85 uppercase">Hidrogênio</span>
          </div>

          {/* Cute Beaker sticker */}
          <div className="p-1 px-2.5 bg-[#FAF3E3] text-amber-805 border border-amber-300 rounded-full flex items-center gap-1 hover:skew-x-2 transition-transform text-[9px] font-mono leading-none font-bold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-bounce">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Ph = 8 (Neutro de Saudade)</span>
          </div>
        </div>
      </div>

      {/* Editor & Viewer Sliding Drawer Overlay */}
      <AnimatePresence>
        {isEditorOpen && selectedDate && (
          <div id="drawer-container" className="fixed inset-0 z-40 flex justify-end p-0">
            {/* Backdrop */}
            <motion.div
              id="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditorOpen(false);
                setSelectedDate(null);
              }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            {/* Sidebar content drawer */}
            <motion.div
              id="drawer-body"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-md md:max-w-lg bg-[#FCFAF6] border-l border-amber-250/50 shadow-2xl h-full flex flex-col justify-between p-6 overflow-y-auto z-10 text-stone-850"
            >
              <div className="space-y-6">
                {/* Header title */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-250">
                  <div>
                    <h3 className="text-base font-bold font-serif text-stone-900">
                      Compromissos para o dia
                    </h3>
                    <p className="text-sm font-bold text-amber-800 font-mono mt-0.5">
                      {formatDateBr(selectedDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditorOpen(false);
                      setSelectedDate(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Day events List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">
                    Eventos Ativos ({selectedDayEvents.length})
                  </h4>
                  {selectedDayEvents.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-center justify-center min-h-[90px]">
                      <p className="text-xs text-slate-500 font-medium">Nenhum evento registrado para esta data.</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">Preencha o formulário abaixo para agendar</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {selectedDayEvents.map((evt) => {
                        const style = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Outros'];
                        return (
                          <div
                            key={evt.id}
                            className={`p-3.5 border rounded-2xl flex items-start justify-between gap-3 transition-colors ${style.bg} ${style.border}`}
                          >
                            <div className="space-y-1">
                              {/* Title line */}
                              <div className="flex items-center gap-2">
                                <h5 className={`text-xs font-bold ${style.text} leading-tight`}>
                                  {evt.title}
                                </h5>
                                {evt.isRecurring && (
                                  <span
                                    className={`inline-flex items-center gap-0.5 text-[8px] font-bold font-mono uppercase bg-white/60 px-1 rounded-sm ${style.text}`}
                                    title={`Repete a cada ${evt.recurringDays} dias`}
                                  >
                                    <RotateCw size={8} className="animate-spin-slow" />
                                    {evt.recurringDays}d
                                  </span>
                                )}
                              </div>

                              {evt.description && (
                                <p className="text-[11px] text-slate-700 leading-normal pr-4">
                                  {evt.description}
                                </p>
                              )}

                              {evt.imageUrl && (
                                <div className="my-2.5 shrink-0 inline-block bg-white p-2 pb-5 border border-stone-250 rounded shadow-xs rotate-[-1.5deg] hover:rotate-0 transition-all duration-300">
                                  <div className="w-[140px] h-[100px] bg-[#faf8f5] overflow-hidden relative">
                                    <img
                                      src={evt.imageUrl}
                                      alt={evt.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="mt-1.5 text-center font-handwritten text-[11.5px] text-rose-600 font-bold leading-none select-none">
                                    reação de afeto
                                  </div>
                                </div>
                              )}

                              {/* Footer elements */}
                              <div className="flex items-center gap-4 text-[9px] text-slate-500 font-bold font-mono pt-1">
                                <span className="flex items-center gap-0.5">
                                  <User size={10} /> {evt.creator}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Clock size={10} /> {evt.category}
                                </span>
                              </div>
                            </div>

                            {/* Edit/delete actions */}
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => handleEditInit(evt)}
                                className={`p-1.5 bg-white/40 hover:bg-white border rounded-lg transition-colors text-slate-500 hover:text-slate-800`}
                                title="Editar Compromisso"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(evt.id)}
                                className="p-1.5 bg-white/40 hover:bg-rose-50 border rounded-lg hover:border-rose-100 text-slate-500 hover:text-rose-500 transition-colors"
                                title="Deletar Compromisso"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Compromisso Creation Form */}
                <form onSubmit={handleFormSubmit} className="pt-4 border-t border-stone-250 space-y-4">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>{editingEvent ? 'Editar Compromisso' : 'Novo Compromisso'}</span>
                    {editingEvent && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-[10px] text-amber-600 hover:underline normal-case font-bold"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </h4>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-550 tracking-wider">
                      Título do Evento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Viagem para o sul"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-880 focus:outline-none focus:border-amber-400 transition-colors font-semibold"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-550 tracking-wider">
                      Descrição Opcional
                    </label>
                    <textarea
                      placeholder="Detalhes adicionais ou notas de roteiro..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-880 focus:outline-none focus:border-amber-400 transition-colors resize-none font-medium"
                    />
                  </div>

                  {/* Recordação do Date (Photo Upload) */}
                  <div className="space-y-1 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <label className="text-[10px] font-bold font-mono uppercase text-rose-500 tracking-wider flex items-center gap-1">
                      <Sparkles size={11} className="text-rose-500 shrink-0" />
                      Visual de Recordação (Foto)
                    </label>
                    
                    {imageUrl ? (
                      <div className="relative w-full h-[120px] bg-stone-100 rounded-lg overflow-hidden border border-stone-250 animate-fade-in">
                        <img
                          src={imageUrl}
                          alt="Nossa Foto"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-1.5 right-1.5 px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[8.5px] font-bold rounded-md shadow-sm transition-colors uppercase"
                        >
                          Remover Foto
                        </button>
                      </div>
                    ) : isCameraActive ? (
                      <div className="space-y-2 border border-dashed border-rose-300 p-2 rounded-lg bg-rose-50/20 text-center animate-fade-in">
                        <div className="relative w-full h-[200px] bg-black rounded-lg overflow-hidden border border-stone-300">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 text-white text-[8px] font-bold font-mono rounded tracking-wider uppercase">
                            Câmera Ativa (Selfie)
                          </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold font-mono text-[10px] rounded-lg tracking-wide flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                          >
                            <Camera size={12} />
                            Capturar Polaroid
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold font-mono text-[10px] rounded-lg tracking-wide hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <label className="flex flex-col items-center justify-center p-3 border border-stone-250 rounded-xl bg-white hover:bg-stone-50 cursor-pointer transition-colors shadow-2xs h-[64px]">
                              <Plus size={14} className="text-stone-600 mb-0.5" />
                              <span className="text-[9.5px] font-bold text-stone-700 font-mono text-center">Do Dispositivo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          
                          <button
                            type="button"
                            onClick={startCamera}
                            className="flex flex-col items-center justify-center p-3 border border-rose-200 rounded-xl bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-colors shadow-2xs h-[64px]"
                          >
                            <Camera size={14} className="text-rose-500 mb-0.5" />
                            <span className="text-[9.5px] font-bold text-rose-700 font-mono text-center">Tirar da Câmera</span>
                          </button>
                        </div>
                        
                        <div className="text-[8.5px] text-stone-500 font-mono text-center">
                          &mdash; OU COLA LINK DE IMAGEM &mdash;
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Cole um link de imagem da web (ex: https://...)"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-stone-250 bg-white text-stone-800 placeholder-stone-450 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Row grid for Category and Recurrence */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Category Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono uppercase text-slate-550 tracking-wider">
                        Categoria
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as EventCategory)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-amber-400 transition-colors font-bold"
                      >
                        <option value="Conchinha de Manutenção">Conchinha de Manutenção</option>
                        <option value="Date de Exploração">Date de Exploração</option>
                        <option value="Casa da Mãe - SM">Casa da Mãe - SM</option>
                        <option value="Compromissos de Trabalho">Compromissos de Trabalho</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    {/* Date field (Data Início and Data Fim) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono uppercase text-slate-550 tracking-wider">
                        Data Início *
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 bg-stone-50 text-slate-800 rounded-xl focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-550 tracking-wider">
                      Data Fim (Opcional - para período de dias)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-stone-50 text-slate-800 rounded-xl focus:outline-none font-bold"
                    />
                  </div>

                  {/* Recurrence Selection */}
                  <div className="p-3 bg-amber-50/20 border border-amber-100/35 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-4 h-4 text-amber-500 border-amber-300 rounded-sm focus:ring-amber-400 cursor-pointer"
                      />
                      <label
                        htmlFor="isRecurring"
                        className="text-xs font-bold text-slate-800 cursor-pointer select-none"
                      >
                        Repetir este compromisso?
                      </label>
                    </div>

                    {isRecurring && (
                      <div className="space-y-1.5 pl-6">
                        <label className="text-[10px] font-bold font-mono uppercase text-slate-500">
                          Repetição Periódica (em dias)
                        </label>
                        <select
                          value={recurringDays}
                          onChange={(e) => setRecurringDays(Number(e.target.value))}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-850 font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value={7}>A cada 7 dias (Semanal)</option>
                          <option value={14}>A cada 14 dias (Quinzenal)</option>
                          <option value={15}>A cada 15 dias (Ex: Viagem SM)</option>
                          <option value={30}>A cada 30 dias (Mensal)</option>
                          <option value={60}>A cada 60 dias (Bimestral)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 font-bold text-white rounded-xl text-xs shadow-xs tracking-wider uppercase transition-colors"
                  >
                    {editingEvent ? 'Atualizar Evento • Concluído' : 'Criar Evento Catalisado'}
                  </button>
                </form>
              </div>

              {/* Identity warning footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center gap-2 mt-4 text-[10px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Criando como: <strong className="text-stone-900">{currentProfile}</strong> &bull; Sincronização Ativa
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
