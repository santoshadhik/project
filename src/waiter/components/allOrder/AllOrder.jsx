import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSwr from "swr";
import ShowDelete from "../../../Admin/components/utils/ShowDelete";
import { APIURL } from "../../../constants/ApiConstants";
import OrderItem from "./OrderItem";

const AllOrder = (props) => {
  const params = useParams();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());

  const { data, error } = useSwr(APIURL + `table/${params.id}`, fetcher);

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

  // * function to Delete Cart Item
  const deleteCartItem = (id) => {
    fetch(APIURL + `cart/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.status) {
          toast(data.message, { type: "success" });
        }
      });
    });
    toggleIsDelete();
  };

  if (data) {
    const allOrders = props.ordered.filter(
      (order) => order.status != "cancelled"
    );
    return (
      <div>
        {isDelete ? (
          <ShowDelete
            delete={deleteCartItem}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}
        <div className="fixed inset-0 w-full z-50 white-card duration-1000 overflow-hidden">
          <div className="flex">
            <div className="w-screen h-screen" onClick={props.close}></div>
            <div className="fixed top-0 right-0 bottom-0 w-80 bg-white  overflow-hidden overflow-y-auto item-bar">
              <div className="mt-6 mx-4 flex items-center">
                <h1 className="text-xl font-bold">Order</h1>
                <p>( {data.data.table_number} )</p>
              </div>
              <div className="mb-32">
                {props.ordered.map((order) => {
                  return (
                    <OrderItem
                      key={order.id}
                      id={order.id}
                      name={order.products.product_name}
                      price={order.products.price}
                      quantity={order.qty}
                      image={order.products.photopath}
                      status={order.status}
                      click={() => {
                        toggleIsDelete();
                        setId(order.id);
                      }}
                    />
                  );
                })}
              </div>
              <div className="fixed bottom-0 right-0 w-80">
                <div className="bg-gray-100 text-[#b52739] flex items-center justify-between py-2 px-4">
                  <h2 className="text-sm">Total Amount</h2>
                  <h3 className="text-lg font-bold">
                    Rs{" "}
                    {allOrders.reduce((total, cart) => {
                      return total + cart.products.price * cart.qty;
                    }, 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AllOrder;
