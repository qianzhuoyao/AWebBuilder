import { useEffect, useRef } from "react";
import { Graph, Node } from "@antv/x6";
import { LOGIC_PANEL_DOM_ID } from "../contant";
import { useSelector } from "react-redux";
import { ILs } from "../store/slice/logicSlice";
import ReactDOM from "react-dom";

interface GraphPanel {
  G: Graph | null;
  mountedIdList: Map<string, Node | undefined>;
}

export const LogicGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const GRef = useRef<GraphPanel>({ G: null, mountedIdList: new Map([]) });

  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  useEffect(() => {
    Object.values(logicState.logicNodes).map((node) => {
      if (!GRef.current.mountedIdList.has(node.id)) {
        const GNode = GRef.current.G?.addNode({
          shape: node.shape,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          imageUrl: node.imageUrl,
          attrs: {
            body: {
              fill: "#f5f5f5",
              stroke: "#d9d9d9",
              strokeWidth: 1,
            },
          },
          ports: {
            groups: {
              group1: {
                attrs: {},
              },
            },
            items: [
              {
                id: "in0",
                group: "group1",
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: "red",
                    fill: "#fff",
                    strokeWidth: 1,
                  },
                  text: {
                    //stroke: "red",
                    // 标签选择器
                    // text: "入口", // 标签文本
                  },
                },
              },
              {
                id: "out0",
                group: "group1",
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#31d0c6",
                    fill: "#fff",
                    strokeWidth: 1,
                  },
                  text: {
                    // 标签选择器
                    // text: "出口", // 标签文本
                  },
                },
              },
            ],
          },
        });
        GRef.current.mountedIdList.set(node.id, GNode);
      }
    });
  }, [logicState.logicNodes]);

  useEffect(() => {
    const GPanel = GRef.current?.G;

    if (!containerRef.current) {
      return;
    }
    GRef.current.G = new Graph({
      container: containerRef.current,
      grid: false,
      virtual: true,
      onPortRendered(args) {
        const selectors = args.contentSelectors;
        const container = selectors && selectors.foContent;
        if (container) {
          ReactDOM.render(<span>jA</span>, container as HTMLElement);
        }
      },
    });

    return () => {
      GPanel?.dispose();
    };
  }, []);

  return (
    <div id={LOGIC_PANEL_DOM_ID} className="w-full h-full">
      <div className="w-full h-full" ref={containerRef}></div>
    </div>
  );
};
