import { create } from "zustand";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
// type DateRange = {
//   from: Date;
//   to: Date;
// };

type DashboardState = {
  date: DateRange;
  setDate: (newDate: DateRange) => void;
};
const useDashboardTimeFrameStore = create<DashboardState>((set) => ({
  date: {
    from: startOfMonth(currentUtcDate()),
    to: currentUtcDate(),
  },
  setDate: (newDate: any) => set({ date: newDate }),
}));

export default useDashboardTimeFrameStore;
