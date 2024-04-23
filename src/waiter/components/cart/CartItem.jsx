import { useState } from "react";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";

const CartItem = (props) => {
  const [items, setItems] = useState(props.qty);
  const itemsIncrease = () => {
    setItems(items + 1);
    updateCartQuantity(props.id, items + 1);
  };

  const itemsDecrease = () => {
    if (items > 1) {
      setItems(items - 1);
      updateCartQuantity(props.id, items - 1);
    } else {
      setItems(1);
      updateCartQuantity(props.id, 1);
    }
  };

  const updateCartQuantity = (id, qty) => {
    fetch(`${APIURL}cart/update/quantity/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ qty }),
    }).then((res) => {
      res.json().then((data) => {
        if (!data.status) {
          toast(data.message, { type: "error" });
        }
      });
    });
  };
  return (
    <>
      <div>
        <div className="mt-6 mx-4 bg-gray-100 rounded-xl shadow-md py-3 px-4">
          <div
            className="text-[#b52739] float-right -mt-2 cursor-pointer"
            onClick={props.click}
          >
            <RiDeleteBin6Line />
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-20 rounded-md"
              src={`${APIIMG}images/product_images/${props.img}`}
              alt={props.name}
            />
            <div>
              <h1 className="text-sm font-bold">{props.name}</h1>
              <div className="flex items-center gap-x-8 mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={itemsDecrease}>
                    <AiFillMinusSquare className="text-xl text-[#b52739]" />
                  </button>
                  <span className="text-[#b52739] text-xl">{items}</span>
                  <button onClick={itemsIncrease}>
                    <AiFillPlusSquare className="text-xl text-[#b52739]" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-[#b52739]">{props.price}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
