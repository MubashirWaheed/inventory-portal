import { useEffect, useState } from "react";

export const useDebounce = (value: any, delay = 450) => {
  const [debounceValue, setDebounceValue] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [value, delay]);

  return debounceValue as string;
};
