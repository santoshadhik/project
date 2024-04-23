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

const DiscountCodeIndex = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, mutate, error } = useSWR(APIURL + "discountCode", fetcher);

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
  const deleteDiscountCode = async (id) => {
    const formData = new FormData();
    fetch(`${APIURL}discountCode/${id}`, {
      method: "delete",
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
    return (
      <div>
        {isDelete ? (
          <ShowDelete
            delete={deleteDiscountCode}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Discount Code</h1>
            <NavLink to="add">
              <AddButton name="Add Discount Code" />
            </NavLink>
          </div>
          <div>
            <SearchBox
              name="search discount code..."
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
                <th className="py-2 border border-gray-300 px-2">Discount Code</th>
                <th className="py-2 border border-gray-300 px-2">Type</th>
                <th className="py-2 border border-gray-300 px-2">value</th>
                <th className="py-2 border border-gray-300 px-2">Status</th>
                <th className="py-2 border border-gray-300 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data
                .filter((discountCode) => {
                  if (search === "") {
                    return discountCode;
                  } else if (
                    discountCode.code
                      .toLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return discountCode;
                  }
                })
                .map((dat, index) => {
                  return (
                    <tr key={dat.id} className="border border-gray-300">
                      <td className="py-2 border border-gray-300 px-2">
                        {index + 1}
                      </td>
                      <td className="py-2 border border-gray-300 px-2">
                        {dat.code}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {dat.type}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {dat.value}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {dat.status}
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

export default DiscountCodeIndex;
