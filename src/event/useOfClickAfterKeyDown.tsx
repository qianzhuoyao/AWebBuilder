import { useEffect, useRef } from "react";
import { IBothEvent, ofClickAfterKeyDown } from "./bothEvent";
import { Subscription } from "rxjs";
/**
 * 
 * @param codes 
 *   const { click } = useOfClickAfterKeyDown(["a", "s"]);
  click((e) => {
    console.log(e, "0skl0sklfff");
  });
 * @returns 
 */
export const useOfClickAfterKeyDown = (codes: string[]) => {
  const evRef = useRef<{
    ins: IBothEvent | null;
    sub: Subscription | null;
    callback: ((e: MouseEvent) => void) | null;
  }>({
    ins: null,
    sub: null,
    callback: null,
  });

  useEffect(() => {
    if (!evRef.current.ins) {
      evRef.current.ins = ofClickAfterKeyDown();
      const ps = (codeIndex: number, event: IBothEvent | null) => {
        if (codes[codeIndex]) {
          ps(codeIndex + 1, event?.keyDown(codes[codeIndex]) || null);
        } else {
          evRef.current.sub =
            event?.subscribe(evRef.current.callback || undefined) || null;
        }
      };
      ps(0, evRef.current.ins);
    }
  }, [codes]);

  return {
    click: (callback: (e: MouseEvent) => void) => {
      evRef.current.callback = callback;
    },
  };
};
