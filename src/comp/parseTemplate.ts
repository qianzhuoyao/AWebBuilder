import { getWCache } from "../panel/data"
import { filterObjValue } from "./filterObjValue"

export const parseContent = (input: Record<string, any>, id: string) => {
    const parseReg = /\{(.+?)\}/gi
    console.log(input, id, 'cascwc3cwwc1')
    const newContent: Record<string, any> = {...input}
    Object.keys(input).map((key) => {
        const parseResult = String(input[key]).match(parseReg)
        if (parseResult?.length) {
            const path = parseResult[0].replace("{", '').replace('}', '')

            //获取最终值
            const fKey = path.split('.').splice(-1)[0] || ''
            console.log(getWCache(id), fKey, 'cascwc3cwwc')
            if (getWCache(id)) {
                newContent[key] = filterObjValue(getWCache(id) || {}, path || "")
            }

        }
    })
    return newContent
}