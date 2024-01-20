import {fromEvent, Observable} from 'rxjs'
import {LOG_INSTANCE} from "../Log";


export class MouseRecord {

   public mouseDown$: Observable<MouseEvent>
   public mouseUp$: Observable<MouseEvent>
   public mouseMove$: Observable<MouseEvent>

   constructor() {
      this.mouseDown$ = fromEvent<MouseEvent>(document.body, 'mousedown')
      this.mouseUp$ = fromEvent<MouseEvent>(document.body, 'mouseup')
      this.mouseMove$ = fromEvent<MouseEvent>(document.body, 'mousemove')

   }


}