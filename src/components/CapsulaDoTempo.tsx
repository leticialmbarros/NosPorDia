/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Eye,
  Bold,
  Italic,
  Underline,
  Heading,
  Quote,
  Edit3,
  Mic,
  Square,
  Volume2
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { SecretLetter } from '../types';

// Inline Formatted Letter Parser Component
export const WaxSeal: React.FC<{ isUnlocked?: boolean; size?: 'sm' | 'md' | 'lg' }> = ({ isUnlocked = false, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  
  return (
    <div className={`relative flex items-center justify-center rounded-full shadow-md font-serif font-black select-none transition-transform duration-300 shrink-0 ${sizeClasses} ${
      isUnlocked
        ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 border-2 border-amber-400/80 shadow-amber-900/20'
        : 'bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 text-rose-100 border-2 border-rose-500/80 shadow-rose-950/40 ring-1 ring-rose-900/50'
    }`}>
      {/* Irregular outer wax seal ripple ring */}
      <div className="absolute -inset-0.5 rounded-full border border-dashed border-white/20 pointer-events-none opacity-60" />
      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        <Heart size={size === 'lg' ? 16 : size === 'sm' ? 10 : 12} className="fill-current text-white/95 drop-shadow-xs" />
        {size === 'lg' && <span className="text-[7px] font-mono font-extrabold uppercase tracking-widest opacity-90 mt-0.5 text-amber-200">NÓS</span>}
      </div>
    </div>
  );
};

export const LetterEnvelopeIllustration: React.FC<{ className?: string; strokeColor?: string }> = ({
  className = "w-full h-full",
  strokeColor = "#991B1B"
}) => {
  return (
    <svg
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Letter paper inside the open flap */}
        <path d="M 85 92 L 205 52 L 170 12 L 68 42 Z" fill="#FFFDFB" fillOpacity="0.95" strokeWidth="1.8" />
        
        {/* Letter wavy lines */}
        <path d="M 95 48 C 110 42 125 48 140 44" strokeWidth="1.5" />
        <path d="M 88 60 C 105 54 122 60 140 55 C 152 52 165 56 178 52" strokeWidth="1.5" />
        <path d="M 98 72 C 115 66 132 72 150 67 C 160 64 172 68 184 64" strokeWidth="1.5" />
        <path d="M 108 84 C 122 79 136 84 152 80" strokeWidth="1.5" />

        {/* Envelope Body - Open Top Flap */}
        <path d="M 68 42 L 140 125 L 205 52" strokeWidth="2" />

        {/* Envelope Main Shell (Angled Envelope) */}
        <path d="M 68 42 L 205 52 L 230 142 L 95 172 Z" fill="#FFFAFA" fillOpacity="0.85" strokeWidth="2.2" />

        {/* Inner Crease Folds */}
        <path d="M 68 42 L 152 130 L 95 172" strokeWidth="1.8" />
        <path d="M 205 52 L 152 130 L 230 142" strokeWidth="1.8" />

        {/* Ribbon - Left Strand */}
        <path d="M 82 118 Q 115 125 146 131" strokeWidth="2" />
        <path d="M 80 123 Q 115 130 147 136" strokeWidth="2" />

        {/* Ribbon - Right Strand */}
        <path d="M 160 134 Q 190 121 218 112" strokeWidth="2" />
        <path d="M 161 139 Q 190 126 219 117" strokeWidth="2" />

        {/* Left Ribbon Tail (curling out left) */}
        <path d="M 82 118 C 60 122 40 128 32 134 C 28 136 32 140 38 138 C 55 132 70 128 80 123" strokeWidth="1.8" />
        <path d="M 32 134 L 38 135 L 38 138" strokeWidth="1.8" fill={strokeColor} />

        {/* Right Ribbon Tail (curling out right) */}
        <path d="M 218 112 C 240 106 258 100 266 102 C 270 103 268 108 262 110 C 248 114 232 115 219 117" strokeWidth="1.8" />
        <path d="M 266 102 L 261 106 L 262 110" strokeWidth="1.8" fill={strokeColor} />

        {/* Central Heart Bow Knot */}
        <path
          d="M 153 128 C 147 118 135 120 135 129 C 135 137 148 142 153 148 C 158 142 171 137 171 129 C 171 120 159 118 153 128 Z"
          strokeWidth="2.2"
          fill="#FFFBF7"
        />

        {/* Left Bow Loop */}
        <path
          d="M 148 127 C 130 115 118 132 138 138 C 144 140 149 138 151 134"
          strokeWidth="2"
        />

        {/* Right Bow Loop */}
        <path
          d="M 158 127 C 176 115 188 132 168 138 C 162 140 157 138 155 134"
          strokeWidth="2"
        />

        {/* Bow Hanging Tails */}
        <path d="M 148 142 C 144 154 140 162 138 170 C 137 174 142 173 144 170 C 148 162 151 152 152 146" strokeWidth="1.8" />
        <path d="M 154 146 C 155 152 158 162 162 170 C 164 173 169 174 168 170 C 166 162 162 154 158 142" strokeWidth="1.8" />
      </g>
    </svg>
  );
};

export const VintageEnvelopeCard: React.FC<{
  letter: SecretLetter;
  unlocked: boolean;
  unlockLabel: string;
  onOpen: (letter: SecretLetter) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ letter, unlocked, unlockLabel, onOpen, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={unlocked ? { y: -3, scale: 1.01 } : undefined}
      onClick={() => unlocked && onOpen(letter)}
      className={`relative min-h-[160px] rounded-2xl p-3.5 flex flex-col justify-between border shadow-2xs transition-all overflow-hidden select-none group ${
        unlocked
          ? 'bg-[#FAF4EC] border-[#E5D7C5] hover:border-rose-400 hover:shadow-md cursor-pointer'
          : 'bg-[#F2EAE0] border-[#DDD0BF] opacity-90'
      }`}
    >
      {/* Background Red Line Art Illustration matching user's requested drawing */}
      <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28 pointer-events-none z-0 opacity-25 group-hover:opacity-40 transition-opacity">
        <LetterEnvelopeIllustration className="w-full h-full" strokeColor="#991B1B" />
      </div>

      {/* Header Info: Sender / Receiver & Actions */}
      <div className="relative z-10 flex items-center justify-between gap-1 pr-6">
        <div className="bg-[#FAF4EC]/95 border border-[#DFCFC0] px-1.5 py-0.5 rounded backdrop-blur-xs shadow-2xs truncate max-w-[65%]">
          <span className="text-[8.5px] font-serif italic font-bold text-stone-700 truncate block">
            <strong className="text-rose-900 not-italic">{letter.sender}</strong> &rarr; <strong className="text-rose-900 not-italic">{letter.recipient}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#FAF4EC]/95 border border-[#DFCFC0] px-1.5 py-0.5 rounded backdrop-blur-xs shadow-2xs shrink-0">
          {unlocked ? (
            letter.isOpened ? (
              <span className="text-[7.5px] font-mono font-bold text-emerald-700 flex items-center gap-0.5">
                <Eye size={9} /> Lido
              </span>
            ) : (
              <span className="text-[7.5px] font-mono font-bold text-rose-600 animate-pulse">
                Novo!
              </span>
            )
          ) : (
            <span className="text-[7.5px] font-mono font-bold text-stone-500 flex items-center gap-0.5">
              <Lock size={9} /> Selado
            </span>
          )}

          {letter.audioUrl && (
            <span className="text-[7.5px] font-mono font-bold text-amber-700 flex items-center gap-0.5 bg-amber-100/80 px-1 py-0.2 rounded">
              <Mic size={8} />
            </span>
          )}

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(letter.id, e);
            }}
            className="p-0.5 text-stone-400 hover:text-rose-600 hover:bg-rose-100/80 rounded transition-colors cursor-pointer"
            title="Excluir carta"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Middle Content: Letter Title - Completely clear of seal */}
      <div className="relative z-10 my-auto py-1 px-0.5">
        <h4 className="text-xs md:text-sm font-serif font-bold text-stone-900 leading-snug group-hover:text-rose-900 transition-colors line-clamp-2">
          {letter.title}
        </h4>
      </div>

      {/* Footer Info: Unlock requirements */}
      <div className="relative z-10 pt-1.5 border-t border-[#DCCBBA]/70 flex items-center justify-between text-[8.5px] font-mono font-semibold">
        <div className="flex items-center gap-1 text-stone-700 truncate max-w-[70%]">
          {unlocked ? (
            <Unlock size={10} className="text-emerald-600 shrink-0" />
          ) : (
            <Lock size={10} className="text-amber-700 shrink-0" />
          )}
          <span className="truncate">{unlockLabel}</span>
        </div>

        {unlocked && (
          <span className="text-[7.5px] font-mono font-extrabold text-rose-800 uppercase tracking-tight shrink-0 bg-rose-100/80 px-1.5 py-0.5 rounded border border-rose-200 shadow-2xs">
            Abrir ✉️
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const FormattedLetterContent: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;

  const renderInlineFormatted = (text: string): React.ReactNode[] => {
    let normalized = text
      .replace(/<u>(.*?)<\/u>/gi, '[u]$1[/u]')
      .replace(/<small>(.*?)<\/small>/gi, '[small]$1[/small]')
      .replace(/<big>(.*?)<\/big>/gi, '[big]$1[/big]')
      .replace(/<pink>(.*?)<\/pink>/gi, '[pink]$1[/pink]');

    const pattern = /(\*\*.*?\*\*|\*.*?\*|\[u\].*?\[\/u\]|\[small\].*?\[\/small\]|\[big\].*?\[\/big\]|\[pink\].*?\[\/pink\])/g;
    const parts = normalized.split(pattern);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={i} className="font-extrabold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={i} className="italic text-rose-900 font-medium">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('[u]') && part.endsWith('[/u]')) {
        return <u key={i} className="underline decoration-rose-400 decoration-2 underline-offset-2">{part.slice(3, -4)}</u>;
      }
      if (part.startsWith('[small]') && part.endsWith('[/small]')) {
        return <span key={i} className="text-xs opacity-90 font-sans">{part.slice(7, -8)}</span>;
      }
      if (part.startsWith('[big]') && part.endsWith('[/big]')) {
        return <span key={i} className="text-lg md:text-xl font-bold text-stone-900">{part.slice(5, -6)}</span>;
      }
      if (part.startsWith('[pink]') && part.endsWith('[/pink]')) {
        return <span key={i} className="bg-rose-100/90 text-rose-700 px-1.5 py-0.5 rounded-md font-semibold border border-rose-200/50">{part.slice(6, -7)}</span>;
      }

      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-2.5 font-serif leading-relaxed text-stone-800 ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }

        if (line.startsWith('# ')) {
          return (
            <h3 key={index} className="text-xl md:text-2xl font-black text-rose-950 tracking-tight my-2">
              {renderInlineFormatted(line.slice(2))}
            </h3>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <h4 key={index} className="text-lg font-bold text-stone-900 my-1.5">
              {renderInlineFormatted(line.slice(3))}
            </h4>
          );
        }

        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-3 border-rose-400 pl-3.5 my-2.5 italic text-stone-700 bg-rose-50/70 py-1.5 rounded-r-xl shadow-3xs">
              {renderInlineFormatted(line.slice(2))}
            </blockquote>
          );
        }

        return (
          <p key={index} className="whitespace-pre-wrap">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
};

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
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Audio Note Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
      alert('Permissão de microfone não concedida ou dispositivo não suportado.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const [unlockType, setUnlockType] = useState<'date' | 'pulses'>('date');
  const [unlockDate, setUnlockDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [unlockTime, setUnlockTime] = useState('00:00');
  const [unlockPulses, setUnlockPulses] = useState(10);

  // Read Modal state
  const [readingLetter, setReadingLetter] = useState<SecretLetter | null>(null);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);

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

  const applyFormat = (prefix: string, suffix: string = '', defaultText: string = 'texto') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const textToFormat = selectedText || defaultText;
    const replacement = `${prefix}${textToFormat}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
      }
    }, 0);
  };

  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const recipient = currentProfile === 'Érica' ? 'Letícia' : 'Érica';
    const formattedDateTime = unlockTime ? `${unlockDate}T${unlockTime}` : `${unlockDate}T00:00`;
    const unlockValue = unlockType === 'date' ? formattedDateTime : String(unlockPulses);

    try {
      await dataService.addLetter(
        title.trim(),
        content.trim(),
        currentProfile,
        recipient,
        unlockType,
        unlockValue,
        pulseCount,
        audioUrl || undefined
      );

      // Reset form
      setTitle('');
      setContent('');
      setAudioUrl(null);
      setUnlockType('date');
      setUnlockTime('00:00');
      setIsAdding(false);
    } catch (err) {
      console.error('Erro ao adicionar carta:', err);
    }
  };

  const handleDeleteLetter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening
    e.preventDefault();
    setLetterToDelete(id);
  };

  const confirmDeleteLetter = async () => {
    if (!letterToDelete) return;
    const targetId = letterToDelete;
    try {
      await dataService.deleteLetter(targetId);
      setLetters((prev) => prev.filter((l) => l.id !== targetId));
      if (readingLetter?.id === targetId) {
        setReadingLetter(null);
      }
    } catch (err) {
      console.error('Erro ao excluir carta:', err);
    } finally {
      setLetterToDelete(null);
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
      if (letter.unlockValue.includes('T')) {
        const unlockDateTime = new Date(letter.unlockValue);
        return new Date() >= unlockDateTime;
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        return todayStr >= letter.unlockValue;
      }
    } else {
      const targetCount = (letter.createdPulseCount || 0) + Number(letter.unlockValue);
      return pulseCount >= targetCount;
    }
  };

  // Get unlock description text
  const getUnlockDetails = (letter: SecretLetter) => {
    if (letter.unlockType === 'date') {
      if (letter.unlockValue.includes('T')) {
        const [d, t] = letter.unlockValue.split('T');
        const dateBr = d.split('-').reverse().join('/');
        return {
          label: `Apenas em ${dateBr} às ${t}`,
          icon: <Calendar size={12} />,
          unlocked: isUnlocked(letter)
        };
      } else {
        const dateBr = letter.unlockValue.split('-').reverse().join('/');
        return {
          label: `Apenas em ${dateBr}`,
          icon: <Calendar size={12} />,
          unlocked: isUnlocked(letter)
        };
      }
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
          <h2 className="text-3xl sm:text-4xl text-rose-600 font-cursive tracking-wide select-none leading-none">
            Baú de Cartas Secretas
          </h2>
          <p className="text-[10.5px] text-stone-500 font-mono leading-relaxed max-w-xl">
            Quer me contar alguma coisa? Defina datas de aniversário ou metas de chamego (pulsos de Ocitocina) para revelar os segredos!
          </p>
        </div>

        {/* Global pulse status indicator */}
        <div className="bg-[#FFFDF9] border border-amber-200/55 rounded-2xl px-4 py-3 shadow-3xs flex items-center gap-3 self-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
            <Heart size={20} className="fill-white animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-stone-400 block leading-none">
              Pulsos de Afeto Acumulados
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

              {/* Audio Note Recorder Section */}
              <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold text-rose-800 uppercase flex items-center gap-1">
                  <Volume2 size={12} /> Adicionar Nota de Áudio à Carta (Opcional):
                </span>
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mic size={13} /> Gravador de Voz
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-3 py-1.5 bg-stone-900 text-rose-400 font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 animate-pulse cursor-pointer"
                    >
                      <Square size={13} /> Parar Gravação...
                    </button>
                  )}

                  {audioUrl && (
                    <div className="flex items-center gap-2 flex-1">
                      <audio controls src={audioUrl} className="h-8 max-w-xs" />
                      <button
                        type="button"
                        onClick={() => setAudioUrl(null)}
                        className="text-[10px] font-mono text-rose-600 font-bold underline cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold font-mono uppercase text-slate-500 block">
                    O conteúdo íntimo da sua carta *
                  </label>

                  {/* Mode tabs: Edit vs Live Preview */}
                  <div className="flex bg-stone-200/60 p-0.5 rounded-lg text-[9px] font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => setEditorTab('edit')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        editorTab === 'edit'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Edit3 size={11} /> Digitar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        editorTab === 'preview'
                          ? 'bg-white text-rose-600 shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Eye size={11} /> Prévia
                    </button>
                  </div>
                </div>

                {editorTab === 'edit' ? (
                  <div className="border border-slate-200 bg-white rounded-xl overflow-hidden focus-within:border-rose-400 transition-colors">
                    {/* Toolbar */}
                    <div className="bg-stone-50/90 border-b border-stone-200/70 p-1.5 flex flex-wrap items-center gap-1 text-[10px] font-mono font-bold text-stone-600">
                      <button
                        type="button"
                        onClick={() => applyFormat('**', '**', 'negrito')}
                        className="p-1.5 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                        title="Negrito (**texto**)"
                      >
                        <Bold size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFormat('*', '*', 'itálico')}
                        className="p-1.5 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                        title="Itálico (*texto*)"
                      >
                        <Italic size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFormat('<u>', '</u>', 'sublinhado')}
                        className="p-1.5 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                        title="Sublinhado (<u>texto</u>)"
                      >
                        <Underline size={13} />
                      </button>

                      <div className="h-4 w-px bg-stone-300 mx-0.5" />

                      <button
                        type="button"
                        onClick={() => applyFormat('# ', '', 'Título Principal')}
                        className="px-2 py-1 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                        title="Título Grande (# texto)"
                      >
                        <Heading size={13} /> Título
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFormat('<big>', '</big>', 'texto maior')}
                        className="px-2 py-1 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer text-[10px] font-black"
                        title="Fonte Maior (<big>texto</big>)"
                      >
                        A+
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFormat('<small>', '</small>', 'texto menor')}
                        className="px-2 py-1 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer text-[9px]"
                        title="Fonte Menor (<small>texto</small>)"
                      >
                        A-
                      </button>

                      <div className="h-4 w-px bg-stone-300 mx-0.5" />

                      <button
                        type="button"
                        onClick={() => applyFormat('<pink>', '</pink>', 'destaque rosa')}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                        title="Destaque Rosa (<pink>texto</pink>)"
                      >
                        <Sparkles size={11} className="text-rose-500" /> Destaque
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFormat('> ', '', 'citação de amor...')}
                        className="p-1.5 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                        title="Citação (> texto)"
                      >
                        <Quote size={13} />
                      </button>
                    </div>

                    <textarea
                      ref={textareaRef}
                      required
                      rows={6}
                      placeholder="Escreva seus sentimentos com carinho... Use a barra acima para formatar em negrito, itálico, sublinhado, tamanhos de fonte e destaques!"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs p-3.5 focus:outline-none font-medium leading-relaxed resize-y min-h-[140px]"
                    />
                  </div>
                ) : (
                  <div className="border border-slate-200 bg-white rounded-xl p-4 min-h-[160px] max-h-[250px] overflow-y-auto">
                    {content.trim() ? (
                      <FormattedLetterContent content={content} />
                    ) : (
                      <p className="text-xs text-stone-400 font-mono italic">
                        Nenhum texto digitado ainda... Alterne para a aba "Digitar" para escrever sua cartinha!
                      </p>
                    )}
                  </div>
                )}
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
                  <div className="space-y-2.5 bg-white border border-stone-200/50 p-4 rounded-xl max-w-md">
                    <label className="text-[8.5px] font-bold font-mono text-stone-500 block uppercase">
                      Data e Horário de Liberação:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block mb-1">Dia:</span>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={unlockDate}
                          onChange={(e) => setUnlockDate(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block mb-1">Horário:</span>
                        <input
                          type="time"
                          required
                          value={unlockTime}
                          onChange={(e) => setUnlockTime(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>

                    <span className="text-[8.5px] font-mono font-medium text-stone-500 block pt-0.5">
                      🔒 A carta ficará selada até <strong className="text-rose-600 font-bold">{unlockDate.split('-').reverse().join('/')} às {unlockTime}</strong>.
                    </span>
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
        <div className="bg-[#FAF6F0] border border-dashed border-[#E5D8C8] p-8 rounded-2xl text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-2 opacity-90">
            <LetterEnvelopeIllustration className="w-full h-full" strokeColor="#991B1B" />
          </div>
          <p className="text-xs text-stone-700 font-bold font-serif">Cápsula vazia no momento</p>
          <p className="text-[10px] text-stone-500 font-mono mt-1 font-semibold uppercase">Envie a primeira cartinha para guardar este momento especial!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {letters.map((item) => {
            const unlocked = isUnlocked(item);
            const { label: unlockLabel } = getUnlockDetails(item);

            return (
              <VintageEnvelopeCard
                key={item.id}
                letter={item}
                unlocked={unlocked}
                unlockLabel={unlockLabel}
                onOpen={handleOpenLetter}
                onDelete={handleDeleteLetter}
              />
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {letterToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLetterToDelete(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-rose-200 rounded-2xl p-6 max-w-xs w-full shadow-xl space-y-4 text-center relative z-50"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">Excluir Cartinha?</h3>
                <p className="text-xs text-stone-500 font-sans mt-1">
                  Tem certeza de que deseja apagar esta carta permanentemente? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLetterToDelete(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteLetter}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Excluir Carta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-[#FFFDF9] border border-rose-300/80 rounded-3xl p-7 md:p-9 max-w-2xl w-full max-h-[88vh] shadow-2xl relative flex flex-col justify-between overflow-hidden"
            >
              {/* Hand-Drawn Ribbon Frame Border SVG with soft opacity background */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25"
                viewBox="0 0 400 580"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Organic wavy line frame border */}
                <g stroke="#C82333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 230 18 C 280 17 340 19 368 24 C 382 28 386 45 385 95 C 384 175 387 285 385 385 C 383 465 386 525 370 543 C 350 551 260 549 190 550 C 120 551 52 550 32 543 C 16 525 19 465 17 385 C 15 285 18 175 17 95 C 16 45 20 28 35 24 C 60 19 120 17 170 18" />
                  <path d="M 18 375 C 17 435 18 505 30 540 C 48 553 120 554 190 554 C 260 554 320 553 340 547" strokeWidth="1" opacity="0.4" />
                </g>

                {/* Ribbon Bow & Hanging Hearts at top center */}
                <g transform="translate(200, 18)" stroke="#C82333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  {/* Left loop */}
                  <path d="M -3 0 C -24 -16 -38 4 -12 11 C -5 11 -1 3 -3 0 Z" fill="#FFFDF9" />
                  
                  {/* Right loop */}
                  <path d="M 3 0 C 24 -16 38 4 12 11 C 5 11 1 3 3 0 Z" fill="#FFFDF9" />

                  {/* Ribbon Knot */}
                  <circle cx="0" cy="1" r="2.5" fill="#C82333" />

                  {/* Left tail */}
                  <path d="M -3 3 C -9 12 -16 20 -22 26 M -22 26 C -20 24 -18 20 -19 16" />

                  {/* Right tail */}
                  <path d="M 3 3 C 9 12 16 20 22 26 M 22 26 C 20 24 18 20 19 16" />

                  {/* Two Dangling Hearts */}
                  <g transform="translate(0, 18)">
                    {/* Bigger Heart */}
                    <path
                      d="M -3 -1 C -6 -5 -10 -1 -10 2 C -10 5 -3 9 -3 11 C -3 9 4 5 4 2 C 4 -1 0 -5 -3 -1 Z"
                      strokeWidth="1.6"
                      fill="#FFFDF9"
                    />
                    {/* Smaller Heart */}
                    <path
                      d="M 3 6 C 1 4 -2 5 -2 7 C -2 9 3 11 3 13 C 3 11 8 9 8 7 C 8 5 5 4 3 6 Z"
                      strokeWidth="1.2"
                      fill="#FFFDF9"
                    />
                  </g>
                </g>
              </svg>

              {/* Fixed Header */}
              <div className="shrink-0 mb-2 relative pt-3 z-10">
                <div className="absolute right-0 top-0">
                  <WaxSeal isUnlocked={true} size="lg" />
                </div>
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 mb-3 text-[10px] font-mono font-extrabold text-stone-500 uppercase pr-14">
                  <span>De: <strong className="text-rose-600">{readingLetter.sender}</strong></span>
                  <span>Para: <strong className="text-rose-600">{readingLetter.recipient}</strong></span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-serif font-black text-stone-900 tracking-tight pr-14">
                  {readingLetter.title}
                </h3>
              </div>

              {/* Scrollable Letter Body */}
              <div className="overflow-y-auto my-2 pr-2.5 max-h-[58vh] space-y-3 flex-1 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-transparent z-10 relative">
                {readingLetter.audioUrl && (
                  <div className="my-2 p-3 bg-rose-50 border border-rose-200/80 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono font-bold text-rose-800 uppercase flex items-center gap-1">
                      <Mic size={12} className="text-rose-600 animate-pulse" /> Nota de Áudio Anexa:
                    </span>
                    <audio controls src={readingLetter.audioUrl} className="w-full h-9 accent-rose-500" />
                  </div>
                )}
                <FormattedLetterContent content={readingLetter.content} className="pl-3.5 border-l-2 border-rose-300 py-1" />
              </div>

              {/* Fixed Footer */}
              <div className="shrink-0 mt-3 border-t border-stone-200/50 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] font-mono text-stone-400 z-10 relative">
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
