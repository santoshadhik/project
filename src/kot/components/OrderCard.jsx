import { useState } from "react";
import { toast } from "react-toastify";
import { APIURL } from "../../constants/ApiConstants";
import Conformation from "../components/utils/Conformation";

const OrderCard = (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  function changeStatus(status, id) {
    if (id != 0) {
      const formData = new FormData();
      formData.append("status", status);
      fetch(APIURL + `cart/status/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => {
        res.json().then((data) => {
          props.refresh;

          if (!data.status) {
            toast(data.message, { type: "error" });
          }
        });
      });


      toast("Order status changed successfully", { type: "success" });
    } else {


      props.carts.map((cart) => {
        const formData = new FormData();
        formData.append("status", status);
        fetch(APIURL + `cart/status/${cart.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }).then((res) => {
          res.json().then((data) => {
            props.refresh;

            if (!data.status) {
              toast(data.message, { type: "error" });
            }
          });
        });
      });

      toast("Order status changed successfully", { type: "success" });
    }
  }


  return (
    <>
      {isPressed ? (
        <Conformation
          hide={() => setIsPressed(false)}
          name={name}
          action={() => changeStatus(name, id)}
        />
      ) : null}
      <div className="bg-slate-100 rounded-2xl pb-4 shadow-lg border border-gray-400">
        <div>
          <button className="text-white bg-green-600 w-full rounded-t-2xl py-4">
            {props.table_name}
          </button>
        </div>
        <div className="mx-4">
          <ul className="h-80 overflow-y-scroll">
            {props.carts.map((cart) => {
              return (
                <div className="flex justify-between items-center py-5 border-b-4 border-gray-300">
                  <li className="mt-2 text-sm" key={cart.id}>
                    {cart.qty} {cart.products.product_name}
                  </li>
                  {props.status == "pending" ? (
                    <div className="flex items-center gap-x-4">
                      <button
                        className="bg-[#0000cd] hover:bg-[#3737a7] text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("processing");
                          setIsPressed(true);
                          setId(cart.id);
                        }}
                      >
                        Processing
                      </button>

                      <button
                        className="bg-[#dc143c] hover:bg-[#da3455] text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("cancelled");
                          setIsPressed(true);
                          setId(cart.id);

                        }}
                      >
                        Cancelled
                      </button>
                    </div>
                  ) : props.status == "processing" ? (
                    <div className="flex items-center gap-x-4">
                      <button
                        className="bg-[#0000cd] hover:bg-[#3737a7] text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("pending");
                          setIsPressed(true);
                          setId(cart.id);

                        }}
                      >
                        Pending
                      </button>

                      <button
                        className="bg-emerald-600 hover:bg-emerald-700  text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("completed");
                          setIsPressed(true);
                          setId(cart.id);

                        }}
                      >
                        Completed
                      </button>
                    </div>
                  ) : props.status == "completed" ? (
                    <div className="flex items-center gap-x-4">
                      <button
                        className="bg-[#0000cd] hover:bg-[#3737a7] text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("processing");
                          setIsPressed(true);
                          setId(cart.id);

                        }}
                      >
                        Processing
                      </button>

                      <button
                        className="bg-[#dc143c] hover:bg-[#da3455] text-white  py-2 text-sm px-3 rounded-md"
                        onClick={() => {
                          setName("cancelled");
                          setIsPressed(true);
                          setId(cart.id);

                        }}
                      >
                        Cancelled
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button className="bg-[#dc143c] hover:bg-[#da3455] text-white  py-2 text-sm px-3 rounded-md">
                        Cancelled
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </ul>
        </div>
        <div className="mt-4 mx-4 flex gap-3">
          {props.status == "pending" ? (
            <div className="flex items-center gap-x-4">
              <button
                className="bg-[#0000cd] hover:bg-[#3737a7] text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("processing");
                  setIsPressed(true);
                  setId(0);

                }}
              >
                Processing
              </button>

              <button
                className="bg-[#dc143c] hover:bg-[#da3455] text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("cancelled");
                  setIsPressed(true);
                  setId(0);

                }}
              >
                Cancelled
              </button>
            </div>
          ) : props.status == "processing" ? (
            <div className="flex items-center gap-x-4">
              <button
                className="bg-[#0000cd] hover:bg-[#3737a7] text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("pending");
                  setIsPressed(true);
                  setId(0);

                }}
              >
                Pending
              </button>

              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("completed");
                  setIsPressed(true);
                  setId(0);
                }}
              >
                Completed
              </button>
            </div>
          ) : props.status == "completed" ? (
            <div className="flex items-center gap-x-4">
              <button
                className="bg-[#0000cd] hover:bg-[#3737a7] text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("processing");
                  setIsPressed(true);
                  setId(0);
                }}
              >
                Processing
              </button>

              <button
                className="bg-[#dc143c] hover:bg-[#da3455] text-white text-sm py-2 px-3 rounded-xl"
                onClick={() => {
                  setName("cancelled");
                  setIsPressed(true);
                  setId(0);
                }}
              >
                Cancelled
              </button>
            </div>
          ) : (
            <div>
              <button className="bg-[#dc143c] hover:bg-[#da3455] text-white text-sm py-2 px-3 rounded-xl">
                Cancelled
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderCard;
