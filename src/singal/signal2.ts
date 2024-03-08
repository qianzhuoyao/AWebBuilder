/**
 *
 *
 *  scene:
 *  同步不合并
 *  a->b->**(n)->end
 *  a(0) : of(1)  start
 *  b(1) : a(0).map(value=>value+'1')  append '1'   -> '11'
 *  c(2) : b(1).map(value=>value+'2')  append '2'   ->'112'
 *  ...
 *  end(n) : end(n-1).run()    -> xx
 *
 *  异步不合并
 *  a(0) : of(Promise.resolve(1))  start  promise<1>
 *  b(1) : a(0).map(value=>new Promise(res=>{res(2)}))  change 2  -> promise<2>
 *  ...
 * end(n) : end(n-1).run()    -> promise<xx>
 *
 *
 *  合并
 *  a1->
 *       =>b->**(n)->end
 *  a2->
 *
 *
 *  a1(0) : of(Promise.resolve(1))  start  promise<1>
 *  a2(0) : of(Promise.resolve(1))  start  promise<1>
 *  b(1)  : a1(0).merge(a2(0)).map(async(a)=>{
 *    const a1Value =await a[0]
 *    const a2Value =await a[1]
 *    return new Promise(res=>res(a1Value+a2Value))
 *  })   compose(a1(0),a2(0))  compose  promise<2>
 *  xxx
 *  end : end(n-1).run()    -> promise<xx>
 *
 *  延时
 *  a1->(500ms)
 *       =>b->**(n)->end
 *  a1(0) : of(1)  start 1
 *  a1(1): a1(0).wait(500)  wait 500
 *  end : end(n-1).run()    -> xx
 *
 *  异步等待
 *  a1->(500ms)
 *  a2-(wait a1)>b->xxx->end
 *
 *  of(a2).syncWhile(()=>of(a1).wait(500).run()).run()
 *
 */

/**
 * useSignal2._of(1)._map(a=>a)
 */



type  IState<T> = () => Promise<T>

type IMapFn<T> = (mapValue: T) => T


interface ISignal<S> {
  map: (mapFn: IMapFn<Promise<S>>) => ISignal<S>;
  ap: <K>(signal: ISignal<Promise<K>>) => ISignal<Promise<K>>;
  chain: <K>(signal: ISignal<K>) => Promise<K>;
  merge: <T>(signal: ISignal<T>) => Readonly<ISignal<[Promise<T>, Promise<S>]>>;
  effect: (effect: (ctx: S) => void) => Readonly<ISignal<S>>;
  syncWhile: <W>(waitFn: () => Promise<W>) => Readonly<ISignal<S>>;
  wait: (time: number) => Readonly<ISignal<S>>;
  loop: <C>(interTime: number, condition: () => Promise<C>) => Readonly<ISignal<S>>;
  run: () => Promise<S>;
}


const signal2 = <O, >(fn: IState<O>): Readonly<ISignal<O>> => {


  return {

    /**
     * 替换信号
     * of(0).ap(of(1)) =>signal
     *
     * @param signal
     */
    ap: <T, >(signal: ISignal<Promise<T>>) => {
      return signal2(() => signal.chain(signal));
    },

    /**
     * 打平
     * of(1).chain(of(2)) =>result
     * @param signal
     */
    chain: <T, >(signal: ISignal<T>) => {
      return signal.map(a => a)
        .run();
    },

    /**
     * 副作用
     *
     * of(1).effect(a=>console.log(a)).run()
     * @param effect
     */
    effect: (effect: (ctx: O) => void) => {
      return signal2(async () => {
        const promiseObj = fn();
        const value = await promiseObj;
        effect(value);
        return promiseObj;
      });
    },

    /**
     * 映射信号返回一个新型号
     * of(1).map(a=>2)
     * @param mapFn
     */
    map: (mapFn: IMapFn<Promise<O>>) => {
      return signal2(() => mapFn(fn()));
    },

    /**
     * 合并信号
     * example:
     * of(1).merge(of(2)).run()
     *
     * 合并of(1) 与 of(2) 信号，生成 第三个信号参数为[of(1),of(2)]
     *
     * @param signal
     */
    merge: <T, >(signal: ISignal<T>) => {
      const value0 = signal.run();
      const value1 = fn();
      return signal2(() => new Promise<[Promise<T>, Promise<O>]>(resolve => {
        resolve([value0, value1]);
      }));
    },

    /**
     * 延时信号
     *
     * example:
     * of(1).wait(2000).run()
     * 两秒后发出1
     *
     * @param time
     */
    wait: (time: number) => {
      return signal2(() => {
        return new Promise(resolve => {
          setTimeout(async () => {
            const value = await fn();
            resolve(value);
          }, time);
        });
      });
    },

    loop: <C>(interTime: number, condition: () => Promise<C>) => {

      const state = () => {
        return {
          stop: false,
        };
      };

      const option = (builder: () => { stop: boolean }) => {
        const st = builder();
        return () => {
          return {
            getStop: () => st.stop,
            setStop: (state: boolean) => {
              st.stop = state;
            },
          };
        };
      };

      const status = option(state);

      condition().then(() => {
        status().setStop(true);
      });


      const interval = () => {
        return signal2(() => {
          return new Promise<O>(resolve => {
            setTimeout(() => {
              if (!status().getStop()) {
                interval().map(fn);
              }
              resolve(fn());
            }, interTime);
          });
        });
      };
      return interval();
    },
    /**
     * 等待信号
     * example:
     * of(1).syncWhile(()=>of(2).wait(4000).run()).run()
     *
     * 直到收到wait信号4秒后才发出1
     * @param waitFn
     */
    syncWhile: <W, >(waitFn: () => Promise<W>) => {
      return signal2<O>(() => {
        return new Promise<O>(resolve => {
          waitFn().then(async () => {
            const value = await fn();
            resolve(value);
          });
        });
      });
    },

    run: () => {
      return fn();
    },

  };
};

/**
 * 将输入转化为信号
 * @param input
 */
export const of = <T, >(input: T) => {
  return signal2<T>(() => Promise.resolve(input));
};
/**
 * 定时输出信号
 * @param interTime
 * @param input
 * @param condition
 */

/**
 * 发送1 直到11的信号完成才完成
 */
of(1).loop<number>(
  1000,
  () => of(1)
    .wait(4000)
    .run())
  .effect(() => console.log(2))
  .run();
