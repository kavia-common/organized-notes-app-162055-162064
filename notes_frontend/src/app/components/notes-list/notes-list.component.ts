import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Note } from '../../models/note.model';

/**
 * PUBLIC_INTERFACE
 * NotesListComponent shows a filterable list of notes.
 */
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent {
  @Input() set notes(val: Note[]) {
    this._notes.set(val ?? []);
  }
  @Input() activeId: string | null = null;

  @Output() select = new EventEmitter<Note>();

  private readonly _notes = signal<Note[]>([]);
  readonly sorted = computed(() =>
    this._notes()
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  );

  onSelect(note: Note) {
    this.select.emit(note);
  }

  trackById(_: number, n: Note) {
    return n.id;
  }
}
