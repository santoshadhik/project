import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";
import AddButton from "../../components/utils/AddButton";
import DeleteButton from "../../components/utils/DeleteButton";
import EditButton from "../../components/utils/EditButton";
import SearchBox from "../../components/utils/SearchBox";
import ShowDelete from "../../components/utils/ShowDelete";
import AdminLayout from "../../layouts/AdminLayout";

const Staff = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, mutate, error } = useSWR(APIURL + "users", fetcher);

  const [search, setSearch] = useState("");

  //* For deleting data
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState();

  const toggleIsDelete = () => {
    if (isDelete) {
      setIsDelete(false);
    } else {
      setIsDelete(true);
    }
  };

  //* For Deleteing Staff
  const deleteStaff = async (id) => {
    const formData = new FormData();
    formData.append("status", "inactive");
    fetch(`${APIURL}user/delete/${id}`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then((res) => {
      res.json().then((data) => {
        toast(data.message, {
          type: "success",
        });
      });
    });

    mutate();
    toggleIsDelete();
  };

  //! Show Error
  if (error) {
    return <ServerError />;
  }

  //*Show Loading
  if (!data && !error) {
    return <AdminLayout />;
  }

  if (data) {
    const users = data.data.filter((user) => user.status == "active");
    return (
      <div>
        {isDelete ? (
          <ShowDelete
            delete={deleteStaff}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Staffs</h1>
            <NavLink to="create">
              <AddButton name="Add Staff" />
            </NavLink>
          </div>
          <div>
            <SearchBox
              name="Staff"
              change={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="mt-8">
          <table className="w-full text-center shadow-md">
            <thead className="bg-slate-200">
              <tr className="border border-gray-300">
                <th className="py-2 border border-gray-300 px-2">S.N.</th>
                <th className="py-2 border border-gray-300 px-2">Staff Name</th>
                <th className="py-2 border border-gray-300 px-2">Phone</th>
                <th className="py-2 border border-gray-300 px-2">Email</th>
                <th className="py-2 border border-gray-300 px-2">Address</th>
                <th className="py-2 border border-gray-300 px-2">Role</th>
                <th className="py-2 border border-gray-300 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {search === ""
                ? users.map((staff, index) => {
                  return (
                    <tr key={staff.id} className="border border-gray-300">
                      <td className="py-2 border border-gray-300 px-2">
                        {index + 1}
                      </td>
                      <td className="py-2 border border-gray-300 px-2">
                        {staff.name}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {staff.phone}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {staff.email}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {staff.address}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {staff.role}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        <div className="flex items-center justify-center gap-3">
                          <NavLink to={`edit/${staff.id}`}>
                            <EditButton />
                          </NavLink>

                          <DeleteButton
                            click={() => {
                              toggleIsDelete();
                              setId(staff.id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
                : users
                  .filter((staff) => {
                    if (search === "") {
                      return staff;
                    } else if (
                      staff.name
                        .toLowerCase()
                        .includes(search.toLocaleLowerCase())
                    ) {
                      return staff;
                    }
                  })
                  .map((dat, index) => {
                    return (
                      <tr key={dat.id} className="border border-gray-300">
                        <td className="py-2 border border-gray-300 px-2">
                          {index + 1}
                        </td>
                        <td className="py-2 border border-gray-300 px-2">
                          {dat.name}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          {dat.phone}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          {dat.email}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          {dat.address}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          {dat.role}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          <div className="flex items-center justify-center gap-3">
                            <NavLink to={`edit/${dat.id}`}>
                              <EditButton />
                            </NavLink>

                            <DeleteButton
                              click={() => {
                                toggleIsDelete();
                                setId(dat.id);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Staff;
