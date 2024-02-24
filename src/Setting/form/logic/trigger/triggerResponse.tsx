import { memo, useCallback } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Chip, Spinner } from '@nextui-org/react';
import { useAutoHeight } from '../../../../comp/useAutoHeight.tsx';

import type { SVGProps } from 'react';
import ReactJson from 'react-json-view';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { clearStagePool, ILs } from '../../../../store/slice/logicSlice.ts';


function IcSharpError(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" {...props}>
    <path fill="#db3d3d"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"></path>
  </svg>);
}

const CheckIcon = ({
                     size,
                     height,
                     width,
                     ...props
                   }: any) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
        fill="currentColor" />
    </svg>
  );
};


export function CarbonReset(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 32 32" {...props}>
    <path fill="#a3a3a3"
          d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"></path>
  </svg>);
}

export const TriggerResponse = memo(() => {
  // clearStagePool
  const { theme } = useTheme();
  const height = useAutoHeight();
  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const onHandleReset = useCallback(() => {
    dispatch(clearStagePool());
  }, [dispatch]);

  return <>
    <div className={'h-full overflow-scroll'} style={{
      height: height - 80 + 'px',
    }}>
      <div className={'flex items-center justify-between px-1'}>
        <small>result</small>
        <>{
          logicState.stagPool.length >= 1 ? <> {logicState.stagPool[logicState.stagPool.length - 1]?.currentNode?.talkStatus === 'pending' ?
            <Spinner /> : (
              logicState.stagPool[logicState.stagPool.length - 1]?.currentNode?.talkStatus === 'ok' ? <> <Chip
                startContent={<CheckIcon size={18} />}
                variant="faded"
                color="success"
              >
                OK
              </Chip></> : <>
                <Chip
                  startContent={<IcSharpError />}
                  variant="faded"
                  color="danger"
                >
                  ERROR
                </Chip></>
            )}</> : <>暂无响应</>
        }</>
        <CarbonReset onClick={onHandleReset} className={'w-[20px] h-[20px] cursor-pointer'}></CarbonReset>

      </div>
      {logicState.stagPool.map((stage, index) => {
        return stage && <>
          <Card className="max-w-[400px] mt-1 mx-1">

            <CardHeader className="">
              阶段 {index}
            </CardHeader>
            <CardBody className={'text-[10px]'}>
              <div className="">
                <p>起始点:{stage.currentEdge.from}</p>
                <p>目标点:{stage.currentEdge.to}</p>
              </div>
              <div className="">
                <p>起始点端口:{stage.currentEdge.fromPort}</p>
                <p>目标点端口:{stage.currentEdge.toPort}</p>
              </div>
              <div className="">
                <p>当前节点:{stage.currentNode?.node.id}</p>
                <p>所属类型:{stage.currentNode?.node.typeId}</p>
              </div>
              {stage.errorTipMsg && <div className={'text-red-600'}>
                <p>错误提示:</p>
                <p>
                  {stage.errorTipMsg}
                </p>
              </div>}
              <div className="">
                <p>流数据:</p>
                <ReactJson
                  collapsed={true}
                  name={'streamData'}
                  theme={theme === 'dark' ? 'solarized' : 'rjv-default'}
                  src={stage.data || {}}
                />
              </div>
            </CardBody>
            <CardFooter>
              <small>结果:{stage.currentNode?.talkStatus}</small>
            </CardFooter>
          </Card>
        </>;
      })}
    </div>
  </>;
});