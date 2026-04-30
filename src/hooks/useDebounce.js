import { useMemo } from "react";
import debounce from "lodash.debounce";

export const useDebounce = (cb, delay = 700) => {
  return useMemo(() => {
    return debounce(cb, delay);
  }, []);
};
