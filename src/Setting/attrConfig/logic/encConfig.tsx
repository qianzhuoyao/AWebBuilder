import { signalLogicNodeAttrConfig } from "../../signalNodeConfig.ts";
import { logic_ENC_get } from "../../../store/slice/nodeSlice.ts";
import {
  Card,
  CardBody,
  Input,
  Select,
  Selection,
  SelectItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { memo, useCallback, useState } from "react";
import {
  ENCRYPTION_METHODS,
  genLogicConfigMap,
  IEncryptionConfigInfo,
} from "../../../Logic/nodes/logicConfigMap.ts";
import { useSelector } from "react-redux";
import { ILs } from "../../../store/slice/logicSlice.ts";

const SetEncC = memo(() => {
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const defaultConfig = genLogicConfigMap().configInfo.get(
    logicState.target[0]
  )?.encryptionConfigInfo;

  const [publicKey, setPublicKey] = useState(defaultConfig?.publicKey || "");
  const [encMethods, setEncMethods] = useState<
    (typeof ENCRYPTION_METHODS)[number]
  >(defaultConfig?.encryptionMethod || "MD5");

  const onHandleChangEnc = useCallback(
    (key: Selection) => {
      setEncMethods([...key][0] as (typeof ENCRYPTION_METHODS)[number]);
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        encryptionConfigInfo: {
          ...(genLogicConfigMap().configInfo.get(logicState.target[0])
            ?.encryptionConfigInfo as IEncryptionConfigInfo),
          encryptionMethod: [...key][0] as (typeof ENCRYPTION_METHODS)[number],
        },
      });
    },
    [logicState.target]
  );

  const updatePublicKey = useCallback(
    (value: string) => {
      setPublicKey(value);
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        encryptionConfigInfo: {
          ...(genLogicConfigMap().configInfo.get(logicState.target[0])
            ?.encryptionConfigInfo as IEncryptionConfigInfo),
          publicKey: value,
        },
      });
    },
    [logicState.target]
  );
  return (
    <>
      <div>
        <small>加密方式:</small>
        <Select
          selectedKeys={[encMethods]}
          placeholder={"加密方式"}
          aria-label={"encMethods"}
          labelPlacement={"outside-left"}
          className="max-w-xs"
          onSelectionChange={(key) => {
            onHandleChangEnc(key);
          }}
        >
          {ENCRYPTION_METHODS.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <small>公钥:</small>
        <Input
          type="text"
          placeholder="公钥"
          value={publicKey}
          labelPlacement="outside"
          onChange={(e) => {
            updatePublicKey(e.target.value);
          }}
        />
      </div>
    </>
  );
});

export const EncConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_ENC_get);
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
              <Tab title={"设置"} key={nodeInfo.target[0]}>
                <Card>
                  <CardBody>
                    <SetEncC />
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
