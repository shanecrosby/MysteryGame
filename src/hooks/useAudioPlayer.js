import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing audio playback
 * @returns {Object} Audio player controls
 */
export default function useAudioPlayer() {
  const audioRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isUnlockedRef = useRef(false);
  const playQueueRef = useRef([]);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Create a single audio element to reuse
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto'; // Ensure audio preloads properly

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  /**
   * Unlock audio playback (call on user interaction)
   */
  const unlock = useCallback(() => {
    if (!audioRef.current || isUnlockedRef.current) return;

    // Play and immediately pause a silent audio to unlock the audio context
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    silentAudio.play()
      .then(() => {
        silentAudio.pause();
        isUnlockedRef.current = true;
        console.log('Audio unlocked successfully');
      })
      .catch((error) => {
        console.warn('Failed to unlock audio:', error.message);
      });
  }, []);

  /**
   * Process the play queue
   */
  const processQueue = useCallback(() => {
    if (isProcessingRef.current || playQueueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const { audioPath, onEnd } = playQueueRef.current.shift();

    // Wait 1 second if audio is currently playing or just finished
    const delay = audioRef.current && !audioRef.current.paused ? 1000 : 0;

    setTimeout(() => {
      if (!audioRef.current) {
        isProcessingRef.current = false;
        return;
      }

      // Stop current audio if playing
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }

      audioRef.current.currentTime = 0;
      audioRef.current.src = audioPath;
      currentAudioRef.current = audioPath;

      // Set up end callback with queue processing
      audioRef.current.onended = () => {
        if (onEnd) onEnd();
        isProcessingRef.current = false;
        // Process next item in queue after a brief delay
        setTimeout(() => processQueue(), 100);
      };

      // Load and play the audio
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          console.log('Playing audio:', audioPath);
        })
        .catch((error) => {
          console.warn('Audio playback failed:', error.message);
          isProcessingRef.current = false;
          // Try next item in queue
          setTimeout(() => processQueue(), 100);
        });
    }, delay);
  }, []);

  /**
   * Play an audio file (adds to queue to prevent overlapping)
   * @param {String} audioPath - Path to the audio file
   * @param {Function} onEnd - Optional callback when audio ends
   */
  const play = useCallback((audioPath, onEnd = null) => {
    if (!audioRef.current) return;

    // Try to unlock audio on first play attempt
    if (!isUnlockedRef.current) {
      unlock();
      // Wait a bit for unlock to complete
      setTimeout(() => {
        playQueueRef.current.push({ audioPath, onEnd });
        processQueue();
      }, 150);
    } else {
      playQueueRef.current.push({ audioPath, onEnd });
      processQueue();
    }
  }, [unlock, processQueue]);

  /**
   * Stop the currently playing audio and clear queue
   */
  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    currentAudioRef.current = null;
    playQueueRef.current = [];
    isProcessingRef.current = false;
  }, []);

  /**
   * Check if audio is currently playing
   * @returns {Boolean}
   */
  const isPlaying = useCallback(() => {
    return audioRef.current && !audioRef.current.paused;
  }, []);

  /**
   * Get the currently playing audio path
   * @returns {String|null}
   */
  const getCurrentAudio = useCallback(() => {
    return currentAudioRef.current;
  }, []);

  return {
    play,
    stop,
    isPlaying,
    getCurrentAudio,
    unlock
  };
}
