import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface Soundscape {
  key: string;
  name: string;
  audio_url: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { bg: string; music: string; volume: number }) => void;
  initialBg: string;
  initialMusic: string;
  initialVolume: number;
  soundscapes: Soundscape[];
}

type TabType = 'profile' | 'appearance' | 'audio';

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialBg,
    initialMusic,
    initialVolume,
    soundscapes
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [bg, setBg] = useState(initialBg);
    const [music, setMusic] = useState(initialMusic);
    const [volume, setVolume] = useState(initialVolume);

    // Handle Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Add event listener when component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Reset form when modal opens/closes
    useEffect(() => {
        setBg(initialBg);
        setMusic(initialMusic);
        setVolume(initialVolume);
    }, [isOpen, initialBg, initialMusic, initialVolume]);
    
    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ bg, music, volume });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-white shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Settings
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2"></div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'profile'
                                    ? 'text-white border-b-2 border-blue-400'
                                    : 'text-white/60 hover:text-white/80'
                            }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'appearance'
                                    ? 'text-white border-b-2 border-blue-400'
                                    : 'text-white/60 hover:text-white/80'
                            }`}
                        >
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveTab('audio')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'audio'
                                    ? 'text-white border-b-2 border-blue-400'
                                    : 'text-white/60 hover:text-white/80'
                            }`}
                        >
                            Audio
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-4 animate-fade-in">
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/90">Background Theme</label>
                                    <div className="relative">
                                        <select 
                                            value={bg}
                                            onChange={(e) => setBg(e.target.value)}
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="cat" className="bg-gray-800 text-white">🐱 Cute Cats</option>
                                            <option value="dog" className="bg-gray-800 text-white">🐶 Cute Dogs</option>
                                            <option value="nature" className="bg-gray-800 text-white">🌿 Nature</option>
                                        </select>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Audio Tab */}
                        {activeTab === 'audio' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/90">Background Music</label>
                                    <div className="relative">
                                        <select 
                                            value={music}
                                            onChange={(e) => setMusic(e.target.value)}
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="none" className="bg-gray-800 text-white">🔇 None</option>
                                            {soundscapes.map((scape) => (
                                                <option key={scape.key} value={scape.key} className="bg-gray-800 text-white">
                                                    {scape.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/90">
                                        Volume <span className="text-white/60">({Math.round(volume * 100)}%)</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="1" 
                                            step="0.05" 
                                            value={volume}
                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                            className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #60a5fa 0%, #a855f7 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            onClick={handleSave} 
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-6 py-4 font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
