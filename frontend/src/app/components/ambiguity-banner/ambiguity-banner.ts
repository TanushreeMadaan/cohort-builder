import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ClarificationOptionSelectedEvent {
  term: string;
  filters: any;
}

@Component({
  selector: 'app-ambiguity-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ambiguity-banner.html',
  styleUrls: ['./ambiguity-banner.css']
})
export class AmbiguityBanner {
  @Input() requests: any[] = [];
  @Input() selected: Record<string, any | null> = {};

  @Output()
  optionSelected = new EventEmitter<ClarificationOptionSelectedEvent>();

  selectOption(term: string, filters: any) {
    this.optionSelected.emit({ term, filters });
  }

  isSelected(term: string, optionFilters: any): boolean {
    return JSON.stringify(this.selected[term]) === JSON.stringify(optionFilters);
  }
}
