import React from 'react';

const ImportMui = React.lazy(() => import('./mui'));

const skinToImport: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  mui: ImportMui,
};


const Import: React.FC<{ skin: string }> = ({
                                              skin,
                                            }) => {
  const Import = skinToImport[skin];
  return <React.Suspense fallback={<>loading styles for {skin}</>}><Import /></React.Suspense>;
};

export default Import;