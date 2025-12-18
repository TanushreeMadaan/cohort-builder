import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './search-bar.html'
})
export class SearchBar {
  query = '';

  @Output() searchQuery = new EventEmitter<string>();

  search() {
    if (this.query.trim()) {
      this.searchQuery.emit(this.query);
    }
  }
}
