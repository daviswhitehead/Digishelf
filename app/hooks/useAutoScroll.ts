import { useState } from 'react';

interface AutoScrollState {
  autoScrollEnabled: boolean;
  setAutoScrollEnabled: (enabled: boolean) => void;
}

export const useAutoScroll = (): AutoScrollState => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(false);

  return {
    autoScrollEnabled,
    setAutoScrollEnabled,
  };
};
