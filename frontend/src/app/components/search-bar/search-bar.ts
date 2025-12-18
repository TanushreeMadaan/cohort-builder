import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar {
  query = '';

  @Output() search = new EventEmitter<string>();

  submit() {
    const trimmed = this.query.trim();
    if (!trimmed) return;
    this.search.emit(trimmed);
  }
}
