import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { NotesService } from './services/notes.service';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TopbarComponent,
    SidebarComponent,
    NotesListComponent,
    NoteEditorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Organized Notes';

  // State
  search = signal<string>('');
  activeCategory = signal<string | null>(null);
  activeTag = signal<string | null>(null);
  selected: Note | null = null;
  editorOpen = signal<boolean>(false);

  // Derived data initialized after DI
  readonly notes;
  readonly categories;
  readonly tags;

  readonly filtered = computed<Note[]>(() => {
    const q = this.search().toLowerCase().trim();
    const cat = this.activeCategory();
    const tag = this.activeTag();
    return this.notes().filter(n => {
      if (cat && (n.category || '') !== cat) return false;
      if (tag && !(n.tags || []).includes(tag)) return false;
      if (!q) return true;
      const text = `${n.title} ${n.content} ${n.category} ${(n.tags || []).join(' ')}`.toLowerCase();
      return text.includes(q);
    });
  });

  constructor(private readonly notesService: NotesService) {
    this.notes = this.notesService.notes;
    this.categories = this.notesService.categories;
    this.tags = this.notesService.tags;
  }

  onCreate() {
    // Open empty editor
    this.selected = {
      id: '',
      title: '',
      content: '',
      category: '',
      tags: [],
      createdAt: '',
      updatedAt: ''
    };
    this.editorOpen.set(true);
  }

  onSelect(note: Note) {
    this.selected = note;
    this.editorOpen.set(true);
  }

  onSaveNote(payload: { title: string; content: string; category: string; tags: string[] }) {
    if (this.selected?.id) {
      this.notesService.updateNote(this.selected.id, payload);
    } else {
      const created = this.notesService.createNote(payload);
      this.selected = created;
    }
    this.editorOpen.set(false);
  }

  onDeleteNote() {
    if (this.selected?.id) {
      this.notesService.deleteNote(this.selected.id);
      this.selected = null;
    }
    this.editorOpen.set(false);
  }

  onCloseEditor() {
    this.editorOpen.set(false);
  }

  setCategory(cat: string | null) {
    this.activeCategory.set(cat);
  }
  setTag(tag: string | null) {
    this.activeTag.set(tag);
  }
}
