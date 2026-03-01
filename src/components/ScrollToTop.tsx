import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait for page to render, then scroll to the element
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const headerOffset = 100;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - headerOffset, behavior: "smooth" });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
