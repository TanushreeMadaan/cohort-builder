import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { QueryResponse } from '../models/cohort.model';

@Injectable({ providedIn: 'root' })
export class CohortService {
    private baseUrl = 'https://cohort-builder-7jqu.onrender.com';

    loading$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) { }

    search(query: string): Observable<QueryResponse> {
        this.loading$.next(true);
        return this.http.post<QueryResponse>(`${this.baseUrl}/query`, { query });
    }
}
