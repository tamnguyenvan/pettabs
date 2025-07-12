// src/components/SoundWave.tsx

import React, { useState, useEffect, useRef } from 'react';

// DÁN DỮ LIỆU BẠN ĐÃ COPY TỪ SCRIPT PYTHON VÀO ĐÂY
const soundData: number[] = [0.5561, 0.5129, 0.4517, 0.3861, 0.3318, 0.3281, 0.3451, 0.3692,
  0.3879, 0.4164, 0.4509, 0.507, 0.5792, 0.6407, 0.6916, 0.7111, 0.7057, 0.6787,
  0.615, 0.5328, 0.4337, 0.3421, 0.28, 0.2343, 0.2006, 0.1745, 0.1509, 0.1495,
  0.1638, 0.1864, 0.2079, 0.226, 0.2516, 0.2742, 0.3001, 0.3177, 0.349, 0.4027,
  0.4628, 0.5126, 0.5396, 0.5341, 0.5164, 0.4785, 0.4185, 0.352, 0.2766, 0.217,
  0.1802, 0.1539, 0.1403, 0.1288, 0.1068, 0.0938, 0.0848, 0.0831, 0.083, 0.0795,
  0.0785, 0.086, 0.1027, 0.123, 0.1352, 0.1495, 0.1895, 0.2218, 0.2536, 0.2804,
  0.2723, 0.2852, 0.2997, 0.2844, 0.2775, 0.2536, 0.2262, 0.2257, 0.2112, 0.1962,
  0.1837, 0.1741, 0.1838, 0.1971, 0.2121, 0.2149, 0.211, 0.2143, 0.2274, 0.247,
  0.2666, 0.285, 0.3017, 0.3239, 0.3384, 0.329, 0.3225, 0.3086, 0.296, 0.3002,
  0.2905, 0.2787, 0.2659, 0.2339, 0.1976, 0.1509, 0.0988, 0.059, 0.0249, 0.0109,
  0.001, 0.0, 0.0201, 0.0459, 0.0747, 0.0966, 0.1064, 0.1193, 0.1325, 0.1419,
  0.1765, 0.2106, 0.2505, 0.2938, 0.3126, 0.3284, 0.353, 0.349, 0.3411, 0.3219,
  0.2891, 0.2714, 0.2374, 0.2331, 0.2288, 0.3201, 0.4446, 0.5592, 0.6777, 0.723,
  0.7037, 0.677, 0.5633, 0.423, 0.3038, 0.1884, 0.1644, 0.1734, 0.1844, 0.197,
  0.2073, 0.252, 0.3088, 0.3663, 0.4173, 0.4354, 0.4418, 0.4529, 0.4383, 0.4108,
  0.3762, 0.33, 0.3094, 0.2916, 0.2698, 0.2386, 0.208, 0.1979, 0.2354, 0.3078,
  0.3978, 0.4866, 0.5385, 0.5661, 0.6152, 0.6174, 0.5985, 0.5593, 0.4637, 0.424,
  0.4217, 0.3841, 0.3554, 0.3073, 0.2542, 0.2655, 0.2634, 0.249, 0.2284, 0.2188,
  0.2164, 0.2244, 0.2274, 0.2148, 0.2114, 0.2687, 0.3176, 0.3708, 0.4192, 0.4131,
  0.4116, 0.3957, 0.3299, 0.2598, 0.1927, 0.1336, 0.1198, 0.1157, 0.1208, 0.1257,
  0.1396, 0.1469, 0.157, 0.1759, 0.1884, 0.2067, 0.2154, 0.2163, 0.2254, 0.2162,
  0.204, 0.1994, 0.1854, 0.1808, 0.1738, 0.1564, 0.1464, 0.1406, 0.1335, 0.1273,
  0.1209, 0.1228, 0.1346, 0.1486, 0.1538, 0.1529, 0.1503, 0.1548, 0.3429, 0.5371,
  0.7374, 0.9451, 0.9806, 1.0, 0.9984, 0.7999, 0.5874, 0.3702, 0.159, 0.1256, 0.1075, 0.0994];

const NUM_BARS = 41;
const ANIMATION_SPEED_MS = 50; // Tăng tốc độ cập nhật
const MIN_BAR_HEIGHT_PERCENT = 15;
const SYMMETRY_SPREAD = 4;
const SMOOTHING_FACTOR = 0.15; // Giảm để làm mượt hơn

const SoundWave = ({ isPlaying }: { isPlaying: boolean }) => {
  const [frame, setFrame] = useState(0);
  const smoothedHeightsRef = useRef<number[]>(Array(NUM_BARS).fill(MIN_BAR_HEIGHT_PERCENT));
  const animationFrameRef = useRef<number>();

  // Hàm làm mượt exponential
  const exponentialSmooth = (current: number, target: number, alpha: number) => {
    return current + (target - current) * alpha;
  };

  // Hàm tạo dữ liệu được làm mượt từ soundData
  const getSmoothData = (index: number) => {
    const dataIndex = (frame + index) % soundData.length;
    const current = soundData[dataIndex] || 0;
    const prev = soundData[(dataIndex - 1 + soundData.length) % soundData.length] || 0;
    const next = soundData[(dataIndex + 1) % soundData.length] || 0;
    const next2 = soundData[(dataIndex + 2) % soundData.length] || 0;
    
    // Weighted average để làm mượt
    return (current * 0.4 + prev * 0.2 + next * 0.3 + next2 * 0.1);
  };

  // Sử dụng requestAnimationFrame thay vì setInterval
  const animate = () => {
    if (isPlaying) {
      setFrame(prevFrame => (prevFrame + 1) % soundData.length);
      
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, ANIMATION_SPEED_MS);
    }
  };

  useEffect(() => {
    if (isPlaying && soundData.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Reset về trạng thái tĩnh một cách mượt mà
      const resetToStatic = () => {
        const centerIndex = Math.floor(NUM_BARS / 2);
        smoothedHeightsRef.current = smoothedHeightsRef.current.map((current, index) => {
          const distanceFromCenter = Math.abs(index - centerIndex);
          const staticHeight = Math.max(MIN_BAR_HEIGHT_PERCENT, 
            100 - Math.pow(distanceFromCenter, 1.8) * 2.5);
          return exponentialSmooth(current, staticHeight, 0.05);
        });
      };
      resetToStatic();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Tạo ra một mảng các thanh tĩnh
  const staticBars = React.useMemo(() => 
    Array.from({ length: NUM_BARS }).map((_, index) => {
        const centerIndex = Math.floor(NUM_BARS / 2);
        const distanceFromCenter = Math.abs(index - centerIndex);
        const height = Math.max(MIN_BAR_HEIGHT_PERCENT, 
          100 - Math.pow(distanceFromCenter, 1.8) * 2.5);
        
        return (
            <div 
                key={index}
                className="w-1.5 bg-white/30 rounded-full"
                style={{ 
                    height: `${height}%`,
                    transition: 'none', // Bỏ transition
                }}
            />
        )
    }), 
  []);

  // Tạo ra một mảng các thanh động với làm mượt cực mạnh
  const animatedBars = React.useMemo(() => {
    return Array.from({ length: NUM_BARS }).map((_, index) => {
        const dataIndex = (frame + index) % soundData.length; // Không còn dùng SYMMETRY_SPREAD
        const amplitude = getSmoothData(dataIndex);

        const targetHeight = MIN_BAR_HEIGHT_PERCENT + 
            amplitude * (100 - MIN_BAR_HEIGHT_PERCENT);

        const currentHeight = smoothedHeightsRef.current[index] || MIN_BAR_HEIGHT_PERCENT;
        const newHeight = exponentialSmooth(currentHeight, targetHeight, SMOOTHING_FACTOR);
        smoothedHeightsRef.current[index] = newHeight;

        return (
            <div 
                key={index}
                className="w-1.5 bg-white/70 rounded-full"
                style={{
                    height: `${newHeight}%`,
                    transition: 'none',
                }}
            />
        );
    });
  }, [frame]);

  return (
    <div className="flex items-center justify-center h-24 gap-1.5 select-none">
      {isPlaying ? animatedBars : staticBars}
    </div>
  );
};

export default SoundWave;