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

const Dealer = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, mutate, error } = useSWR(APIURL + "dealers", fetcher);

  //* For searching data
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

  //* For Deleteing Product
  const deleteCategory = async (id) => {
    const category = await fetch(`${APIURL}dealers/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    category.json().then((data) => {
      toast(data.message, {
        type: "success",
      });
    });
    mutate();
    toggleIsDelete();
  };

  // ! Show Error
  if (error) {
    return <ServerError />;
  }

  //*Show Loading
  // if (!data && !error) {
  //   return <AdminLayout />;
  // }

  if (data) {
    const categoryLength = data.data.length;
    return (
      <div>
        {isDelete ? (
          <ShowDelete
            delete={deleteCategory}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}

        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dealers</h1>
            <NavLink to="create" state={categoryLength}>
              <AddButton name="Add Dealer" />
            </NavLink>
          </div>
          <div>
            <SearchBox
              name="dealer"
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
                <th className="py-2 border border-gray-300 px-2">S.No</th>
                <th className="py-2 border border-gray-300 px-2">Dealer Name</th>
                <th className="py-2 border border-gray-300 px-2">
                  Address
                </th>
                <th className="py-2 border border-gray-300 px-2">
                  Phone Number
                </th>
                <th className="py-2 border border-gray-300 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data
                .filter((category) => {
                  if (search === "") {
                    return category;
                  } else if (
                    category.name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return category;
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
                        {dat.address}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {dat.phone}
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

export default Dealer;
