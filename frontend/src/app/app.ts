import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from './components/search-bar/search-bar';
import { ResultsTable } from './components/results-table/results-table';
import { StatsSummary } from './components/stats-summary/stats-summary';
import { FilterChip } from './components/filter-chips/filter-chips';
import { AmbiguityBanner } from './components/ambiguity-banner/ambiguity-banner';
import { CohortService } from './services/cohort.service';
import { QueryResponse } from './models/cohort.model';
import { normalizeValue } from './utils/normalization';

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
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  response: QueryResponse | null = null;

  originalResults: any[] = [];
  filteredResults: any[] = [];
  activeFilters: any = {};
  clarificationRequests: any[] = [];
  fullDataset: any[] = [];
  pendingClarifications: Record<string, any> = {};

  constructor(private cohortService: CohortService) { }

  get getclarificationRequests() {
    return this.response?.clarification_requests ?? [];
  }

  runQuery(query: string) {
    this.cohortService.search(query).subscribe(res => {
      this.response = res;
  
      this.originalResults = res.results;
      this.activeFilters = { ...res.filters };
  
      if (res.clarification_requests?.length) {
        this.filteredResults = res.results;
        return;
      }
  
      this.filteredResults = this.applyLocalFilters(
        this.originalResults,
        this.activeFilters
      );
  
      this.updateStats();
    });
  }
  

  removeFilter(key: string) {
    delete this.activeFilters[key];

    this.filteredResults = this.applyLocalFilters(
      this.originalResults,
      this.activeFilters
    );

    this.updateStats();
  }

  clearAllFilters() {
    this.activeFilters = {};
    this.filteredResults = [...this.originalResults];
    this.updateStats();
  }

  applyLocalFilters(rows: any[], filters: any): any[] {
    if (!filters || Object.keys(filters).length === 0) return rows;

    return rows.filter(row => {
      return Object.entries(filters).every(([key, condition]: any) => {
        const operator = condition.operator;

        // 🔥 NORMALIZE BOTH SIDES
        const rowValue = normalizeValue(key, row[key]);
        const filterValue = normalizeValue(key, condition.value);

        if (rowValue === undefined || rowValue === null || rowValue === '') {
          return false;
        }

        const rowNum = Number(rowValue);
        const filterNum = Number(filterValue);

        console.log(
          key,
          '| raw row:', row[key],
          '| normalized row:', rowValue,
          '| raw filter:', condition.value,
          '| normalized filter:', filterValue
        );

        switch (operator) {
          
          case '=':
            return normalizeValue(key, rowValue) === normalizeValue(key, condition.value);

          case '>':
            return !isNaN(rowNum) && rowNum > filterNum;

          case '<':
            return !isNaN(rowNum) && rowNum < filterNum;

          case '>=':
            return !isNaN(rowNum) && rowNum >= filterNum;

          case '<=':
            return !isNaN(rowNum) && rowNum <= filterNum;

          case 'contains':
            return normalizeValue(key, rowValue) === normalizeValue(key, condition.value);

          case 'in':
            return Array.isArray(filterValue) && filterValue.includes(rowValue);

          default:
            return true;
        }
      });
    });
  }

  updateStats() {
    if (!this.response) return;

    this.response = {
      ...this.response,
      filters: { ...this.activeFilters },
      results: this.filteredResults,
      count: this.filteredResults.length,
      stats: this.computeStatsLocal(this.filteredResults)
    };
  }

  computeStatsLocal(rows: any[]) {
    if (!rows.length) return this.response?.stats;

    const agesDx = rows.map(r => Number(r.age_at_diagnosis)).filter(n => !isNaN(n));
    const agesSpec = rows.map(r => Number(r.age_at_specimen_acquisition)).filter(n => !isNaN(n));

    const genderBreakdown: any = {};
    rows.forEach(r => {
      const gender = normalizeValue('gender', r.gender);
      if (gender) {
        genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
      }
    });

    return {
      count: rows.length,
      age: {
        diagnosis: {
          min: Math.min(...agesDx),
          max: Math.max(...agesDx),
          avg: Math.round(agesDx.reduce((a, b) => a + b, 0) / agesDx.length)
        },
        specimen: {
          min: Math.min(...agesSpec),
          max: Math.max(...agesSpec),
          avg: Math.round(
            (agesSpec.reduce((a, b) => a + b, 0) / agesSpec.length) * 10
          ) / 10
        }
      },
      genderBreakdown
    };
  }

  resolveAgeAmbiguity(type: 'diagnosis' | 'specimen') {
    if (!this.activeFilters) return;

    const ageKey = Object.keys(this.activeFilters).find(
      k => k === 'age_at_diagnosis' || k === 'age_at_specimen_acquisition'
    );

    if (!ageKey) return;

    const ageFilter = this.activeFilters[ageKey];

    delete this.activeFilters[ageKey];

    const newKey =
      type === 'diagnosis'
        ? 'age_at_diagnosis'
        : 'age_at_specimen_acquisition';

    this.activeFilters[newKey] = ageFilter;

    this.filteredResults = this.applyLocalFilters(
      this.originalResults,
      this.activeFilters
    );

    console.log(
      'Ambiguity resolved:',
      Object.keys(this.activeFilters),
      'Rows:',
      this.filteredResults.length
    );

    this.updateStats();
  }

  applyClarification(optionFilters: any) {
    // Merge clarification filters
    this.activeFilters = {
      ...this.activeFilters,
      ...optionFilters
    };
  
    this.filteredResults = this.applyLocalFilters(
      this.originalResults,
      this.activeFilters
    );
  
    this.updateStats();
  }

  onClarificationResolved(newFilters: any) {
    // 1. Merge filters
    this.activeFilters = {
      ...this.activeFilters,
      ...newFilters
    };
  
    // 2. Apply filtering
    this.filteredResults = this.applyLocalFilters(
      this.originalResults,
      this.activeFilters
    );
  
    // 3. Update stats
    this.updateStats();
  
    // 4. Remove ALL clarifications once user acts
    if (this.response) {
      this.response.clarification_requests = [];
    }
  }
  
}
