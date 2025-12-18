import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './stats-summary.html',
  styleUrls: ['./stats-summary.css']
})
export class StatsSummary {
  @Input() stats: any;
}
