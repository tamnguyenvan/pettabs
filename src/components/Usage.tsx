import React, { useState, useEffect } from 'react';
import { X, Zap, Image, Music, HelpCircle } from 'lucide-react';
import { loadSettings, updateSettings } from '../lib/settings';

const Usage = () => {
    const [isVisible, setIsVisible] = useState(true);
    const settings = loadSettings();

    useEffect(() => {
        // Initialize visibility from settings
        setIsVisible(settings.appearance.showUsage !== false);
    }, [settings.appearance.showUsage]);

    const handleClose = () => {
        const newSettings = {
            ...settings,
            appearance: {
                ...settings.appearance,
                showUsage: false
            }
        };
        updateSettings(newSettings);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);
    const cmdKey = isMac ? '⌘' : 'Ctrl';

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-black/60 backdrop-blur-sm text-white/90 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-slide-up">
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Quick Guide
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Close guide"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center gap-2 font-medium text-amber-300 mb-2">
                            <Zap className="w-4 h-4" />
                            Zen Mode
                        </div>
                        <p className="text-white/80 mb-2">
                            Hides all UI elements, leaving just the background. Perfect for relaxing with ambient soundscapes.
                        </p>
                        <div className="text-xs bg-black/30 px-2 py-1 rounded inline-flex items-center">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded mr-1">
                                {cmdKey} + K
                            </kbd>
                            Toggle Zen Mode
                        </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center gap-2 font-medium text-blue-300 mb-2">
                            <Image className="w-4 h-4" />
                            Change Background
                        </div>
                        <p className="text-white/80 mb-2">
                            Click the settings icon in the top-left corner to change the background category.
                        </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center gap-2 font-medium text-purple-300 mb-2">
                            <Music className="w-4 h-4" />
                            Soundscapes
                        </div>
                        <p className="text-white/80 mb-2">
                            Soundscapes automatically play in Zen Mode. You can change or disable them in settings.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-black/30 px-4 py-2 text-center text-xs text-white/60 border-t border-white/5">
                This guide won't show again unless you reset it in settings
            </div>
        </div>
    );
};

export default Usage;