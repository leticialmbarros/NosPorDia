/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory =
  | 'Conchinhas de Manutenção'
  | 'Dates de Exploração'
  | 'Hasta Home - SM'
  | 'Compromissos de Trabalho'
  | 'Saúde&Autocuidado'
  | 'Momentos Solo'
  | 'Dates em Casa'
  | 'Viagens & Aventuras'
  | 'Rolês com Amigos & Família'
  | 'Outros';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // Optional YYYY-MM-DD for multi-day range
  category: EventCategory;
  isRecurring: boolean;
  recurringDays?: number; // Frequency in days, e.g. 15 for every 15 days
  creator: string;
  createdAt: string;
  imageUrl?: string; // Optional photo for Date events (Photo 1)
  imageUrl2?: string; // Optional Photo 2 for photo dumps
  imageUrl3?: string; // Optional Photo 3 for photo dumps
  videoUrl?: string; // Optional video URL or direct Base64 video
  locationText?: string; // Address or place location
  instagramHandle?: string; // Instagram handle starting with @
  relatedDateSuggestionId?: string; // Associated date suggestion
  includeInMonthlyCount?: boolean; // If event counts towards monthly conference
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  url: string;
  creator: string;
  createdAt: string;
}

export interface DateSuggestion {
  id: string;
  placeName: string;
  instagramHandle?: string; // e.g. @nome_do_lugar
  locationText?: string; // Textual location or address
  isChecked: boolean;
  creator: string;
  createdAt: string;
  checkedBy?: string;
  checkedAt?: string;
  tags?: string[];
}

export interface PostIt {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  slotIndex: number; // 0 to 5 representing the 6 fixed slots
}

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string; dot: string }> = {
  'Conchinhas de Manutenção': {
    bg: 'bg-rose-100/90',
    text: 'text-rose-900 font-extrabold',
    border: 'border-rose-400',
    dot: 'bg-rose-600 ring-1 ring-rose-200',
  },
  'Dates de Exploração': {
    bg: 'bg-indigo-100/90',
    text: 'text-indigo-900 font-extrabold',
    border: 'border-indigo-400',
    dot: 'bg-indigo-600 ring-1 ring-indigo-200',
  },
  'Hasta Home - SM': {
    bg: 'bg-emerald-100/90',
    text: 'text-emerald-900 font-extrabold',
    border: 'border-emerald-400',
    dot: 'bg-emerald-600 ring-1 ring-emerald-200',
  },
  'Compromissos de Trabalho': {
    bg: 'bg-blue-100/90',
    text: 'text-blue-900 font-extrabold',
    border: 'border-blue-400',
    dot: 'bg-blue-600 ring-1 ring-blue-200',
  },
  'Saúde&Autocuidado': {
    bg: 'bg-teal-100/90',
    text: 'text-teal-900 font-extrabold',
    border: 'border-teal-400',
    dot: 'bg-teal-600 ring-1 ring-teal-200',
  },
  'Momentos Solo': {
    bg: 'bg-purple-100/90',
    text: 'text-purple-900 font-extrabold',
    border: 'border-purple-400',
    dot: 'bg-purple-600 ring-1 ring-purple-200',
  },
  'Dates em Casa': {
    bg: 'bg-pink-100/90',
    text: 'text-pink-900 font-extrabold',
    border: 'border-pink-400',
    dot: 'bg-pink-600 ring-1 ring-pink-200',
  },
  'Viagens & Aventuras': {
    bg: 'bg-sky-100/90',
    text: 'text-sky-900 font-extrabold',
    border: 'border-sky-400',
    dot: 'bg-sky-600 ring-1 ring-sky-200',
  },
  'Rolês com Amigos & Família': {
    bg: 'bg-orange-100/90',
    text: 'text-orange-900 font-extrabold',
    border: 'border-orange-400',
    dot: 'bg-orange-600 ring-1 ring-orange-200',
  },
  Outros: {
    bg: 'bg-slate-100/95',
    text: 'text-slate-900 font-extrabold',
    border: 'border-slate-400',
    dot: 'bg-slate-600 ring-1 ring-slate-200',
  },
};

export interface SecretLetter {
  id: string;
  title: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: string;
  unlockType: 'date' | 'pulses';
  unlockValue: string; // Date (YYYY-MM-DD) or number of pulses required
  isOpened: boolean;
  createdPulseCount?: number; // Number of pulses at creation time
  audioUrl?: string; // Optional recorded audio note
}

export interface CompoundEssay {
  id: string; // 'ensaio-01', etc.
  essayNumber: number; // 1 to 14
  title: string; // 'ENSAIO 01'
  unlockDate: string; // 'YYYY-MM-DD'
  unlockTime: string; // 'HH:mm'
  enigma: string;
  sampleReleased: string;
}

export interface CompoundHypothesis {
  id: string;
  essayNumber: number;
  hypothesis: string;
  author: string; // 'Letícia' or 'Érica'
  submittedAt: string;
}

