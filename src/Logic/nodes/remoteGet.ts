import { signalLogicNode } from "../base.ts";
import { logic_D_get } from "../../store/slice/nodeSlice.ts";
import remoteGet from "../../assets/widgetIcon/remote_get.svg";
import { from, of } from "rxjs";
import { IRemoteReqInfo } from "./logicConfigMap.ts";
import { aGet, aPost } from "../../fetch/request.ts";
import { filterObjValue } from "../../comp/filterObjValue.ts";

export const buildDataReqNode = () => {
  const dataReq = signalLogicNode<
    { remoteReqInfo: IRemoteReqInfo },
    unknown,
    unknown
  >({
    id: logic_D_get,
    type: "remote",
    src: remoteGet,
    tips: "获取来自服务器上的数据",
    name: "获取器",
  });
  dataReq.signalIn("in-0", (value) => {
    return of(value.pre);
  });

  dataReq.signalOut<unknown>("out", (value) => {
    return from(
      new Promise((resolve) => {
        console.log(value.config?.remoteReqInfo?.method, 'casascscassavalue')

        console.log(value.config?.remoteReqInfo?.method?.toUpperCase(), 'value.config?.remoteReqInfo?.method?.toLowerCase()')
        const req = () => value.config?.remoteReqInfo?.method?.toUpperCase() !== 'GET' ? aPost(

          "//" +
          value.config?.remoteReqInfo?.url || "",
          value.pre,
          {

            headers: {
              'Access-Control-Allow-Origin': "*",
              'Access-Control-Allow-Methods': "*",
              'Access-Control-Allow-Headers': "*",
              Authorization: value.config?.remoteReqInfo?.token,
              'Content-Type': 'application/json'
            }
          }
        ) : aGet(
          "//" +
          value.config?.remoteReqInfo?.url || "",
          value.pre,
          {

            headers: {
              'Access-Control-Allow-Origin': "*",
              'Access-Control-Allow-Methods': "*",
              'Access-Control-Allow-Headers': "*",
              Authorization: value.config?.remoteReqInfo?.token,
              'Content-Type': 'application/json'
            }
          }
        )

        req().then((res) => {
          const parseKeyData = filterObjValue(
            res?.data || {},
            value.config?.remoteReqInfo?.parse || ""
          )
          console.log(res, 'resssss')
          resolve({
            data: res?.data,
            parseValue: parseKeyData
          });
        });
      })
    );
  });
};
