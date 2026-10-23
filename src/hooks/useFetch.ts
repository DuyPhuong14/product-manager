import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/error';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let ignore = false; // tránh set state khi component đã unmount / request cũ

    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!ignore) setState({ data: null, loading: false, error: getErrorMessage(err) });
      });

    return () => {
      ignore = true;
    };
  }, [fetcher, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { ...state, reload };
}