import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing audio playback
 * @returns {Object} Audio player controls
 */
export default function useAudioPlayer() {
  const audioRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    // Create a single audio element to reuse
    audioRef.current = new Audio();

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
      })
      .catch(() => {
        // Ignore errors on unlock attempt
      });
  }, []);

  /**
   * Play an audio file
   * @param {String} audioPath - Path to the audio file
   * @param {Function} onEnd - Optional callback when audio ends
   */
  const play = useCallback((audioPath, onEnd = null) => {
    if (!audioRef.current) return;

    // Try to unlock audio on first play attempt
    if (!isUnlockedRef.current) {
      unlock();
    }

    // Stop current audio if playing
    stop();

    // Set new audio source
    audioRef.current.src = audioPath;
    currentAudioRef.current = audioPath;

    // Set up end callback
    if (onEnd) {
      audioRef.current.onended = onEnd;
    }

    // Play the audio with a small delay to allow unlock
    setTimeout(() => {
      if (audioRef.current && audioRef.current.src === audioPath) {
        audioRef.current.play().catch((error) => {
          console.warn('Audio playback blocked - user interaction may be required:', error.message);
        });
      }
    }, isUnlockedRef.current ? 0 : 100);
  }, [unlock]);

  /**
   * Stop the currently playing audio
   */
  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    currentAudioRef.current = null;
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
