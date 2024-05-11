import { signalViewNode } from "./baseViewNode";
import { IViewNode, pix_Text } from "../store/slice/nodeSlice";
import { useEffect, useRef, useState } from "react";
import { useAutoSubscription } from "../comp/autoSubscription";
import { parseContent } from "../comp/parseTemplate";
const Content = ({ config, id }: { config: IViewNode, id: string }) => {
    const [content, setContent] = useState(() => config.instance.option);

    const textRef = useRef<HTMLSpanElement>(null)

    useAutoSubscription(config.id).render((value) => {
        console.log(value, parseContent(value, id), "useAutoSubscriptioAnasdasd");
        const result = parseContent(value, id)
        setContent(result)
    });


    useEffect(() => {
        if (textRef.current instanceof HTMLElement) {
            textRef.current.style.color = ''
            textRef.current.style.fontFamily = ''
            textRef.current.style.fontSize = '12px'
            textRef.current.style.fontWeight = '500'
            textRef.current.style.color = content?.color || ''
            textRef.current.style.fontFamily = content?.fontFamily || ''
            textRef.current.style.fontSize = content?.fontSize || '12px'
            textRef.current.style.fontWeight = String(content?.fontWeight) || '500'
        }
    }, [content])

    return <span ref={textRef}>{content?.text}</span>
}

export const TextTemplate = () => {
    const text = signalViewNode(pix_Text);

    text.createElement((_, { NodesState, id }) => {
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <Content id={id} config={NodesState.list[id]}></Content>
            </div>
        );
    });
};
