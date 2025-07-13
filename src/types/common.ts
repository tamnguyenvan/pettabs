/**
 * Common types used across the application
 */

export interface Attribution {
    photographer_name: string;
    source_url: string | null;
}

export interface ImageData {
    url: string;
    attribution: Attribution;
}
