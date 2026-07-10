import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      if (mounted) setIsOnline(state.isConnected ?? true);
    };

    check();

    const interval = setInterval(check, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}
