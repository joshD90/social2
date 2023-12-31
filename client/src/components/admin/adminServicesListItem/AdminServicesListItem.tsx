import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

import { IService } from "../../../types/serviceTypes/Service";
import envIndex from "../../../envIndex/envIndex";

type Props = {
  service: IService;
  deleteItem: (url: string, id: number) => Promise<void>;
};

const AdminServicesListItem: FC<Props> = ({ service, deleteItem }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!service.id) return;
    const serviceId =
      typeof service.id === "string" ? parseInt(service.id) : service.id;
    deleteItem(`${envIndex.urls.baseUrl}/services/${service.id}`, serviceId);
  };
  return (
    <div className="bg-stone-700 p-2 text-stone-50 rounded-sm flex items-center justify-between">
      <div>
        <p>id: {service.id}</p>
        <p>name: {service.name}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/admin/services/view?id=${service.id}`)}
          className="text-3xl"
        >
          <AiFillEye />
        </button>
        <button
          className="bg-green-600 p-2 hover:bg-green-500"
          onClick={() => navigate(`/admin/services/edit/${service.id}`)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 p-2 hover:bg-red-500"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminServicesListItem;
