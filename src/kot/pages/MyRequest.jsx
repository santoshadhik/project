import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import KotLayout from "../layouts/KotLayout";
const MyRequest = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")} ` },
    }).then((res) => res.json());

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");

  const { data, error, mutate } = useSWR(
    `${APIURL}kitchen?page=${page}`,
    fetcher
  );

  if (error) {
    return <ServerError />;
  }
  if (!data) {
    return <KotLayout />;
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
    const lastPage = data.data.last_page;
    return (
      <>
        <div className="mt-14">
          <div className="xl:max-w-[1280px] w-full mx-auto sm:px-16 px-6 pt-6">
            <div className="mt-16 flex gap-4 sm:justify-end overflow-hidden overflow-x-auto">
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
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3  gap-10">
              {data.data.data.map((request) => {
                let requests = [];
                status == "pending"
                  ? (requests = pending.filter(
                    (request) => request.status == status
                  ))
                  : status == "processing"
                    ? (requests = processing.filter(
                      (request) => request.status == status
                    ))
                    : (requests = completed.filter(
                      (request) => request.status == status
                    ));

                if (requests.length > 0) {
                  return (
                    <div
                      key={request.id}
                      className="w-full py-4 px-4 bg-white shadow rounded-xl"
                    >
                      <div className="flex justify-between gap-8">
                        <p className="text-sm text-justify">
                          {request.description}
                        </p>
                        <div className="flex items-center gap-2">
                          {request.status == "pending" ? (
                            <NavLink to={`/kot/edit/${request.id}`}>
                              <button className="text-2xl text-[#225fa2]">
                                <RiEditLine />
                              </button>
                            </NavLink>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="xl:max-w-[1280px] w-full mx-auto sm:px-16 px-6 my-5">
            {/* /Paginate Button */}
            <div className="flex items-center">
              <button
                className="px-6 py-2 rounded-md shadow-lg hover:shadow-xl bg-blue-500 hover:bg-blue-700 text-white mx-2"
                onClick={() => {
                  if (page <= 1) {
                    setPage(1);
                  } else {
                    setPage(page - 1);
                  }
                }}
              >
                prev
              </button>
              <p className="text-gray-600">
                {page} / {lastPage}
              </p>
              <button
                className="px-6 py-2 rounded-md shadow-lg hover:shadow-xl bg-blue-500 hover:bg-blue-700 text-white mx-2"
                onClick={() => {
                  if (page <= lastPage) {
                    setPage(page + 1);
                  }
                }}
              >
                next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default MyRequest;
