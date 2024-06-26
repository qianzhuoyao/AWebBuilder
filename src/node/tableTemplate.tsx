import { ATable } from "../comp/ATable";
import { getWCache } from "../panel/data";
import { pix_Table } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";

export const TableTemplate = () => {
  const table = signalViewNode(pix_Table);
  table.createElement((_, { id }) => {
    console.log(getWCache(id), "getWCache(id)");
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <ATable id={id}></ATable>
      </div>
    );
  });
};
