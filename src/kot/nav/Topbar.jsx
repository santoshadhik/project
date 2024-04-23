import { useState } from "react";
import { RiHome2Line, RiLogoutCircleLine } from "react-icons/ri";
import { TbListCheck } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { APIURL } from "../../constants/ApiConstants";

const Topbar = () => {
  const [showLogOutBar, setShowLogOutBar] = useState(false);
  const toggleShowLogOutBar = () => setShowLogOutBar(!showLogOutBar);
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
      <div className="fixed top-0 left-0 right-0 py-4 bg-white shadow">
        <div className="text-white  xl:max-w-[1280px] w-full mx-auto sm:px-16 px-6 font-bold">
          <div className="flex items-center justify-between">
            <NavLink to="/kot">
              <img className="w-20" src="/images/logo.png" alt="logo" />
            </NavLink>
            <div className="flex items-center gap-x-8">
              <NavLink to="/kot/request">
                <button className="bg-[#0000cd] hover:bg-[#6161c2] text-white lg:text-sm text-xs rounded-xl shadow py-2 lg:px-8 px-4">
                  Request
                </button>
              </NavLink>
              <div className="relative">
                <div className="cursor-pointer" onClick={toggleShowLogOutBar}>
                  <img
                    className="w-10 h-10  rounded-full object-cover"
                    src="/images/profile-default.jpg"
                    alt=""
                  />
                </div>
                {showLogOutBar ? (
                  <div className="absolute right-2 top-12  w-60 pt-4 bg-white   shadow logoutbar">
                    <div className="">
                      <div className="flex items-center gap-x-2 px-4 border-b pb-2">
                        <img className="w-14" src="/images/logo.png" alt="" />
                        <div>
                          <h3 className="text-xs text-gray-700">POS</h3>
                        </div>
                      </div>
                      <div>
                        <NavLink to="/kot">
                          <button className="flex items-center cursor-pointer text-gray-700 px-6 hover:bg-gray-200 hover:text-[#0000cd] py-2 text-sm w-full gap-2">
                            <RiHome2Line className="text-lg" />
                            <p>Home</p>
                          </button>
                        </NavLink>

                        <NavLink to="/kot/myrequest">
                          <button className="flex items-center cursor-pointer text-gray-700 px-6 hover:bg-gray-200 hover:text-[#0000cd] py-2 text-sm w-full gap-2">
                            <TbListCheck className="text-lg" />
                            <p>My Request</p>
                          </button>
                        </NavLink>
                        <div
                          className="flex items-center cursor-pointer text-gray-700 px-6 hover:bg-gray-200 hover:text-[#0000cd] py-2 w-full gap-2"
                          onClick={logout}
                        >
                          <RiLogoutCircleLine className="text-lg" />
                          <p className="text-sm">Logout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
