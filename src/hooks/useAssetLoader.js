import { useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Custom hook for preloading assets with progress tracking
 * @param {Array} audioFiles - Array of audio file paths
 * @param {Array} textureFiles - Array of texture file URLs
 * @returns {Object} { isLoading, progress, assets }
 */
export default function useAssetLoader(audioFiles = [], textureFiles = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState({
    audio: {},
    textures: {}
  });

  useEffect(() => {
    const totalAssets = audioFiles.length + textureFiles.length;
    if (totalAssets === 0) {
      setIsLoading(false);
      setProgress(100);
      return;
    }

    // Reset state when starting new load
    setIsLoading(true);
    setProgress(0);

    let loadedCount = 0;
    const loadedAudio = {};
    const loadedTextures = {};
    let isCancelled = false;
    const audioElements = [];

    const updateProgress = () => {
      if (isCancelled) return;

      loadedCount++;
      setProgress((loadedCount / totalAssets) * 100);

      if (loadedCount === totalAssets) {
        setAssets({
          audio: loadedAudio,
          textures: loadedTextures
        });
        setIsLoading(false);
      }
    };

    // Preload audio files
    audioFiles.forEach((audioPath) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audioElements.push(audio);

      const handleCanPlayThrough = () => {
        if (!isCancelled) {
          loadedAudio[audioPath] = audio;
          updateProgress();
        }
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
      };

      const handleError = (error) => {
        if (!isCancelled) {
          console.warn(`Failed to load audio: ${audioPath}`, error);
          updateProgress(); // Still count as loaded to not block forever
        }
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('error', handleError);
      audio.src = audioPath;
      audio.load();
    });

    // Preload textures
    const textureLoader = new THREE.TextureLoader();
    textureFiles.forEach((texturePath) => {
      textureLoader.load(
        texturePath,
        (texture) => {
          if (!isCancelled) {
            loadedTextures[texturePath] = texture;
            updateProgress();
          }
        },
        undefined,
        (error) => {
          if (!isCancelled) {
            console.warn(`Failed to load texture: ${texturePath}`, error);
            updateProgress(); // Still count as loaded to not block forever
          }
        }
      );
    });

    // Cleanup function
    return () => {
      isCancelled = true;
      audioElements.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };

  }, [audioFiles.length, textureFiles.length]); // Use lengths to prevent infinite loops

  return { isLoading, progress, assets };
}
