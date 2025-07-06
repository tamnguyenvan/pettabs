export const WORKER_URL = 'https://pettabs-worker.pettabs.workers.dev';

export const OFFLINE_FALLBACK = {
    image: {
        // chrome.runtime.getURL() sẽ trả về đường dẫn chính xác của file trong extension đã được cài đặt
        url: chrome.runtime.getURL('offline-background.jpg'),
        attribution: {
            photographer_name: 'Pettabs Team',
            source_url: null,
        }
    },
    fact: {
        content: "Did you know? A cat's purr can be a form of self-healing.",
        category: 'General'
    }
};