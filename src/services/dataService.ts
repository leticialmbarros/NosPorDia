/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  increment,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../firebase';
import { CalendarEvent, PostIt, PlaylistItem, DateSuggestion, SecretLetter } from '../types';

// Mock DB for LocalStorage fallback
const EVENTS_KEY = 'curcumina_events';
const POSTITS_KEY = 'curcumina_postits';

const DEFAULT_EVENTS: CalendarEvent[] = [
  // dia 10/06 temos nosso date
  {
    id: 'seed-date-june-10',
    title: 'Próximo Date',
    description: 'Encontro romântico especial para celebrar nossa afinidade absoluta e encher o tanque de ocitocina!',
    date: '2026-06-10',
    category: 'Dates de Exploração',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },

  // dia 11/06 dormir juntos
  {
    id: 'seed-sleepover-june-11',
    title: 'Dormir Juntos Juntinhas 🛏️✨',
    description: 'Chamego termorregulado na cama para recarregar as energias.',
    date: '2026-06-11',
    category: 'Conchinhas de Manutenção',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },

  // 12/06 eduarda in poacity
  {
    id: 'seed-eduarda-june-12',
    title: 'Eduarda in POAcity 🏙️',
    description: 'Eduarda chegando em Porto Alegre! Encontro e comemorações.',
    date: '2026-06-12',
    category: 'Outros',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },

  // 13/06 eduarda in poacity
  {
    id: 'seed-eduarda-june-13',
    title: 'Eduarda in POAcity 🏙️',
    description: 'Aproveitando o final de semana com a Eduarda em Porto Alegre.',
    date: '2026-06-13',
    category: 'Outros',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },

  // dia 20/06 ela vem dormir comigo
  {
    id: 'seed-sleepover-june-20',
    title: 'Ela vem dormir comigo 🛏️💝',
    description: 'Noite especial juntinhas de puro dengo e carinho.',
    date: '2026-06-20',
    category: 'Conchinhas de Manutenção',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },

  // dia 19/20/21 de junho é a competição do arthur
  {
    id: 'seed-arthur-june-19',
    title: 'Competição do Arthur 🏆',
    description: 'Início da competição oficial do Arthur! Enviando todas as energias positivas.',
    date: '2026-06-19',
    category: 'Outros',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-arthur-june-20',
    title: 'Competição do Arthur (Finais) 🏆',
    description: 'Dia decisivo da competição do Arthur! Mandando muita torcida e força mental.',
    date: '2026-06-20',
    category: 'Outros',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-arthur-june-21',
    title: 'Competição do Arthur (Encerramento) 🏆',
    description: 'Último dia da competição e celebração dos resultados e do esforço incrível.',
    date: '2026-06-21',
    category: 'Outros',
    isRecurring: false,
    creator: 'Érica',
    createdAt: new Date().toISOString(),
  },

  // 26 a 29 ela está na casa da mãe novamente
  {
    id: 'seed-sm-june-26',
    title: 'Casa da Mãe (Santa Maria) 🚌',
    description: 'Retorno para Santa Maria para visitar a família e receber aquele chamego de mãe.',
    date: '2026-06-26',
    category: 'Hasta Home - SM',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-sm-june-27',
    title: 'Casa da Mãe (Santa Maria) 🚌',
    description: 'Passando o fim de semana com a família em Santa Maria.',
    date: '2026-06-27',
    category: 'Hasta Home - SM',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-sm-june-28',
    title: 'Casa da Mãe (Santa Maria) 🚌',
    description: 'Tempo com a mamãe em Santa Maria.',
    date: '2026-06-28',
    category: 'Hasta Home - SM',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-sm-june-29',
    title: 'Casa da Mãe (Santa Maria) 🚌',
    description: 'Último dia de retorno familiar em Santa Maria antes da volta.',
    date: '2026-06-29',
    category: 'Hasta Home - SM',
    isRecurring: false,
    creator: 'Letícia',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_POSTITS: PostIt[] = [
  {
    id: 'slot_0',
    text: 'Boa sorte na reunião hoje ❤️ sei que você vai arrasar!',
    author: 'Érica',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    slotIndex: 0,
  },
  {
    id: 'slot_1',
    text: 'Não esquece o artigo da orientadora! Ele está na pasta de Farmacodinâmica 📚',
    author: 'Letícia',
    createdAt: new Date().toISOString(),
    slotIndex: 1,
  },
  {
    id: 'slot_2',
    text: 'Estou com muita saudade... Conta as horas para o nosso fim de semana de descanso ✨',
    author: 'Érica',
    createdAt: new Date().toISOString(),
    slotIndex: 2,
  },
  {
    id: 'slot_3',
    text: 'Comprar curcumina em pó de alta pureza para temperar nossas receitas 🍳',
    author: 'Letícia',
    createdAt: new Date().toISOString(),
    slotIndex: 3,
  },
  {
    id: 'slot_4',
    text: 'Revisar a estrutura molecular da curcumina para a apresentação de sexta-feira 🧪',
    author: 'Letícia',
    createdAt: new Date().toISOString(),
    slotIndex: 4,
  },
  {
    id: 'slot_5',
    text: 'Que seu dia seja tão radiante quanto a cor do açafrão! Te amo! 🧪💛',
    author: 'Érica',
    createdAt: new Date().toISOString(),
    slotIndex: 5,
  },
];

function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Pub/Sub emitter for local mode across components
const listenersMap: Record<string, Set<any>> = {
  events: new Set(),
  postits: new Set(),
  pulses: new Set(),
  playlist: new Set(),
  suggestions: new Set(),
  letters: new Set(),
  pulseStats: new Set(),
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'curcumina_ocitocina_pulse' && e.newValue) {
      try {
        const payload = JSON.parse(e.newValue);
        if (listenersMap.pulses) {
          listenersMap.pulses.forEach((cb) => {
            try { cb(payload); } catch (_) {}
          });
        }
      } catch (_) {}
    }
    if (e.key === 'curcumina_ocitocina_pulse_count' && e.newValue) {
      if (listenersMap.pulseStats) {
        listenersMap.pulseStats.forEach((cb) => {
          try { cb({ count: Number(e.newValue) }); } catch (_) {}
        });
      }
    }
  });
}

function triggerLocalUpdate(type: 'events' | 'postits', data: any) {
  if (listenersMap[type]) {
    listenersMap[type].forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

// Helper to soft-migrate any old session categories/titles to the new ones
export function migrateEventCategories(evt: CalendarEvent): CalendarEvent {
  let cat = evt.category;
  let title = evt.title;
  let changed = false;

  if (cat as string === 'Porto Alegre' || cat as string === 'Compromisso') {
    cat = 'Outros';
    changed = true;
  } else if (cat as string === 'Santa Maria' || cat as string === 'Casa da Mãe - SM') {
    cat = 'Hasta Home - SM';
    changed = true;
  } else if (cat as string === 'Date' || cat as string === 'Date de Exploração') {
    cat = 'Dates de Exploração';
    changed = true;
  } else if (cat as string === 'Trabalho' || cat as string === 'Mestrado') {
    cat = 'Compromissos de Trabalho';
    changed = true;
  } else if (cat as string === 'Conchinha de Manutenção') {
    cat = 'Conchinhas de Manutenção';
    changed = true;
  } else if (cat as string === 'Dengo & Cinema em Casa') {
    cat = 'Dates em Casa';
    changed = true;
  } else if (cat as string === 'Momento Solo / Recarregar') {
    cat = 'Momentos Solo';
    changed = true;
  } else if (cat as string === 'Saúde & Autocuidado') {
    cat = 'Saúde&Autocuidado';
    changed = true;
  } else if (cat as string === 'Rolê com Amigos & Família') {
    cat = 'Rolês com Amigos & Família';
    changed = true;
  }
  
  if (evt.id === 'seed-sleepover-june-11' || evt.id === 'seed-sleepover-june-20') {
    if (cat !== 'Conchinhas de Manutenção') {
      cat = 'Conchinhas de Manutenção';
      changed = true;
    }
  }

  if (evt.id === 'seed-date-june-10' || evt.title === 'Nosso Date Especial 🕯️❤️') {
    if (title !== 'Próximo Date') {
      title = 'Próximo Date';
      changed = true;
    }
  }

  if (changed) {
    return { ...evt, category: cat, title };
  }
  return evt;
}

// LocalStorage helpers
function getLocalEvents(): CalendarEvent[] {
  const stored = localStorage.getItem(EVENTS_KEY);
  let parsed: CalendarEvent[];
  if (!stored) {
    parsed = [...DEFAULT_EVENTS];
  } else {
    try {
      parsed = JSON.parse(stored) as CalendarEvent[];
    } catch {
      parsed = [...DEFAULT_EVENTS];
    }
  }

  let migrated = false;
  const list = parsed.map((evt) => {
    const migratedEvt = migrateEventCategories(evt);
    if (migratedEvt.category !== evt.category || migratedEvt.title !== evt.title) {
      migrated = true;
    }
    return migratedEvt;
  });

  if (migrated || !stored) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
  }
  return list;
}

function setLocalEvents(events: CalendarEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  triggerLocalUpdate('events', [...events]);
}

function getLocalPostIts(): PostIt[] {
  const stored = localStorage.getItem(POSTITS_KEY);
  if (!stored) {
    localStorage.setItem(POSTITS_KEY, JSON.stringify(DEFAULT_POSTITS));
    return [...DEFAULT_POSTITS];
  }
  
  try {
    const list = JSON.parse(stored) as PostIt[];
    let migrated = false;
    const mapped = list.map((p) => {
      const canonicalId = `slot_${p.slotIndex}`;
      if (p.id !== canonicalId) {
        migrated = true;
        return { ...p, id: canonicalId };
      }
      return p;
    });
    if (migrated) {
      localStorage.setItem(POSTITS_KEY, JSON.stringify(mapped));
    }
    return mapped;
  } catch {
    localStorage.setItem(POSTITS_KEY, JSON.stringify(DEFAULT_POSTITS));
    return [...DEFAULT_POSTITS];
  }
}

function setLocalPostIts(postits: PostIt[]) {
  localStorage.setItem(POSTITS_KEY, JSON.stringify(postits));
  triggerLocalUpdate('postits', [...postits]);
}

let seedingPromise: Promise<void> | null = null;

async function seedDatabaseIfNeeded(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const eventsSnap = await getDocs(collection(db, 'events'));
    if (eventsSnap.empty) {
      console.log('Seeding initial events to Firestore...');
      for (const evt of DEFAULT_EVENTS) {
        await addDoc(collection(db, 'events'), {
          title: evt.title,
          description: evt.description,
          date: evt.date,
          category: evt.category,
          isRecurring: evt.isRecurring,
          recurringDays: evt.recurringDays || null,
          creator: evt.creator,
          createdAt: evt.createdAt,
          imageUrl: evt.imageUrl || null,
        });
      }
    }
  } catch (error) {
    console.error('Failed to seed events:', error);
  }

  try {
    const postitsSnap = await getDocs(collection(db, 'postits'));
    if (postitsSnap.empty) {
      console.log('Seeding initial postits to Firestore...');
      for (const p of DEFAULT_POSTITS) {
        await setDoc(doc(db, 'postits', p.id), {
          id: p.id,
          text: p.text,
          author: p.author,
          slotIndex: p.slotIndex,
          createdAt: p.createdAt,
        });
      }
    }
  } catch (error) {
    console.error('Failed to seed postits:', error);
  }
}

function ensureSeeded() {
  if (!seedingPromise) {
    seedingPromise = seedDatabaseIfNeeded();
  }
  return seedingPromise;
}

// EXPORTED SERVICES
export const dataService = {
  /**
   * Subscribe to shared events.
   * Leverages Firebase Firestore if loaded, otherwise falls back to window local storage persistence
   */
  subscribeEvents(callback: (events: CalendarEvent[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      ensureSeeded();
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventsList: CalendarEvent[] = [];
          snapshot.forEach((docSnap) => {
            const rawEvent = {
              id: docSnap.id,
              ...(docSnap.data() as Omit<CalendarEvent, 'id'>),
            };
            eventsList.push(migrateEventCategories(rawEvent));
          });
          callback(eventsList);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'events');
        },
      );
      return unsubscribe;
    } else {
      // Offline fallback
      listenersMap.events.add(callback);
      // Send initial data immediately
      const current = getLocalEvents();
      callback(current);
      return () => {
        listenersMap.events.delete(callback);
      };
    }
  },

  async addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<void> {
    const newEvent: CalendarEvent = {
      ...event,
      id: isFirebaseConfigured ? '' : 'evt-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'events'), {
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          endDate: newEvent.endDate || null,
          category: newEvent.category,
          isRecurring: newEvent.isRecurring,
          recurringDays: newEvent.recurringDays || null,
          creator: newEvent.creator,
          createdAt: newEvent.createdAt,
          imageUrl: newEvent.imageUrl || null,
          imageUrl2: newEvent.imageUrl2 || null,
          imageUrl3: newEvent.imageUrl3 || null,
          videoUrl: newEvent.videoUrl || null,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'events');
      }
    } else {
      const current = getLocalEvents();
      current.push(newEvent);
      setLocalEvents(current);
    }
  },

  async updateEvent(id: string, updatedFields: Partial<CalendarEvent>): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const ref = doc(db, 'events', id);
        // Clean undefined or opt keys, clear explicitly optional ones on server as null
        const cleaned: Record<string, any> = {};
        Object.entries(updatedFields).forEach(([k, v]) => {
          if (v !== undefined) {
            cleaned[k] = v;
          } else {
            if (k === 'imageUrl' || k === 'imageUrl2' || k === 'imageUrl3' || k === 'videoUrl' || k === 'endDate' || k === 'recurringDays') {
              cleaned[k] = null;
            }
          }
        });
        await updateDoc(ref, cleaned);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
      }
    } else {
      const current = getLocalEvents();
      const idx = current.findIndex((e) => e.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updatedFields };
        setLocalEvents(current);
      }
    }
  },

  async deleteEvent(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
      }
    } else {
      const current = getLocalEvents();
      const filtered = current.filter((e) => e.id !== id);
      setLocalEvents(filtered);
    }
  },

  /**
   * Subscribe to Post-it messages
   */
  subscribePostIts(callback: (postIts: PostIt[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      ensureSeeded();
      const q = query(collection(db, 'postits'), orderBy('slotIndex', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: PostIt[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<PostIt, 'id'>),
            });
          });
          callback(list);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'postits');
        },
      );
      return unsubscribe;
    } else {
      listenersMap.postits.add(callback);
      const current = getLocalPostIts();
      callback(current);
      return () => {
        listenersMap.postits.delete(callback);
      };
    }
  },

  async savePostIt(text: string, author: string, slotIndex: number, id?: string, createdAt?: string): Promise<void> {
    if (slotIndex < 0 || slotIndex >= 6) {
      throw new Error('Post-it slotIndex must be between 0 and 5 inclusive.');
    }

    const docId = id || `slot_${slotIndex}`;
    const payload = {
      text,
      author,
      slotIndex,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'postits', docId);
        await setDoc(docRef, {
          ...payload,
          id: docId,
          createdAt: createdAt || new Date().toISOString(),
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `postits/${docId}`);
      }
    } else {
      const current = getLocalPostIts();
      
      // Clean up any entry that occupies the same slot or has the same ID to prevent duplicates completely
      const cleaned = current.filter((p) => p.slotIndex !== slotIndex && p.id !== docId);
      
      cleaned.push({
        id: docId,
        text,
        author,
        slotIndex,
        createdAt: createdAt || new Date().toISOString(),
      });
      
      setLocalPostIts(cleaned);
    }
  },

  async deletePostIt(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'postits', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `postits/${id}`);
      }
    } else {
      const current = getLocalPostIts();
      const filtered = current.filter((p) => p.id !== id);
      setLocalPostIts(filtered);
    }
  },

  async clearAllPostIts(): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        // Read all and delete sequentially for complete wipe
        const snaps = await getDocs(collection(db, 'postits'));
        const deletePromises: Promise<void>[] = [];
        snaps.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, 'postits', docSnap.id)));
        });
        await Promise.all(deletePromises);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'postits');
      }
    } else {
      setLocalPostIts([]);
    }
  },

  subscribeOcitocinaPulse(callback: (pulse: { sender: string; timestamp: string } | null) => void): () => void {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(
        doc(db, 'pulses', 'current'),
        (snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.data() as { sender: string; timestamp: string });
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('Error listening to pulses:', error);
        }
      );
      return unsub;
    } else {
      listenersMap.pulses.add(callback);
      const stored = localStorage.getItem('curcumina_ocitocina_pulse');
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch (_) {}
      } else {
        callback(null);
      }
      return () => {
        listenersMap.pulses.delete(callback);
      };
    }
  },

  async sendOcitocinaPulse(sender: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const payload = { sender, timestamp };
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'pulses', 'current'), payload);
        await setDoc(doc(db, 'pulses', 'stats'), {
          count: increment(1)
        }, { merge: true });
      } catch (error) {
        console.error('Failed to send pulse to Firestore:', error);
      }
    } else {
      localStorage.setItem('curcumina_ocitocina_pulse', JSON.stringify(payload));
      const currentCount = Number(localStorage.getItem('curcumina_ocitocina_pulse_count') || '0') + 1;
      localStorage.setItem('curcumina_ocitocina_pulse_count', String(currentCount));
      
      if (listenersMap.pulses) {
        listenersMap.pulses.forEach((cb) => {
          try { cb(payload); } catch (_) {}
        });
      }
      if (listenersMap.pulseStats) {
        listenersMap.pulseStats.forEach((cb) => {
          try { cb({ count: currentCount }); } catch (_) {}
        });
      }
    }
  },

  subscribePulseStats(callback: (stats: { count: number }) => void): () => void {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(
        doc(db, 'pulses', 'stats'),
        (snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.data() as { count: number });
          } else {
            callback({ count: 0 });
          }
        },
        (error) => {
          console.error('Error listening to pulse stats:', error);
        }
      );
      return unsub;
    } else {
      listenersMap.pulseStats.add(callback);
      const currentCount = Number(localStorage.getItem('curcumina_ocitocina_pulse_count') || '0');
      callback({ count: currentCount });
      return () => {
        listenersMap.pulseStats.delete(callback);
      };
    }
  },

  subscribePlaylist(callback: (playlist: PlaylistItem[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'playlist'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: PlaylistItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<PlaylistItem, 'id'>),
            });
          });
          callback(list);
        },
        (error) => {
          console.error('Error listening to playlist:', error);
        }
      );
      return unsubscribe;
    } else {
      listenersMap.playlist.add(callback);
      const stored = localStorage.getItem('curcumina_playlist');
      let parsed: PlaylistItem[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      callback(parsed);
      return () => {
        listenersMap.playlist.delete(callback);
      };
    }
  },

  async addPlaylistItem(title: string, url: string, creator: string, artist?: string): Promise<void> {
    const payload: Omit<PlaylistItem, 'id'> = {
      title,
      url,
      creator,
      createdAt: new Date().toISOString(),
      artist: artist || '',
    };
    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'playlist'), payload);
    } else {
      const stored = localStorage.getItem('curcumina_playlist');
      let parsed: PlaylistItem[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const newItem = {
        id: 'pl-' + Math.random().toString(36).substr(2, 9),
        ...payload,
      };
      parsed.push(newItem);
      localStorage.setItem('curcumina_playlist', JSON.stringify(parsed));
      if (listenersMap.playlist) {
        listenersMap.playlist.forEach((cb) => {
          try { cb(parsed); } catch (_) {}
        });
      }
    }
  },

  async deletePlaylistItem(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'playlist', id));
    } else {
      const stored = localStorage.getItem('curcumina_playlist');
      let parsed: PlaylistItem[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const filtered = parsed.filter((item) => item.id !== id);
      localStorage.setItem('curcumina_playlist', JSON.stringify(filtered));
      if (listenersMap.playlist) {
        listenersMap.playlist.forEach((cb) => {
          try { cb(filtered); } catch (_) {}
        });
      }
    }
  },

  subscribeDateSuggestions(callback: (suggestions: DateSuggestion[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: DateSuggestion[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<DateSuggestion, 'id'>),
            });
          });
          callback(list);
        },
        (error) => {
          console.error('Error listening to suggestions:', error);
        }
      );
      return unsubscribe;
    } else {
      listenersMap.suggestions.add(callback);
      const stored = localStorage.getItem('curcumina_suggestions');
      let parsed: DateSuggestion[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      } else {
        parsed = [
          {
            id: 'sug-1',
            placeName: 'Parque Farroupilha (Redenção)',
            instagramHandle: '@parquedaredencao',
            locationText: 'Porto Alegre - RS',
            isChecked: true,
            creator: 'Letícia',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sug-2',
            placeName: 'Fazer piquenique no Gasômetro',
            instagramHandle: '@orladogasometro',
            locationText: 'Porto Alegre - RS',
            isChecked: false,
            creator: 'Érica',
            createdAt: new Date().toISOString(),
          }
        ];
        localStorage.setItem('curcumina_suggestions', JSON.stringify(parsed));
      }
      callback(parsed);
      return () => {
        listenersMap.suggestions.delete(callback);
      };
    }
  },

  async addDateSuggestion(placeName: string, instagramHandle: string, locationText: string, creator: string, tags?: string[]): Promise<void> {
    const payload: Omit<DateSuggestion, 'id'> = {
      placeName,
      instagramHandle: instagramHandle?.trim() || null,
      locationText: locationText?.trim() || null,
      isChecked: false,
      creator,
      createdAt: new Date().toISOString(),
      tags: tags || [],
    };
    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'suggestions'), payload);
    } else {
      const stored = localStorage.getItem('curcumina_suggestions');
      let parsed: DateSuggestion[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const newItem = {
        id: 'sug-' + Math.random().toString(36).substr(2, 9),
        ...payload,
      };
      parsed.push(newItem);
      localStorage.setItem('curcumina_suggestions', JSON.stringify(parsed));
      if (listenersMap.suggestions) {
        listenersMap.suggestions.forEach((cb) => {
          try { cb(parsed); } catch (_) {}
        });
      }
    }
  },

  async updateDateSuggestion(id: string, updatedFields: Partial<DateSuggestion>): Promise<void> {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'suggestions', id);
      await updateDoc(ref, updatedFields);
    } else {
      const stored = localStorage.getItem('curcumina_suggestions');
      let parsed: DateSuggestion[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const idx = parsed.findIndex((s) => s.id === id);
      if (idx !== -1) {
        parsed[idx] = { ...parsed[idx], ...updatedFields };
        localStorage.setItem('curcumina_suggestions', JSON.stringify(parsed));
        if (listenersMap.suggestions) {
          listenersMap.suggestions.forEach((cb) => {
            try { cb(parsed); } catch (_) {}
          });
        }
      }
    }
  },

  async deleteDateSuggestion(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'suggestions', id));
    } else {
      const stored = localStorage.getItem('curcumina_suggestions');
      let parsed: DateSuggestion[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const filtered = parsed.filter((s) => s.id !== id);
      localStorage.setItem('curcumina_suggestions', JSON.stringify(filtered));
      if (listenersMap.suggestions) {
        listenersMap.suggestions.forEach((cb) => {
          try { cb(filtered); } catch (_) {}
        });
      }
    }
  },

  subscribeLetters(callback: (letters: SecretLetter[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'letters'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: SecretLetter[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<SecretLetter, 'id'>),
            });
          });
          callback(list);
        },
        (error) => {
          console.error('Error listening to letters:', error);
        }
      );
      return unsubscribe;
    } else {
      listenersMap.letters.add(callback);
      const stored = localStorage.getItem('curcumina_letters');
      let parsed: SecretLetter[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      } else {
        parsed = [
          {
            id: 'welcome-letter',
            title: 'Nossa Primeira Cápsula do Tempo 🌌❤️',
            content: 'Bem-vinda ao nosso baú de cartinhas secretas! Aqui podemos escrever cartinhas de amor uma para a outra e guardá-las em cápsulas do tempo virtuais, configurando para abrir somente em datas especiais (como nosso aniversário de namoro) ou após acumularem novos pulsos de ocitocina uma para a outra! Escreva a primeira cartinha clicando no botão abaixo! Com todo amor do mundo, Érica & Letícia.',
            sender: 'Érica',
            recipient: 'Letícia',
            createdAt: new Date().toISOString(),
            unlockType: 'date',
            unlockValue: new Date().toISOString().split('T')[0],
            isOpened: true,
            createdPulseCount: 0
          }
        ];
        localStorage.setItem('curcumina_letters', JSON.stringify(parsed));
      }
      callback(parsed);
      return () => {
        listenersMap.letters.delete(callback);
      };
    }
  },

  async addLetter(
    title: string,
    content: string,
    sender: string,
    recipient: string,
    unlockType: 'date' | 'pulses',
    unlockValue: string,
    createdPulseCount: number
  ): Promise<void> {
    const payload: Omit<SecretLetter, 'id'> = {
      title,
      content,
      sender,
      recipient,
      unlockType,
      unlockValue,
      createdAt: new Date().toISOString(),
      isOpened: false,
      createdPulseCount,
    };
    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'letters'), payload);
    } else {
      const stored = localStorage.getItem('curcumina_letters');
      let parsed: SecretLetter[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const newItem = {
        id: 'letter-' + Math.random().toString(36).substr(2, 9),
        ...payload,
      };
      parsed.push(newItem);
      localStorage.setItem('curcumina_letters', JSON.stringify(parsed));
      if (listenersMap.letters) {
        listenersMap.letters.forEach((cb) => {
          try { cb(parsed); } catch (_) {}
        });
      }
    }
  },

  async updateLetter(id: string, updatedFields: Partial<SecretLetter>): Promise<void> {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'letters', id);
      await updateDoc(ref, updatedFields);
    } else {
      const stored = localStorage.getItem('curcumina_letters');
      let parsed: SecretLetter[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const idx = parsed.findIndex((l) => l.id === id);
      if (idx !== -1) {
        parsed[idx] = { ...parsed[idx], ...updatedFields };
        localStorage.setItem('curcumina_letters', JSON.stringify(parsed));
        if (listenersMap.letters) {
          listenersMap.letters.forEach((cb) => {
            try { cb(parsed); } catch (_) {}
          });
        }
      }
    }
  },

  async deleteLetter(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'letters', id));
    } else {
      const stored = localStorage.getItem('curcumina_letters');
      let parsed: SecretLetter[] = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (_) {}
      }
      const filtered = parsed.filter((l) => l.id !== id);
      localStorage.setItem('curcumina_letters', JSON.stringify(filtered));
      if (listenersMap.letters) {
        listenersMap.letters.forEach((cb) => {
          try { cb(filtered); } catch (_) {}
        });
      }
    }
  },
};
