import { useEffect, useRef } from 'react';

export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    // コンポーネントがアンマウントされたときに `isMounted` を `false` に設定
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
