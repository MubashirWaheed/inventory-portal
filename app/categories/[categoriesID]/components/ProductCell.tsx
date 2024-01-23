"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProductCell = ({ data, id }: { data: string; id: string }) => {
  const path = usePathname();
  return <Link href={`${path}/${id}`}>{data}</Link>;
};

export default ProductCell;
