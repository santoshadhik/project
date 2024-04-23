import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import FoodCard from "../components/foods/FoodCard";

const ReceptionSearchPage = () => {
  const fetcher = (...args) => fetch(...args, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((res) => res.json());

  const { state } = useLocation();
  const { tableId, query } = state;
  const params = useParams();


  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(APIURL + "fetchProduct", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => {
      res.json().then((data) => {
        let results = data.data.filter((product) =>
          product.product_name
            .toLowerCase()
            .includes(query.toLowerCase())
        );
        setProducts(results);
      });
    });
  }, [query]);
  const { data, error } = useSWR(`${APIURL}product`, fetcher);
  const navigate = useNavigate();
  if (error) {
    if (localStorage.getItem("token")) {
      return <ServerError />;
    } else {
      navigate("/");
    }
  }

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
        table_id: tableId,
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
  if (data) {
    return (
      <>
        <div>
          <div>
            <h1 className="text-2xl text-gray-700 font-bold px-4 pt-8">
              <span onClick={() => navigate(`/reception/table/${params.id}`)} className="text-red-400 hover:text-red-600 cursor-pointer">Home</span> / You have searched for {query}
            </h1>

            <div>
              <div className="grid  sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8 mr-[1.5rem] my-8">
                {products.length < 1 ? (
                  <div className="col-span-3 md:col-span-5">
                    <h1 className="text-center text-4xl font-bold text-gray-600">
                      No Products Yet! Comming Soon New Products
                    </h1>
                  </div>
                ) : (
                  products.map((product) => {
                    return (
                      <FoodCard
                        key={product.id}
                        image={product.photopath}
                        name={product.product_name}
                        price={product.price}
                        click={() => addToCart(product.id)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ReceptionSearchPage;
