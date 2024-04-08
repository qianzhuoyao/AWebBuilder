import { interval, map } from "rxjs"

export const loop = (duration: number, task: () => void) => {
    if (!duration) {
        throw new Error('duration error')
    }
    return interval(duration * 1000).pipe(
        map(() => { task() })
    ).subscribe()
}