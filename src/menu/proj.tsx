import { memo, useCallback } from 'react';
import { AInput } from '../comp/AInput';
import { MenuContent } from './content';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';


export const Proj = memo(() => {
  const nav = useNavigate();

  const onHandleCreate = useCallback(() => {
    nav('/panel');
  }, [nav]);
  
  return (
    <div>
      <div className="flex mb-4 justify-between">
        <Button size="sm" onClick={onHandleCreate}>新建</Button>
        <div className="flex">
          <AInput placeholder="搜索" className="w-[250px] mr-2" size="xs" />
          <Button size="sm">搜索</Button>
        </div>
      </div>
      <MenuContent></MenuContent>
    
    </div>
  );
});
