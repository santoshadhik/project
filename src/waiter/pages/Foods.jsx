import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIURL } from "../../constants/ApiConstants";
import Button from "../../reception/components/utils/Button";
import FoodCard from "../components/foods/FoodCard";

const Foods = () => {
  const params = useParams();
  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());
  const { data, error } = useSWR(APIURL + "fetchProduct", fetcher);
  const { data: categoryData, error: categoryError } = useSWR(
    APIURL + "category",
    fetcher
  );
  const { data: tableData, error: tableError } = useSWR(APIURL + `fetchTable/${params.id}`, fetcher);

  // For Adding to Cart
  const addToCart = (id) => {
    fetch(APIURL + "cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: id,
        table_id: params.id,
        qty: 1,
      }),
    }).then((res) => {
      res.json().then((data) => {
        if (data.status) {
          toast(data.message, {
            type: "success",
          });
        } else {
          toast(data.message, {
            type: "error",
          });
        }
      });
    });
  };

  //* For Category wise Filtering
  const [categoryId, setCategoryId] = useState(0);
  const [products, setProducts] = useState([]);

  //For filtering category data from the products
  useEffect(() => {
    setProducts(
      data?.data?.filter((product) => product.category_id == categoryId)
    );
  }, [categoryId]);

  if (data && categoryData) {
    return (
      <div>
        <h1 className="mt-16 text-2xl font-bold">
          {tableData?.data?.table_number}
        </h1>
        <hr className="my-2" />
        <div className="mt-8 flex gap-2 overflow-x-auto">
          <Button
            title="ALL"
            btn={categoryId == 0 ? "bg-[#b52739] text-white" : "text-black"}
            click={() => setCategoryId(0)}
          />
          {categoryData.data.map((category) => {
            return (
              <Button
                key={category.priority}
                title={category.category_name}
                click={() => setCategoryId(category.id)}
                btn={
                  categoryId == category.id
                    ? "bg-[#b52739] text-white"
                    : "text-black"
                }
              />
            );
          })}
        </div>
        {categoryId == 0 ? (
          <div className="grid  sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8 mr-[1.5rem] my-8">
            {data.data.map((product) => {
              return (
                <FoodCard
                  key={product.id}
                  image={product.photopath}
                  name={product.product_name}
                  price={product.price}
                  click={() => addToCart(product.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid  sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8 mr-[1.5rem] my-8">
            {products?.map((product) => {
              return (
                <FoodCard
                  key={product.id}
                  image={product.photopath}
                  name={product.product_name}
                  price={product.price}
                  click={() => addToCart(product.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
};

export default Foods;
