import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
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
  const { data: discountData, error: discountError } = useSwr(APIURL + `fetchDiscount`, fetcher);

  // * For Discount Code
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(null);
  // * For Changing Data in discount selected
  useEffect(() => {
    fetch(APIURL + `fetchDiscount/${discountCode}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        setDiscount(data.data);
      });
    });
  }, [discountCode]);

  //* For Tendor
  const [tendor, setTendor] = useState(0);
  //* For Payement Mode
  const [paymentMode, setPaymentMode] = useState("cash");

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

    const total = discount == null || discountCode == '' ? allOrders.reduce((total, cart) => {
      return total + cart.products.price * cart.qty;
    }, 0) : discount?.type == 'amount' ? allOrders.reduce((total, cart) => {
      return total + cart.products.price * cart.qty;
    }, 0) - discount?.value : allOrders.reduce((total, cart) => {
      return total + cart.products.price * cart.qty;
    }, 0) - discount?.value * allOrders.reduce((total, cart) => {
      return total + cart.products.price * cart.qty;
    }
      , 0) / 100;
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
        <div className="fixed inset-0 w-full white-card z-50 duration-1000 overflow-hidden">
          <div className="flex">
            <div className="w-full mr-96 px-10 h-screen bg-gray-50 bg-opacity-40" >
              <div className="flex items-center justify-between border-b pt-8 pb-3 border-black">
                <h1 className="text-black px-4  text-3xl font-bold ">
                  Select Payment Mode
                </h1>
                <button onClick={props.close} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md  shadow-md">
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-10 mt-6 mb-5">
                <div onClick={() => setPaymentMode('cash')} className={` ${paymentMode == 'cash' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}  rounded-md p-10 shadow-md cursor-pointer`}>
                  <h1 className="text-xl font-bold text-center">Cash</h1>
                </div>

                <div onClick={() => setPaymentMode('card')} className={` ${paymentMode == 'card' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}  rounded-md p-10 shadow-md cursor-pointer`}>
                  <h1 className="text-xl font-bold text-center">Credit / Debit Card</h1>
                </div>

                <div onClick={() => setPaymentMode('esewa/khalti')} className={` ${paymentMode == 'esewa/khalti' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}  rounded-md p-10 shadow-md cursor-pointer`}>
                  <h1 className="text-xl font-bold text-center">Esewa / Khalti</h1>
                </div>

                <div onClick={() => setPaymentMode('ebanking')} className={` ${paymentMode == 'ebanking' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}  rounded-md p-10 shadow-md cursor-pointer`}>
                  <h1 className="text-xl font-bold text-center">E-Banking</h1>
                </div>
              </div>
              <div className="w-[60vw] bg-gray-100 pt-10 rounded-md shadow-md px-3 mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    Tendor :
                  </h2>
                  <input type="number" autoFocus={true} onChange={(e) => setTendor(e.target.value)} name="tendor" onWheel={(e) => e.target.blur()} id="tendor" className="rounded-md shadow-md border border-gray-400 py-2 outline-none px-2 focus-visible:border-gray-600" />
                </div>

                <div className="flex items-center gap-2 mt-3 pb-5">
                  <h2 className="text-xl font-bold">
                    Change :
                  </h2>
                  <p>
                    {parseInt(tendor) - total}
                  </p>
                </div>
              </div>
              <div className="w-[60vw]">
                {/* For Discount Box */}
                <div className="bg-gray-100 text-[#b52739] w-full   py-2 px-4">
                  <div>
                    <h1 className=" font-semibold ">Apply Discount Code</h1>
                    <hr className="my-1" />
                    <select onChange={(e) => setDiscountCode(e.target.value)} name="discount" id="discount" className="w-full">
                      <option value="0">Select Discount</option>
                      {discountData?.data?.map((discount) => {
                        return (
                          <option key={discount.id} value={discount.id}>
                            {discount.code}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Sub-total Amount */}
                <div className="bg-gray-100 text-[#b52739] flex items-center justify-between py-1 px-4">
                  <h2 className="text-sm">Sub-Total Amount</h2>
                  <h3 className="text-lg font-bold">
                    Rs{" "}
                    {allOrders.reduce((total, cart) => {
                      return total + cart.products.price * cart.qty;
                    }, 0)}
                  </h3>
                </div>

                {/* Discount-total */}
                <div className="bg-gray-100 text-[#b52739] flex items-center justify-between py-1 px-4">
                  <h2 className="text-sm">Discount Amount</h2>
                  <h3 className="text-lg font-bold">
                    {
                      discount == null || discountCode == '' ? '-' : discount?.type == 'amount' ? 'Rs ' + discount?.value : discount?.value + ' %'
                    }

                  </h3>
                </div>

                {/* Total */}
                <div className="bg-gray-100 text-[#b52739] flex items-center justify-between py-1 px-4">
                  <h2 className="text-sm">Total Amount</h2>
                  <h3 className="text-lg font-bold">
                    Rs{" "}
                    {
                      discount == null || discountCode == '' ? allOrders.reduce((total, cart) => {
                        return total + cart.products.price * cart.qty;
                      }, 0) : discount?.type == 'amount' ? allOrders.reduce((total, cart) => {
                        return total + cart.products.price * cart.qty;
                      }, 0) - discount?.value : allOrders.reduce((total, cart) => {
                        return total + cart.products.price * cart.qty;
                      }, 0) - discount?.value * allOrders.reduce((total, cart) => {
                        return total + cart.products.price * cart.qty;
                      }
                        , 0) / 100
                    }
                  </h3>
                </div>
                <NavLink state={{ id: params.id, discountId: discount?.id, tendor: tendor, paymentMode: paymentMode }} to="/reception/print">
                  <button onClick={props.close} className="bg-[#b52739] hover:bg-[#75121f] duration-1000 text-white w-full py-4">
                    View Bill
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="fixed top-0 right-0 bottom-0 w-96 bg-white  overflow-hidden overflow-y-auto item-bar">
              <div className="mt-6 mx-4 flex items-center">
                <h1 className="text-xl font-bold">Order</h1>
                <p>( {data?.data?.table_number} )</p>
              </div>
              <div className="mb-2">
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
                      showDelete={true}
                    />
                  );
                })}
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AllOrder;
