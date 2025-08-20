import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * TopbarComponent renders the top navigation bar with app title, search, and new note button.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  /** Title to display on the left */
  @Input() title = 'Organized Notes';
  /** Current search query text */
  @Input() search = '';
  /** Emits when user types in search */
  @Output() searchChange = new EventEmitter<string>();
  /** Emits when user clicks new note */
  @Output() create = new EventEmitter<void>();

  focused = signal<boolean>(false);

  onSearchChange(ev: unknown) {
    const target = ev && typeof ev === 'object' && 'target' in (ev as any) ? (ev as any).target : null;
    const value = target && 'value' in (target as any) ? String((target as any).value ?? '') : '';
    this.searchChange.emit(value);
  }
}
