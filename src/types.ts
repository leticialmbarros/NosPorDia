/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory =
  | 'Conchinha de Manutenção'
  | 'Date de Exploração'
  | 'Casa da Mãe - SM'
  | 'Compromissos de Trabalho'
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
  imageUrl?: string; // Optional photo for Date events
}

export interface PostIt {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  slotIndex: number; // 0 to 5 representing the 6 fixed slots
}

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string; dot: string }> = {
  'Conchinha de Manutenção': {
    bg: 'bg-rose-100/90',
    text: 'text-rose-900 font-extrabold',
    border: 'border-rose-400',
    dot: 'bg-rose-600 ring-1 ring-rose-200',
  },
  'Date de Exploração': {
    bg: 'bg-indigo-100/90',
    text: 'text-indigo-900 font-extrabold',
    border: 'border-indigo-400',
    dot: 'bg-indigo-600 ring-1 ring-indigo-200',
  },
  'Casa da Mãe - SM': {
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
  Outros: {
    bg: 'bg-slate-100/95',
    text: 'text-slate-900 font-extrabold',
    border: 'border-slate-400',
    dot: 'bg-slate-600 ring-1 ring-slate-200',
  },
};
