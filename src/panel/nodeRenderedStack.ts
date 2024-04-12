import { createSingleInstance } from "../comp/createSingleInstance"

const stack = () => {
    return {
        stack: new Set<string>([])
    }
}
const getStack = createSingleInstance(stack)

export const insertMountedNodeId = (id: string) => {
    getStack().stack.add(id)
}

export const isMountedNodeId = (id: string) => {
    return getStack().stack.has(id)
}
export const clear = () => {
    getStack().stack.clear()
}
export const remove = (id: string) => {
    getStack().stack.delete(id)
}