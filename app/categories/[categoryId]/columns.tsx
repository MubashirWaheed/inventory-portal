"use client";
import { Product } from "@/types/Payment";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import IssueDialog from "./components/Dialoges/IssueDialog";
import ProductCell from "./components/ProductCell";
import AddStockDialog from "./components/Dialoges/AddStockDialog";
import { Protect } from "@clerk/nextjs";

type RowType = { helo: string };

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "Index",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    accessorKey: "itemCode",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0.5renm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product code
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.getValue("itemCode") as string;
      return <ProductCell data={data} id={row.original.id} />;
    },
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-left">In Stock</div>,
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity"));
      return <div className="text-left font-medium">{quantity}</div>;
    },
  },
  {
    accessorKey: "company",
    header: () => <div className="text-left">Company</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("company")}</div>
      );
    },
  },
  {
    id: "issueDialog",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return <IssueDialog item={row.original} />;
    },
  },
  {
    id: "addStockDialog",
    enableHiding: false,
    cell: (info: unknown) => {
      const infoCasted = info as CellContext<RowType, string>;
      return (
        <Protect permission="org:feature:create">
          <AddStockDialog
            item={(info as any)?.row?.original}
            employeeList={(info as any)?.helo}
          />
        </Protect>
      );
    },
  },
];
