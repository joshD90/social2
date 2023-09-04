import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { FaUser } from "react-icons/fa";

const PrimaryLayoutNav = () => {
  return (
    <div className="w-full py-1 px-3 bg-blue-950 p-2 text-stone-50 flex items-center justify-between">
      <div>
        <button className="text-2xl flex items-center hover:text-white">
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
        <button className="text-xl hover:text-white">
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default PrimaryLayoutNav;
