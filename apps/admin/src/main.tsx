import { createRoot } from 'react-dom/client';
import { ALayoutInstance, setProvider } from 'AWebBuilder';
import { ALayout } from './ALayout';
import './App.scss';
import { SlotMenu } from './menu/slotMenu';
import { SlotAttrMenu } from './menu/attrMenu.ts';
import { LayerMenu } from './menu/slotMenu/layer';
import { Layout } from './layout';
const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);

const Node = () => {
  return (
    <div>
      <Layout
        leftNode={<LayerMenu></LayerMenu>}
        topNode={<SlotMenu></SlotMenu>}
        RightNode={<SlotAttrMenu></SlotAttrMenu>}
        content={<ALayout></ALayout>}
      ></Layout>
    </div>
  );
};

root.render(<Node></Node>);
