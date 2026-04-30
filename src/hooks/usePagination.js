import { useSearchParams } from "react-router-dom";

const usePagination = () => {
  const [queryParams] = useSearchParams();

  return {
    page: parseInt(queryParams.get("page") || 0),
  };
};

export { usePagination };
