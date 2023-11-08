import { useNavigate, useLocation } from "react-router-dom";
import ServiceDisplay from "../../../pages/serviceDisplay/ServiceDisplay";

import "../../../assets/themeColors/backgroundGradients.css";
import findQueryParam from "../../../utils/queryParams/findQueryParam";
import useDeleteFetch from "../../../hooks/useDeleteFetch";
import ServiceDisplayContainer from "../../../pages/serviceDisplayContainer/ServiceDisplayContainer";
import envIndex from "../../../envIndex/envIndex";

const AdminServiceWrapper = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const serviceId = findQueryParam(search, "id");
  const { fetchDelete, error } = useDeleteFetch();

  const handleDelete = async () => {
    const deleteStatus = await fetchDelete(
      `${envIndex.urls.baseUrl}/services/${serviceId}`
    );
    if (deleteStatus === "deleted") navigate("/admin/services");
  };

  return (
    <section className="bg-blue-950">
      <div className="w-full flex items-center justify-between p-1 bg-blue-950">
        <button
          className="rounded-md p-2 bg-stone-50 hover:bg-stone-200 text-stone-900"
          onClick={() => navigate("/admin/services")}
        >
          All Services
        </button>
        {error !== "" && <p className="text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            className="rounded-md p-2 bg-green-400 hover:bg-green-500 text-stone-900"
            onClick={() => navigate(`/admin/services/edit/${serviceId}`)}
          >
            Edit
          </button>
          <button
            className="rounded-md p-2 bg-red-400 hover:bg-red-500 text-stone-900"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <ServiceDisplayContainer />
    </section>
  );
};

export default AdminServiceWrapper;
