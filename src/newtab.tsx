import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Settings } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import Clock from './components/Clock';
import DailyInspiration from './components/DailyInspiration';
import Fact from './components/Fact';
import BackgroundImageLoader from './components/BackgroundImageLoader';
import { Soundscape } from './components/SettingsModal';
import { WORKER_URL } from './lib/constants';

// --- Main App Component ---
const NewTab = () => {
    const [bgCategory, setBgCategory] = useState<string>(''); // Khởi tạo rỗng
    const [music, setMusic] = useState('none');
    const [volume, setVolume] = useState(0.5);
    const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    // Load all settings from localStorage on initial mount
    useEffect(() => {
        // Load category sau khi component đã mount để đảm bảo BackgroundImageLoader nhận được prop
        const storedBgCategory = localStorage.getItem('bgCategory') || 'cat';
        setBgCategory(storedBgCategory);

        const storedMusic = localStorage.getItem('backgroundMusic') || 'none';
        setMusic(storedMusic);

        const storedVolume = localStorage.getItem('musicVolume');
        setVolume(storedVolume ? parseFloat(storedVolume) : 0.5);

    }, []);

     // Fetch soundscapes một lần duy nhất khi app khởi động
    useEffect(() => {
        const fetchSoundscapes = async () => {
            try {
                const response = await fetch(`${WORKER_URL}/api/soundscapes`);
                if (response.ok) {
                    const data: Soundscape[] = await response.json();
                    setSoundscapes(data);
                }
            } catch (error) {
                console.error("Failed to fetch soundscapes:", error);
            }
        };

        fetchSoundscapes();
    }, []);

    // Effect to control background music
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;

            if (music === 'none') {
                audioRef.current.pause();
            } else {
                // Tìm URL nhạc từ danh sách soundscapes đã fetch được
                const currentTrack = soundscapes.find(s => s.key === music);
                if (currentTrack) {
                    // Chỉ thay đổi src nếu nó khác để tránh load lại không cần thiết
                    if (audioRef.current.src !== currentTrack.audio_url) {
                        audioRef.current.src = currentTrack.audio_url;
                    }
                    audioRef.current.play().catch(e => console.log('Autoplay was prevented.', e));
                }
            }
        }
    }, [music, volume, soundscapes])

    const handleSaveSettings = (settings: { bg: string; music: string; volume: number }) => {
        // Chỉ cập nhật state nếu có thay đổi
        if (settings.bg !== bgCategory) {
            setBgCategory(settings.bg);
            localStorage.setItem('bgCategory', settings.bg);
        }
        
        setMusic(settings.music);
        localStorage.setItem('backgroundMusic', settings.music);

        setVolume(settings.volume);
        localStorage.setItem('musicVolume', settings.volume.toString());
    };

    return (
        <div className="min-h-screen">
            {/* Component này sẽ xử lý toàn bộ logic ảnh nền */}
            {bgCategory && <BackgroundImageLoader category={bgCategory} />}

            <main className="text-white min-h-screen flex flex-col justify-center items-center p-6 relative">
                {/* Main Content - Always centered */}
                <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mb-8">
                    <Clock />
                    <DailyInspiration />
                </div>
                
                {/* Audio Element */}
                <audio ref={audioRef} loop />

                {/* Fact at bottom center */}
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
                    <Fact />
                </div>

                {/* Settings Button */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="fixed bottom-6 right-6 bg-black/30 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-black/50 transition-all"
                >
                    <Settings size={20} />
                </button>

                {/* Settings Modal */}
                <SettingsModal 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={handleSaveSettings}
                    initialBg={bgCategory}
                    initialMusic={music}
                    initialVolume={volume}
                    soundscapes={soundscapes}
                />
            </main>
        </div>
    );
};


// --- Render the App ---
ReactDOM.render(
  <React.StrictMode>
    <NewTab />
  </React.StrictMode>,
  document.getElementById("root")
);