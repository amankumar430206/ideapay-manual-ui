import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollToTop = () => {
  const target = document.getElementsByClassName("app-content-wrapper")[0];
  target.scrollTop = 0;
};

export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
