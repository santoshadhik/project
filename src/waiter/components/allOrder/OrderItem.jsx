import { RiDeleteBin6Line } from "react-icons/ri";
import { APIIMG } from "../../../constants/ApiConstants";

const OrderItem = (props) => {
  return (
    <>
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
            src={APIIMG + `images/product_images/${props.image}`}
            alt=""
          />
          <div>
            <h1 className="text-sm font-bold">{props.name}</h1>
            <div className="flex items-center gap-x-8 mt-2">
              <div className="text-[#b52739] font-bold text-sm">
                ({props.quantity}
                <span className="text-xs">X</span>)
              </div>
              <div>
                <h4 className="font-bold text-[#b52739]">${props.price}</h4>
              </div>
            </div>
            <h1 className="text-sm font-bold">{props.status}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItem;
