import {
  Card,
  Spacer,
  CardFooter,
  CardBody,
  Pagination,
  Image,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { IPs, updateWorkSpaceName } from '../store/slice/panelSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addNode } from '../store/slice/nodeSlice';
import { nodeBuilder } from '../Logic/nodes';
import { createNode } from '../panel/logicPanelEventSubscribe';
import { ILogicNode } from '../store/slice/logicSlice';
import { genWDGraph } from '../DirGraph/weightedDirectedGraph';
import {
  frameSendChangePageInfo,
  frameSendDelete,
  frameSendPageLoadSuccess,
  IParseInPanel,
  messageEventListener,
  toParseInPanel, toSetLocalstorage,
} from '../struct/toJSON.ts';

export const MenuContent = () => {
  const [list, setList] = useState<{
    total: number,
    records: IParseInPanel[]
  } | null>(null);

  useEffect(() => {
    const sub = messageEventListener<
      {
        total: number,
        records: IParseInPanel[]
      }>((data) => {
      setList(data);
    });
    frameSendPageLoadSuccess();
    return () => {
      window.removeEventListener('message', sub);
    };
  }, []);

  const changePage = useCallback((pageNum: number) => {
    frameSendChangePageInfo(pageNum);
  }, []);

  return (<>
      <div className="flex flex-wrap content-start">
        {list?.records?.map((item, index) => {
          return <Fragment key={index}>
            <Each data={item}></Each>
          </Fragment>;
        })}
      </div>
      <div className="flex flex-row-reverse">
        <Pagination
          isCompact
          showControls
          total={(list?.total || 1) / 10 + 1}
          initialPage={1}
          onChange={page => {
            changePage(page);
          }} />
      </div>
    </>

  );
};

const Each = ({ data }: {
  data: IParseInPanel
}) => {
  return (
    <>
      <CustomCard data={data} />
      <Spacer x={4} />
      <Spacer y={4} />
    </>
  );
};
nodeBuilder();
const CustomCard = ({ data }: {
  data: IParseInPanel
}) => {
  const navigate = useNavigate();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  const dispatch = useDispatch();
  const toDelete = useCallback(() => {
    frameSendDelete(data);
  }, [data]);
  const toPanel = useCallback(() => {
    dispatch(updateWorkSpaceName(data?.viewName));
    toParseInPanel(data, {
      paintLogicNodesEach: (node) => {
        createNode({
          typeId: node.typeId,
          belongClass: node.belongClass,
          x: node.x,
          y: node.y,
          shape: 'image',
          width: node.width,
          height: node.height,
          id: node.id,
          imageUrl: node.imageUrl,
        } as ILogicNode);
      },
      paintViewNodesEach: (item) => {
        dispatch(
          addNode({
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            z: item.z,
            id: item.id,
            classify: item.classify,
            nodeType: item.nodeType,
            alias: item.alias,
            instance: item.instance,
          }),
        );
      },
    });
    genWDGraph(JSON.parse(data.webLogic || '{}')?.G || '');
    navigate({
      pathname: '/panel',
      search: `?name=${data?.viewName}`,
    });
  }, [data, dispatch, navigate]);
  const toDemo = () => {
    toSetLocalstorage(data.webNodes, data.webPanel, data.webLogic);
    window.open(window.location.origin + '/demo/' + PanelState.workSpaceName);
  };
  return (
    <div>
      <Card className="py-1.5 min-w-[300px] max-h-[320px] cursor-pointer">
        <CardBody className="overflow-visible py-2">
          <Image
            width={300}
            alt="NextUI hero Image"
            src={data?.img}
          />
        </CardBody>
        <CardFooter className="justify-between">
          <div>
            <p className="text-tiny uppercase font-bold">{data?.viewName}</p>
          </div>
          <div>
            <small onClick={() => toDemo()}>查看</small>
            <small className="ml-1" onClick={() => toPanel()}>编辑</small>
            <small className="ml-1" onClick={() => toDelete()}>删除</small>
          </div>
          {/*<div className="flex-col items-end">*/}
          {/*  <p className="flex items-center mb-1">*/}
          {/*    <small className="text-default-500 mr-1">构建人:</small>*/}
          {/*    <small>admin</small>*/}
          {/*  </p>*/}
          {/*  <p className="flex items-center">*/}
          {/*    <small className="text-default-500">构建日期:</small>*/}
          {/*    <small>2024.01.01</small>*/}
          {/*  </p>*/}
          {/*</div>*/}
        </CardFooter>
      </Card>
      <Spacer x={4} />
      <Spacer y={4} />
    </div>
  );
};
