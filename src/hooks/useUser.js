import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../api/api-service";

/**
 *
 * @param {string} id - user id
 */
export const useUser = ({ id, populate = "" }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById({ id: id, populate }),
    enabled: !!id,
  });
};
