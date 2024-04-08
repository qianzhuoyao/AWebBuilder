import { ATable } from "../comp/ATable";
import { getWCache } from "../panel/data";
import { pix_Table } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";

export const TableTemplate = () => {
  const table = signalViewNode(pix_Table);
  table.createElement((_, { id }) => {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ATable id={id} streamData={getWCache(id)}></ATable>
      </div>
    );
  });
};
