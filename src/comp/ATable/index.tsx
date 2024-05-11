import "./index.css";
import {
  Cell,
  ColumnDef,
  Header,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateDraggable } from "../../store/slice/widgetSlice.ts";
import { filterObjValue } from "../filterObjValue.ts";
import { v4 } from "uuid";
import { useMouseUp } from "../useMouseUp.tsx";
import { getWCache } from "../../panel/data.ts";
import { useAutoSubscription } from "../autoSubscription.tsx";
import { ATTR_TAG, NODE_ID, NODE_TYPE_CODE } from "../../contant/index.ts";

const DraggableTableHeader = <T,>({
  header,
  table,
}: {
  header: Header<T, unknown>;
  table: Table<T>;
}) => {
  console.log(header, "sfheaders");
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const dispatch = useDispatch();

  const resizeStart = useCallback(() => {
    dispatch(updateDraggable(false));
    return header.getResizeHandler();
  }, [dispatch, header]);

  const mouseUpDefaultSetDraggable = useCallback(() => {
    dispatch(updateDraggable(true));
  }, [dispatch]);

  useMouseUp(mouseUpDefaultSetDraggable);
  console.log(header, "headers");
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.getSize(),
    zIndex: isDragging ? 100 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      {...{
        colSpan: header.colSpan,
        key: header.id,
        className: "thz bg-[#f5f8fd] text-[#000c] text-[13px]",
        style: style,
      }}
    >
      <span {...attributes} {...listeners}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </span>

      <div
        {...{
          onMouseDown: resizeStart(),
          onTouchStart: resizeStart(),
          className: `w-[4px] resizer ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? "isResizing" : ""
            }`,
        }}
      ></div>
    </div>
  );
};

const DragAlongCell = <T,>({
  cell,
  color,
}: {
  cell: Cell<T, unknown>;
  color: string;
}) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    color: "#000",
    background: color,
  };

  return (
    <div style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};

export const ATable = memo(<T,>({ id }: { id: string }) => {
  const [columns, setColumns] = useState<ColumnDef<T>[]>([]);
  const [data, setData] = useState<T[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch();

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((c) => c.id!)
  );

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const handleDragStart = useCallback(() => {
    dispatch(updateDraggable(false));
  }, []);



  useAutoSubscription(id).render((value) => {
    const col = filterObjValue(getWCache(id) || {}, value?.colField || "");
    const tableData = filterObjValue(
      getWCache(id) || {},
      value.dataField || ""
    );
    setColumns(() => {
      if (Array.isArray(col)) {
        return (col || []).map((item) => {
          return {
            cell: (info) => {
              return info.row.original[
                (item[value?.colProp || ""] || "") as keyof T
              ];
            },
            header: () => <span>{item[value.colLabel || ""]}</span>,
            id: item[value?.colProp || ""] || v4(),
          };
        }) as ColumnDef<T>[];
      }
      return [];
    });

    setData((tableData || []) as T[]);
  });


  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }
    [...nodeRef.current.getElementsByTagName("*")].forEach((ele) => {
      ele.setAttribute(ATTR_TAG, NODE_TYPE_CODE);
      ele.setAttribute(NODE_ID, id);
    });
  }, [data]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
    dispatch(updateDraggable(true));
  }, []);

  return (
    <div ref={nodeRef} >
      {columns.length > 0 ? (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="w-full h-full overflow-scroll">
            <table
              className="w-full h-full"
              style={{
                //width: table.getCenterTotalSize(),
                width: table.getCenterTotalSize(),
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <div
                    {...{
                      key: headerGroup.id,
                      className: "trz",
                    }}
                  >
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader
                          key={header.id}
                          header={header}
                          table={table}
                        />
                      ))}
                    </SortableContext>
                  </div>
                ))}
              </thead>
              <tbody className="bg-[#fff]">
                {table.getRowModel().rows.map((row, index) => (
                  <div
                    {...{
                      key: row.id,
                      className: `trz`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <SortableContext
                        key={cell.id}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DragAlongCell
                          color={index % 2 ? "#e1e1e1" : "#fff"}
                          key={cell.id}
                          cell={cell}
                        />
                      </SortableContext>
                    ))}
                  </div>
                ))}
              </tbody>
            </table>
          </div>
        </DndContext>
      ) : (
        <>表格无配置</>
      )}
    </div>
  );
});
