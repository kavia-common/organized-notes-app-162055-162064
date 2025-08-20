import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * SidebarComponent lists categories and tags, allows filtering.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() categories: string[] = [];
  @Input() tags: string[] = [];
  @Input() activeCategory: string | null = null;
  @Input() activeTag: string | null = null;

  @Output() categoryChange = new EventEmitter<string | null>();
  @Output() tagChange = new EventEmitter<string | null>();

  clearFilters() {
    this.categoryChange.emit(null);
    this.tagChange.emit(null);
  }
}
