import { Attribution } from './common';

/**
 * Types related to daily content and facts
 */

export interface FactData {
    content: string;
    category: string;
}

export interface DailyContent {
    date: string; // "YYYY-MM-DD"
    category: string;
    image: {
        url: string;
        attribution: Attribution;
    };
    fact: FactData;
}

export interface DailyContentRecord {
    date: string;
    category: string;
    imageBlob: Blob;
    attribution: Attribution;
    fact: FactData;
}
