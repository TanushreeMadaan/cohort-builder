import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './filter-chips.html',
  styleUrls: ['./filter-chips.css']
})
export class FilterChip {
  @Input() filters: Record<string, any> = {};

  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  get keys(): string[] {
    return Object.keys(this.filters || {});
  }

  removeFilter(key: string) {
    this.remove.emit(key);
  }

  clearAll() {
    this.clear.emit();
  }
}
