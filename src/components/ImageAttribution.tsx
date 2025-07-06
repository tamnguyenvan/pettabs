import React from 'react';

interface ImageAttributionProps {
    photographer_name?: string | null;
    source_url?: string | null;
}

const ImageAttribution: React.FC<ImageAttributionProps> = ({ 
    photographer_name = 'Unsplash',
    source_url = 'https://unsplash.com'
}) => {
    if (!photographer_name && !source_url) {
        return null; // Don't render anything if no data is provided
    }

    return (
        <div className="text-sm text-white/70 mt-2">
            <a 
                href={source_url || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline hover:text-white transition-colors"
            >
                {photographer_name || 'View on Unsplash'}
            </a>
        </div>
    );
};

export default React.memo(ImageAttribution);
