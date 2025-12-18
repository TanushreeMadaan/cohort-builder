import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './filter-chips.html'
})
export class FilterChip {
  @Input() filters: any = {};
  @Output() removeFilter = new EventEmitter<string>();
  @Output() clearAll = new EventEmitter<void>();

  formatFilter(key: string, value: any) {
    return `${key} ${value.operator} ${value.value}`;
  }

  keys(): string[] {
    return Object.keys(this.filters || {});
  }
}
