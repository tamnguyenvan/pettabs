import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Settings, RotateCw, Quote } from 'lucide-react';
import Clock from './components/Clock';

const Popup: React.FC = () => {
  const [username, setUsername] = useState('User');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load username from localStorage on initial mount
  useEffect(() => {
    const storedName = localStorage.getItem('username') || 'User';
    setUsername(storedName);
  }, []);

  return (
    <div className="min-h-screen w-[380px] bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="min-h-screen flex flex-col justify-center items-center p-6 relative">
        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center text-center w-full mb-8">
          <div className="mb-4">
            <Clock />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-md space-y-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white/90">Quick Actions</h2>
            <div className="space-y-3">
              <button
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center"
                onClick={() => {
                  // Add reset functionality
                  alert('Settings have been reset to default');
                }}
              >
                <RotateCw size={16} className="mr-2" />
                Reset Settings
              </button>
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center"
                onClick={() => alert('New Quote triggered')}
              >
                <Quote size={16} className="mr-2" />
                New Quote
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white/90">Display Settings</h2>
            <div className="space-y-4">
              <ToggleSwitch 
                label="Show Clock" 
                checked={true} 
                onChange={() => {}} 
              />
              <ToggleSwitch 
                label="Show Weather" 
                checked={true} 
                onChange={() => {}} 
              />
              <ToggleSwitch 
                label="Show Bookmarks" 
                checked={true} 
                onChange={() => {}} 
              />
              <ToggleSwitch 
                label="Show Pet Quotes" 
                checked={true} 
                onChange={() => {}} 
              />
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white/90">Keyboard Shortcuts</h2>
            <div className="space-y-2 text-sm">
              <ShortcutRow label="Search" keybind="/" />
              <ShortcutRow label="Settings" keybind="S" />
              <ShortcutRow label="New Quote" keybind="Q" />
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="fixed bottom-6 right-6 bg-black/30 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-black/50 transition-all"
        >
          <Settings size={20} />
        </button>

        {/* Settings Modal - You can integrate the SettingsModal component here if needed */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-300 mb-4">Settings content goes here...</p>
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-white/90">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
    </label>
  </div>
);

interface ShortcutProps {
  label: string;
  keybind: string;
}

const ShortcutRow: React.FC<ShortcutProps> = ({ label, keybind }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-white/80">{label}</span>
    <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs">{keybind}</span>
  </div>
);


ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
