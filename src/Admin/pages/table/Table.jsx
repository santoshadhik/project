import { useState } from "react";
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

const Table = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, mutate, error } = useSWR(APIURL + "table", fetcher);

  //* For searching data
  const [search, setSearch] = useState("");

  // For Deleting data
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState();
  const toggleIsDelete = () => {
    if (isDelete) {
      setIsDelete(false);
    } else {
      setIsDelete(true);
    }
  };

  // For Deleting Table
  const deleteTable = async (id) => {
    const table = await fetch(`${APIURL}table/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    table.json().then((data) => {
      toast(data.message, {
        type: "success",
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
      <>
        <div>
          {isDelete ? (
            <ShowDelete
              delete={deleteTable}
              hideDelete={toggleIsDelete}
              id={id}
            />
          ) : (
            <></>
          )}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Tables</h1>
              <NavLink to="create">
                <AddButton name="Add Table" />
              </NavLink>
            </div>
            <div>
              <SearchBox
                name="Table"
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
                  <th className="py-2 border border-gray-300 px-2">
                    Table Number
                  </th>
                  <th className="py-2 border border-gray-300 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.data
                  .filter((table) => {
                    if (search === "") {
                      return table;
                    } else if (
                      table.table_number
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return table;
                    }
                  })
                  .map((dat, index) => {
                    return (
                      <tr key={dat.id} className="border border-gray-300">
                        <td className="py-2 border border-gray-300 px-2">
                          {index + 1}
                        </td>

                        <td className="py-2 border border-gray-300 px-2">
                          {dat.table_number}
                        </td>

                        {/* <td className="py-2 border border-gray-300 px-2">
                          {dat.status}
                        </td> */}

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
      </>
    );
  }
};

export default Table;
