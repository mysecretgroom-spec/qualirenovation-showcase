import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to top first so all sections render and get correct heights
      window.scrollTo(0, 0);

      // Use scrollIntoView which respects CSS scroll-margin-top
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };

      // Multiple attempts with increasing delay to handle async content loading
      const t1 = setTimeout(() => {
        if (!scrollToHash()) {
          setTimeout(scrollToHash, 600);
        }
      }, 600);

      // Final correction after all content & animations settle
      const t2 = setTimeout(scrollToHash, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
