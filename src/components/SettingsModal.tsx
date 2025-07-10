import React, { useState, useEffect } from 'react';
import { X, Info, Sparkles, Wind, Settings, MessageCircle } from 'lucide-react';
import ZenDropdown from './ui/DropDown';

// Định nghĩa Soundscape ở đây để tái sử dụng
export interface Soundscape {
  key: string;
  name: string;
  audio_url: string;
}

// Props cho component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { 
    bg: string; 
    zenMode: boolean; 
    zenMusic: string;
  }) => void;
  initialBg: string;
  initialZenMode: boolean;
  initialZenMusic: string;
  soundscapes: Soundscape[];
  isOnline: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialBg,
    initialZenMode,
    initialZenMusic,
    soundscapes,
    isOnline
}) => {
    // === STATE MANAGEMENT ===
    const [bg, setBg] = useState(initialBg);
    const [zenMode, setZenMode] = useState(initialZenMode);
    const [zenMusic, setZenMusic] = useState(initialZenMusic);
    const [activeTab, setActiveTab] = useState<'appearance' | 'about'>('appearance');

    // === SIDE EFFECTS ===
    // Xử lý phím Escape để đóng modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Reset lại state của form khi modal được mở hoặc giá trị ban đầu thay đổi
    useEffect(() => {
        setBg(initialBg);
        setZenMode(initialZenMode);
        setZenMusic(initialZenMusic);
    }, [isOpen, initialBg, initialZenMode, initialZenMusic]);
    
    // Đảm bảo không render gì nếu modal không mở
    if (!isOpen) return null;

    // === HANDLERS ===
    const handleSave = () => {
        onSave({ bg, zenMode, zenMusic });
        onClose();
    };

    // === RENDER ===
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 w-[500px] h-auto max-h-[90vh] flex flex-col text-white shadow-2xl border border-white/5 transition-all duration-200">
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Settings</h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex-shrink-0 flex border-b border-white/10 -mx-8 px-8">
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'}`}
                        >
                            <Settings size={16} />
                            General
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
                    <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                        {activeTab === 'appearance' && (
                            <div className="space-y-8 animate-fade-in">
                                
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-white">Background Theme</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'cat', label: 'Cats', emoji: '🐱' },
                                            { value: 'dog', label: 'Dogs', emoji: '🐶' },
                                            { value: 'landscape', label: 'Landscape', emoji: '🏞️' }
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
                                
                                <div className="border-t border-white/10"></div>

                                <div className="space-y-6">
                                    <div 
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${!zenMode ? 'bg-white/10 border-white/30' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                                        onClick={() => setZenMode(false)}
                                    >
                                        <div className="flex items-center gap-2 text-lg font-semibold">
                                            <Sparkles size={20} className="text-yellow-300"/>
                                            Normal Mode
                                            {!zenMode && <span className="text-xs font-normal bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full ml-auto">Active</span>}
                                        </div>
                                        <p className="text-xs text-white/60 mt-1 mb-4">Show clock, facts, and other widgets.</p>
                                    </div>

                                    <div 
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer group 
                                            ${zenMode 
                                                ? 'bg-white/10 border-white/30 hover:border-white/50' 
                                                : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}
                                        `}
                                        onClick={() => setZenMode(true)}
                                        >
                                        <div className="flex items-center gap-2 text-lg font-semibold">
                                            <Wind size={20} className="text-blue-300"/>
                                            Zen Mode
                                            {zenMode && (
                                            <span className="text-xs font-normal bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full ml-auto">
                                                Active
                                            </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-white/60 mt-1 mb-4">
                                            Focus on the background with ambient sound. 
                                            <span className="font-mono bg-white/10 px-1 py-0.5 rounded ml-1">Ctrl+K</span> to toggle.
                                        </p>

                                        <ZenDropdown
                                            label="Ambient Sound"
                                            value={zenMusic}
                                            onChange={setZenMusic}
                                            options={soundscapes}
                                            disabled={!isOnline || !zenMode}
                                        />
                                        </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white/90">PetTabs</h3>
                                    <p className="text-sm text-white/70">
                                        A purr-fect new tab page with relaxing pet themes and soothing sounds to brighten your day. Paws and enjoy the cuteness!
                                    </p>
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Version</span>
                                            <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded">0.1.3</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Created by</span>
                                            <a 
                                                href="https://x.com/tamnvvn" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-300 hover:underline"
                                            >
                                                @tamnvvn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <h4 className="text-sm font-medium text-white/90 mb-3">Feedback</h4>
                                    <p className="text-sm text-white/70 mb-3">
                                        Have suggestions or found a bug? We'd love to hear from you!
                                    </p>
                                    <a 
                                        href="https://docs.google.com/spreadsheets/d/1QK18XLihI7kdHWqQfTSq3_CuC6G8McudQIBuKCOXJBM/edit?usp=sharing" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-300 hover:underline"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" /> Submit Feedback
                                    </a>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <h4 className="text-sm font-medium text-white/90 mb-3">Attributions</h4>
                                    <ul className="space-y-2 text-sm text-white/70">
                                        <li>• Icons by <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Lucide</a></li>
                                        <li>• Images by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Unsplash</a></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Nút Save/Cancel */}
                    <div className="flex-shrink-0 pt-6 mt-auto border-t border-white/10 -mx-8 px-8 pb-0">
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/30">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/30">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;