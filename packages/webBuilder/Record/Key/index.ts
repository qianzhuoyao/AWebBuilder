import {fromEvent, Observable} from 'rxjs'
import {LOG_INSTANCE} from "../Log";


export class KeyRecord {

   public keyDown$: Observable<KeyboardEvent>
   public keyUp$: Observable<KeyboardEvent>


   constructor() {
      this.keyDown$ = fromEvent<KeyboardEvent>(document.body, 'keydown')
      this.keyUp$ = fromEvent<KeyboardEvent>(document.body, 'keyup')

   }


}