// src/components/SoundWave.tsx

import React, { useState, useEffect } from 'react';

// DÁN DỮ LIỆU BẠN ĐÃ COPY TỪ SCRIPT PYTHON VÀO ĐÂY
// Ví dụ: const soundData = [0.1, 0.2, 0.35, ...];
const soundData: number[] = [
  0.0, 0.005, 0.015, 0.03, 0.05, 0.075, 0.1, 0.13, 0.16, 0.2, 0.24, 0.28, 0.32, 0.37, 0.42, 0.47, 
  0.52, 0.58, 0.63, 0.68, 0.73, 0.78, 0.83, 0.87, 0.91, 0.95, 0.98, 1.0, 0.97, 0.93, 0.88, 0.82,
  0.76, 0.7, 0.64, 0.58, 0.52, 0.46, 0.4, 0.35, 0.3, 0.26, 0.22, 0.18, 0.15, 0.12, 0.09, 0.07,
  0.05, 0.04, 0.03, 0.02, 0.015, 0.01, 0.008, 0.005, 0.003, 0.0, 0.004, 0.009, 0.016, 0.025, 0.035, 
  0.048, 0.06, 0.075, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.24, 0.25, 0.26, 0.27, 
  0.28, 0.29, 0.3, 0.29, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06,
  0.04, 0.02, 0.01, 0.0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 
  0.24, 0.26, 0.28, 0.29, 0.3
]; // Dữ liệu ví dụ, hãy thay bằng dữ liệu của bạn

const NUM_BARS = 101; // Số lẻ để có thanh ở giữa

const SoundWave = ({ isPlaying }: { isPlaying: boolean }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setFrame(prevFrame => (prevFrame + 1) % soundData.length);
      }, 60); // Tốc độ animation, 60ms cho cảm giác chậm rãi

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Tạo ra một mảng các thanh đối xứng
  const bars = Array.from({ length: NUM_BARS }).map((_, index) => {
    // Tìm vị trí trung tâm
    const centerIndex = Math.floor(NUM_BARS / 2);
    // Tính khoảng cách từ thanh hiện tại đến trung tâm
    const distanceFromCenter = Math.abs(index - centerIndex);
    
    // Lấy dữ liệu từ soundData, đối xứng qua tâm
    // Dùng modulo để tạo vòng lặp mượt mà
    const dataIndex = (frame + distanceFromCenter * 5) % soundData.length;
    const heightValue = soundData[dataIndex];
    
    // Tính toán chiều cao thực tế
    // Chiều cao tối thiểu 10%, tối đa 100%
    const height = 10 + heightValue * 90;

    return (
      <div 
        key={index}
        className="w-1 bg-white/50 rounded-full"
        style={{
          height: `${height}%`,
          // CSS transition để tạo hiệu ứng mượt mà khi chiều cao thay đổi
          transition: 'height 0.2s ease-out',
        }}
      />
    );
  });

  const staticBars = Array.from({ length: NUM_BARS }).map((_, index) => {
    const centerIndex = Math.floor(NUM_BARS / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const height = 100 - distanceFromCenter * 5; // Tạo hình parabol
    return (
      <div 
        key={index}
        className="w-1 bg-white/50 rounded-full transition-all duration-300"
        style={{ height: `${height}%` }}
      />
    )
  });

  return (
    <div className="flex items-center justify-center h-48 gap-1">
      {isPlaying ? bars : staticBars}
    </div>
  );
};

export default SoundWave;