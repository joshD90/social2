import { useNavigate } from "react-router-dom";

import "../../../assets/themeColors/backgroundGradients.css";

const AdminLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="backgroundAllColorDark w-screen h-screen flex items-center justify-center flex-col text-stone-50">
      <div className="flex gap-10">
        <button
          onClick={() => navigate("/admin/services")}
          className="bg-stone-400 p-5 shadow-md hover:bg-stone-500 rounded-sm"
        >
          Services
        </button>
        <button
          className="bg-stone-400 p-5 shadow-md hover:bg-stone-500 rounded-sm"
          onClick={() => navigate("/admin/users")}
        >
          Users
        </button>
      </div>
    </div>
  );
};

export default AdminLanding;
