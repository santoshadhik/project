import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";
import AdminLayout from "../../layouts/AdminLayout";

const Profile = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

  const { data, error } = useSWR(`${APIURL}admin`, fetcher, {
    refreshInterval: 1000,
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  if (error) {
    if (localStorage.getItem("token")) {
      return <ServerError />;
    }
  }

  //*Show Loading
  if (!data && !error) {
    return <AdminLayout />;
  }

  if (data) {
    return (
      <div>
        <div className="h-full">
          <div className="w-11/12 md:w-9/12 mx-auto bg-white shadow-md rounded-md  my-10 p-10 relative">
            <div>
              <div className="flex items-center">
                {data.user.profile_photo ? (
                  <img
                    src={`${APIIMG}images/profiles/${data.user.profile_photo}`}
                    alt=""
                    className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-full shadow-md"
                  />
                ) : (
                  <img
                    className="w-16 h-16 md:w-28 md:h-28  rounded-full object-cover"
                    src="/images/profile-default.jpg"
                    alt=""
                  />
                )}
              </div>

              <div className="my-5">
                <h1 className="text-xl font-bold">My Details</h1>
                <hr className="my-2" />
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="font-bold text-gray-600 px-2 py-2">
                          Name:
                        </td>
                        <td className="font-semibold text-gray-800 px-2 py-2">
                          {data.user.name}
                        </td>
                      </tr>

                      <tr>
                        <td className="font-bold text-gray-600 px-2 py-2">
                          Email:
                        </td>
                        <td className="font-semibold text-gray-800 px-2 py-2">
                          {data.user.email}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="absolute top-2 md:top-5 right-2">
                <NavLink to="/admin/profile/edit">
                  <button className="px-4 py-1 md:py-2 bg-indigo-500 hover:bg-indigo-600 md:text-base text-xs text-white rounded-md shadow-md mx-3">
                    Edit Profile
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
