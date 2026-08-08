'use client';

import { useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
///@ts-ignore
import useSound from 'use-sound';

type NotificationSoundOptions = {
  loop?: boolean;
};

/**
 * 通知音を再生するためのフック
 *
 * use-soundは音声ファイルの読み込みが終わるまでplay()が無視されるため、
 * 読み込み前に再生要求があった場合は読み込み完了後に再生する。
 */
export function useNotificationSound(src: string, options?: NotificationSoundOptions) {
  const [play, { stop, sound }] = useSound(src, {
    interrupt: true,
    loop: options?.loop ?? false,
  });
  const isPendingRef = useRef(false);

  // 読み込み完了前の再生要求を再生する
  useEffect(() => {
    if (sound == null || !isPendingRef.current) return;
    isPendingRef.current = false;
    play();
  }, [sound, play]);

  const playSound = useCallback(() => {
    if (sound == null) {
      isPendingRef.current = true;
      return;
    }
    play();
  }, [sound, play]);

  const stopSound = useCallback(() => {
    isPendingRef.current = false;
    stop();
  }, [stop]);

  const isPlaying = useCallback(() => sound != null && sound.playing() === true, [sound]);

  return { play: playSound, stop: stopSound, isPlaying, isLoaded: sound != null };
}
