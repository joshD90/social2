import { useParams, useNavigate } from "react-router-dom";
import ServiceDisplay from "../../../pages/serviceDisplay/ServiceDisplay";

const AdminServiceWrapper = () => {
  return (
    <section className="">
      <div className="w-full flex items-center justify-between">
        <button>All Services</button>
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
      <ServiceDisplay />
    </section>
  );
};

export default AdminServiceWrapper;
