import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import usePageStore from "./pageStore";

function PageTracker() {
  const location = useLocation();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const toggleSidebar = usePageStore((state) => state.toggleSidebar);

  useEffect(() => {
    setCurrentPage(location.pathname);
    toggleSidebar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null; // This just runs logic, no UI
}

export default PageTracker;
