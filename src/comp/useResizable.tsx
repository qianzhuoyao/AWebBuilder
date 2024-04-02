import { useEffect, useRef, useState } from "react";

const DEFAULT_SIZE = {
  height: 0,
  width: 0,
} as const;

type ISize = { [k in keyof typeof DEFAULT_SIZE]: number };

export const useResizable = (propDom: HTMLElement | null) => {
  const [dom, setDom] = useState(() => propDom);
  const callback = useRef<{
    watchSizeEffect: (size: ISize) => void;
  }>({
    watchSizeEffect: () => void 0,
  });

  const [size, setSize] = useState<ISize>(DEFAULT_SIZE);
  useEffect(() => {
    console.log(callback.current, dom, "7774");
    const R = new ResizeObserver(() => {
      if (dom) {
        const { height, width } = dom.getBoundingClientRect();
        callback.current?.watchSizeEffect({ height, width });
        setSize({ height, width });
      }
    });
    dom && R.observe(dom);
    return () => {
      dom && R.unobserve(dom);
      R.disconnect();
    };
  }, [dom]);

  return {
    size,
    setDomObservable: (DOM: HTMLElement) => {
      setDom(DOM);
    },
    watch: (watchCallback: (size: ISize) => void) => {
      if (callback.current) {
        callback.current.watchSizeEffect = watchCallback;
      }
    },
  };
};
