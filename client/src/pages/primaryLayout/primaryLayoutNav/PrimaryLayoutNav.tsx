import { useNavigate } from "react-router-dom";

import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import ProfileNavDropDown from "../../../components/navbar/profileNavDropDown/ProfileNavDropDown";
import { useRef, useState } from "react";

const PrimaryLayoutNav = () => {
  const [profileDropDownVis, setProfileDropDownVis] = useState(false);
  const toggleProfileDropDown = () => {
    setProfileDropDownVis((prev) => !prev);
  };
  const navigate = useNavigate();
  const profileToggleRef = useRef(null);
  return (
    <div className="w-full py-1 px-3 bg-blue-950 p-2 text-stone-50 flex items-center justify-between relative">
      <div>
        <button
          className="text-2xl flex items-center hover:text-white"
          onClick={() => navigate("/services")}
        >
          <AiFillHome />
        </button>
      </div>
      <div className="flex gap-5">
        <div className="flex items-center gap-2 text-xl">
          <AiOutlineSearch />
          <input
            type="text"
            className="rounded-full text-stone-800 px-2 text-lg"
          />
        </div>
        <button
          className="text-xl hover:text-white px-3"
          onClick={toggleProfileDropDown}
          ref={profileToggleRef}
        >
          <FaUser />
        </button>
        <div className="absolute right-0 z-10 top-full">
          <ProfileNavDropDown
            isVisible={profileDropDownVis}
            setIsVisible={setProfileDropDownVis}
            profileToggleRef={profileToggleRef}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayoutNav;
