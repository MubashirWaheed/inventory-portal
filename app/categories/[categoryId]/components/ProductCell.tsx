"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// { data: string; id: string }
const ProductCell = ({ data: productName, id }: any) => {
  const path = usePathname();
  return <Link href={`${path}/${id}`}>{productName}</Link>;
};

export default ProductCell;
