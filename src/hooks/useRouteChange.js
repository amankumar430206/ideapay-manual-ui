import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./useScrollToTop";

export default function useRouteChange() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {}, [pathname, dispatch]);

  return (
    <>
      <ScrollToTop />
    </>
  );
}
