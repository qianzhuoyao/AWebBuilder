import { DependencyList, useEffect, useRef } from "react";
import { IConfig, subscribeConfig } from "../node/viewConfigSubscribe";

export const useAutoSubscription = (id: string, deps?: DependencyList) => {
  const callbackRef = useRef<{
    fn: null | ((e: IConfig & { id?: string }) => void);
  }>({ fn: null });
  useEffect(() => {
    const autoSubscription = subscribeConfig((value) => {
      if (id === value.id) {
        callbackRef.current.fn?.(value);
      }
    });
    return () => {
      autoSubscription.unsubscribe();
    };
  }, [deps, id]);

  return {
    render: (callback: (e: IConfig & { id?: string }) => void) => {
      callbackRef.current.fn = callback;
    },
  };
};
