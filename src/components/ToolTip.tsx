import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { loadSettings, updateSettings } from '../lib/settings';


const ToolTip = () => {
    const settings = loadSettings();
    const isVisible = settings.appearance.showZenTooltip !== false; // Show by default if not set

    const handleClose = () => {
        updateSettings({
            ...settings,
            appearance: {
                ...settings.appearance,
                showZenTooltip: false
            }
        });
    };

    if (!isVisible) return null;

    return (
        <div className="absolute left-full ml-3 whitespace-nowrap flex items-center bg-black/40 backdrop-blur-sm text-white/80 text-sm pl-3 pr-4 py-2 rounded-lg shadow-lg border border-white/5 animate-fade-in z-50">
            <button
                onClick={handleClose}
                className="absolute -right-1.5 -top-1.5 p-0.5 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black transition-colors border border-white/10"
                aria-label="Dismiss tooltip"
            >
                <X className="w-3 h-3" />
            </button>
            <span className="whitespace-nowrap">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs mr-1">
                    {/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'} + K
                </kbd>
                to toggle Zen mode
            </span>
        </div>
    );
};

export default ToolTip;