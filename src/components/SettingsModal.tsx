import React, { useState, useEffect } from 'react';
import { X, Palette, Volume2, Info } from 'lucide-react';

// Định nghĩa Soundscape ở đây để tái sử dụng
export interface Soundscape {
  key: string;
  name: string;
  audio_url: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { bg: string; music: string; zenMode: boolean }) => void;
  initialBg: string;
  initialMusic: string;
  initialZenMode: boolean;
  soundscapes: Soundscape[];
  isOnline: boolean;
}

type TabType = 'appearance' | 'audio' | 'about';

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialBg,
    initialMusic,
    initialZenMode,
    soundscapes,
    isOnline
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('appearance'); // Default to appearance tab
    const [bg, setBg] = useState(initialBg);
    const [music, setMusic] = useState(initialMusic);
    const [zenMode, setZenMode] = useState(initialZenMode);

    // Xử lý phím Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Reset lại state của form khi modal được mở hoặc các giá trị ban đầu thay đổi
    useEffect(() => {
        setBg(initialBg);
        setMusic(initialMusic);
        setZenMode(initialZenMode);
    }, [isOpen, initialBg, initialMusic, initialZenMode]);
    
    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ bg, music, zenMode });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-[500px] h-[600px] flex flex-col text-white shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold">Settings</h2>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-white/10 -mx-8 px-8">
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'}`}
                        >
                            <Palette size={16} />
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveTab('audio')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'audio' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'}`}
                        >
                            <Volume2 size={16} />
                            Audio
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'}`}
                        >
                            <Info size={16} />
                            About
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-white/90">Background Theme</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'cat', label: 'Cats', emoji: '🐱' },
                                            { value: 'dog', label: 'Dogs', emoji: '🐶' },
                                            { value: 'nature', label: 'Nature', emoji: '🌿' }
                                        ].map((theme) => (
                                            <button
                                                key={theme.value}
                                                type="button"
                                                onClick={() => setBg(theme.value)}
                                                className={`aspect-square flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                                    bg === theme.value
                                                        ? 'bg-white/20 border-white/60'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <span className="text-2xl mb-1">{theme.emoji}</span>
                                                <span className="text-xs font-medium">{theme.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center justify-between text-sm font-medium mb-2 text-white/90">
                                        Zen Mode
                                        <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded">Ctrl/Cmd + K</span>
                                    </label>
                                    <label htmlFor="zen-toggle" className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" id="zen-toggle" className="sr-only" checked={zenMode} onChange={() => setZenMode(!zenMode)} />
                                            <div className="block bg-white/20 w-14 h-8 rounded-full"></div>
                                            <div 
                                                className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${zenMode ? 'translate-x-6' : 'translate-x-1'}`}
                                            ></div>
                                        </div>
                                    </label>
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
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isOnline}
                                        >
                                            <option value="none" className="bg-gray-800 text-white">🔇 None</option>
                                            {soundscapes.map((scape) => (
                                                <option key={scape.key} value={scape.key} className="bg-gray-800 text-white">{scape.name}</option>
                                            ))}
                                        </select>
                                        {!isOnline && (
                                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center pointer-events-none">
                                                <p className="text-xs text-white/70">Audio requires an internet connection</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                

                            </div>
                        )}

                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white/90">PetTabs</h3>
                                    <p className="text-sm text-white/70">
                                        A beautiful new tab page with relaxing themes and sounds to enhance your browsing experience.
                                    </p>
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Version</span>
                                            <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded">1.0.0</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Created by</span>
                                            <a 
                                                href="https://github.com/tamnguyenvan" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-300 hover:underline"
                                            >
                                                @tamnguyenvan
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <h4 className="text-sm font-medium text-white/90 mb-3">Attributions</h4>
                                    <ul className="space-y-2 text-sm text-white/70">
                                        <li>• Icons by <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Lucide</a></li>
                                        <li>• Backgrounds from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Unsplash</a></li>
                                        <li>• Sounds from <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">ZapSplat</a></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/30"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/30"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;