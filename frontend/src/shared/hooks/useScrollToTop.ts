import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = (selector?: string): void => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    document.body.scrollIntoView({ behavior: "smooth" });
  }, [pathname, search, selector]);
};
