import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminServicesListItem from "../../../components/admin/adminServicesListItem/AdminServicesListItem";
import useDeleteFetch from "../../../hooks/useDeleteFetch";
import useGetFetch from "../../../hooks/useGetFetch";
import { IService } from "../../../types/serviceTypes/Service";
import envIndex from "../../../envIndex/envIndex";

const AdminServicesView = () => {
  const { fetchedData, loading, error, setFetchedData } = useGetFetch<
    IService[]
  >(`${envIndex.urls.baseUrl}/services/`);
  const navigate = useNavigate();
  const { fetchDelete, error: deleteError } = useDeleteFetch();
  //put into useCallback so that we can pass down to children.  We want to keep the useDeleteFetch's other properties available to the parent so we keep it in this and pass it down
  const deleteItem = useCallback(
    async (url: string, id: number) => {
      //don't need to put into try/catch block as error handling is done through the hook

      const result = await fetchDelete(url);

      if (result instanceof Error || !fetchedData) return console.log("error");
      setFetchedData((prev) => {
        if (!prev) return null;
        const filtered = prev.filter((service) => service.id !== id);
        return filtered;
      });
    },
    [fetchDelete, setFetchedData, fetchedData]
  );

  if (loading) return <div>...Loading</div>;
  if (error !== "") return <div>{error}</div>;

  return (
    <div className="bg-stone-800 grid lg:grid-cols-2 gap-2 p-5 relative">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl text-stone-50">All Services</h2>
        <button
          className="bg-green-600 hover:bg-green-500 p-2 text-stone-50 rounded-sm"
          onClick={() => navigate("/admin/services/create")}
        >
          Create New
        </button>
      </div>
      {Array.isArray(fetchedData) &&
        fetchedData.map((service) => (
          <AdminServicesListItem
            key={service.id}
            service={service}
            deleteItem={deleteItem}
          />
        ))}

      {deleteError !== "" && (
        <div className="absolute left-0 top-0 bg-red-500 text-center w-full p-2 bg-opacity-50 text-white">
          {deleteError}
        </div>
      )}
    </div>
  );
};

export default AdminServicesView;
