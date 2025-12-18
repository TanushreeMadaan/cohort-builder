export interface FilterCondition {
    operator: string;
    value: any;
  }
  
  export interface QueryResponse {
    query: string;
    filters: Record<string, FilterCondition>;
    count: number;
    stats: any;
    verification: {
      verified: boolean;
      issues: string[];
    };
    excluded_due_to_missing_fields: number;
    ambiguities: string[];
    assumptions: string[];
    confidence: number;
    clarification_needed: boolean;
    results: any[];
  }
  