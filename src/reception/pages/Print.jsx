import { useRef, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIURL } from "../../constants/ApiConstants";

const Print = () => {
  const printRef = useRef();
  const [printModal, setPrintModal] = useState(false);
  const toggleShowPrintModal = () => setPrintModal(!printModal);

  const { state } = useLocation();
  const { id, discountId, tendor, paymentMode } = state;
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  const { data, error } = useSWR(`${APIURL}cart`, fetcher);
  // Bill Fetch
  const { data: billData, error: billerror } = useSWR(`${APIURL}fetchBill`, fetcher);

  const { data: discountData, error: discountError } = useSWR(`${APIURL}fetchDiscount/${discountId}`, fetcher);

  const { data: userData, error: userError } = useSWR(`${APIURL}fetchUser`, fetcher);

  const navigate = useNavigate();

  if (error) {
    return <h1>Error</h1>
  }
  if (data) {
    const billed = (tableCart) => {
      const carts = tableCart.map((cart) => { return cart.id });

      const formData = new FormData();
      formData.append("carts_id", JSON.stringify(carts));
      formData.append("payment_mode", paymentMode);
      formData.append('total_amount', discountTotal != undefined ? parseInt(subTotal) - parseInt(discountTotal) : subTotal);
      formData.append('bill_no', 1001 + billData?.data.length);
      if (discountId) {
        formData.append("discount_codes_id", discountId);
      }
      fetch(APIURL + `cart/update/billed`, {
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
          else {
            console.log(data);
            navigate('/reception/home');
          }
        });
      });
      toggleShowPrintModal();
      toast("Billed successfully", { type: "success" });
    };
    //Filter cart data
    const tableCart = data?.data?.filter(
      (cart) =>
        cart.table_id == id && cart.isOrdered == 1 && cart.isBilled == 0
    );

    //Calculate subtotal
    const subTotal = tableCart.reduce((total, cart) => {
      return total + cart.products.price * cart.qty;
    }, 0);

    //Calculate discount
    const discountTotal = discountData?.data?.type == "percentage" ? (subTotal * discountData?.data?.value) / 100 : discountData?.data?.value;

    //* Total Amount
    const total = discountTotal != undefined ? parseInt(subTotal) - parseInt(discountTotal) : subTotal;
    return (
      <div>
        <div className="p-6">
          <div className="flex justify-end">
            <button
              className="hover:bg-[#b52739] hover:text-white border-2 border-[#b52739] text-[#b52739] duration-1000 rounded-md  py-2 px-7 my-8"
              onClick={toggleShowPrintModal}
            >
              Print Bill
            </button>
          </div>
          {/* Bill Format */}
          <div className="w-[7.8cm]  print:p-4" ref={printRef}>
            <div>
              <h1 className="text-xl font-bold text-center">
                Zen G Cafe Pvt. Ltd.
              </h1>
              <p className="text-xs text-center">SahidChowk</p>
              <p className="text-xs text-center">Narayanghat, Nepal</p>
              <p className="text-xs text-center">PAN NO. 123456789</p>
            </div>

            <p className="text-xs text-center my-2">INVOICE SLIP</p>

            <p className="text-xs">Bill No.: {1001 + billData?.data.length}</p>
            <p className="text-xs">{new Date().toLocaleString()}</p>
            <p className="text-xs">Payment Mode: {paymentMode}</p>

            <div className="mt-8 mb-4">
              <table className="text-xs">
                <thead className="border-t border-b border-dashed border-black">
                  <tr>
                    <td className="w-full">Item</td>
                    <td className="w-full px-1">Qty</td>
                    <td className="w-full px-1">Rate</td>
                    <td className="w-full px-1">Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {tableCart.map((cart) => {
                    return (
                      <tr key={cart.id}>
                        <td className="w-full">{cart.products.product_name}</td>
                        <td className="w-full px-1">{cart.qty}</td>
                        <td className="w-full px-1">{cart.products.price}</td>
                        <td className="w-full px-1 text-right">
                          {cart.products.price * cart.qty}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-b border-t border-dashed border-black">
                  <tr>
                    <td className="w-full">Total Items :</td>
                    <td className="w-full">{tableCart.length}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end pb-1">
              <div>
                <p className="text-xs text-right">Sub-Total : {subTotal}</p>
                {
                  discountTotal != undefined ? <p className="text-xs text-right">Discount : {discountTotal}</p> : ''
                }

              </div>
            </div>

            <div className="flex justify-end border-t border-dashed border-black pt-1">
              <div>
                <p className="text-xs text-right">Tendor : {tendor}</p>
                <p className="text-xs text-right">Change : {parseInt(tendor) - total}</p>


              </div>
            </div>

            <div className="font-bold text-sm border-t border-b border-dashed border-black my-3">
              <p className="uppercase text-center py-1">
                Grand Total : {discountTotal != undefined ? parseInt(subTotal) - parseInt(discountTotal) : subTotal}
              </p>
            </div>

            <p className="text-xs text-center">Cashier: {userData?.data.name}</p>
            <p className="text-xs text-center">Thank you for your visit</p>
          </div>
        </div>
        {printModal ? (
          <div className="bg-black bg-opacity-50 bg-backdrop-blur overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-20 z-50 justify-center items-center md:h-full md:inset-0  align-middle">
            <div className="flex justify-between items-center h-full">
              <div className="relative px-4 w-full max-w-md h-full md:h-auto mx-auto  ">
                <div className="relative bg-gray-50 rounded-lg   shadow-md shadow-gray-500 p-10">
                  <div className="flex items-center justify-center">
                    <RiErrorWarningLine className="text-5xl text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 pt-6 mb-0 text-center">
                    Are You Sure To Print Bill
                  </h3>
                  <div className="flex justify-center mt-4">
                    <ReactToPrint
                      trigger={() => (
                        <button
                          className="py-3 px-6 mx-2 rounded-md text-white bg-indigo-600 shadow-md  hover:bg-indigo-800 hover:shadow-sm"
                        >
                          Yes
                        </button>
                      )}
                      onPrintError={() => alert('error')}
                      onAfterPrint={() => billed(tableCart)}
                      content={() => printRef.current}
                    />
                    <button
                      onClick={toggleShowPrintModal}
                      className="py-3 px-6 mx-2 rounded-md cursor-pointer text-white bg-red-500  hover:bg-red-600"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
};

export default Print;
