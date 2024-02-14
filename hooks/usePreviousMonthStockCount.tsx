import { fetcher } from "@/lib/fetecher";
import useSWR from "swr";

const usePreviousMonthStockCount = (from: any, to: any) => {
  const { data } = useSWR(
    `/api/dashbaord/previous-month-count?from=${from}&to=${to}`,
    fetcher,
  );

  return {};
};
