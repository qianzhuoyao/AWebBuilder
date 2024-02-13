import { useEffect, useRef } from "react";
import { Graph, Node } from "@antv/x6";
import { LOGIC_PANEL_DOM_ID } from "../contant";
import { useDispatch, useSelector } from "react-redux";
import {
  addLogicEdge,
  ILogicNode,
  ILs,
  updateLogicNode,
  updateLogicPortsNode,
} from "../store/slice/logicSlice";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { getWDGraph } from "../DirGraph/weightedDirectedGraph.ts";

interface GraphPanel {
  G: Graph | null;
  mountedIdList: Map<string, Node | undefined>;
}

const colorSet = (color: 0 | 1 | 2) => {
  return color === 0 ? "#e1e1e1" : color === 1 ? "red" : "green";
};

const nodeProp = (node: ILogicNode) => {
  return {
    shape: node.shape,
    x: node.x,
    nodeGId: node.id,
    typeId: node.typeId,
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
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: "#31d0c6",
              strokeWidth: 2,
              fill: "#fff",
            },
            text: {
              fontSize: 12,
              fill: "#888",
            },
          },
          position: {
            name: "absolute",
          },
        },
      },
      items: node.ports.map((item) => {
        return {
          id: item.type + item.tag,
          tag: item.tag,
          group: "group1",
          // 通过 args 指定绝对位置
          args: {
            x: item.type === "in" ? 0 : "100%",
            y: "100%",
          },
          label: {
            position: {
              name: item.type === "in" ? "" : "right",
            },
          },
          attrs: {
            circle: {
              magnet: true,
              stroke: colorSet(item.pointStatus),
              fill: colorSet(item.pointStatus),
            },
            text: { text: item.type },
          },
        };
      }),
    },
  };
};

export const LogicPanel = () => {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const GRef = useRef<GraphPanel>({ G: null, mountedIdList: new Map([]) });

  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  useEffect(() => {
    console.log(logicState.logicEdges, "logicState.logicEdges");
  }, [logicState.logicEdges]);

  useEffect(() => {
    console.log(logicState.logicNodes, "logicState.logicNodes");
    Object.values(logicState.logicNodes).map((node) => {
      if (!GRef.current.mountedIdList.has(node.id)) {
        const GNode = GRef.current.G?.addNode(nodeProp(node));
        GRef.current.mountedIdList.set(node.id, GNode);
      } else {
        if (GRef.current.mountedIdList.get(node.id)) {
          (GRef.current.mountedIdList.get(node.id) as Node).setProp(
            nodeProp(node)
          );
        }
      }
    });
  }, [logicState.logicNodes]);

  useEffect(() => {
    const GPanel = GRef.current?.G;

    if (!containerRef.current) {
      return;
    }
    GRef.current.G = new Graph({
      translating: {
        restrict: true,
      },
      connecting: {
        validateEdge(args) {
          if (
            (args.edge.getSourcePortId() || "").indexOf("out") > -1 &&
            (args.edge.getTargetPortId() || "").indexOf("in") > -1
          ) {
            try {
              dispatch(
                addLogicEdge({
                  from: args.edge.getSourceNode()?.getProp().nodeGId,
                  to: args.edge.getTargetNode()?.getProp().nodeGId,
                  weight: 1,
                })
              );

              dispatch(
                updateLogicPortsNode({
                  id: args.edge.getSourceNode()?.getProp().nodeGId,
                  tag: Number(args.edge.getSourcePortId()?.replace("out", "")),
                  portType: "out",
                  connected: 1,
                })
              );
              dispatch(
                updateLogicPortsNode({
                  id: args.edge.getTargetNode()?.getProp().nodeGId,
                  tag: Number(args.edge.getTargetPortId()?.replace("in", "")),
                  portType: "in",
                  connected: 1,
                })
              );

              console.log(
                getWDGraph(),
                args.edge.getSourceNode()?.getProp(),
                "getWDGraph"
              );
              return true;
            } catch (e) {
              toast.error((e as { message: string }).message);
              return false;
            }
          } else {
            toast.error("边的起点应该是出口,目标应该是入口");
            return false;
          }
        },
        snap: true,
        highlight: true,
        allowLoop: false,
        allowEdge: false,
        allowBlank() {
          // 根据条件返回 true or false
          return false;
        },
      },

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
    GRef.current.G.on("node:mousedown", (args) => {
      console.log(args, "argssssss");
    });
    GRef.current.G.on("node:mouseup", (args) => {
      console.log(args.node.getProp(), "mouseup");
      dispatch(
        updateLogicNode({
          id: args.node.getProp().nodeGId,
          x: args.node.getBBox().x,
          y: args.node.getBBox().y,
        })
      );
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
