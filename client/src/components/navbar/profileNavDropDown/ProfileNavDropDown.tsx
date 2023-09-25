import {
  FC,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import envIndex from "../../../envIndex/envIndex";

type Props = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<SetStateAction<boolean>>;
  profileToggleRef: MutableRefObject<HTMLButtonElement | null>;
};

const ProfileNavDropDown: FC<Props> = ({
  isVisible,
  setIsVisible,
  profileToggleRef,
}) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    const url = `${envIndex.urls.baseUrl}/auth/signout`;

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw Error("Could not logout");
      navigate("/auth/signin");
    } catch (error) {
      //to do Error Handle
      console.log(error);
    }
  };

  //this is to handle clicking outside of the dropdown menu this will close it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node) &&
        !profileToggleRef.current?.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsVisible, profileToggleRef]);
  return (
    <div
      className={`w-96 bg-blue-950 text-stone-50 rounded-bl-lg overflow-hidden transition-all origin-top ${
        isVisible ? "h-48" : "h-0"
      }`}
      ref={dropDownRef}
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
