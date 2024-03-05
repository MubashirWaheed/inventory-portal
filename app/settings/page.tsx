"use client";

import AddSupplier from "./components/AddSupplier";
import AddEmployee from "./components/AddEmployee";

const Settings = () => {
  return (
    <div className="w-full px-8 pb-8 pt-6 flex  gap-4 ">
      <AddEmployee />
      <AddSupplier />
    </div>
  );
};

export default Settings;
