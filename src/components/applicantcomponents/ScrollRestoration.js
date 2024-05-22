import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ScrollRestoration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const scrollPosition = window.scrollY;
      sessionStorage.setItem("scrollPosition", scrollPosition);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const handlePopState = () => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition !== null) {
        window.scrollTo(0, parseInt(scrollPosition));
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return null;
};

export default ScrollRestoration;
