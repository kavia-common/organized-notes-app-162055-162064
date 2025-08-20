import { Injectable, signal, computed } from '@angular/core';
import { Note } from '../models/note.model';

/**
 * PUBLIC_INTERFACE
 * NotesService manages CRUD operations and in-memory storage for notes.
 * In a future iteration this can be replaced with API backed storage.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  /** Internal signal holding all notes */
  private readonly _notes = signal<Note[]>([]);
  /** Computed unique categories from notes */
  readonly categories = computed<string[]>(() => {
    const set = new Set(this._notes().map(n => (n.category || '').trim()).filter(Boolean));
    return Array.from(set).sort();
  });
  /** Computed unique tags from notes */
  readonly tags = computed<string[]>(() => {
    const set = new Set<string>();
    this._notes().forEach(n => (n.tags || []).forEach(t => set.add((t || '').trim())));
    return Array.from(set).filter(Boolean).sort();
  });
  /** Expose notes for read */
  readonly notes = computed<Note[]>(() => this._notes());

  constructor() {
    // Load from localStorage if exists
    try {
      const g: any = typeof globalThis !== 'undefined' ? globalThis : {};
      const storage = g && g.localStorage ? (g.localStorage as any) : null;
      const raw = storage ? storage.getItem('notes_data_v1') : null;
      if (raw) {
        const parsed: Note[] = JSON.parse(raw);
        this._notes.set(parsed);
      } else {
        // seed with one welcome note
        const now = new Date().toISOString();
        this._notes.set([
          {
            id: this.uuid(),
            title: 'Welcome to Organized Notes',
            content:
              'Use the + New Note button to add notes. Filter by category or tags from the sidebar, and search from the top bar.',
            category: 'General',
            tags: ['welcome', 'tips'],
            createdAt: now,
            updatedAt: now
          }
        ]);
        this.persist();
      }
    } catch {
      // ignore storage issues in non-browser contexts
    }
  }

  /** Persist current notes to localStorage */
  private persist(): void {
    try {
      const g: any = typeof globalThis !== 'undefined' ? globalThis : {};
      const storage = g && g.localStorage ? (g.localStorage as Storage) : null;
      if (storage) {
        storage.setItem('notes_data_v1', JSON.stringify(this._notes()));
      }
    } catch {
      // ignore
    }
  }

  private uuid(): string {
    try {
      const g: any = typeof globalThis !== 'undefined' ? globalThis : {};
      if (g && g.crypto && typeof g.crypto.randomUUID === 'function') {
        return g.crypto.randomUUID();
      }
    } catch {
      // ignore
    }
    // Fallback UUID v4-ish
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note.
   */
  createNote(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: this.uuid(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    this._notes.update(list => [note, ...list]);
    this.persist();
    return note;
  }

  /**
   * PUBLIC_INTERFACE
   * Update a note by id.
   */
  updateNote(id: string, changes: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | undefined {
    let updated: Note | undefined;
    this._notes.update(list =>
      list.map(n => {
        if (n.id !== id) return n;
        updated = { ...n, ...changes, updatedAt: new Date().toISOString() };
        return updated!;
      })
    );
    this.persist();
    return updated;
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a note by id.
   */
  deleteNote(id: string): void {
    this._notes.update(list => list.filter(n => n.id !== id));
    this.persist();
  }

  /**
   * PUBLIC_INTERFACE
   * Get a single note.
   */
  getNote(id: string): Note | undefined {
    return this._notes().find(n => n.id === id);
  }
}
