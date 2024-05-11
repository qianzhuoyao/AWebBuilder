/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "next-themes";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Menu, Item, useContextMenu, ItemParams } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { fromEvent } from "rxjs";

export const useSceneContext = (
  id: string,
  handleClick?: (params: ItemParams<any, any>) => void
) => {
  const [position, setPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0
  })

  const { theme } = useTheme();
  const { show, hideAll } = useContextMenu({
    id,
  });

  useEffect(() => {
    const downSub = fromEvent<MouseEvent>(document, 'mousedown').subscribe(v => {
      console.log(v, 'acadownSubwcaqcw')
      setPosition({
        x: v.clientX,
        y: v.clientY
      })
    })
  }, [])

  return {
    show,
    hideAll,
    view: (nodes: ReactElement<any, any>[]) => (
      <Menu className={"z-[9999999999] absoulte"}
        style={{
          left: position.x,
          top: position.y
        }}
        id={id} theme={theme}>
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
