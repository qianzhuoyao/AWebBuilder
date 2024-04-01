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
import { CSSProperties, memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateDraggable } from "../../store/slice/widgetSlice.ts";
import { subscribeConfig } from "../../node/viewConfigSubscribe.ts";
import { filterObjValue } from "../filterObjValue.ts";
import { v4 } from "uuid";

const DraggableTableHeader = <T,>({
  header,
  table,
}: {
  header: Header<T, unknown>;
  table: Table<T>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });
  const dispatch = useDispatch();
  const resizeStart = useCallback(() => {
    dispatch(updateDraggable(false));
    return header.getResizeHandler();
  }, [header]);

  const mouseUpDefaultSetDraggable = useCallback(() => {
    dispatch(updateDraggable(true));
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpDefaultSetDraggable, false);
    return () => {
      window.removeEventListener("mouseup", mouseUpDefaultSetDraggable);
    };
  }, [mouseUpDefaultSetDraggable]);

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.getSize(),
    zIndex: isDragging ? 1000 : 0,
  };
  console.log(header.getSize(), "listeners");
  return (
    <div
      ref={setNodeRef}
      {...{
        colSpan: header.colSpan,
        key: header.id,
        className: "th",
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
          className: `w-[4px] resizer ${table.options.columnResizeDirection} ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`,
        }}
      ></div>
    </div>
  );
};

const DragAlongCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};

export const ATable = memo(
  <T,>({ streamData, id }: { streamData: any; id: string }) => {
    const [columns, setColumns] = useState<ColumnDef<T>[]>([]);
    const [data, setData] = useState<T[]>([]);

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

    useEffect(() => {
      const sub = subscribeConfig((value) => {
        if (id === value.id) {
          const col = filterObjValue(streamData, value?.colField || "");
          const tableData = filterObjValue(streamData, value.dataField || "");
          console.log(col, tableData, value, streamData, "cscscscsc");
          setColumns(() => {
            if (Array.isArray(col)) {
              return (col || []).map((item) => {
                return {
                  // accessorFn: (row) => {
                  //   console.log(row,'cccccws3333');
                  //   return row[value?.colProp||'']
                  // },
                  cell: (info) => {
                    console.log(
                      info.row.original,
                      value?.colProp,
                      "info.getValue()"
                    );
                    return info.row.original[
                      (item[value?.colProp || ""] || "") as keyof T
                    ];
                  },
                  header: () => <span>{item[value.colLabel || ""]}</span>,
                  id: value.colProp || v4(),
                };
              }) as ColumnDef<T>[];
            }
            return [];
          });
          setData((tableData || []) as T[]);
        }
      });
      return () => {
        sub.unsubscribe();
      };
    }, [streamData]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
      const { active, over } = event;
      console.log(event, "event");
      if (active && over && active.id !== over.id) {
        setColumnOrder((columnOrder) => {
          const oldIndex = columnOrder.indexOf(active.id as string);
          const newIndex = columnOrder.indexOf(over.id as string);
          return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
        });
      }
      dispatch(updateDraggable(true));
    }, []);
    // reorder columns after drag & drop

    return (
      <>
        {columns.length > 0 ? (
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div>
              <table
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
                        className: "tr",
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
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <div
                      {...{
                        key: row.id,
                        className: "tr",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <SortableContext
                          key={cell.id}
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          <DragAlongCell key={cell.id} cell={cell} />
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
      </>
    );
  }
);
