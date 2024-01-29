import { Payment } from "@/types/Payment";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import IssueDialog from "./components/IssueDialog";
import ProductCell from "./components/ProductCell";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Index",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product code
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.getValue("email") as string;
      return <ProductCell data={data} id={row.original.id} />;
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-left">In Stock</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-left font-medium">25</div>;
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return <IssueDialog />;
    },
  },
];
