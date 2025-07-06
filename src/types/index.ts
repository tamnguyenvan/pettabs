export interface Attribution {
    photographer_name: string;
    source_url: string | null;
}

export interface DailyContent {
    date: string; // "YYYY-MM-DD"
    category: string;
    image: any; // Cấu trúc { url, attribution }
    fact: any;  // Cấu trúc { content, category }
}

export interface FactData {
    content: string;
    category: string;
}
    