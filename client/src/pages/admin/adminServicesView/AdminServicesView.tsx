import { useCallback } from "react";
import AdminServicesListItem from "../../../components/admin/adminServicesListItem/adminServicesListItem";
import useDeleteFetch from "../../../hooks/useDeleteFetch";
import useGetFetch from "../../../hooks/useGetFetch";
import { IService } from "../../../types/serviceTypes/Service";

const AdminServicesView = () => {
  const { fetchedData, loading, error, setFetchedData } = useGetFetch<
    IService[]
  >("http://localhost:3500/service/");
  const { fetchDelete, error: deleteError } = useDeleteFetch();
  //put into useCallback so that we can pass down to children.  We want to keep the useDeleteFetch's other properties available to the parent so we keep it in this and pass it down
  const deleteItem = useCallback(
    async (url: string, id: number) => {
      console.log("deleting ITEM");
      //don't need to put into try/catch block as error handling is done through the hook
      const result = await fetchDelete(url);
      console.log(result);
      if (result instanceof Error || !fetchedData)
        return console.log(result, fetchedData, "therefore returning");
      setFetchedData((prev) => {
        if (!prev) return null;
        console.log(prev);
        return prev.filter((service) => service.id !== id);
      });
    },
    [fetchDelete, setFetchedData, fetchedData]
  );

  if (loading) return <div>...Loading</div>;
  if (error !== "") return <div>{error}</div>;

  return (
    <div className="bg-stone-800 grid lg:grid-cols-2 gap-2 p-5 relative">
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
