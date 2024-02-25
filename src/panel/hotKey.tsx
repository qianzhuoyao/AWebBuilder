import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fromEvent,
  filter,
  merge,
  repeat,
  switchMap,
  zip,
  map,
  takeUntil,
  take,
} from 'rxjs';
import {
  IPs,
  updateIsSelection,
  updatePanelTickUnit,
} from '../store/slice/panelSlice';
import { AR_PANEL_DOM_ID, ATTR_TAG, Node, NODE_ID } from '../contant';
import { updateTargets } from '../store/slice/nodeSlice';
import { checkMouseDownInArea } from '../comp/mousdownArea.ts';

const scroll = <T, >(filter: (e: WheelEvent) => T) => {
  return fromEvent<WheelEvent>(document, 'mousewheel').pipe(
    map((e) => {
      return filter(e);
    }),
  );
};
const createMouseDown = <T, >(filter?: (e: MouseEvent) => T) => {
  return fromEvent<MouseEvent>(document, 'mousedown').pipe(
    map((ev) => {
      return filter && filter(ev);
    }),
  );
};
const createMouseUp = <T, >(filter?: (e: MouseEvent) => T) => {
  return fromEvent<MouseEvent>(document, 'mouseup').pipe(
    map((ev) => {
      return filter && filter(ev);
    }),
  );
};
const createKeyDown = (code: string) => {
  return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter((event) => {
      return event.key === code;
    }),
  );
};
const createKeyUp = () => {
  return fromEvent<KeyboardEvent>(document, 'keyup');
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

    const keyDown$ = createKeyDown('f');
    const keyUp$ = createKeyUp();
    const scroll$ = scroll<number>((e) => e.deltaY);

    const mouseScroll$ = keyDown$.pipe(
      switchMap(() => scroll$.pipe(takeUntil(keyUp$))),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = zip(keyDown$, mouseScroll$).subscribe(([_, w]) => {
      if (w > 0) {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit + 0.1).toFixed(1))),
        );
      } else {
        dispatch(
          updatePanelTickUnit(Number((PanelState.tickUnit - 0.1).toFixed(1))),
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

    const keyDown$ = createKeyDown('q');
    const keyUp$ = createKeyUp();
    const mousedown$ = createMouseDown();
    const mouseup$ = createMouseUp();

    const S$ = keyDown$.pipe(
      map(() => {
        // dispatch(updatePanelLockTransform(true));
        dispatch(updateIsSelection(true));
      }),
      switchMap(() =>
        mousedown$.pipe(
          takeUntil(
            merge(mouseup$, keyUp$).pipe(
              map(() => {
                dispatch(updateIsSelection(false));
              }),
            ),
          ),
        ),
      ),
    );

    const subscription = zip(keyDown$, S$).pipe(take(1), repeat()).subscribe();

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
          console.log(d, 'dasdasdasdsadsadasdsadddf');
          if (d?.target.getAttribute(ATTR_TAG) !== Node) {
            if (checkMouseDownInArea({
              x: d.pageX,
              y: d.pageY,
            }, document.getElementById(AR_PANEL_DOM_ID))) {
              dispatch(updateTargets([]));
            }
            // dispatch(updateTargets([]));
          }
        }
      }),
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
