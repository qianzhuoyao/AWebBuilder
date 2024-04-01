//普通柱状图配置
import { signalViewNodeAttrConfig } from "../../signalNodeConfig.ts";
import {
  INs,
  pix_Table,
  updateInstance,
} from "../../../store/slice/nodeSlice.ts";
import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm.tsx";
import { StreamData } from "../../form/logic/remoteReq/StreamData.tsx";
import { memo, useCallback } from "react";
import { insertConfig } from "../../../node/viewConfigSubscribe.ts";
import { ITableConfig } from "../../../node/viewConfigSubscribe.ts";
import { useDispatch, useSelector } from "react-redux";

const TakeCol = memo(() => {
  return (
    <div>
      <div>
        <small>颜色</small>
        <Input
          type="text"
          placeholder="颜色取值"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>字体大小</small>
        <Input
          type="text"
          placeholder="字体大小"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>字体</small>
        <Input
          type="text"
          placeholder="字体"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>对齐</small>
        <Input
          type="text"
          placeholder="对齐"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>加粗</small>
        <Input
          type="text"
          placeholder="加粗"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>开启强调</small>
        <Input
          type="text"
          placeholder="开启强调"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
      <div>
        <small>内间距</small>
        <Input
          type="text"
          placeholder="内间距"
          labelPlacement="outside"
          onChange={() => {}}
        />
      </div>
    </div>
  );
});

const TakeForm = memo(() => {
  const dispatch = useDispatch();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const onChangeConfig = useCallback(
    (value: string, key: keyof ITableConfig) => {
      dispatch(
        updateInstance({
          type: NodesState.list[NodesState.targets[0]].instance.type,
          id: NodesState.list[NodesState.targets[0]].id,
          option: {
            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
            [key]: value,
          },
        })
      );
    },
    [NodesState.list, NodesState.targets]
  );

  const updateTableConfig = useCallback(() => {
    insertConfig(NodesState.targets[0], {
      colProp:
        NodesState.list[NodesState.targets[0]]?.instance?.option?.colProp,
      colLabel:
        NodesState.list[NodesState.targets[0]]?.instance?.option?.colLabel,
      colField:
        NodesState.list[NodesState.targets[0]]?.instance?.option?.colField,
      dataField:
        NodesState.list[NodesState.targets[0]]?.instance?.option?.dataField,
    });
  }, [NodesState.list, NodesState.targets]);

  return (
    <div>
      <div>
        <small>表头取值</small>
        <Input
          type="text"
          placeholder="表头取值"
          labelPlacement="outside"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option
              ?.colField || ""
          }
          onChange={(e) => {
            onChangeConfig(e.target.value, "colField");
          }}
        />
      </div>
      <div>
        <small>表头label</small>
        <Input
          type="text"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option
              ?.colLabel || ""
          }
          placeholder="表头label"
          labelPlacement="outside"
          onChange={(e) => {
            onChangeConfig(e.target.value, "colLabel");
          }}
        />
      </div>
      <div>
        <small>表头映射prop</small>
        <Input
          type="text"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option?.colProp ||
            ""
          }
          placeholder="表头映射prop"
          labelPlacement="outside"
          onChange={(e) => {
            onChangeConfig(e.target.value, "colProp");
          }}
        />
      </div>
      <div>
        <small>内容取值</small>
        <Input
          type="text"
          value={
            NodesState.list[NodesState.targets[0]]?.instance?.option
              ?.dataField || ""
          }
          placeholder="内容取值"
          labelPlacement="outside"
          onChange={(e) => {
            onChangeConfig(e.target.value, "dataField");
          }}
        />
      </div>
      <div>
        <Button
          color={"primary"}
          size={"sm"}
          onClick={() => {
            updateTableConfig();
          }}
        >
          同步
        </Button>
      </div>
    </div>
  );
});

const TableConfigSetting = memo(({ id }: { id: string }) => {
  return (
    <div className="flex w-full flex-col px-1">
      <Tabs
        aria-label="chart config"
        classNames={{
          panel: "p-1",
          base: "px-1",
        }}
      >
        <Tab key={id + "take-0"} title={"取值"}>
          <Card>
            <CardBody>
              <TakeForm></TakeForm>
            </CardBody>
          </Card>
        </Tab>
        <Tab key={id + "col-1"} title={"表头"}>
          <Card>
            <CardBody>
              <TakeCol></TakeCol>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
});

export const TableConfig = () => {
  const config = signalViewNodeAttrConfig(pix_Table);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="chart config"
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              <Tab
                key={nodeInfo.target[0] + "TableConfigSetting"}
                title={"表格配置"}
              >
                <Card>
                  <CardBody>
                    <TableConfigSetting
                      id={nodeInfo.target[0]}
                    ></TableConfigSetting>
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key={nodeInfo.target[0] + "DefaultViewNodeConfigForm"}
                title={"组件配置"}
              >
                <Card>
                  <CardBody>
                    <DefaultViewNodeConfigForm />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key={nodeInfo.target[0] + "StreamData"} title={"流入数据"}>
                <Card>
                  <CardBody>
                    <StreamData />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </>
      );
    }
  });
};
