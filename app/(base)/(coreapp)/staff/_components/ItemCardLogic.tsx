import { useState } from 'react';

export function useItemCardLogic() {
  const [isCalled, setIsCalled] = useState(false);

  const onCallCancel = () => {
    setIsCalled(false);
  };
  const onCall = () => {
    setIsCalled(true);
  };

  return { isCalled, onCallCancel, onCall };
}
