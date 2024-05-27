import { useDispatch, useSelector } from "react-redux";
import { INs, pix_Text, updateInstance } from "../../../store/slice/nodeSlice";
import { StreamData } from "../../form/logic/remoteReq/StreamData";
import { DefaultViewNodeConfigForm } from "../../form/view/BXChartConfigForm";
import { signalViewNodeAttrConfig } from "../../signalNodeConfig";
import { Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { useCallback } from "react";
import { insertConfig } from "../../../node/viewConfigSubscribe";
import { useTakeNodeData } from "../../../comp/useTakeNodeData";

const TextConfigSetting = () => {
    const NodesState = useTakeNodeData()
    const dispatch = useDispatch();

    const onUpdateFontFamily = useCallback(
        (value: string) => {
            try{
                insertConfig(NodesState.targets[0], {
                    ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                    fontFamily: value,
                });
                dispatch(
                    updateInstance({
                        type: NodesState.list[NodesState.targets[0]].instance.type,
                        id: NodesState.targets[0],
                        option: {
                            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                            fontFamily: value,
                        },
                    })
                );
            }catch(e){}
        },
        [NodesState.list, NodesState.targets, dispatch]
    );
    const onUpdateFontSize = useCallback(
        (value: string) => {
            try{
                insertConfig(NodesState.targets[0], {
                    ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                    fontSize: value,
                });
                dispatch(
                    updateInstance({
                        type: NodesState.list[NodesState.targets[0]].instance.type,
                        id: NodesState.targets[0],
                        option: {
                            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                            fontSize: value,
                        },
                    })
                );
            }catch(e){}
        },
        [NodesState.list, NodesState.targets, dispatch]
    );
    const onUpdateFontWeight = useCallback(
        (value: string) => {
           try{
            insertConfig(NodesState.targets[0], {
                ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                fontWeight: Number(value),
            });
            dispatch(
                updateInstance({
                    type: NodesState.list[NodesState.targets[0]].instance.type,
                    id: NodesState.targets[0],
                    option: {
                        ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                        fontWeight: value,
                    },
                })
            );
           }catch(e){}
        },
        [NodesState.list, NodesState.targets, dispatch]
    );

    const onUpdateColor = useCallback(
        (value: string) => {
           try{
            insertConfig(NodesState.targets[0], {
                ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                color: value,
            });
            dispatch(
                updateInstance({
                    type: NodesState.list[NodesState.targets[0]].instance.type,
                    id: NodesState.targets[0],
                    option: {
                        ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                        color: value,
                    },
                })
            );
           }catch(e){}
        },
        [NodesState.list, NodesState.targets, dispatch]
    );

    const onUpdateText = useCallback(
        (value: string) => {
            try{
                insertConfig(NodesState.targets[0], {
                    ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                    text: value,
                });
                dispatch(
                    updateInstance({
                        type: NodesState.list[NodesState.targets[0]].instance.type,
                        id: NodesState.targets[0],
                        option: {
                            ...NodesState.list[NodesState.targets[0]]?.instance?.option,
                            text: value,
                        },
                    })
                );
            }catch(e){
                console.error(e)
            }
        },
        [NodesState.list, NodesState.targets, dispatch]
    );

    return <>
        <div>
            <small>内容</small>
            <Input
                type="text"
                placeholder="内容,可用过{}的形式取用流值路径"
                labelPlacement="outside"
                value={
                    NodesState.list[NodesState.targets[0]]?.instance?.option?.text || ""
                }
                // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
                onChange={(e) => {
                    onUpdateText(e.target.value);
                }}
            />
        </div>
        <div>
            <small>颜色</small>
            <Input
                type="text"
                placeholder="颜色,可用过{}的形式取用流值路径"
                labelPlacement="outside"
                value={
                    NodesState.list[NodesState.targets[0]]?.instance?.option?.color || ""
                }
                // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
                onChange={(e) => {
                    onUpdateColor(e.target.value);
                }}
            />
        </div>
        <div>
            <small>字号大小</small>
            <Input
                type="text"
                placeholder="字号大小,可用过{}的形式取用流值路径"
                labelPlacement="outside"
                value={
                    String(NodesState.list[NodesState.targets[0]]?.instance?.option?.fontWeight) || ""
                }
                // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
                onChange={(e) => {
                    onUpdateFontWeight(e.target.value);
                }}
            />
        </div>
        <div>
            <small>字体大小</small>
            <Input
                type="text"
                placeholder="字体大小,可用过{}的形式取用流值路径"
                labelPlacement="outside"
                value={
                    NodesState.list[NodesState.targets[0]]?.instance?.option?.fontSize || ""
                }
                // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
                onChange={(e) => {
                    onUpdateFontSize(e.target.value);
                }}
            />
        </div>
        <div>
            <small>字体</small>
            <Input
                type="text"
                placeholder="字体,可用过{}的形式取用流值路径"
                labelPlacement="outside"
                value={
                    NodesState.list[NodesState.targets[0]]?.instance?.option?.fontFamily || ""
                }
                // value={NodesState.list[NodesState.targets[0]].instance.option?.src || ''}
                onChange={(e) => {
                    onUpdateFontFamily(e.target.value);
                }}
            />
        </div>
    </>
}

export const TextConfig = () => {
    const config = signalViewNodeAttrConfig(pix_Text);
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
                                title={"内容配置"}
                            >
                                <Card>
                                    <CardBody>
                                        <TextConfigSetting></TextConfigSetting>
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
                                        <StreamData id={nodeInfo.target[0]} />
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
