import { APIIMG } from "../../../constants/ApiConstants";

const FoodCard = (props) => {
  return (
    <>
      <div
        className="text-center bg-white pb-4 sm:pb-8 rounded-3xl shadow-md cursor-pointer"
        onClick={props.click}
      >
        <img
          className="rounded-t-3xl w-full object-cover h-40"
          src={`${APIIMG}images/product_images/${props.image}`}
          alt={props.name}
        />
        <div className="mt-4">
          <h2 className="sm:text-xl text-lg font-semibold">{props.name}</h2>
          <h5 className="font-bold text-[#b52739] mt-2">Rs. {props.price}</h5>
        </div>
      </div>
    </>
  );
};

export default FoodCard;
