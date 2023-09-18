import { useLocation, useParams } from "react-router-dom";

const useDisplayOutletChecker = () => {
  const { serviceId } = useParams();
  const url = useLocation().pathname;
  const searchInUrl = url.includes("/search");

  if (!searchInUrl && !serviceId) return false;
  return true;
};

export default useDisplayOutletChecker;
