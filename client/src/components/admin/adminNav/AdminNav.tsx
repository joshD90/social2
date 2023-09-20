import { useNavigate } from "react-router-dom";

import { AiFillHome } from "react-icons/ai";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import ProfileNavDropDown from "../../navbar/profileNavDropDown/ProfileNavDropDown";
import { useRef, useState } from "react";

const AdminNav = () => {
  const navigate = useNavigate();
  const [dropDownVisible, setDropDownVisible] = useState(true);
  const dropDownToggleRef = useRef(null);
  return (
    <div className="w-full p-2 bg-blue-950 text-stone-50 flex  justify-between relative">
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
      <div
        ref={dropDownToggleRef}
        onClick={() => setDropDownVisible((prev) => !prev)}
        className="text-xl mr-2 cursor-pointer"
      >
        <FaUser />
      </div>
      <div className="absolute right-0 top-full z-50">
        <ProfileNavDropDown
          isVisible={dropDownVisible}
          setIsVisible={setDropDownVisible}
          profileToggleRef={dropDownToggleRef}
        />
      </div>
    </div>
  );
};

export default AdminNav;
