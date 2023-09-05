import { FC, useContext } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

type Props = { isVisible: boolean };

const ProfileNavDropDown: FC<Props> = ({ isVisible }) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const url = "http://localhost:3500/auth/signout";
    console.log("trying to sign out");
    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw Error("Could not logout");
      navigate("/services");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`w-96 h-48 bg-blue-950 text-stone-50 rounded-bl-lg overflow-hidden transition-transform origin-top ${
        isVisible ? "scale-y-100" : "scale-y-0"
      }`}
    >
      <ul className="h-full w-full p-0 m-0 flex flex-col">
        <li className="basis-1 flex-grow flex items-center justify-between hover:bg-blue-800 cursor-pointer px-5">
          View Profile
        </li>
        <li
          className="basis-1 flex-grow flex items-center justify-between hover:bg-blue-800 cursor-pointer px-5"
          onClick={handleLogout}
        >
          Logout <AiOutlineLogout />
        </li>
        {user?.privileges === "admin" ? (
          <li
            className="basis-1 flex-grow flex items-center justify-between hover:bg-blue-800 cursor-pointer px-5"
            onClick={() => navigate("/admin")}
          >
            Switch to Admin <PiArrowsCounterClockwise />
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default ProfileNavDropDown;
