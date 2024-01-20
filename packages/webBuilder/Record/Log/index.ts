import dayjs from 'dayjs'
import {ILog, insertLogTask, logObservable} from "../../Queue/logQueue";
import {parseTime} from "../../Queue/parseTime";
import {Subscription} from "rxjs";


export class Log {

   private static instance: Log | null = null;
   private logSubscription?: Subscription;
   private log: ILog[] = []
   private logWatch: (log: ILog[]) => void = () => void 0


   /**
    * 裁剪日志数量
    * @param size
    */
   public cutLog(size = 2000) {
      if (Log.instance?.log.length) {
         if (Log.instance?.log.length >= size) {
            Log.instance.log = Log.instance?.log.slice(-2000)
         }
      }
      return Log.instance?.log || []
   }

   public static getInstance(): Log {
      if (!Log.instance) {
         Log.instance = new Log();
      }
      Log.instance.logSubscription = logObservable.subscribe(value => {
         if (value.type && Log.instance?.log) {
            Log.instance.log = Log.instance?.log.concat([value])
            Log.instance.logWatch(Log.instance.cutLog())
         }
      })
      return Log.instance;
   }

   public insertLog(log: Omit<ILog, "time">) {
      insertLogTask(() => {
         return new Promise<ILog>(
            resolve => {
               resolve({
                  ...log,
                  time: parseTime(dayjs())
               })
            }
         )
      })
   }

   public printLog() {
      console.log(Log.instance, 'vcsv')
      return Log.instance?.log
   }

   public clearLog() {
      if (Log.instance?.log) {
         Log.instance.log = []
      }
   }

   public closeLog() {
      Log.instance?.logSubscription?.unsubscribe()
   }

   public logSubscribe(subscribe: (log: ILog[]) => void) {
      console.log(Log.instance, 'Log.instance')
      if (Log.instance) {
         Log.instance.logWatch = subscribe
      }
   }

}


export const LOG_INSTANCE = Log.getInstance()