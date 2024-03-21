import { memo, useCallback, useEffect, useRef } from 'react';
import { Graph, Node } from '@antv/x6';
import { LOGIC_PANEL_DOM_ID } from '../contant';
import { useDispatch } from 'react-redux';
import {
  deleteLogicNode,
  ILogicNode, setLogicTarget,
  updateLogicNode,
} from '../store/slice/logicSlice';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { useSceneContext } from '../menu/context.tsx';
import { ItemParams, TriggerEvent } from 'react-contexify';
import { findPortInfo, getPortNodeMap, updateConnectStatus } from '../node/portStatus.ts';
import { deleteSubNode, subscribeCreateNode, subscribeUpdateEdge } from './logicPanelEventSubscribe.ts';
import { useFilterLogicNode } from './useFilter.tsx';
import { getRunningTasks } from '../comp/msg.tsx';
import { createPEM, findPEM, getPortEdgeMap, removePEM } from './portEdgeMap.ts';


interface GraphPanel {
  G: Graph | null;
}


const colorSet = (color: 0 | 1 | 2) => {
  return color === 0 ? '#e1e1e1' : color === 1 ? 'red' : '#22F576FF';
};


const renderNode = (node: ILogicNode) => {
  const ports = getPortNodeMap(node.id);
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
      items: [...(ports || [])]?.map((item, index) => {
        const partInfo = findPortInfo(item);
        return !partInfo ? {} : {
          id: item,
          tag: partInfo.tag,
          group: 'group1',
          // 通过 args 指定绝对位置
          args: {
            x: partInfo.type === 'in' ? 0 : '100%',
            y: partInfo.type === 'in' ? (index * 40) : '100%',
          },
          label: {
            position: {
              name: partInfo.type === 'in' ? '' : 'right',
            },
          },
          attrs: {
            circle: {
              magnet: true,
              stroke: colorSet(partInfo.pointStatus),
              fill: colorSet(partInfo.pointStatus),
            },
            text: { text: partInfo.portName || 'out' },
          },
        };
      }),
    },
  };
};


const usePaintNodes = (Graph: Graph | null) => {
  const layerLogicNode = useFilterLogicNode();

  useEffect(() => {
    Graph?.clearCells();
    const nodeIdMap = new Map<string, Node>();
    layerLogicNode.map(node => {
      const GNode = Graph?.addNode(renderNode(node));
      if (GNode) {
        nodeIdMap.set(node.id, GNode);
      }
    });
    console.log(getWDGraph().getAllEdges(), layerLogicNode, 'getAllEdges');
    getWDGraph().getAllEdges().map(edge => {
      const source = nodeIdMap.get(edge.source);
      const target = nodeIdMap.get(edge.target);
      if (source && target) {
        Graph?.addEdge({
          source: {
            cell: source.id,
            port: edge.sourcePort, // 链接桩 ID
          },
          target: {
            cell: target.id,
            port: edge.targetPort, // 链接桩 ID
          },
        });
      }
    });
  }, []);
};

export const LogicPanel = memo(() => {
  const GRef = useRef<GraphPanel>({ G: null });
  const dispatch = useDispatch();
  console.log('09890');
  usePaintNodes(GRef.current.G);
  useEffect(() => {
    //挂载上所有节点

    document.ondragstart = () => false;
    //逻辑流走向
    const updateEdgeSubscription = subscribeUpdateEdge(
      ({ fromNodeId, nodeIdList }) => {
        console.log(nodeIdList, fromNodeId, getRunningTasks(), '0909889');
        GRef.current.G?.getEdges().map(edge => {
          console.log(edge.getSourcePortId(), nodeIdList, 'edge-edge');
          //当前边无正在run的任务
          if (
            nodeIdList.some(item =>
              item.target === edge.getTargetCell()?.getProp().nodeGId
              && item.source === edge.getSourceCell()?.getProp().nodeGId,
            )
          ) {
            updateConnectStatus(edge.getSourcePortId() || '', 2);
            updateConnectStatus(edge.getTargetPortId() || '', 2);
            edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
              fill: '#22F576FF',
              stroke: '#22F576FF',
            });
            edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
              fill: '#22F576FF',
              stroke: '#22F576FF',
            });
            edge.setAttrs({
              line: {
                stroke: '#22F576FF',
                targetMarker: 'classic',
              },
            });
          } else {
            updateConnectStatus(edge.getSourcePortId() || '', 1);
            updateConnectStatus(edge.getTargetPortId() || '', 1);
            edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
              fill: '#f5222d',
              stroke: '#f5222d',
            });
            edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
              fill: '#f5222d',
              stroke: '#f5222d',
            });
            edge.setAttrs({
              line: {
                stroke: '#f5222d',
                targetMarker: 'classic',
              },
            });
          }
        });
      },
    );
    //新增
    const subscription = subscribeCreateNode(
      (node) => {
        GRef.current.G?.addNode(renderNode(node));
        getWDGraph().addVertex(node.id);
      },
    );
    return () => {
      subscription.unsubscribe();
      updateEdgeSubscription.unsubscribe();
    };
  }, []);


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
      console.log((params.event.target as HTMLElement)?.innerText, '(params.event.target as HTMLElement)?.innerText');
      switch ((params.event.target as HTMLElement)?.innerText) {
        case '删除边':
          return removeEdge(params);
      }
    },
  );
  const containerRef = useRef<HTMLDivElement>(null);


  const removeNode = useCallback((params: ItemParams) => {
    GRef.current.G?.getEdges().map(edge => {
      if (edge.getSourceNode()?.getProp().nodeGId === params.props.nodeProp.nodeGId) {
        updateConnectStatus(edge.getTargetNode()?.getProp().nodeGId, 0);
        edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
          fill: '#d9d9d9',
          stroke: '#d9d9d9',
        });
      } else if (edge.getTargetNode()?.getProp().nodeGId === params.props.nodeProp.nodeGId) {
        updateConnectStatus(edge.getSourceNode()?.getProp().nodeGId, 0);
        edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
          fill: '#d9d9d9',
          stroke: '#d9d9d9',
        });
      }
    });
    getWDGraph().removeVertex(
      params.props.nodeProp.nodeGId,
    );
    deleteSubNode(params.props.nodeProp.nodeGId);
    GRef.current.G?.removeNode(params.props.node.id);
    dispatch(deleteLogicNode({ id: params.props.nodeProp.nodeGId }));
  }, [dispatch]);

  const removeEdge = useCallback((params: ItemParams) => {
    GRef.current.G?.getEdges().some(edge => {
      if (edge.getTargetNode()?.getProp().nodeGId === params.props.targetNode.nodeGId
        &&
        edge.getSourceNode()?.getProp().nodeGId === params.props.sourceNode.nodeGId
      ) {
        edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
          fill: '#d9d9d9',
          stroke: '#d9d9d9',
        });
        edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
          fill: '#d9d9d9',
          stroke: '#d9d9d9',
        });
        getWDGraph().removeEdge(
          params.props.sourceNode.nodeGId,
          params.props.targetNode.nodeGId,
        );
        removePEM(edge.getSourceNode()?.getProp().nodeGId + edge.getSourcePortId() || '', (edge.getSourcePortId() || '') + edge.getTargetPortId());
        removePEM(edge.getTargetNode()?.getProp().nodeGId + edge.getTargetPortId() || '', (edge.getSourcePortId() || '') + edge.getTargetPortId());
        updateConnectStatus(params.props.sourceNode.nodeGId || '', 0);
        updateConnectStatus(params.props.targetNode.nodeGId || '', 0);
        GRef.current.G?.removeEdge(params.props.edge.id);
        return true;
      }
    });
  }, []);


  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
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
              console.log(args.edge.getTargetPortId(), findPEM(args.edge.getTargetPortId() || ''), 'args.edge.getTargetPortId()');
              if (
                ((args.edge.getTargetPortId() || '').indexOf('logic_and_BOTH_get@in-and') > -1
                  &&
                  [...(findPEM(args.edge.getTargetNode()?.getProp().nodeGId + args.edge.getTargetPortId() || '') || [])].length)
                || (
                  (args.edge.getTargetPortId() || '').indexOf('logic_or_BOTH_get@in-or') > -1
                  &&
                  [...(findPEM(args.edge.getTargetNode()?.getProp().nodeGId + args.edge.getTargetPortId() || '') || [])].length
                )
              ) {
                toast.error('为了输出唯一,门节点输入必须唯一');
                return false;
              }

              updateConnectStatus(args.edge.getSourceNode()?.getProp().nodeGId || '', 1);
              updateConnectStatus(args.edge.getTargetNode()?.getProp().nodeGId || '', 1);
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
      grid: true,
      autoResize: true,
      virtual: true,
      onPortRendered(args) {
        const selectors = args.contentSelectors;
        const container = selectors && selectors.foContent;
        if (container) {
          ReactDOM.render(<span>jA</span>, container as HTMLElement);
        }
      },
    });
    GRef.current.G?.on('node:mousedown', () => {
    });
    GRef.current.G?.on('node:contextmenu', ({ e, x, y, node, view }) => {
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
      console.log('pops-1');
      console.log(edge.getSourceNode()?.getPortProp(edge.getSourcePortId() || '', 'attrs/circle'), 'p;odsddddd');
      edge.setAttrs({
        line: {
          stroke: '#f5222d',
          targetMarker: 'classic',
        },
      });
      edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
        fill: '#f5222d',
        stroke: '#f5222d',
      });

      edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
        fill: '#f5222d',
        stroke: '#f5222d',
      });
    });
    GRef.current.G.on('edge:mouseup', ({ edge }) => {
      console.log(edge.getTargetNode(), edge.getSourceCellId(), 'edge.getTargetNode()');
      if (!edge.getTargetNode()) {
        (GRef.current.G?.getCellById(edge.getSourceCellId()) as Node)?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
          fill: '#d9d9d9',
          stroke: '#d9d9d9',
        });
      }
    });
    GRef.current.G.on('edge:connected', ({ isNew, edge }) => {
      console.log(edge, 'pops');
      if (isNew) {
        if (
          !getWDGraph().hasEdge(
            edge.getSourceNode()?.getProp().nodeGId,
            edge.getTargetNode()?.getProp().nodeGId,
          )
        ) {
          getWDGraph().addEdge(
            edge.getSourceNode()?.getProp().nodeGId,
            edge.getTargetNode()?.getProp().nodeGId,
            {},
            1,
            edge.getSourcePortId() || '',
            edge.getTargetPortId() || '',
          );
        }
        edge.getSourceNode()?.setPortProp(edge.getSourcePortId() || '', 'attrs/circle', {
          fill: '#f5222d',
          stroke: '#f5222d',
        });

        edge.getTargetNode()?.setPortProp(edge.getTargetPortId() || '', 'attrs/circle', {
          fill: '#f5222d',
          stroke: '#f5222d',
        });

        const edgeTag = (edge.getSourcePortId() || '') + (edge.getTargetPortId() || '');

        createPEM(edge.getSourceNode()?.getProp().nodeGId + edge.getSourcePortId() || '', edgeTag);
        createPEM(edge.getTargetNode()?.getProp().nodeGId + edge.getTargetPortId() || '', edgeTag);
      }
    });
    GRef.current.G?.on('node:mouseup', (args) => {
      //校验port
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
  }, [NodeShow, dispatch, show]);


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
