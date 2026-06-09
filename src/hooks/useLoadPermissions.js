import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPermissions } from "../api/api-service";
import { setPermissions } from "../store/features/authSlice";

/**
 * Loads the current user's role permissions into the auth store.
 * Runs whenever there is an active session (token + role). Keeps the
 * permission set fresh on login and on full page reloads.
 */
export const useLoadPermissions = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.currentUser?.role);

  const query = useQuery({
    queryKey: ["my-permissions", role],
    queryFn: fetchMyPermissions,
    enabled: !!authToken && !!role,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data?.content) {
      dispatch(setPermissions(query.data.content));
    }
  }, [query.data, dispatch]);
};
