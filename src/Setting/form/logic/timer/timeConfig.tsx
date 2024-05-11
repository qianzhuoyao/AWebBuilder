import { Chip, Input } from "@nextui-org/react";

import { useCallback, useEffect, useState } from "react";
import { genLogicConfigMap } from "../../../../Logic/nodes/logicConfigMap.ts";
import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../../../../comp/createSingleInstance.ts";
import { useTakeLogicData } from "../../../../comp/useTakeLogicData.tsx";

const syncTimeConfig = () => {
  const subject = new ReplaySubject();
  return {
    subject,
  };
};
export const getSyncTimeIntConfig = createSingleInstance(syncTimeConfig);

interface ISubjectValue {
  status: boolean;
}

export const TimeConfig = () => {
  const logicState = useTakeLogicData()
  const loadTime = String(
    genLogicConfigMap().configInfo.get(logicState.target[0])?.timerConfigInfo
      ?.time
  );
  const [time, setTime] = useState(loadTime);
  const [subjectValue, setSubjectValue] = useState<ISubjectValue>({
    status: false,
  });

  const updateTime = useCallback(
    (time: string) => {
      setTime(time);
      genLogicConfigMap().configInfo.set(logicState.target[0], {
        timerConfigInfo: {
          time: Number(time),
        },
      });
    },
    [logicState.target]
  );

  useEffect(() => {
    const subscription = getSyncTimeIntConfig().subject.subscribe((value) => {
      setSubjectValue(value as ISubjectValue);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div>
        <small>间隔时间(ms):</small>
        <Input
          type="text"
          placeholder="间隔时间"
          value={time}
          labelPlacement="outside"
          onChange={(e) => {
            updateTime(e.target.value);
          }}
        />
        <div className={"mt-1"}>
          <small>工作状态:</small>
          {/*{subjectValue?.status ? '工作中' : '未工作'}*/}
          {subjectValue?.status ? (
            <Chip variant="faded" color="success">
              工作中
            </Chip>
          ) : (
            <Chip variant="faded" color="danger">
              未工作
            </Chip>
          )}
        </div>
        <div className={"mt-1"}>
          <small>并发:</small>
        </div>
      </div>
    </>
  );
};
