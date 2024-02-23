import { memo, useCallback, useEffect, useRef } from 'react';
import { Graph, Node } from '@antv/x6';
import { LOGIC_PANEL_DOM_ID } from '../contant';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLogicEdge, deleteNode,
  ILogicNode,
  ILs, setLogicTarget,
  updateLogicNode,
  updateLogicPortsNode,
} from '../store/slice/logicSlice';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { useSceneContext } from '../menu/context.tsx';
import { ItemParams, TriggerEvent } from 'react-contexify';


interface GraphPanel {
  G: Graph | null;
  mountedIdList: Map<string, Node | undefined>;

}


const colorSet = (color: 0 | 1 | 2) => {
  return color === 0 ? '#e1e1e1' : color === 1 ? 'red' : '#22F576FF';
};


const renderNode = (node: ILogicNode) => {
  console.log(node, 'nodessss');
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
        fill: '#f5f5f5',
        stroke: '#d9d9d9',
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
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
            },
            text: {
              fontSize: 12,
              fill: '#888',
            },
          },
          position: {
            name: 'absolute',
          },
        },
      },
      items: node.ports.map((item, index) => {
        return {
          id: item.type + item.tag + '#' + item.id,
          tag: item.tag,
          group: 'group1',
          // 通过 args 指定绝对位置
          args: {
            x: item.type === 'in' ? 0 : '100%',
            y: item.type === 'in' ? (index * 40) : '100%',
          },
          label: {
            position: {
              name: item.type === 'in' ? '' : 'right',
            },
          },
          attrs: {
            circle: {
              magnet: true,
              stroke: colorSet(item.pointStatus),
              fill: colorSet(item.pointStatus),
            },
            text: { text: item.portName || 'out' },
          },
        };
      }),
    },
  };
};


export const LogicPanel = memo(() => {

  const GRef = useRef<GraphPanel>({ G: null, mountedIdList: new Map([]) });

  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });


  useEffect(() => {
    GRef.current.G?.getEdges().map(edge => {
      console.log(edge.getSourceCell()?.getProp(), logicState.signalSet, 'edge-edge');
      if (logicState.signalSet.includes(edge.getSourceCell()?.getProp().nodeGId)
        && logicState.signalSet.includes(edge.getTargetCell()?.getProp().nodeGId)
      ) {
        dispatch(updateLogicPortsNode({
          id: edge.getSourceNode()?.getProp().nodeGId,
          tag: edge.getSourcePortId(),
          portType: 'out',
          connected: 2,
        }));
        dispatch(updateLogicPortsNode({
          id: edge.getTargetNode()?.getProp().nodeGId,
          tag: edge.getTargetPortId(),
          portType: 'in',
          connected: 2,
        }));
        edge.setAttrs({
          line: {
            stroke: '#22F576FF',
            targetMarker: 'classic',
          },
        });
      } else {
        dispatch(updateLogicPortsNode({
          id: edge.getSourceNode()?.getProp().nodeGId,
          tag: edge.getSourcePortId(),
          portType: 'out',
          connected: 1,
        }));
        dispatch(updateLogicPortsNode({
          id: edge.getTargetNode()?.getProp().nodeGId,
          tag: edge.getTargetPortId(),
          portType: 'in',
          connected: 1,
        }));
        edge.setAttrs({
          line: {
            stroke: '#f5222d',
            targetMarker: 'classic',
          },
        });
      }
    });
  }, [logicState.signalSet]);


  const { view: NodeView, show: NodeShow } = useSceneContext(
    'NODE',
    params => {
      switch ((params.event.target as HTMLElement)?.innerText) {
        case '删除点':
          return removeNode(params);
      }
    },
  );

  const { view, show } = useSceneContext(
    'LINE',
    params => {
      console.log(params, (params.event.target as HTMLElement)?.innerText, params.props.edge.getSourceNode()?.getProp(), 'params');
      switch ((params.event.target as HTMLElement)?.innerText) {
        case '删除边':
          return removeEdge(params);
      }
    },
  );
  const containerRef = useRef<HTMLDivElement>(null);


  const removeNode = useCallback((params: ItemParams) => {
    console.log(params, 'params-0');
    GRef.current.G?.removeNode(params.props.node.id);
    getWDGraph().removeVertex(
      params.props.nodeProp.nodeGId,
    );
    dispatch(deleteNode({
      id: params.props.nodeProp.nodeGId,
    }));
  }, [dispatch]);

  const removeEdge = useCallback((params: ItemParams) => {

    GRef.current.G?.removeEdge(params.props.edge.id);
    getWDGraph().removeEdge(
      params.props.sourceNode.nodeGId,
      params.props.targetNode.nodeGId,
    );
    dispatch(
      updateLogicPortsNode({
        id: params.props.sourceNode.nodeGId,
        tag: Number(params.props.sourcePortId?.replace('out', '')),
        portType: 'out',
        connected: 0,
      }),
    );
    dispatch(
      updateLogicPortsNode({
        id: params.props.targetNode.nodeGId,
        tag: Number(params.props.targetPortId?.replace('in', '')),
        portType: 'in',
        connected: 0,
      }),
    );
  }, []);


  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    console.log(GRef.current.G, 'GRef.current.G');
    GRef.current.G = GRef.current.G || new Graph({
      translating: {
        restrict: true,
      },
      connecting: {
        validateEdge(args) {
          console.log((args.edge.getSourcePortId() || '').indexOf('out') > -1 &&
            (args.edge.getTargetPortId() || '').indexOf('in') > -1, args.edge.getSourcePortId(), args.edge.getTargetPortId(), 's-sf');
          if (
            (args.edge.getSourcePortId()?.split('#')[0] || '').indexOf('out') > -1 &&
            (args.edge.getTargetPortId()?.split('#')[0] || '').indexOf('in') > -1
          ) {
            try {
              console.log(args, '0o0o0');
              dispatch(
                addLogicEdge({
                  fromPort: args.edge.getSourcePortId(),
                  toPort: args.edge.getTargetPortId(),
                  from: args.edge.getSourceNode()?.getProp().nodeGId,
                  to: args.edge.getTargetNode()?.getProp().nodeGId,
                  weight: 1,
                }),
              );

              dispatch(
                updateLogicPortsNode({
                  id: args.edge.getSourceNode()?.getProp().nodeGId,
                  tag: args.edge.getSourcePortId(),
                  portType: 'out',
                  connected: 1,
                }),
              );
              dispatch(
                updateLogicPortsNode({
                  id: args.edge.getTargetNode()?.getProp().nodeGId,
                  tag: args.edge.getTargetPortId(),
                  portType: 'in',
                  connected: 1,
                }),
              );
              return true;
            } catch (e) {
              toast.error((e as { message: string }).message);
              return false;
            }
          } else {
            toast.error('边的起点应该是出口,目标应该是入口');
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
    GRef.current.G?.on('node:mousedown', (args) => {
      console.log(args, 'argssssss');
    });
    GRef.current.G?.on('node:contextmenu', ({ e, x, y, node, view }) => {
      console.log(e, x, y, node, view);
      NodeShow({
        event: (e as unknown as TriggerEvent),
        props: {
          e, x, y, node, view,
          nodeProp: node.getProp(),
        },
      });
    });
    GRef.current.G?.on('edge:contextmenu', ({ e, x, y, edge, view }) => {
      show({
        event: (e as unknown as TriggerEvent),
        props: {
          e, x, y, edge, view,
          targetPortId: edge.getTargetPortId(),
          sourcePortId: edge.getSourcePortId(),
          sourceNode: edge.getSourceNode()?.getProp(),
          targetNode: edge.getTargetNode()?.getProp(),
        },
      });
    });
    GRef.current.G?.on('blank:click', () => {
      dispatch(setLogicTarget([]));
    });
    GRef.current.G?.on('edge:added', ({ edge }) => {
      //连接后，默认无信号
      if (logicState.signalSet.includes(edge.getSourceCell()?.getProp().nodeGId)
        && logicState.signalSet.includes(edge.getTargetCell()?.getProp().nodeGId)
      ) {
        edge.setAttrs({
          line: {
            stroke: '#22F576FF',
            targetMarker: 'classic',
          },
        });
      } else {
        edge.setAttrs({
          line: {
            stroke: '#f5222d',
            targetMarker: 'classic',
          },
        });
      }

    });
    GRef.current.G?.on('node:mouseup', (args) => {
      console.log(args.node.getProp(), 'mouseup');
      dispatch(setLogicTarget([args.node.getProp().nodeGId]));
      //更新位置
      dispatch(
        updateLogicNode({
          id: args.node.getProp().nodeGId,
          x: args.node.getBBox().x,
          y: args.node.getBBox().y,
        }),
      );
    });
    Object.values(logicState.logicNodes).map((node) => {
      if (!GRef.current.mountedIdList.has(node.id)) {
        //添加
        console.log(GRef.current.G?.getNodes(), logicState.logicNodes, 'fgfgfffff');
        const GNode = GRef.current.G?.addNode(renderNode(node));
        GRef.current.mountedIdList.set(node.id, GNode);
      } else {
        //更新
        if (GRef.current.mountedIdList.get(node.id)) {
          (GRef.current.mountedIdList.get(node.id) as Node).setProp(
            renderNode(node),
          );
        }
      }
    });
    logicState.logicEdges.map(logicEdgeItem => {
      const nodeA = GRef.current.mountedIdList.get(logicEdgeItem.from);
      const nodeB = GRef.current.mountedIdList.get(logicEdgeItem.to);
      console.log({ nodeA, nodeB, logicEdgeItem }, 'nodeA,nodeB');
      if (nodeA && nodeB) {
        GRef.current.G?.addEdge({
          source: {
            cell: nodeA.id,
            port: logicEdgeItem.fromPort, // 链接桩 ID
          },
          target: {
            cell: nodeB.id,
            port: logicEdgeItem.toPort, // 链接桩 ID
          },
        });
      }
    });
  }, [logicState.logicNodes, logicState.logicEdges, dispatch, NodeShow, show]);


  return (<>
      <div id={LOGIC_PANEL_DOM_ID} className="w-full h-full">
        <div className="w-full h-full" ref={containerRef}></div>
      </div>
      {view(
        ['删除边'].map((value) => {
          return <div key={value}>{value}</div>;
        }),
      )}
      {NodeView(
        ['删除点'].map((value) => {
          return <div key={value}>{value}</div>;
        }),
      )}
    </>

  );
});
