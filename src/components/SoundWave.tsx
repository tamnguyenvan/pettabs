import React from 'react';

interface SoundWaveProps {
  isPlaying: boolean;
}

// Mảng delay mới: Các giá trị được rải ra một cách ngẫu nhiên hơn
// để tạo cảm giác dòng chảy tự nhiên, không theo quy tắc cứng nhắc.
const delays = [
  '0.9s', '0.2s', '0.7s', '0.4s', '1.1s', '0.1s', '0.6s', 
  '0.3s', '0.8s', '0.5s', '1.0s'
];

const SoundWave: React.FC<SoundWaveProps> = React.memo(({ isPlaying }) => {
  return (
    // Có thể giảm khoảng cách một chút để các gợn sóng gần nhau hơn
    <div className="flex items-end justify-center h-12 gap-1"> 
      {delays.map((delay, index) => (
        <div
          key={index}
          // Sử dụng class animation mới: animate-gentle-flow
          // Giữ các cột mảnh mai với w-1
          className={`w-1 bg-white/80 rounded-full animate-gentle-flow ${!isPlaying ? 'animation-paused' : ''}`}
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  );
});

export default SoundWave;