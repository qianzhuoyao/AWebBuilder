import { signalLogicNodeAttrConfig } from "../../signalNodeConfig.ts";
import { logic_D_get } from "../../../store/slice/nodeSlice.ts";
import {
  Tabs,
  Tab,
  CardBody,
  Card,
  Button,
  Select,
  SelectItem,
  CardHeader,
  Divider,
  Chip,
  Textarea,
} from "@nextui-org/react";
import { memo, useCallback, useRef, useState } from "react";
import { Input } from "@nextui-org/react";
import {
  genLogicConfigMap,
  IProtocol,
  IRemoteReqInfo,
} from "../../../Logic/nodes/logicConfigMap.ts";
import { defaultRemote } from "../../../panel/widgetIconTemp.tsx";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import beautify_js from "js-beautify";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";
import { useQuery } from "react-query";
import { useAutoHeight } from "../../../comp/useAutoHeight.tsx";
import { useTakeLogicData } from "../../../comp/useTakeLogicData.tsx";

const Url = memo(() => {
  const logicState = useTakeLogicData()
  const loadParams =
    genLogicConfigMap().configInfo.get(logicState.target[0])?.remoteReqInfo ||
    defaultRemote;

  const [params, setParams] = useState<IRemoteReqInfo>(loadParams);

  const updateParse = useCallback((parse: string) => {
    setParams({ ...params, parse });
    genLogicConfigMap().configInfo.set(logicState.target[0], {
      remoteReqInfo: { ...params, parse },
    });
  }, [])

  const updateToken = useCallback(
    (token: string) => {
      setParams({ ...params, token });
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        remoteReqInfo: { ...params, token },
      });
    },
    [logicState.target, params]
  );

  const updateUrl = useCallback(
    (url: string) => {
      setParams({ ...params, url });
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        remoteReqInfo: { ...params, url },
      });
    },
    [logicState.target, params]
  );

  const updateProtocol = useCallback(
    (protocol: IProtocol) => {
      setParams({ ...params, protocol });
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        remoteReqInfo: { ...params, protocol },
      });
    },
    [logicState.target, params]
  );

  const updateMethod = useCallback(
    (method: "post" | "get") => {
      setParams({ ...params, method });
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        remoteReqInfo: { ...params, method },
      });
    },
    [logicState.target, params]
  );

  return (
    <>
      <div className={"mt-1"}>
        <small>协议:</small>
        <Select
          aria-label={"PROTOCOL"}
          selectedKeys={[params?.protocol]}
          labelPlacement="outside"
          placeholder="PROTOCOL"
          className="max-w-xs"
          onChange={(e) => {
            updateProtocol(e.target.value as IProtocol);
          }}
        >
          {[
            {
              label: "https",
              value: "https",
            },
            {
              label: "http",
              value: "http",
            },
          ].map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <small>url:</small>
        <Input
          type="text"
          value={params?.url}
          placeholder="URL"
          labelPlacement="outside"
          onChange={(e) => {
            updateUrl(e.target.value);
          }}
        />
      </div>

      <div className={"mt-1"}>
        <small>方法:</small>
        <Select
          labelPlacement="outside"
          aria-label={"METHOD"}
          selectedKeys={[params?.method]}
          placeholder="METHOD"
          className="max-w-xs"
          onChange={(e) => {
            updateMethod(e.target.value as "post" | "get");
          }}
        >
          {[
            {
              label: "POST",
              value: "post",
            },
            {
              label: "GET",
              value: "get",
            },
          ].map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className={"mt-1"}>
        <small>token:</small>
        <Textarea
          value={params?.token}
          placeholder="token"
          labelPlacement="outside"
          className="max-w-xs"
          onChange={(e) => {
            updateToken(e.target.value);
          }}
        />
      </div>
      <div className={"mt-1"}>
        <small>parse(JSON):</small>
        <Textarea
          value={params?.parse}
          placeholder="待解析的JSON 路径"
          labelPlacement="outside"
          className="max-w-xs"
          onChange={(e) => {
            updateParse(e.target.value);
          }}
        />
      </div>
    </>
  );
});

const Test = memo(() => {
  const mirrorRef = useRef<ReactCodeMirrorRef>(null);
  const logicState = useTakeLogicData()
  const loadParams =
    genLogicConfigMap().configInfo.get(logicState.target[0])?.remoteReqInfo ||
    defaultRemote;
  const [params] = useState<IRemoteReqInfo>(loadParams);
  const { theme } = useTheme();
  const [toSend, setToSend] = useState(0);

  const height = useAutoHeight();

  const query = () =>
    fetch("//" + params.url, {
      method: params.method,
      body: null,
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*",
        'Access-Control-Allow-Headers': "*",
        "Content-Type": "application/json",
        Accept: "application/json, text/plain",
        Authorization: params.token,
      },
    }).then((res) => res.json());

  const { isLoading, isError, error, data } = useQuery(
    [toSend],
    () => query(),
    {
      retry: 0,
      enabled: !!toSend,
    }
  );

  const sendTest = useCallback(() => {
    setToSend(toSend + 1);
  }, [toSend]);

  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex justify-between items-center w-full">
            <small>协议:</small>
            <Chip>{params.protocol}</Chip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex justify-between items-center w-full">
            <small>方法:</small>
            <Chip>{params.method}</Chip>
          </div>
        </CardBody>
        <Divider />
        <CardBody>
          <div className="">
            <p>
              <small>url:</small>
            </p>
            <p>
              <small>{params.url}</small>
            </p>
          </div>
        </CardBody>
      </Card>
      <Card className="max-w-[400px] mt-1">
        <CardHeader className="flex gap-3">
          <div className="flex justify-between items-center w-full">
            <small>响应:</small>
            <Button
              isLoading={isLoading}
              size={"sm"}
              color={"primary"}
              onClick={sendTest}
            >
              发送
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Divider></Divider>
          {isError ? (
            <>
              <div className={"text-red-600"}>
                {(error as { message: string }).message}
              </div>
            </>
          ) : (
            <CodeMirror
              ref={mirrorRef}
              value={beautify_js(JSON.stringify(data), { indent_size: 2 })}
              height={height - 350 + "px"}
              lang={"json"}
              theme={theme === "dark" ? "dark" : "light"}
              extensions={[json(), EditorView.lineWrapping]}
              basicSetup={{
                lintKeymap: false,
              }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
});

export const remoteGetConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_D_get);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return (
        <>
          <div className="flex w-full flex-col px-1">
            <Tabs
              aria-label="Dynamic tabs"
              classNames={{
                panel: "p-1",
                base: "px-1",
              }}
            >
              <Tab key={nodeInfo.target[0] + "url"} title={"Url"}>
                <Card>
                  <CardBody>
                    <Url></Url>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key={nodeInfo.target[0] + "test"} title={"测试"}>
                <Card>
                  <CardBody>
                    <Test></Test>
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
