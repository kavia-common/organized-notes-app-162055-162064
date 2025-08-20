import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

/**
 * PUBLIC_INTERFACE
 * NoteEditorComponent provides fields to edit a note (title, content, category, tags).
 */
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent {
  @Input() note: Note | null = null;
  @Input() allCategories: string[] = [];
  @Input() allTags: string[] = [];

  @Output() save = new EventEmitter<{ title: string; content: string; category: string; tags: string[] }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  title = '';
  content = '';
  category = '';
  tagsText = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note']) {
      const n = this.note;
      this.title = n?.title ?? '';
      this.content = n?.content ?? '';
      this.category = n?.category ?? '';
      this.tagsText = (n?.tags ?? []).join(', ');
    }
  }

  onSave() {
    const tags = this.tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    this.save.emit({ title: this.title.trim(), content: this.content, category: this.category.trim(), tags });
  }
}
