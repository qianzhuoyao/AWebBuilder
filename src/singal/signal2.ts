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
  run: () => Promise<S>;
}

const signal2 = <O, >(fn: IState<O>): Readonly<ISignal<O>> => {
  return {

    ap: <T, >(signal: ISignal<Promise<T>>) => {
      return signal2(() => signal.chain(signal));
    },

    chain: <T, >(signal: ISignal<T>) => {
      return signal.map(a => a)
        .run();
    },


    effect: (effect: (ctx: O) => void) => {
      return signal2(async () => {
        const promiseObj = fn();
        const value = await promiseObj;
        effect(value);
        return promiseObj;
      });
    },

    map: (mapFn: IMapFn<Promise<O>>) => {
      return signal2(() => mapFn(fn()));
    },

    merge: <T, >(signal: ISignal<T>) => {
      const value0 = signal.run();
      const value1 = fn();
      return signal2(() => new Promise<[Promise<T>, Promise<O>]>(resolve => {
        resolve([value0, value1]);
      }));
    },
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

export const of = <T, >(input: T) => {
  return signal2<T>(() => Promise.resolve(input));
};


/**
 * syncWhile(1,()=>wait(2000,()=>2)).effect(() => console.log(2)).run()
 */
of(1).syncWhile<number>(() => of(11).wait(2000).run(),
).effect(() => console.log(2)).run();
