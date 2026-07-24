/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Square, 
  MapPin, 
  Instagram, 
  Plus, 
  Trash2, 
  Compass, 
  Sparkles, 
  Check, 
  Bookmark,
  CalendarCheck
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { DateSuggestion, CalendarEvent } from '../types';

interface DateChecklistProps {
  currentProfile: string;
}

export const DateChecklist: React.FC<DateChecklistProps> = ({ currentProfile }) => {
  const [suggestions, setSuggestions] = useState<DateSuggestion[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [placeName, setPlaceName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [location, setLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [suggestionIdToDelete, setSuggestionIdToDelete] = useState<string | null>(null);

  // Roulette States
  const [isRolling, setIsRolling] = useState(false);
  const [rolledItem, setRolledItem] = useState<DateSuggestion | null>(null);
  const [rollingName, setRollingName] = useState('');
  const [rollShowWinner, setRollShowWinner] = useState(false);

  const PRESET_TAGS = ['cinema', 'barzinho', 'show', 'balada', 'gastronômico', 'cafeteria', 'parque', 'viagem', 'romântico', 'cultura'];

  const handleRoll = () => {
    const todoList = suggestions.filter(s => !s.isChecked);
    if (todoList.length === 0) {
      alert('Nenhum date na lista "A fazer" para sortear! Adicione ou reative algum primeiro. 💖');
      return;
    }
    setIsRolling(true);
    setRolledItem(null);
    setRollShowWinner(false);

    let speed = 65;
    let iterations = 0;
    const maxIterations = 18;

    const tick = () => {
      iterations++;
      const randomItem = todoList[Math.floor(Math.random() * todoList.length)];
      setRollingName(randomItem.placeName);

      if (iterations >= maxIterations) {
        const finalItem = todoList[Math.floor(Math.random() * todoList.length)];
        setRolledItem(finalItem);
        setRollingName(finalItem.placeName);
        setRollShowWinner(true);
        setIsRolling(false);
      } else {
        if (iterations > 10) speed += 35;
        if (iterations > 14) speed += 65;
        setTimeout(tick, speed);
      }
    };

    setTimeout(tick, speed);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const tagClean = customTag.trim().toLowerCase().replace(/^#/, '');
    if (tagClean && !selectedTags.includes(tagClean)) {
      setSelectedTags(prev => [...prev, tagClean]);
      setCustomTag('');
    }
  };

  useEffect(() => {
    const unsubSuggestions = dataService.subscribeDateSuggestions((data) => {
      setSuggestions(data);
    });
    const unsubEvents = dataService.subscribeEvents((events) => {
      setCalendarEvents(events);
    });
    return () => {
      unsubSuggestions();
      unsubEvents();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim()) return;

    // Sanitize instagram handle to include '@' if missing
    let ig = instagram.trim();
    if (ig && !ig.startsWith('@')) {
      ig = '@' + ig;
    }

    try {
      await dataService.addDateSuggestion(
        placeName.trim(),
        ig,
        location.trim(),
        currentProfile,
        selectedTags
      );
      setPlaceName('');
      setInstagram('');
      setLocation('');
      setSelectedTags([]);
      setCustomTag('');
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding date suggestion:', err);
    }
  };

  const handleToggleCheck = async (item: DateSuggestion) => {
    const isChecked = !item.isChecked;
    const updatePayload: Partial<DateSuggestion> = {
      isChecked,
      checkedBy: isChecked ? currentProfile : '',
      checkedAt: isChecked ? new Date().toISOString() : ''
    };
    try {
      await dataService.updateDateSuggestion(item.id, updatePayload);
    } catch (err) {
      console.error('Error toggling suggestion check:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataService.deleteDateSuggestion(id);
      setSuggestionIdToDelete(null);
    } catch (err) {
      console.error('Error deleting suggestion:', err);
    }
  };

  // Stats
  const checkedCount = suggestions.filter(s => s.isChecked).length;
  const totalCount = suggestions.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div id="date-checklist-panel" className="bg-[#FAF8F5]/90 border border-amber-250/45 rounded-3xl p-6 md:p-8 shadow-xs relative mt-8 text-stone-850">
      {/* Visual background decor element */}
      <div className="absolute right-[-15px] bottom-[-15px] text-amber-100 opacity-20 pointer-events-none select-none">
        <Compass size={140} className="animate-spin-slow" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-stone-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg">
              <Compass className="text-rose-500 animate-pulse" size={16} />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-rose-600">
              Checklist de Aventuras
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-rose-600 font-cursive tracking-wide select-none leading-none">
            Dates por ai...
          </h2>
          <p className="text-[10.5px] text-stone-550 font-mono leading-relaxed max-w-xl">
            Locais, cafeterias e dates ideais que pretendemos fazer juntas. Quando formos no lugar, basta riscar e registrar na história!
          </p>
        </div>

        {/* Progress gauge card */}
        <div className="bg-white border border-amber-200/50 rounded-2xl p-4 shadow-3xs max-w-full md:max-w-[220px] w-full self-start">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-500 mb-1.5 uppercase">
            <span>Metas Concluídas</span>
            <span className="text-rose-600">{checkedCount}/{totalCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/40">
            <motion.div 
              className="bg-rose-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[8px] font-mono font-bold text-stone-400 mt-1.5 block leading-tight">
            {progressPercent === 100 
              ? '🏆 SINTONIA PERFEITA: zeramos todas as sugestões!' 
              : '🚌 Explorando horizontes, dengo por dengo.'}
          </span>
        </div>
      </div>

      {/* Adding Toggle and Roulette buttons */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-[10px] tracking-wide uppercase rounded-xl shadow-2xs hover:scale-[1.01] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={14} className={isAdding ? 'rotate-45 transition-transform' : 'transition-transform'} />
          <span>{isAdding ? 'Fechar Formulário' : 'Sugerir Novo Roteiro'}</span>
        </button>

        <button
          onClick={handleRoll}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-mono font-bold text-[10px] tracking-wide uppercase rounded-xl shadow-sm hover:scale-[1.01] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles size={12} className="animate-pulse text-amber-100" />
          <span>🎰 Roleta de Dates</span>
        </button>
      </div>

      {/* Interactive Creation form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleSubmit} className="bg-white border border-amber-250/40 rounded-2xl p-5 shadow-3xs space-y-4 max-w-2xl">
              <h3 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} className="text-amber-600 animate-pulse" /> Informações da Sugestão
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do Lugar */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold font-mono uppercase text-slate-500">
                    Nome do Lugar / Ideia de Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rooftop do Cais, piquenique na Redenção..."
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-stone-50/55 rounded-xl focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                {/* Rede Social */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold font-mono uppercase text-slate-500">
                    @ de Rede Social (Instagram)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: @rooftop_poa"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-stone-50/55 rounded-xl focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Localizacao */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono uppercase text-slate-500">
                  Localização / Endereço / Link de Mapa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Porto Alegre - RS, Centro Histórico ou link do Google Maps..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 bg-stone-50/55 rounded-xl focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              {/* Categoria/Tags do Roteiro */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold font-mono uppercase text-slate-500 block">
                  Tipo de Rolê / Hashtags do Date
                </label>
                
                {/* Selected tags list */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 border border-stone-200/60 rounded-xl">
                    {selectedTags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-pink-100 text-pink-700 border border-pink-200 px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-rose-100 hover:text-rose-800 transition-colors"
                        onClick={() => handleToggleTag(tag)}
                        title="Clique para remover"
                      >
                        #{tag}
                        <span className="text-[8px] opacity-60 font-sans">&times;</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Preset suggestions */}
                <div className="space-y-1">
                  <span className="text-[8px] font-bold font-mono text-stone-400 uppercase block">Sugestões rápidas (clique para marcar):</span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_TAGS.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`text-[9.5px] font-mono font-bold px-2.5 py-1 rounded-full transition-all border ${
                            isSelected 
                              ? 'bg-rose-500 text-white border-rose-600 scale-[1.02]' 
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom input */}
                <div className="flex gap-2 max-w-xs pt-1">
                  <input
                    type="text"
                    placeholder="Outra #tag customizada..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag(e);
                      }
                    }}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 bg-stone-50/55 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleAddCustomTag(e)}
                    className="px-3 bg-stone-800 hover:bg-stone-900 text-white font-mono text-[10px] font-bold rounded-xl uppercase transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setPlaceName('');
                    setInstagram('');
                    setLocation('');
                    setSelectedTags([]);
                    setCustomTag('');
                  }}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono text-[9px] font-bold rounded-lg uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-bold rounded-lg uppercase flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={11} />
                  <span>Gravar Sugestão</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of suggest items */}
      {totalCount === 0 ? (
        <div className="bg-white/40 border border-dashed border-stone-300 p-8 rounded-2xl text-center">
          <p className="text-xs text-stone-500 font-bold font-mono">Nenhuma sugestão cadastrada por enquanto.</p>
          <p className="text-[10px] text-stone-400 font-mono mt-1 font-semibold uppercase">Clique em "Sugerir Novo Roteiro" para registrar o primeiro date dos sonhos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {suggestions.map((item) => {
              const displayIg = item.instagramHandle?.trim();
              const hasMapsLink = item.locationText?.startsWith('http://') || item.locationText?.startsWith('https://');

              let instagramUrl = '';
              if (displayIg) {
                if (displayIg.startsWith('http://') || displayIg.startsWith('https://')) {
                  instagramUrl = displayIg;
                } else {
                  const cleanHandle = displayIg.replace(/^@/, '');
                  instagramUrl = `https://instagram.com/${cleanHandle}`;
                }
              }

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 border rounded-2xl flex flex-col justify-between gap-3 shadow-3xs transition-all ${
                    item.isChecked 
                      ? 'bg-emerald-50/25 border-emerald-150 text-stone-500 opacity-80' 
                      : 'bg-white border-amber-200/40 hover:border-amber-200 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    {/* Header check status and actions */}
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => handleToggleCheck(item)}
                        className={`p-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer outline-none ${
                          item.isChecked 
                            ? 'text-emerald-600 hover:text-stone-500 bg-emerald-50' 
                            : 'text-stone-400 hover:text-rose-500 hover:bg-stone-50'
                        }`}
                        title={item.isChecked ? 'Marcar como não concluído' : 'Marcar como concluído!'}
                      >
                        {item.isChecked ? (
                          <CheckSquare size={18} className="shrink-0" />
                        ) : (
                          <Square size={18} className="shrink-0 text-stone-350" />
                        )}
                        <span className="text-[9.5px] font-bold font-mono uppercase tracking-tight">
                          {item.isChecked ? 'Concluído' : 'A fazer'}
                        </span>
                      </button>

                      {suggestionIdToDelete === item.id ? (
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-mono font-bold text-rose-600 mr-1">Deletar?</span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[8px] font-mono font-bold rounded-md uppercase transition-colors"
                            title="Confirmar exclusão"
                          >
                            Sim
                          </button>
                          <button
                            onClick={() => setSuggestionIdToDelete(null)}
                            className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[8px] font-mono font-bold rounded-md uppercase transition-colors"
                            title="Cancelar"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSuggestionIdToDelete(item.id);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors"
                          title="Remover sugestão"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* Place Name and Strikethrough state */}
                    <div className="pt-1">
                      <h4 className={`text-sm font-bold font-serif leading-tight text-stone-900 ${
                        item.isChecked ? 'line-through text-stone-400 font-normal decoration-emerald-500 decoration-2' : ''
                      }`}>
                        {item.placeName}
                      </h4>
                    </div>

                    {/* Meta info like Social Media or Address */}
                    <div className="space-y-1 text-[10.5px] font-mono font-medium">
                      {displayIg && (
                        <div className="flex items-center gap-1 text-pink-650/85">
                          <Instagram size={11} className="shrink-0 text-pink-500" />
                          <a 
                            href={instagramUrl}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-pink-600 hover:text-pink-700 hover:underline font-bold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {displayIg.startsWith('@') ? displayIg : `@${displayIg}`}
                          </a>
                        </div>
                      )}

                      {item.locationText && (
                        <div className="flex items-center gap-1 text-stone-500">
                          <MapPin size={11} className="shrink-0 text-amber-500" />
                          {hasMapsLink ? (
                            <a 
                              href={item.locationText}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-amber-800 hover:underline hover:text-rose-600 font-bold max-w-[200px] truncate block"
                            >
                              Ver no Google Maps &rarr;
                            </a>
                          ) : (
                            <span className="truncate max-w-[200px] block font-mono">{item.locationText}</span>
                          )}
                        </div>
                      )}

                      {/* Hashtags render */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className={`inline-flex items-center text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                                item.isChecked 
                                  ? 'bg-stone-100 text-stone-400 border border-stone-200/50' 
                                  : 'bg-rose-50/70 text-rose-600 border border-rose-100/50'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Related Calendar Event Badge */}
                      {(() => {
                        const linkedEvent = calendarEvents.find((evt) => evt.relatedDateSuggestionId === item.id);
                        if (!linkedEvent) return null;
                        return (
                          <div className={`mt-2 flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-[9.5px] font-mono font-bold w-fit border ${
                            item.isChecked
                              ? 'bg-stone-50 text-stone-400 border-stone-200/50'
                              : 'bg-amber-50/70 text-amber-800 border-amber-200/40'
                          }`}>
                            <CalendarCheck size={11} className={`${item.isChecked ? 'text-stone-400' : 'text-amber-600'} shrink-0 animate-pulse`} />
                            <span>Agendado: {linkedEvent.date.split('-').reverse().join('/')}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Creator and Footer details */}
                  <div className="border-t border-stone-100 pt-2 flex items-center justify-between text-[8px] font-mono text-stone-400 mt-2">
                    <span>Sugerido por: <strong className="text-stone-600">{item.creator}</strong></span>
                    {item.isChecked && item.checkedBy && (
                      <span className="text-emerald-700 bg-emerald-50/60 px-1 rounded flex items-center gap-0.5">
                        <CalendarCheck size={8} /> feito por {item.checkedBy}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Roulette Animated Overlay */}
      <AnimatePresence>
        {(isRolling || rollShowWinner) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              className="bg-white border border-amber-200/90 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center flex flex-col items-center"
            >
              {/* Spinning slot effect */}
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mb-4">
                <Compass size={28} className={isRolling ? 'animate-spin text-rose-500' : 'animate-bounce text-rose-500'} />
              </div>

              <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-amber-800">
                {isRolling ? '🎰 Girando a Roleta...' : '✨ O Destino Escolheu! ✨'}
              </h3>

              <div className="my-6 p-5 w-full bg-stone-50 border border-amber-200/40 rounded-2xl relative overflow-hidden min-h-[120px] flex flex-col items-center justify-center">
                {/* Rolling name */}
                <motion.div
                  key={rollingName}
                  initial={{ y: isRolling ? 15 : 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-xl font-serif font-extrabold ${isRolling ? 'text-stone-400' : 'text-stone-900 scale-105 transition-transform'}`}
                >
                  {rollingName || 'Escolhendo...'}
                </motion.div>

                {!isRolling && rolledItem && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 text-xs text-stone-500 font-mono flex flex-col items-center gap-1.5"
                  >
                    {rolledItem.locationText && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-amber-500" /> {rolledItem.locationText}
                      </span>
                    )}
                    {rolledItem.instagramHandle && (
                      <span className="text-pink-600 font-bold">
                        {rolledItem.instagramHandle}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="flex gap-2.5 w-full">
                {isRolling ? (
                  <div className="w-full py-2.5 bg-stone-100 text-stone-400 font-bold font-mono text-center text-[10px] uppercase rounded-xl">
                    Sorteando...
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleRoll}
                      className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold font-mono text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Girar de Novo 🔄
                    </button>
                    <button
                      onClick={() => {
                        setIsRolling(false);
                        setRollShowWinner(false);
                      }}
                      className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold font-mono text-[10px] uppercase rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Vamos Fazer! 💖
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
