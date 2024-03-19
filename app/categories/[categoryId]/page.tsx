"use client";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/fetecher";
import { Button } from "@/components/ui/button";
import { useEmployees } from "@/hooks/useEmployees";
import AddItemDialog from "./components/Dialoges/AddItemDialog";
import { Protect } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryItem {
  categoryId: number;
  company: string;
  id: number;
  itemCode: string;
  quantity: number;
  Category: {
    name: string;
  };
}

const Category = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { categoryId } = useParams();

  const { data: categoryData, isLoading } = useSWR<{ data: CategoryItem[] }>(
    `/api/products/productsByCategory?categoryId=${categoryId}`,
    fetcher,
  );
  const { data: category } = useSWR(`/api/categories/${categoryId}`, fetcher);

  const { data: list } = useSWR("/api/employees", fetcher);

  const { setEmployeeList } = useEmployees();
  const { data: suppliersList } = useSWR("/api/suppliers", fetcher);
  const { data: employeeList } = useSWR("/api/employees", fetcher);

  useEffect(() => {
    console.log("EMPLOYEE LIST:", employeeList);
  }, [employeeList]);

  const data = useMemo(() => categoryData?.data ?? [], [categoryData]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (list) {
      setEmployeeList(list);
    }
  }, [list]);

  return (
    <div className="w-full px-8 pb-8 pt-6 ">
      <h2 className="text-3xl font-bold">{category?.data.name}</h2>
      <div className="flex justify-between items-center py-4">
        {/* CATEGORY SEARCH INPUT */}
        <Input
          placeholder="Search item"
          value={
            (table.getColumn("itemCode")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: any) =>
            table.getColumn("itemCode")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-3">
          {/* org:feature:createorg:feature:create */}
          {/*  */}
          <Protect permission="org:sys_memberships:manage">
            <AddItemDialog />
          </Protect>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell className="cursor-pointer" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        suppliersList,
                        employeeList,
                      })}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Category;
