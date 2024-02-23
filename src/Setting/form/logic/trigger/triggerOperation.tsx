import { Button } from '@nextui-org/react';
import { memo } from 'react';

export const TriggerOperation = memo(({ go }: {
  go: () => void
}) => {
  const handleClick = () => {
    go();
  };
  return <>
    <Button size={'sm'} onClick={handleClick}>发送</Button>
  </>;
});