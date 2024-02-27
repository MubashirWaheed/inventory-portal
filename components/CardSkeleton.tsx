import React from "react";
import { Skeleton } from "./ui/skeleton";

const CardSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col md:flex-row gap-4 mr-4">
      <div className=" flex flex-col space-y-3">
        <Skeleton className="h-[150px] w-[350px] md:w-[250px] rounded-xl" />
      </div>
      <div className=" flex flex-col space-y-3 ">
        <Skeleton className="h-[150px] w-[350px] md:w-[250px] rounded-xl" />
      </div>
      <div className=" flex flex-col space-y-3 ">
        <Skeleton className="h-[150px] w-[350px] md:w-[250px] rounded-xl" />
      </div>
      <div className=" flex flex-col space-y-3 ">
        <Skeleton className="h-[150px] w-[350px] md:w-[250px] rounded-xl" />
      </div>
    </div>
  );
};

export default CardSkeleton;
