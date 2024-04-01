import { useDispatch, useSelector } from 'react-redux';
import { IPs } from '../store/slice/panelSlice';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import * as echarts from 'echarts';
import {
  deleteListItem,
  INs,
  IViewNode, moveNode, pic_Img, pix_BX, pix_Table, resizeNode,
  updatePosition,
  updateSize,
  updateTargets,
} from '../store/slice/nodeSlice';
import { ATTR_TAG, Node, NODE_ID, PANEL_MAIN_BG, SCENE } from '../contant';
import { BaseChart } from '../node/chart';
import { useSceneContext } from '../menu/context';
import { computeActPositionNodeByRuler } from '../comp/computeActNodeByRuler.ts';
import { ItemParams } from 'react-contexify';
import { useFilterViewNode } from './useFilter.tsx';
import { getWCache, subscribeViewCacheUpdate } from './data.ts';
import { getChartEmit } from '../emit/emitChart.ts';
import { ATable } from '../comp/ATable';
import { IWls } from '../store/slice/widgetSlice.ts';
import { Image } from '@nextui-org/react';


const BaseImage = memo(({ config }: { config: IViewNode }) => {
  return <Image
    width={'100%'}
    height={'100%'}
    alt="BaseImage"
    className={'w-full h-full'}
    src={config.instance.option?.src}
    classNames={{
      wrapper:'w-full h-full'
    }}
  ></Image>;
});

export const Temp = memo(({ id, isTemp, PanelState, NodesState }: {
  NodesState: INs,
  id: string;
  isTemp?: boolean,
  PanelState: IPs
}) => {
  const [parseOption, setParseOption] = useState<any>({});

  useEffect(() => {
    if (NodesState?.list) {
      setParseOption(() => new Function('params','echarts',

        `try{
        ${(NodesState?.list || {})[id]?.instance?.option?.chart || ''}
        }catch(e){return {}}`,
      )(getWCache(id),echarts));
    }
  }, []);

  useEffect(() => {
    const sub = getChartEmit().observable.subscribe(() => {
      if (NodesState?.list) {
        setParseOption(() => new Function('params','echarts',
          `try{
        ${(NodesState?.list || {})[id]?.instance?.option?.chart || ''}
        }catch(e){return {}}`,
        )(getWCache(id),echarts));

      }
    });
    const sSub = subscribeViewCacheUpdate(() => {
      if (NodesState?.list) {
        setParseOption(() => new Function('params','echarts',

          `try{
        ${(NodesState?.list || {})[id]?.instance?.option?.chart || ''}
        }catch(e){
        return {}}`,
        )(getWCache(id),echarts));
      }
    });
    return () => {
      sub.unsubscribe();
      sSub.unsubscribe();
    };
  }, [NodesState?.list, id]);


  if (NodesState.list[id]?.classify === pix_BX) {
    return (
      <BaseChart
        type={NodesState.list[id].instance.type}
        width={isTemp ? 205 : NodesState.list[id].w / PanelState.tickUnit}
        height={isTemp ? 100 : NodesState.list[id].h / PanelState.tickUnit}
        options={parseOption}
        //   options={NodesState.list[id].instance.option}
      ></BaseChart>
    );
  } else if (NodesState.list[id]?.classify === pix_Table) {
    return (
      <div className={'overflow-scroll w-full h-full'}>
        <ATable
          id={id}
          streamData={getWCache(id)}
        ></ATable>
      </div>
    );
  } else if (NodesState.list[id]?.classify === pic_Img) {
    return <div className={'w-full h-full'}>
      <BaseImage config={NodesState.list[id]}></BaseImage>
    </div>;
  }

  return <></>;
});

export const NodeSlot = memo(
  ({ node, isTemp }: { node: IViewNode; isTemp: boolean }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const PanelState = useSelector((state: { panelSlice: IPs }) => {
      return state.panelSlice;
    });
    const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
      return state.viewNodesSlice;
    });


    useEffect(() => {

      if (nodeRef.current) {
        const pos = computeActPositionNodeByRuler(nodeRef.current, PanelState.tickUnit);

        if (pos) {
          dispatch(
            updatePosition({
              id: nodeRef.current.id,
              x: pos.x,
              y: pos.y,
            }),
          );
          nodeRef.current.style.left = node.x / PanelState.tickUnit + 'px';
          nodeRef.current.style.top = node.y / PanelState.tickUnit + 'px';
        }

      }
    }, []);


    useEffect(() => {
      if (!nodeRef.current) {
        return;
      }
      [...nodeRef.current.getElementsByTagName('*')].forEach((ele) => {
        ele.setAttribute(ATTR_TAG, Node);
        ele.setAttribute(NODE_ID, node.id);
      });
    }, [NodesState]);

    const onHandleSelectedCurrent = useCallback(() => {
      //如果不是模板 就选中，否则映射至对应组件

      if (isTemp) {
        dispatch(updateTargets([node.id]));
      } else {
        dispatch(updateTargets([nodeRef.current?.id]));
      }
    }, [isTemp, node.id]);

    return (
      <div
        ref={nodeRef}
        id={isTemp ? node.id + '-Map' : node.id}
        className={isTemp ? '' : 'absolute target'}
        onMouseDown={onHandleSelectedCurrent}

        style={
          isTemp
            ? {
              width: '100%',
              height: '100%',
            }
            : {
              // left: node.x / PanelState.tickUnit + 'px',
              // top: node.y / PanelState.tickUnit + 'px',
              width: node.w / PanelState.tickUnit + 'px',
              height: node.h / PanelState.tickUnit + 'px',
            }
        }
      >
        <Temp id={node.id} isTemp={isTemp} PanelState={PanelState} NodesState={NodesState}></Temp>

      </div>
    );
  },
);

const NodeContainer = memo(() => {
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);
  const layerViewNode = useFilterViewNode();
  const removeViewNode = useCallback((params: ItemParams) => {
    console.log(params, ';params');
    dispatch(deleteListItem({ idList: [params.props.id] }));
  }, []);

  const { view, show } = useSceneContext('viewNode', params => {
    switch ((params.event.target as HTMLElement)?.innerText) {
      case '删除':
        return removeViewNode(params);
    }
  });
  const dispatch = useDispatch();

  const PanelState = useSelector((state: { panelSlice: IPs, }) => {
    return state.panelSlice;
  });
  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });

  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  useEffect(() => {
    if (NodesState.resizeTo.length) {
      NodesState.resizeTo.map(willResizeNode => {
        const nodeDom = document.getElementById(willResizeNode.id);
        if (nodeDom && moveableRef.current) {
          nodeDom.style.width = willResizeNode.newW / PanelState.tickUnit + 'px';
          nodeDom.style.height = willResizeNode.newH / PanelState.tickUnit + 'px';
          moveableRef.current!.moveable.updateTarget();
          dispatch(
            updateSize({
              id: willResizeNode.id,
              w: willResizeNode.newW,
              h: willResizeNode.newH,
            }),
          );
        }
      });
      dispatch(resizeNode([]));
    }
  }, [NodesState.resizeTo, PanelState.tickUnit]);

  useEffect(() => {
    if (NodesState.moveTo.length) {
      NodesState.moveTo.map(willMoveNode => {
        const nodeDom = document.getElementById(willMoveNode.id);
        if (nodeDom && moveableRef.current) {
          nodeDom.style.left = willMoveNode.newX / PanelState.tickUnit + 'px';
          nodeDom.style.top = willMoveNode.newY / PanelState.tickUnit + 'px';
          moveableRef.current!.moveable.updateTarget();
          dispatch(
            updatePosition({
              id: willMoveNode.id,
              x: willMoveNode.newX,
              y: willMoveNode.newY,
            }),
          );
        }
      });
      //重置位移任务
      dispatch(moveNode([]));
    }

  }, [NodesState.moveTo, PanelState.tickUnit, dispatch]);

  useEffect(() => {
    const box = moveableRef.current?.getControlBoxElement();
    if (box) {
      box.style.zIndex = '9';
    }
    console.log(layerViewNode, 'layerViewNode');
  }, []);

  return (
    <>
      <Moveable
        ref={moveableRef}
        origin={false}
        keepRatio={false}
        target={NodesState.targets.map((id) => document.getElementById(id))}
        draggable={widgetState.inOperationForDraggable}
        resizable={true}
        scalable={true}
        rotatable={true}
        onDragStart={e => {

          console.log(e, 'onDragStarsst');
        }}
        onClickGroup={(e) => {
          console.log(e, 'onClickGroup');
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onRotateEnd={e => {
          console.log(e, 'eeeonRotateEndeeee');
        }}
        onRender={(e) => {
          e.target.style.cssText += e.cssText;
        }}
        onResizeEnd={(e) => {
          dispatch(
            updateSize({
              id: e.target.id,
              w: parseFloat(e.target.style.width) * PanelState.tickUnit,
              h: parseFloat(e.target.style.height) * PanelState.tickUnit,
            }),
          );
        }}
        onDragEnd={(e) => {
          const pos = computeActPositionNodeByRuler(e.target, PanelState.tickUnit);
          if (pos) {
            dispatch(
              updatePosition({
                id: e.target.id,
                x: pos.x,
                y: pos.y,
              }),
            );
          } else {
            throw new Error('computeActPositionNodeByRuler error');
          }
        }}
        onRenderGroup={(e) => {
          e.events.forEach((ev) => {
            ev.target.style.cssText += ev.cssText;
          });
        }}
      />
      {PanelState.isSelection && (
        <Selecto
          ref={selectoRef}
          dragContainer={'.elements'}
          selectableTargets={['.target']}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          keyContainer={window}
          onDragStart={(e) => {
            console.log(e, '{}ddfff');
            const target = e.inputEvent.target;
            if (
              moveableRef.current!.isMoveableElement(target) ||
              NodesState.targets
                .map((id) => {
                  return document.getElementById(id);
                })!
                .some((t) => t === target || t?.contains(target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={(e) => {
            setTimeout(() => {
              [...document.querySelectorAll('.moveable-area')].forEach(
                (node) => {
                  node.setAttribute(ATTR_TAG, Node);
                },
              );
            }, 0);
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault();
              moveableRef.current!.waitToChangeTarget().then(() => {
                moveableRef.current!.dragStart(e.inputEvent);
              });
            }
            dispatch(updateTargets(e.selected.map((node) => node.id)));
          }}
        />
      )}
      <div className="empty elements"></div>
      <div id={PANEL_MAIN_BG} className="relative w-full h-full elements" style={{
        background: PanelState.panelColor,
      }}>
        {layerViewNode.map((node) => {
          return <div
            onContextMenu={(e) => {
              show({
                event: e,
                props: node,
              });
            }}
          >
            <NodeSlot key={node.id} node={node} isTemp={false}></NodeSlot>
          </div>;
        })}
      </div>
      {view(
        ['删除'].map((value) => {
          return <div key={value}>{value}</div>;
        }),
      )}
    </>
  );
});

export const AScene = memo(() => {
  const SCENE_REF = useRef<HTMLDivElement>(null);
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  return (
    <>
      <div
        className="absolute w-[calc(100%_-_40px)] h-[calc(100%_-_40px)]"
        style={{
          left: '30px',
          top: '30px',
        }}
      >
        <div id="container" className="relative w-full h-full overflow-hidden">
          <div
            ref={SCENE_REF}
            id={SCENE}
            className="absolute bg-[#232324] overflow-hidden"
            style={{
              left: PanelState.panelLeft - PanelState.rulerMinX + 'px',
              top: PanelState.panelTop - PanelState.rulerMinY + 'px',
              width: PanelState.panelWidth / PanelState.tickUnit + 'px',
              height: PanelState.panelHeight / PanelState.tickUnit + 'px',
            }}
          >
            <NodeContainer></NodeContainer>
          </div>
        </div>
      </div>
    </>
  );
});
