import useSwr from "swr";
import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import OrderItem from "../components/allOrder/OrderItem";

const Order = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

  const { data, error } = useSwr(`${APIURL}cart`, fetcher);

  if (!data) {
    <div>
      <h1>Loading....</h1>
    </div>;
  }
  if (error) {
    <ServerError />;
  }
  if (data) {
    const todayOrder = data.data.filter(
      (order) => order.isOrdered == 1 && order.isBilled == 0
    );
    return (
      <>
        <div>
          <div className="mt-14">
            <h1 className="text-4xl font-bold ">Active Orders</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-2">
              {todayOrder.map((order) => {
                return (
                  <OrderItem
                    key={order.id}
                    id={order.id}
                    name={order.products.product_name}
                    price={order.products.price}
                    quantity={order.qty}
                    image={order.products.photopath}
                    status={order.status}
                    showDelete={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Order;
