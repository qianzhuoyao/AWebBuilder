import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fromEvent, filter, switchMap, zip, map, takeUntil, take } from "rxjs";
import {
  IPs,
  updatePanelLockTransform,
  updatePanelTickUnit,
} from "../store/slice/panelSlice";
import { AR_PANEL_DOM_ID, ATTR_TAG, Node } from "../contant";
import { updateIsSelection, updateTargets } from "../store/slice/nodeSlice";

const scroll = <T,>(filter: (e: WheelEvent) => T) => {
  return fromEvent<WheelEvent>(document, "mousewheel").pipe(
    map((e) => {
      return filter(e);
    })
  );
};
const createMouseDown = <T,>(filter?: (e: MouseEvent) => T) => {
  return fromEvent<MouseEvent>(document, "mousedown").pipe(
    map((ev) => {
      return filter && filter(ev);
    })
  );
};
const createKeyDown = (code: string) => {
  return fromEvent<KeyboardEvent>(document, "keydown").pipe(
    filter((event) => {
      return event.key === code;
    })
  );
};
const createKeyUp = () => {
  return fromEvent<KeyboardEvent>(document, "keyup");
};
const useZoomKeyEvent = () => {
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

    const keyDown$ = createKeyDown("f");
    const keyUp$ = createKeyUp();
    const scroll$ = scroll<number>((e) => e.deltaY);

    const mouseScroll$ = keyDown$.pipe(
      switchMap(() => scroll$.pipe(takeUntil(keyUp$)))
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = zip(keyDown$, mouseScroll$).subscribe(([_, w]) => {
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
const useSelectionKeyEvent = () => {
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

    const keyDown$ = createKeyDown("q");
    const keyUp$ = createKeyUp();
    const mousedown$ = createMouseDown();

    const S$ = keyDown$.pipe(
      take(1),
      map(() => {
        dispatch(updatePanelLockTransform(true));
        dispatch(updateIsSelection(true));
      }),
      switchMap(() =>
        mousedown$.pipe(
          takeUntil(
            keyUp$.pipe(
              take(1),
              map(() => {
                dispatch(updatePanelLockTransform(false));
                dispatch(updateIsSelection(false));
              })
            )
          )
        )
      )
    );

    const subscription = zip(keyDown$, S$).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

const useDefaultBlurEvent = () => {
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

    const mousedown$ = createMouseDown((e) => e);

    const D$ = mousedown$.pipe(
      map((d) => {
        if (d?.target instanceof HTMLElement) {
          if (d?.target.getAttribute(ATTR_TAG) !== Node) {
            dispatch(updateTargets([]));
          }
        }
      })
    );

    const subscription = D$.subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [PanelState.tickUnit, dispatch, panelId]);
};

//快捷键
export const useCustomHotKeys = () => {
  //放大快捷键
  useZoomKeyEvent();
  //多选快捷键
  useSelectionKeyEvent();
  //自动取消焦点
  useDefaultBlurEvent();
};
