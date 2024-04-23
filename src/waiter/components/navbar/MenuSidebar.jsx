import { BiCategory } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { APIURL } from "../../../constants/ApiConstants";

const MenuSidebar = () => {

  const navigate = useNavigate();
  const logout = async () => {
    await fetch(APIURL + "logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <>
      <div className="fixed bottom-0 top-16 left-0 w-28 overflow-y-auto sidebar shadow-2xl">
        <div className="mt-8 mb-4">
          {/* <NavLink to="/waiter">
            <div className="text-center mt-8">
              <RiHome3Line className="text-2xl mx-auto" />
              <small>Home</small>
            </div>
          </NavLink> */}

          <NavLink to="/waiter">
            <div className="text-center mt-20">
              <BiCategory className="text-2xl mx-auto" />
              <small>Table</small>
            </div>
          </NavLink>

          {/* <div className="text-center mt-8">
            <RiShoppingCart2Line className="text-2xl mx-auto" />
            <small>Order</small>
          </div> */}

          <div className="text-center mt-8 cursor-pointer" onClick={logout}>
            <IoIosLogOut className="text-2xl mx-auto" />
            <small>Logout</small>
          </div>

        </div>
      </div>
    </>
  );
};

export default MenuSidebar;
