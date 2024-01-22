export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed" | string;
  email: string;
  company: string;
};
