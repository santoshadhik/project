import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import ConformationRequest from "../../Admin/components/utils/ConformationRequest";
import DeleteButton from "../../Admin/components/utils/DeleteButton";
import ShowDelete from "../../Admin/components/utils/ShowDelete";

import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import ReceptionLayout from "../components/layouts/ReceptionLayout";



const ReceptionApplication = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, mutate, error } = useSWR(APIURL + "kitchen", fetcher);

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

  const [status, setStatus] = useState("pending");
  const [isPressed, setIsPressed] = useState(false);
  const [name, setName] = useState("");
  const [requestId, setRequestId] = useState();

  const changeStatus = (status) => {
    data.data.data.map((request) => {
      const formData = new FormData();
      formData.append("status", status);
      fetch(APIURL + `kitchen/status/${request.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => {
        res.json().then((data) => {
          mutate();

          if (!data.status) {
            toast(data.message, { type: "error" });
          }
        });
      });
    });

    toast("Application status changed successfully", { type: "success" });
  };
  //* For Deleteing Product
  const deleteKitchenRequest = async (id) => {
    const kitchenRequest = await fetch(`${APIURL}kitchen/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    kitchenRequest.json().then((data) => {
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
  if (!data && !error) {
    return <ReceptionLayout />;
  }

  if (data) {
    const pending = data.data.data.filter(
      (request) => request.status == "pending"
    );
    const processing = data.data.data.filter(
      (request) => request.status == "processing"
    );
    const completed = data.data.data.filter(
      (request) => request.status == "completed"
    );

    return (
      <div className="p-5">
        {isDelete ? (
          <ShowDelete
            delete={deleteKitchenRequest}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}

        {isPressed ? (
          <ConformationRequest
            hide={() => setIsPressed(false)}
            name={name}
            id={requestId}
            action={() => changeStatus(name)}
          />
        ) : null}

        <div>
          <div className="flex items-center justify-between mt-14">
            <h1 className="text-2xl font-bold">Request</h1>
            <div className="flex items-center gap-4">
              <button
                className={`border border-[#0000cd] hover:bg-[#0000cd] hover:text-white py-2 px-8 rounded-xl ${status == "pending" ? "bg-[#0000cd] text-white" : ""
                  }`}
                onClick={() => setStatus("pending")}
              >
                Pending
              </button>

              <button
                className={`border border-[#0000cd] hover:bg-[#0000cd] hover:text-white py-2 px-8 rounded-xl ${status == "processing" ? "bg-[#0000cd] text-white" : ""
                  }`}
                onClick={() => setStatus("processing")}
              >
                Processing
              </button>

              <button
                className={`border border-[#0000cd] hover:bg-[#0000cd] hover:text-white py-2 px-8 rounded-xl ${status == "completed" ? "bg-[#0000cd] text-white" : ""
                  }`}
                onClick={() => setStatus("completed")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <table className="w-full text-center shadow-md">
            <thead className="bg-slate-200">
              <tr className="border border-gray-300">
                <th className="py-2 border border-gray-300 px-2">S.N.</th>
                <th className="py-2 border border-gray-300 px-2">
                  Kitchen Request
                </th>
                <th className="py-2 border border-gray-300 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data.data.map((application, index) => {
                let requests = [];
                status == "pending"
                  ? (requests = pending.filter(
                    (request) => request.id == application.id
                  ))
                  : status == "processing"
                    ? (requests = processing.filter(
                      (request) => request.id == application.id
                    ))
                    : (requests = completed.filter(
                      (request) => request.id == application.id
                    ));

                if (requests.length > 0) {
                  return (
                    <tr key={application.id} className="border border-gray-300">
                      <td className="py-2 border border-gray-300 px-2">
                        {index + 1}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        {application.description}
                      </td>

                      <td className="py-2 border border-gray-300 px-2">
                        <div className="flex items-center justify-center gap-3">
                          {application.status == "pending" ? (
                            <div className="flex items-center gap-x-4">
                              <button
                                className="bg-[#0000cd] hover:bg-[#3737a7] text-white text-sm py-2 px-3 rounded-xl"
                                onClick={() => {
                                  setName("processing");
                                  setIsPressed(true);
                                  setRequestId(application.id);
                                }}
                              >
                                Processing
                              </button>
                            </div>
                          ) : application.status == "processing" ? (
                            <div className="flex items-center gap-x-4">
                              <button
                                className="bg-[#0000cd] hover:bg-[#3737a7] text-white text-sm py-2 px-3 rounded-xl"
                                onClick={() => {
                                  setName("completed");
                                  setIsPressed(true);
                                  setRequestId(application.id);
                                }}
                              >
                                Completed
                              </button>
                            </div>
                          ) : application.status == "completed" ? (
                            <div className="flex items-center gap-x-4">
                              <DeleteButton
                                click={() => {
                                  toggleIsDelete();
                                  setId(application.id);
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default ReceptionApplication;
