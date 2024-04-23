import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import ShowDelete from "../../../Admin/components/utils/ShowDelete";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";
import CartItem from "./CartItem";
const Cart = (props) => {
  const params = useParams();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());

  const { data, error } = useSWR(`${APIURL}table/${params.id}`, fetcher);

  const placed = () => {
    props.cart.map((cart) => {
      const formData = new FormData();
      formData.append("ordered", 1);
      fetch(`${APIURL}cart/update/ordered/${cart.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => {
        res.json().then((data) => {
          if (!data.status) {
            toast(data.message, { type: "error" });
          }
        });
      });
    });
    toast("Item placed successfully", { type: "success" });
  };

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
    fetch(`${APIURL}cart/${id}`, {
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

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  // * It show error page while loading the data
  if (error) {
    if (localStorage.getItem("token")) {
      return <ServerError />;
    } else {
    }
  }

  if (data) {
    return (
      <>
        {isDelete ? (
          <ShowDelete
            delete={deleteCartItem}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}
        <div className="fixed inset-0 w-full white-card z-50 duration-1000 overflow-hidden">
          <div className="flex">
            <div className="w-screen h-screen" onClick={props.close}></div>
            <div className="fixed top-0 right-0 bottom-0 w-80 bg-white  overflow-hidden overflow-y-auto item-bar">
              <div className="flex items-center mt-6 mx-4">
                <h1 className="text-xl font-bold">Order</h1>{" "}
                <p>( {data.data.table_number} )</p>
              </div>
              <div className="mb-32">
                {
                  props.cart.length < 1 ? (
                    <h1 className="text-4xl px-4 text-center text-gray-500 font-bold my-3">
                      No Items in cart
                    </h1>
                  ) : (
                    props.cart.map((cart) => {
                      return (
                        <CartItem
                          key={cart.id}
                          id={cart.id}
                          img={cart.products.photopath}
                          name={cart.products.product_name}
                          price={cart.products.price}
                          qty={parseInt(cart.qty)}
                          click={() => {
                            toggleIsDelete();
                            setId(cart.id);
                          }}
                        />
                      );
                    })
                  )
                }
              </div >
              <div className="fixed bottom-0 right-0 w-80">
                <div className="bg-gray-100 text-[#b52739] flex items-center justify-between py-2 px-4">
                  <h2 className="text-sm">Total Amount</h2>
                  <h3 className="text-lg font-bold">
                    Rs{" "}
                    {props.cart.reduce((total, cart) => {
                      return total + cart.products.price * cart.qty;
                    }, 0)}
                  </h3>
                </div>
                <button
                  className="bg-[#b52739] hover:bg-[#75121f] duration-1000 text-white w-full py-4"
                  onClick={() => placed()}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Cart;
