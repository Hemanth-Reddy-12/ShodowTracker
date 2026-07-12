import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import usePageStore from "./pageStore";

function RouteWatcher() {
  const location = useLocation();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const toggleSidebar = usePageStore((state) => state.toggleSidebar);

  useEffect(() => {
    setCurrentPage(location.pathname);
    toggleSidebar(false);
  }, [location.pathname, setCurrentPage, toggleSidebar]);

  return null; // This just runs logic, no UI
}

export default RouteWatcher;
