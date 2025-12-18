export interface FilterCondition {
    operator: string;
    value: any;
}

export interface FilterObject {
    [key: string]: FilterCondition;
}

export interface ClarificationOption {
    label: string;
    filters: Record<string, any>;
}

export interface ClarificationRequest {
    message: string;
    options: ClarificationOption[];
}

export interface QueryResponse {
    query: string;
    filters: FilterObject;
    results: any[];
    count: number;
    stats: any;

    clarification_requests: ClarificationRequest[];
    assumptions?: string[];
    confidence: number;
}
