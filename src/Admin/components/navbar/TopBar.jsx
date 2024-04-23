import { useState } from "react";
import { RiLogoutCircleLine, RiUserLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";

const TopBar = (props) => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

  const { data, error } = useSWR(`${APIURL}admin`, fetcher);
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
  const [showLogOutBar, setShowLogOutBar] = useState(false);
  const toggleShowLogOutBar = () => setShowLogOutBar(!showLogOutBar);

  if (error) {
    <ServerError />;
  }
  if (data) {
    return (
      <>
        <div className="bg-white  fixed top-0 left-0 right-0 ml-60 py-4 px-4 shadow z-50 flex items-center justify-end">
          <div className="relative">
            <div
              className="flex items-center justify-end  cursor-pointer"
              onClick={toggleShowLogOutBar}
            >
              {data.user.profile_photo ? (
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={`${APIIMG}images/profiles/${data.user.profile_photo}`}
                  alt=""
                />
              ) : (
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src="/images/profile-default.jpg"
                  alt=""
                />
              )}
            </div>
            {showLogOutBar ? (
              <div className="absolute right-2 top-14  w-60 pt-4 bg-white   shadow logoutbar">
                <div className="">
                  <div className="flex items-center gap-x-2 px-4 border-b pb-2">
                    {data.user.profile_photo ? (
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={`${APIIMG}images/profiles/${data.user.profile_photo}`}
                        alt=""
                      />
                    ) : (
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src="/images/profile-default.jpg"
                        alt=""
                      />
                    )}
                    <div>
                      <h3 className="text-xs font-bold">{data.user.name}</h3>
                      <h4 className="text-gray-800 font-bold">
                        {data.user.role}
                      </h4>
                    </div>
                  </div>
                  <div className="">
                    <NavLink to="/admin/profile">
                      <div className="flex items-center  px-4 hover:bg-gray-300 py-2 w-full gap-2">
                        <RiUserLine className="text-lg" />
                        <small>My Profile</small>
                      </div>
                    </NavLink>
                    <div
                      className="flex items-center cursor-pointer px-4 hover:bg-gray-300 py-2 w-full gap-2"
                      onClick={logout}
                    >
                      <RiLogoutCircleLine className="text-lg" />
                      <small>Logout</small>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
};

export default TopBar;
