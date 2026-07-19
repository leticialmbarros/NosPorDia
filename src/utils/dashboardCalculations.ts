/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalendarEvent } from '../types';

/**
 * Parses YYYY-MM-DD into a safe local Date object
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format date to PT-BR string: DD/MM/YYYY
 */
export function formatDateBr(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Format date to short readable string: DD de Month
 */
export function formatShortDateBr(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const monthsBr = [
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
  const monthName = monthsBr[parseInt(month, 10) - 1];
  return `${parseInt(day, 10)} de ${monthName}`;
}

/**
 * Checks if a specific event occurs on a target date YYYY-MM-DD
 */
export function isEventOnDate(event: CalendarEvent, targetDateStr: string): boolean {
  const targetTime = parseLocalDate(targetDateStr).getTime();
  const startTime = parseLocalDate(event.date).getTime();

  if (event.endDate) {
    const endTime = parseLocalDate(event.endDate).getTime();
    if (targetTime >= startTime && targetTime <= endTime) {
      return true;
    }
    // If recurring with an endDate range, check if the relative day offset falls inside any recurrence cycle duration
    if (event.isRecurring && event.recurringDays) {
      const durationMs = endTime - startTime;
      const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
      
      const diffMs = targetTime - startTime;
      if (diffMs < 0) return false;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const cycleIndex = Math.floor(diffDays / event.recurringDays);
      const cycleStartDay = cycleIndex * event.recurringDays;
      return diffDays >= cycleStartDay && diffDays <= cycleStartDay + durationDays;
    }
    return false;
  }

  // Single date event
  if (event.date === targetDateStr) return true;
  if (!event.isRecurring || !event.recurringDays) return false;

  if (targetTime < startTime) return false;

  const diffMs = targetTime - startTime;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays % event.recurringDays === 0;
}

/**
 * Helper to expand occurrences of an event in a date range (start to end dates)
 */
export function expandEventOccurrences(
  event: CalendarEvent,
  startDateStr: string,
  endDateStr: string,
): string[] {
  const occurrences: string[] = [];
  const start = parseLocalDate(startDateStr);
  const end = parseLocalDate(endDateStr);

  const iterDate = new Date(start);
  while (iterDate <= end) {
    const yyyy = iterDate.getFullYear();
    const mm = String(iterDate.getMonth() + 1).padStart(2, '0');
    const dd = String(iterDate.getDate()).padStart(2, '0');
    const curDateStr = `${yyyy}-${mm}-${dd}`;

    if (isEventOnDate(event, curDateStr)) {
      occurrences.push(curDateStr);
    }
    iterDate.setDate(iterDate.getDate() + 1);
  }

  return occurrences;
}

/**
 * Get closest future occurrence date for a single event starting from a target date
 */
export function getNextOccurrenceOfEvent(event: CalendarEvent, fromDateStr: string): string | null {
  const refTime = parseLocalDate(fromDateStr).getTime();
  const startTime = parseLocalDate(event.date).getTime();

  // Non-recurring with endDate duration
  if (event.endDate && (!event.isRecurring || !event.recurringDays)) {
    const endTime = parseLocalDate(event.endDate).getTime();
    if (refTime <= startTime) return event.date;
    if (refTime <= endTime) return fromDateStr; // Ongoing today
    return null;
  }

  // Recurring with endDate duration
  if (event.endDate && event.isRecurring && event.recurringDays) {
    const endTime = parseLocalDate(event.endDate).getTime();
    const durationMs = endTime - startTime;
    const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
    const rDays = event.recurringDays;

    if (refTime <= startTime) return event.date;

    const diffMs = refTime - startTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const cycleIndex = Math.floor(diffDays / rDays);
    const cycleStartDay = cycleIndex * rDays;

    if (diffDays >= cycleStartDay && diffDays <= cycleStartDay + durationDays) {
      return fromDateStr; // Ongoing in this cycle today
    }

    const nextCycleStartDay = (cycleIndex + 1) * rDays;
    const nextDate = parseLocalDate(event.date);
    nextDate.setDate(nextDate.getDate() + nextCycleStartDay);
    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Original single date logic
  if (!event.isRecurring || !event.recurringDays) {
    return startTime >= refTime ? event.date : null;
  }

  if (startTime >= refTime) {
    return event.date;
  }

  const diffMs = refTime - startTime;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const rDays = event.recurringDays;
  const cycles = Math.ceil(diffDays / rDays);

  const nextDate = parseLocalDate(event.date);
  nextDate.setDate(nextDate.getDate() + cycles * rDays);

  const yyyy = nextDate.getFullYear();
  const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
  const dd = String(nextDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export interface DashboardStats {
  nextSantaMaria: {
    title: string;
    date: string | null;
    daysLeft: number | null;
  };
  nextDateExploracao: {
    title: string;
    date: string | null;
    daysLeft: number | null;
  } | null;
  daysToNextMeetup: number | null; // closest of 'Date' or travels 'Santa Maria' / 'Porto Alegre'
  monthEventsCount: number;
  trialPeriod: {
    daysElapsed: number;
    startDate: string;
    status: string;
  };
}

export function stripEmojis(text: string): string {
  return text
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF]/g, '')
    .replace(/[\u2000-\u3300]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function shouldEventCountMonthly(evt: CalendarEvent): boolean {
  if (
    evt.category === 'Dates de Exploração' ||
    evt.category === 'Dates em Casa' ||
    evt.category === 'Conchinhas de Manutenção' ||
    evt.category === 'Viagens & Aventuras'
  ) {
    return true;
  }
  if (evt.category === 'Rolês com Amigos & Família' || evt.category === 'Outros') {
    return !!evt.includeInMonthlyCount;
  }
  return false;
}

export function calculateDashboardStats(
  events: CalendarEvent[],
  todayStr: string,
  viewedYear: number,
  viewedMonth: number, // 0-indexed (0 = Jan)
): DashboardStats {
  // 1. Next "Santa Maria" travel
  let nextSmDate: string | null = null;
  let nextSmEventTitle = '';
  let minSmDays: number | null = null;

  // 2. Next Date de Exploração
  let nextDateDate: string | null = null;
  let nextDateTitle = '';
  let minDateDays: number | null = null;

  // 3. Next meetup days
  let minDaysToMeetup: number | null = null;

  const todayTime = parseLocalDate(todayStr).getTime();

  events.forEach((evt) => {
    const nextOccurDate = getNextOccurrenceOfEvent(evt, todayStr);
    if (!nextOccurDate) return;

    const occurTime = parseLocalDate(nextOccurDate).getTime();
    const diffMs = occurTime - todayTime;
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // Evaluate Santa Maria (Hasta Home - SM) Voyages
    if (evt.category === 'Hasta Home - SM') {
      if (minSmDays === null || diffDays < minSmDays) {
        minSmDays = diffDays;
        nextSmDate = nextOccurDate;
        nextSmEventTitle = evt.title;
      }
    }

    // Evaluate Next Date de Exploração
    if (evt.category === 'Dates de Exploração') {
      if (minDateDays === null || diffDays < minDateDays) {
        minDateDays = diffDays;
        nextDateDate = nextOccurDate;
        nextDateTitle = evt.title;
      }
    }

    // Evaluate Meetup index (using the dynamic monthly count rule)
    if (shouldEventCountMonthly(evt)) {
      if (minDaysToMeetup === null || diffDays < minDaysToMeetup) {
        minDaysToMeetup = diffDays;
      }
    }
  });

  // Calculate occurrences in the viewed month
  // Generate first and last days of the viewed month as strings
  const firstDayStr = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(viewedYear, viewedMonth + 1, 0).getDate();
  const lastDayStr = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  let totalOccurrencesInMonth = 0;
  events.forEach((evt) => {
    if (shouldEventCountMonthly(evt)) {
      const occurs = expandEventOccurrences(evt, firstDayStr, lastDayStr);
      totalOccurrencesInMonth += occurs.length;
    }
  });

  // Calculate trial period elapsed days (Beta phase since March 3, 2026)
  const trialStartDateStr = '2026-03-03';
  const startRef = parseLocalDate(trialStartDateStr).getTime();
  const todayRef = parseLocalDate(todayStr).getTime();
  const elapsedMs = todayRef - startRef;
  const daysElapsed = Math.max(0, Math.round(elapsedMs / (1000 * 60 * 60 * 24)));

  return {
    nextSantaMaria: {
      title: nextSmEventTitle || 'Nenhuma viagem agendada',
      date: nextSmDate,
      daysLeft: minSmDays,
    },
    nextDateExploracao: nextDateDate
      ? {
          title: stripEmojis(nextDateTitle),
          date: nextDateDate,
          daysLeft: minDateDays,
        }
      : null,
    daysToNextMeetup: minDaysToMeetup,
    monthEventsCount: totalOccurrencesInMonth,
    trialPeriod: {
      daysElapsed,
      startDate: trialStartDateStr,
      status: 'Resultado: impossível reproduzir os efeitos observados quando você está por perto.',
    },
  };
}
