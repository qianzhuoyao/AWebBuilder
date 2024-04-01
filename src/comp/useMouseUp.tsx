import { useEffect } from "react";

type IMouseUpFn = (ev: MouseEvent) => void;

export const useMouseUp = (mouseUp: IMouseUpFn) => {
  useEffect(() => {
    window.addEventListener("mouseup", mouseUp, false);
    return () => {
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseUp]);
};
