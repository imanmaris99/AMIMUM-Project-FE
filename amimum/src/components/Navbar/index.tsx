import { IoMdHome } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { IoPersonSharp } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="bg-sage flex items-center justify-between px-4 h-14">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-fern">
        <IoMdHome className="text-3xl text-fern" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-fern">
        <CiViewList className="text-3xl text-fern" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-fern">
        <IoPersonSharp className="text-3xl text-fern" />
      </div>
    </div>
  );
};

export default Navbar;