import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ambiguity-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './ambiguity-banner.html'
})
export class AmbiguityBanner {
  @Input() ambiguities: string[] = [];
  @Input() assumptions: string[] = [];
}
