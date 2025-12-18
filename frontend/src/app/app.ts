import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from './components/search-bar/search-bar';
import { ResultsTable } from './components/results-table/results-table';
import { StatsSummary } from './components/stats-summary/stats-summary';
import { FilterChip } from './components/filter-chips/filter-chips';
import { AmbiguityBanner } from './components/ambiguity-banner/ambiguity-banner';
import { CohortService } from './services/cohort.service';
import { QueryResponse } from './models/cohort.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBar,
    ResultsTable,
    StatsSummary,
    FilterChip,
    AmbiguityBanner
  ],
  templateUrl: './app.html'
})
export class AppComponent {
  response: QueryResponse | null = null;

  constructor(private cohortService: CohortService) {}

  runQuery(query: string) {
    this.cohortService.search(query).subscribe(res => {
      this.response = res;
    });
  }

  removeFilter(key: string) {
    if (!this.response) return;
  
    delete this.response.filters[key];
  
    const remainingFilters = this.response.filters;
  
    this.cohortService.search(
      this.response.query
    ).subscribe(res => {
      this.response = {
        ...res,
        filters: remainingFilters
      };
    });
  }
  
  clearAllFilters() {
    this.response = null;
  }
}
