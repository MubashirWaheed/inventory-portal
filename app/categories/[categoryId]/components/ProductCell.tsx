"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// { data: string; id: string }
const ProductCell = ({ data, id }: any) => {
  const path = usePathname();
  // id should be the value
  return <Link href={`${path}/${id}`}>{data}</Link>;
};

export default ProductCell;
