import { useState } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { APIURL } from "../../constants/ApiConstants";
import Table from "../components/table/Table";

function WaiterIndex() {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());
  const { data, error } = useSWR(APIURL + "fetchTable", fetcher);

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
  if (data) {
    return (
      <>
        <div className="xl:max-w-[1280px] w-full mx-auto sm:px-8 px-6">
          <div className="fixed top-0 left-0 right-0 py-4 bg-white z-50 shadow">
            <div className="xl:max-w-[1280px] w-full mx-auto px-2  font-bold flex items-center justify-between">
              <img className="w-20" src="/images/logo.png" alt="logo" />
              <div className="relative">
                <div className="cursor-pointer" onClick={toggleShowLogOutBar}>
                  <img
                    className="lg:w-10 lg:h-10 w-8 h-8 rounded-full object-cover"
                    src="/images/profile-default.jpg"
                    alt=""
                  />
                </div>
                {showLogOutBar ? (
                  <div className="absolute right-2 top-12  w-60 pt-4 bg-white   shadow logoutbar">
                    <div className="flex items-center gap-x-2 px-4 border-b pb-2">
                      <img className="w-14" src="/images/logo.png" alt="" />
                      <div>
                        <h3 className="text-xs text-gray-700">Pos</h3>
                      </div>
                    </div>
                    <div
                      className="flex items-center cursor-pointer text-gray-700 px-6 hover:bg-gray-200 hover:text-[#0000cd] py-2 w-full gap-2"
                      onClick={logout}
                    >
                      <RiLogoutCircleLine className="text-lg" />
                      <p className="text-sm">Logout</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-20 mb-8 gap-8">
            {data.data.map((table) => {
              return (
                <Table id={table.id} key={table.id} name={table.table_number} />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default WaiterIndex;
