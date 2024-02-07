import { create } from "zustand";
// need to fix the type

type EmployeeData = {
  id: number;
  displayName: string;
  value: string;
};

type APIResponse = {
  data: EmployeeData[];
};

type EmployeesStore = {
  employeeList: EmployeeData[];
  setEmployeeList: (data: APIResponse) => void;
};

export const useEmployees = create<EmployeesStore>((set) => ({
  employeeList: [],

  setEmployeeList: ({ data }: APIResponse) => {
    set(() => ({
      employeeList: [...data],
    }));
  },
}));
