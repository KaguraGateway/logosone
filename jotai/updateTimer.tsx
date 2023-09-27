import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

const lastUpdateAtAtom = atom(new Date());

export function useUpdateTimerWhenMin() {
  const [lastUpdateAt, setLastUpdateAt] = useAtom(lastUpdateAtAtom);

  const Update = useCallback(() => {
    setLastUpdateAt(new Date());
  }, [setLastUpdateAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      Update();
    }, 1000 * 60);
    return () => {
      clearInterval(timer);
    };
  }, [Update]);

  return { lastUpdateAt, Update };
}
