import { useNavigate } from "react-router-dom";

import { AiFillHome } from "react-icons/ai";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { FaUser } from "react-icons/fa";

const AdminNav = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full p-2 bg-blue-950 text-stone-50 flex  justify-between">
      <div className="flex gap-3 text-2xl">
        <button title="Go To Admin Home" onClick={() => navigate("/admin")}>
          <AiFillHome />
        </button>
        <button
          title="Switch Back to User Mode"
          onClick={() => navigate("/services")}
        >
          <PiArrowsCounterClockwise />
        </button>
      </div>
      <div>
        <FaUser />
      </div>
    </div>
  );
};

export default AdminNav;
