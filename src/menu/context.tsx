/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "next-themes";
import { ReactElement } from "react";
import { Menu, Item, useContextMenu, ItemParams } from "react-contexify";
import "react-contexify/ReactContexify.css";

export const useSceneContext = (
  id: string,
  handleClick?: (params: ItemParams<any, any>) => void
) => {
  const { theme } = useTheme();
  const { show, hideAll } = useContextMenu({
    id,
  });

  return {
    show,
    hideAll,
    view: (nodes: ReactElement<any, any>[]) => (
      <Menu id={id} theme={theme}>
        {nodes.map((node, index) => {
          return (
            <Item
              id={"menu-id" + index}
              key={index}
              onClick={(params) => {
                handleClick && handleClick(params);
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
