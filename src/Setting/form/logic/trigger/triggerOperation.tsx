import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Tooltip } from '@nextui-org/react';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSendDugCount, deleteSendDugCount, ILs } from '../../../../store/slice/logicSlice.ts';
import dayjs from 'dayjs';
import { useAutoHeight } from '../../../../comp/useAutoHeight.tsx';
import type { SVGProps } from 'react';


export function PajamasClear(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" {...props}>
    <path fill="#605757" fillRule="evenodd"
          d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8L4.22 5.28a.75.75 0 0 1 0-1.06"
          clipRule="evenodd"></path>
  </svg>);
}

export function MaterialSymbolsPendingActions(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" {...props}>
    <path fill="#ea7575"
          d="M17 22q-2.075 0-3.537-1.463T12 17q0-2.075 1.463-3.537T17 12q2.075 0 3.538 1.463T22 17q0 2.075-1.463 3.538T17 22m1.675-2.625l.7-.7L17.5 16.8V14h-1v3.2zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v6.25q-.45-.325-.95-.55T19 10.3V5h-2v3H7V5H5v14h5.3q.175.55.4 1.05t.55.95zm7-16q.425 0 .713-.288T13 4q0-.425-.288-.712T12 3q-.425 0-.712.288T11 4q0 .425.288.713T12 5"></path>
  </svg>);
}

export function IconParkOutlineDocSuccess(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 48 48" {...props}>
    <g fill="none" stroke="#ea7575" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
      <path d="M38 4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M17 30h14m-14 6h7"></path>
      <path d="m30 13l-8 8l-4-4"></path>
    </g>
  </svg>);
}

export function IconParkOutlineDocFail(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 48 48" {...props}>
    <path fill="none" stroke="#ea7575" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}
          d="M38 4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M17 30h14m-14 6h7m-4-15l8-8m0 8l-8-8"></path>
  </svg>);
}

export function TablerClearAll(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="#ea7575" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 6h12M6 12h12M4 18h12"></path>
  </svg>);
}

export function TablerSubtask(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" {...props}>
    <path fill="none" stroke="#ea7575" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M6 9h6M4 5h4M6 5v11a1 1 0 0 0 1 1h5m0-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zm0 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1z"></path>
  </svg>);
}

const TaskCard = memo(({
                         item,
                         target,
                         id,
                       }: {
  id: string
  target: string
  item: {
    type: 'success' | 'fail' | 'pending'
    startTime: number,
    endTime: number
  }
}) => {
  const dispatch = useDispatch();

  const removeTask = useCallback(() => {
    dispatch(deleteSendDugCount({
      nodeId: target,
      id,
    }));
  }, [dispatch, id]);

  return <Card className="max-w-[400px]">
    <CardHeader className="flex gap-3">
      <TablerSubtask></TablerSubtask>
      <div className="flex flex-col">
        <p className="text-md">任务</p>
        <p className="text-small text-default-500">
          <small>id:</small>
          <small>{id}</small>
        </p>
      </div>
    </CardHeader>
    <Divider />
    <CardBody>
      <div>
        <p className={'text-[15px]'}>
          <small>起始时间:</small>
          <small>{dayjs(item.startTime).format()}</small>
        </p>
        <Divider />
        <p className={'text-[15px]'}>
          <small>结束时间:</small>
          <small>{dayjs(item.endTime).format()}</small>
        </p>
        <Divider />
        <p className={'text-[15px]'}>
          <small>耗时:</small>
          <small>{item.endTime - item.startTime}ms</small>
        </p>
      </div>
    </CardBody>
    <Divider />
    <CardFooter>
      <Button size={'sm'} onClick={removeTask}>
        删除
      </Button>
    </CardFooter>
  </Card>;
});

export const TriggerOperation = memo(({ go, target }: {
  go?: () => void,
  target: string
}) => {
  const dispatch = useDispatch();
  const height = useAutoHeight();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const handleClick = () => {
    go && go();
    console.log(target, logicState, 'tarssget-target');
  };

  const onClear = useCallback(() => {
    dispatch(clearSendDugCount({ nodeId: target }));
  }, [dispatch, target]);

  return <>
    <Button size={'sm'} onClick={handleClick} color="primary">发送</Button>
    <div className={'mt-1'}>
      {/*<small>总发送次数:{*/}
      {/*  Object.keys(logicState.sendDugCount).length*/}
      {/*}</small>*/}
      <div className={'flex justify-around mt-1'}>
        <Tooltip color={'default'} content={'总发送次数'} className="">
          <p className="text-small text-default-500 truncate">
            <TablerClearAll></TablerClearAll>
            <p className={'text-center'}>{Object.keys(logicState.sendDugCount[target] || []).length}</p>
          </p>
        </Tooltip>

        <Tooltip color={'default'} content={'总成功次数'} className="">
          <p className="text-small text-default-500 truncate">
            <IconParkOutlineDocSuccess></IconParkOutlineDocSuccess>
            <p
              className={'text-center'}>{Object.values(logicState.sendDugCount[target] || []).filter(i => i.type === 'success').length}</p>

          </p>
        </Tooltip>
        <Tooltip color={'default'} content={'总失败次数'} className="">
          <p className="text-small text-default-500 truncate">
            <IconParkOutlineDocFail></IconParkOutlineDocFail>
            <p
              className={'text-center'}>{Object.values(logicState.sendDugCount[target] || []).filter(i => i.type === 'fail').length}</p>

          </p>
        </Tooltip>
        <Tooltip color={'default'} content={'当前正在执行次数'} className="">
          <p className="text-small text-default-500 truncate">
            <MaterialSymbolsPendingActions></MaterialSymbolsPendingActions>
            <p
              className={'text-center'}>{Object.values(logicState.sendDugCount[target] || []).filter(i => i.type === 'pending').length}</p>

          </p>
        </Tooltip>
      </div>
    </div>
    <Divider className={'my-2'} />
    <div className={'mt-1'}>
      <div className={'flex justify-between items-center'}>
        <small>
          触发时间概览
        </small>
        <PajamasClear className={'cursor-pointer'} onClick={onClear}></PajamasClear>
      </div>

      <div className={'mt-1 overflow-y-scroll px-[5px]'}
           style={{
             height: height - 220 + 'px',
           }}>
        {
          Object.keys(logicState.sendDugCount[target] || []).map((key, index) => {
            return <div className={'my-1'} key={index}>
              <TaskCard
                id={key}
                target={target}
                item={logicState.sendDugCount[target][key]}></TaskCard>
            </div>;
          })
        }
      </div>

    </div>
  </>;
});