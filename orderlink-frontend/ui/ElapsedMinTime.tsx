import { differenceInMinutes, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import { useUpdateTimerWhenMin } from '@/jotai/updateTimer';

function getElapsedMin(date: Date | string) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return differenceInMinutes(new Date(), date);
}

export function ElapsedMinTime(props: { dateISO: string | Date }) {
  const [elapsedMin, setElapsedMin] = useState(getElapsedMin(props.dateISO));
  const { lastUpdateAt } = useUpdateTimerWhenMin();

  useEffect(() => {
    setElapsedMin(getElapsedMin(props.dateISO));
  }, [lastUpdateAt, props.dateISO]);

  return <span>{elapsedMin} 分</span>;
}
