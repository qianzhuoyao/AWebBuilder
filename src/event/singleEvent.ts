import { fromEvent, tap, filter } from "rxjs"

export const onSingleKeyDown = (code: string, callback: (e: KeyboardEvent) => void) => {

    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        filter((e: KeyboardEvent) => {
            return e.key === code.toLowerCase();
        }),
        tap((e) => {
            callback(e)
        })
    ).subscribe()

}
export const onSingleKeyUp = (code: string, callback: (e: KeyboardEvent) => void) => {

    return fromEvent<KeyboardEvent>(document, 'keyup').pipe(
        filter((e: KeyboardEvent) => {
            return e.key === code.toLowerCase();
        }),
        tap((e) => {
            callback(e)
        })
    ).subscribe()

}