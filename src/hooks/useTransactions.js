import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api/api-service";

/**
 *
 * @param {string} id - user id
 */
export const useTransactions = ({ id = "", populate = "", query = {} }) => {
  return useQuery({
    queryKey: ["transactions", query],
    queryFn: () =>
      fetchTransactions({
        query: query,
        populate: populate,
      }),
  });
};
