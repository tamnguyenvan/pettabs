import React, { useEffect } from 'react';
import { WORKER_URL } from '../lib/constants';

interface BackgroundImageLoaderProps {
  category: 'cat' | 'dog' | string;
}

const BackgroundImageLoader: React.FC<BackgroundImageLoaderProps> = ({ category }) => {
  useEffect(() => {
    const fetchAndSetBackground = async () => {
      try {
        // Gọi đến Cloudflare Worker thay vì ImageKit SDK
        const response = await fetch(`${WORKER_URL}/api/background?category=${category}`);

        if (!response.ok) {
          throw new Error(`Worker responded with status: ${response.status}`);
        }
        
        const data: { url: string } = await response.json();
        preloadAndApplyImage(data.url);

      } catch (error) {
        console.error("Failed to fetch image from Worker:", error);
        // Có thể thêm logic fallback ở đây, ví dụ dùng ảnh mặc định
      }
    };
    
    const preloadAndApplyImage = (url: string) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            document.body.style.backgroundImage = `url(${url})`;
        };
        img.onerror = () => {
            console.error("Failed to load image from URL:", url);
        }
    };

    if (category) {
      fetchAndSetBackground();
    }
  }, [category]);

  return null;
};

export default BackgroundImageLoader;