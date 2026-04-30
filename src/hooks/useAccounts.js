import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../api/api-service";

/**
 *
 * @param {string} id - user id
 */
export const useAccounts = ({ id = "", populate = "", query = {} }) => {
  return useQuery({
    queryKey: ["accounts/list", query],
    queryFn: () =>
      fetchAccounts({
        query: query,
        populate: populate,
      }),
  });
};
