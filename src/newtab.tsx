import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import Usage from './components/Usage';
import Clock from './components/Clock';
import Fact from './components/Fact';
import SoundWave from './components/SoundWave';
import ImageAttribution from './components/ImageAttribution';
import QuickLinks from './components/QuickLinks';
import { getDailyContent } from './lib/data-manager';
import { Settings, loadSettings, updateSettings } from './lib/settings';
import { Soundscape } from './components/SettingsModal';
import { Attribution, FactData } from './types';
import { WORKER_URL } from './lib/constants';

// --- Main App Component ---
const NewTab = () => {
    // === STATE MANAGEMENT ===
    const [settings, setSettings] = useState<Settings>(() => loadSettings());
    const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const [dailyContent, setDailyContent] = useState<{
        fact: FactData | null;
        attribution: Attribution | null;
    }>({ fact: null, attribution: null });
    
    // **STATE MỚI ĐỂ QUẢN LÝ BACKGROUND AN TOÀN**
    const [backgroundUrl, setBackgroundUrl] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const audioRef = useRef<HTMLAudioElement>(null);

    // === SIDE EFFECTS ===

    // 1. Theo dõi trạng thái mạng
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => { /* cleanup */ };
    }, []);

    // 2. Tải nội dung chính (ảnh, fact) khi category thay đổi
    useEffect(() => {
        let isActive = true;

        const loadContent = async () => {
            setIsLoading(true);
            const category = settings.background.category;
            if (!category) {
                setIsLoading(false);
                return;
            }

            const content = await getDailyContent(category);
            
            if (isActive && content) {
                // Tách riêng việc tải và áp dụng background
                if (content.image?.url) {
                    // Preload ảnh, và chỉ khi xong mới cập nhật state
                    preloadImage(content.image.url);
                }
                
                setDailyContent({
                    fact: content.fact || null,
                    attribution: content.image?.attribution || null,
                });
            }
        };

        // Hàm preload mới: khi tải xong sẽ cập nhật state URL
        const preloadImage = (url: string) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (isActive) {
                    // CẬP NHẬT STATE CỦA REACT
                    setBackgroundUrl(url); 
                    // Set loading false sau khi ảnh đã sẵn sàng để hiển thị
                    setTimeout(() => setIsLoading(false), 50); 
                }
            };
            img.onerror = () => {
                console.error("Failed to load background image:", url);
                if (isActive) setIsLoading(false); // Vẫn phải tắt loading nếu lỗi
            };
        };

        loadContent();

        return () => { isActive = false; };
    }, [settings.background.category]);

    // 3. Fetch danh sách soundscapes (chỉ một lần và khi online)
    useEffect(() => {
        if (isOnline) {
            const fetchSoundscapes = async () => {
                try {
                    const response = await fetch(`${WORKER_URL}/api/soundscapes`);
                    if (response.ok) {
                        console.log("Soundscapes fetched successfully.");
                        const data: Soundscape[] = await response.json();
                        setSoundscapes(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch soundscapes:", error);
                }
            };
            fetchSoundscapes();
        } else {
            // Nếu offline, xóa danh sách soundscapes để tránh lỗi
            setSoundscapes([]);
        }
    }, [isOnline]);

    // 4. Xử lý logic nhạc nền - Chỉ phát khi đang ở chế độ Zen
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return; // Luôn kiểm tra để đảm bảo audio element đã tồn tại

        // Biến này sẽ quyết định âm thanh có nên phát hay không
        const shouldPlay = 
            isOnline && 
            settings.appearance.zenMode && 
            settings.sound.zenMusic !== 'none';

        if (shouldPlay) {
            // Chỉ khi nên phát, chúng ta mới xử lý logic tìm và chạy nhạc
            const musicKey = settings.sound.zenMusic;
            const currentTrack = soundscapes.find(s => s.key === musicKey);
            
            if (currentTrack) {
                // Chỉ đổi nguồn nhạc khi cần thiết để tránh tải lại không cần thiết
                if (audio.src !== currentTrack.audio_url) {
                    audio.src = currentTrack.audio_url;
                }
                // Thử phát nhạc và bắt lỗi nếu trình duyệt chặn tự động phát
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Audio autoplay was prevented by the browser.", error);
                    });
                }
            } else {
                // Trường hợp có musicKey nhưng không tìm thấy track -> dừng nhạc
                audio.pause();
            }
        } else {
            // Trong mọi trường hợp khác (không online, không ở zen mode, hoặc nhạc là 'none')
            // -> Dừng nhạc
            audio.pause();
        }
    }, [
        settings.appearance.zenMode, 
        settings.sound.zenMusic,
        soundscapes, 
        isOnline
    ]);

    // 5. Xử lý phím tắt cho Zen Mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                // Chỉ cần đảo ngược trạng thái zenMode
                setSettings(prev => updateSettings({
                    appearance: { ...prev.appearance, zenMode: !prev.appearance.zenMode }
                }));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    // === HANDLERS ===
    const handleSaveSettings = useCallback((newSettings: { 
        bg: string; 
        zenMode: boolean; 
        zenMusic: string;
    }) => {
        setSettings(prev => updateSettings({
            appearance: {
                ...prev.appearance,
                zenMode: newSettings.zenMode
            },
            background: {
                ...prev.background,
                category: newSettings.bg
            },
            sound: {
                zenMusic: newSettings.zenMusic
            }
        }));
    }, []);

    // === RENDER ===
    return (
        // ÁP DỤNG BACKGROUND VÀO STYLE CỦA DIV GỐC
        <div 
            className={`min-h-screen bg-black bg-cover bg-center transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
            {/* Lớp phủ mờ để làm nổi bật text */}
            <main className="text-white min-h-screen flex flex-col items-center p-6 relative bg-black/20">
                <audio ref={audioRef} loop />

                {/* QuickLinks at top center */}
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-40 ${settings.appearance.zenMode ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    <QuickLinks />
                </div>

                {/* Clock in top left */}
                <div className={`fixed bottom-6 left-6 ${settings.appearance.zenMode ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    <Clock />
                </div>

                {/* Fact widget at bottom center */}
                <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 ${settings.appearance.zenMode ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    <div className="transition-opacity duration-1000 ease-in-out w-full">
                        <Fact factData={dailyContent.fact} />
                    </div>
                </div>

                {/* Zen mode sound wave - only show in zen mode */}
                <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${!settings.appearance.zenMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                    <div className="flex flex-col items-center gap-2">
                        <SoundWave isPlaying={
                            isOnline && 
                            (settings.appearance.zenMode && settings.sound.zenMusic !== 'none')
                        } />
                        <div className="text-sm text-white/70 mt-2 select-none">
                            {!isOnline ? 'Offline Mode' : (settings.sound.zenMusic === 'none' ? 'Sound is off' : 'Now Playing')}
                        </div>
                    </div>
                </div>
                {/* Settings button and modal */}
                <div className="fixed top-6 left-6 z-50">
                    <div className="relative flex items-center gap-3">
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                            className={`bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center transition-all ${isSettingsOpen ? 'ring-1 ring-white/50' : ''}`} 
                            aria-label="Settings"
                        >
                            <SettingsIcon size={18} className="text-white/70 hover:text-white/90 transition-colors" />
                        </button>
                        {!settings.appearance.showUsage && <Usage />}
                    </div>
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        onSave={handleSaveSettings}
                        initialBg={settings.background.category}
                        initialZenMode={settings.appearance.zenMode}
                        initialZenMusic={settings.sound.zenMusic}
                        soundscapes={soundscapes}
                        isOnline={isOnline}
                    />
                </div>

                {/* Image attribution */}
                {dailyContent.attribution && (
                    <div className={`fixed bottom-6 right-6 transition-opacity duration-1000 ease-in-out ${settings.appearance.zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <ImageAttribution 
                            source_url={dailyContent.attribution.source_url}
                            photographer_name={dailyContent.attribution.photographer_name}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Render App ---
ReactDOM.render(
  <React.StrictMode>
    <NewTab />
  </React.StrictMode>,
  document.getElementById("root")
);