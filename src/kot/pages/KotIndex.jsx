import React, { useState } from "react";
import useSwr from "swr";
import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import OrderCard from "../components/OrderCard";

const KotIndex = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());

  const { data: tableData, error: tableError } = useSwr(
    `${APIURL}table`,
    fetcher
  );
  const {
    data: cartData,
    mutate: cartMutate,
    error: cartError,
  } = useSwr(`${APIURL}cart`, fetcher, { refreshInterval: 1000 });

  // const [change, setChange] = useState(false);
  // useEffect(() => {
  //   if (cartData) {
  //     localStorage.setItem("placed", cartData?.data?.length);
  //   }
  // }, [change]);

  // const playAudio = () => {
  //   new Audio(sound).play();
  // };

  const [status, setStatus] = useState("pending");

  if (tableError || cartError) {
    return <ServerError />;
  }

  if (!tableData || !cartData)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );

  if (tableData && cartData) {
    const pending = cartData.data.filter(
      (cart) =>
        cart.status == "pending" && cart.isOrdered == 1 && cart.isBilled == 0
    );
    const processing = cartData.data.filter(
      (cart) =>
        cart.status == "processing" && cart.isOrdered == 1 && cart.isBilled == 0
    );
    const completed = cartData.data.filter(
      (cart) =>
        cart.status == "completed" && cart.isOrdered == 1 && cart.isBilled == 0
    );
    const cancelled = cartData.data.filter(
      (cart) =>
        cart.status == "cancelled" && cart.isOrdered == 1 && cart.isBilled == 0
    );

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

              <button
                className={`border border-[#0000cd] hover:bg-[#0000cd] hover:text-white py-2 px-8 rounded-xl ${status == "cancelled" ? "bg-[#0000cd] text-white" : ""
                  }`}
                onClick={() => setStatus("cancelled")}
              >
                Cancelled
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 my-8 gap-8">
              {tableData.data.map((table) => {
                let carts = [];
                status == "pending"
                  ? (carts = pending.filter(
                    (cart) => cart.table_id == table.id
                  ))
                  : status == "processing"
                    ? (carts = processing.filter(
                      (cart) => cart.table_id == table.id
                    ))
                    : status == "completed"
                      ? (carts = completed.filter(
                        (cart) => cart.table_id == table.id
                      ))
                      : (carts = cancelled.filter(
                        (cart) => cart.table_id == table.id
                      ));
                if (carts.length > 0) {
                  return (
                    <OrderCard
                      key={table.id}
                      table_name={table.table_number}
                      status={status}
                      carts={carts}
                      refresh={cartMutate(cartData)}
                    />
                  );
                }
              })}
            </div>
          </div>

          {/* For showing new order popup */}
          {/* {cartData.data.length != localStorage.getItem("placed") ? (
            <div
              className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
              onLoad={playAudio()}
            >
              <div className="bg-white rounded-md shadow-md w-80">
                <div className="p-10">
                  <div className="flex justify-center">
                    <RiNotification2Fill
                      size={32}
                      className="text-yellow-400"
                    />
                  </div>
                  <h1 className="text-xl font-semibold text-center mt-2">
                    New Orders Detect
                  </h1>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => setChange(!change)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 my-3 py-1 rounded-md"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null} */}
          {/* For showing new order pop up close */}
        </div>
      </>
    );
  }
};

export default KotIndex;
