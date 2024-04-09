import {
  Card,
  Spacer,
  CardFooter,
  CardBody,
  Pagination,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Fragment, useCallback, useEffect } from "react";
import { IPs, updateWorkSpaceName } from "../store/slice/panelSlice";
import { useDispatch, useSelector } from "react-redux";
import { addNode } from "../store/slice/nodeSlice";
import { createNode } from "../panel/logicPanelEventSubscribe";
import { ILogicNode } from "../store/slice/logicSlice";
import { genWDGraph } from "../DirGraph/weightedDirectedGraph";
import {
  frameSendChangePageInfo,
  frameSendDelete,
  frameSendPageLoadSuccess,
  IParseInPanel,
  messageEventListener,
  toParseInPanel,
  toSetLocalstorage,
} from "../struct/toJSON.ts";
import { ICs, updateContentList } from "../store/slice/configSlice.ts";
import { DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW } from "../contant/index.ts";

export const MenuContent = () => {
  const ConfigState = useSelector((state: { configSlice: ICs }) => {
    return state.configSlice;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const sub = messageEventListener<{
      total: number;
      records: IParseInPanel[];
    }>((data) => {
      dispatch(updateContentList(data));
    });
    frameSendPageLoadSuccess();
    return () => {
      window.removeEventListener("message", sub);
    };
  }, []);

  const changePage = useCallback((pageNum: number) => {
    frameSendChangePageInfo(pageNum);
  }, []);

  return (
    <>
      <div className="flex flex-wrap content-start h-[calc(100vh_-_180px)]">
        {ConfigState.contentList?.records?.map((item, index) => {
          return (
            <Fragment key={index}>
              <Each data={item}></Each>
            </Fragment>
          );
        })}
      </div>
      <div className="flex flex-row-reverse">
        <Pagination
          isCompact
          showControls
          total={(ConfigState.contentList?.total || 1) / 10 + 1}
          initialPage={1}
          onChange={(page) => {
            changePage(page);
          }}
        />
      </div>
    </>
  );
};

const Each = ({ data }: { data: IParseInPanel }) => {
  return (
    <>
      <CustomCard data={data} />
      <Spacer x={4} />
      <Spacer y={4} />
    </>
  );
};

const CustomCard = ({ data }: { data: IParseInPanel }) => {
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
          shape: "image",
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
          })
        );
      },
    });
    genWDGraph(JSON.parse(data.webLogic || "{}")?.G || "{}");
    navigate({
      pathname: "/panel",
      search: `?name=${data?.viewName}`,
    });
  }, [data, dispatch, navigate]);

  const toDemo = useCallback(() => {
    toSetLocalstorage(
      PanelState.workSpaceName,
      DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW,
      data.webNodes,
      data.webPanel,
      data.webLogic
    );
    window.open(
      window.location.origin +
        "/demo?work=" +
        JSON.stringify({
          indexList: [PanelState.workSpaceName],
        })
    );
  }, [PanelState.workSpaceName, data.webLogic, data.webNodes, data.webPanel]);

  return (
    <div>
      <Card className="py-1.5 min-w-[300px] max-h-[320px] cursor-pointer">
        <CardBody className="overflow-visible py-2">
          <div className="border-slate-500 border rounded-md">
            {/* <Image
              width={300}
              alt="visImageShot"
              src={data?.img}
              className="h-[200px]"
            /> */}
            <img src={data?.img} alt="" className="h-[200px] w-[300px]" />
          </div>
        </CardBody>
        <CardFooter className="justify-between">
          <div>
            <p className="text-tiny uppercase font-bold">{data?.viewName}</p>
          </div>
          <div>
            <small onClick={() => toDemo()}>查看</small>
            <small className="ml-1" onClick={() => toPanel()}>
              编辑
            </small>
            <small className="ml-1" onClick={() => toDelete()}>
              删除
            </small>
          </div>
        </CardFooter>
      </Card>
      <Spacer x={4} />
      <Spacer y={4} />
    </div>
  );
};
