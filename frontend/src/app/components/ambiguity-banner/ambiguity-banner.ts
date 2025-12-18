import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarificationRequest, FilterObject } from '../../models/cohort.model';

@Component({
  selector: 'app-ambiguity-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ambiguity-banner.html',
  styleUrls: ['./ambiguity-banner.css']
})
export class AmbiguityBanner {
  @Input() requests!: ClarificationRequest[];
  @Output() resolve = new EventEmitter<any>();

  choose(optionFilters: FilterObject) {
    this.resolve.emit(optionFilters);
  }
}
