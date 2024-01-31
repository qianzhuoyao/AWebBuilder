import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fromEvent, filter, switchMap, zip, map, takeUntil } from "rxjs";
import { IPs, updatePanelTickUnit } from "../store/slice/panelSlice";
import { AR_PANEL_DOM_ID } from "../contant";

const useKeyEvent = () => {
  const dispatch = useDispatch();
  const panelId = AR_PANEL_DOM_ID;

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  useEffect(() => {
    const dom = document.getElementById(panelId);
    if (!dom) {
      return;
    }

    const keyDown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
      filter((event) => {
        console.log(event, "vasvasvasvsav");
        return event.key === "f";
      })
    );

    const keyUp$ = fromEvent<KeyboardEvent>(document, "keyup");
    const scroll$ = fromEvent<WheelEvent>(document, "mousewheel").pipe(
      map((e) => {
        return e.deltaY;
      })
    );

    const mouseScroll$ = keyDown$.pipe(
      switchMap(() => scroll$.pipe(takeUntil(keyUp$)))
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = zip(keyDown$, mouseScroll$).subscribe(([_, w]) => {
      console.log(w, "wwwwwwwww");
      if (w > 0) {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit + 0.1).toFixed(1)))
        );
      } else {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit - 0.1).toFixed(1)))
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

//快捷键
export const useCustomHotKeys = () => {
  useKeyEvent();
};
