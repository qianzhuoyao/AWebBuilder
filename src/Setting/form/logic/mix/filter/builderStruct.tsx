import { memo, useState } from 'react';
import ReactJson from 'react-json-view';
import { useTheme } from 'next-themes';
import { useAutoHeight } from '../../../../../comp/useAutoHeight.tsx';

export const BuilderStruct = memo(() => {
  const { theme } = useTheme();

  const height = useAutoHeight();
  const [jsonConfig, setJsonConfig] = useState<any>({});

  return (
    <div style={{
      height: height - 80 + 'px',
    }}>
      <ReactJson
        name={'resultData'}
        theme={theme === 'dark' ? 'solarized' : 'rjv-default'}
        src={jsonConfig}

        onEdit={() => {
     
        }}
        onSelect={() => {
   

        }}
        onAdd={() => {
 
        }}
        onDelete={() => {
  
        }}
      />
    </div>
  );
});