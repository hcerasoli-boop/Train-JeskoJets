'use client';

import { useState, useEffect } from 'react';

interface PreloaderResult {
  images: HTMLImageElement[];
  isLoading: boolean;
  progress: number;
}

export function useImagePreloader(
  directoryPath: string,
  totalFrames: number,
  formatFileName: (index: number) => string = (index) => `${(index + 1).toString().padStart(3, '0')}.jpg`
): PreloaderResult {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const loadImages = async () => {
      // Build an array of promises for each image to load
      const promises = Array.from({ length: totalFrames }).map((_, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = `${directoryPath}/${formatFileName(index)}`;

          img.onload = () => {
            if (isCancelled) return;
            loadedCount++;
            setProgress(Math.round((loadedCount / totalFrames) * 100));
            loadedImages[index] = img;
            resolve();
          };

          img.onerror = () => {
            if (isCancelled) return;
            console.error(`Failed to load image: ${img.src}`);
            // Resolve anyway to avoid breaking Promise.all completely for a single missing frame
            resolve();
          };
        });
      });

      await Promise.all(promises);

      if (!isCancelled) {
        setImages(loadedImages.filter(Boolean)); // Filter out any potential undefined/failed images
        setIsLoading(false);
      }
    };

    if (totalFrames > 0) {
      loadImages();
    }

    return () => {
      isCancelled = true;
    };
  }, [directoryPath, totalFrames, formatFileName]);

  return { images, isLoading, progress };
}
