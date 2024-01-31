/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "next-themes";
import { ReactElement, useEffect, useId, useMemo } from "react";
import { Menu, Item, useContextMenu, ItemParams } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { Subject, take } from "rxjs";

export const useSceneContext = () => {
    const { theme } = useTheme();
  const MENU_ID = useId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event$ = useMemo<Subject<ItemParams<any, any>>>(
    () => new Subject(),
    []
  );

  useEffect(() => {
    return () => {
      event$.unsubscribe();
    };
  }, [event$]);

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  return {
    show,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleItemClick: (params: ItemParams<any, any>) => {
      event$.next(params);
    },
    view: (nodes: ReactElement<any, any>[]) => (
      <Menu id={MENU_ID} theme={theme}>
        {nodes.map((node, index) => {
          return (
            <Item
              id="copy"
              key={index}
              onClick={() => {
                event$.pipe(take(1)).subscribe();
              }}
            >
              {node}
            </Item>
          );
        })}
      </Menu>
    ),
  };
};
