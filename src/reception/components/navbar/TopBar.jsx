import { useEffect, useState } from "react";
import { RiLogoutCircleLine, RiSearch2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import useSwr from "swr";
import { APIURL } from "../../../constants/ApiConstants";
import AllOrder from "../allOrder/AllOrder";
import Cart from "../cart/Cart";

const TopBar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const toggleShowCart = () => setShowCart(!showCart);
  const toggleShowOrder = () => setShowOrder(!showOrder);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const params = useParams();

  const [showLogOutBar, setShowLogOutBar] = useState(false);
  const toggleShowLogOutBar = () => setShowLogOutBar(!showLogOutBar);

  const logout = async () => {
    await fetch(APIURL + "logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    localStorage.removeItem("token");
    navigate("/");
  };


  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      fetch(APIURL + "fetchProduct", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((res) => {
        res.json().then((data) => {
          let results = data.data.filter((product) =>
            product.product_name.toLowerCase().includes(search.toLowerCase())
          );
          setSearchResults(results);
        });
      });
    }
  }, [search]);

  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => res.json());
  const { data, mutate, error } = useSwr(APIURL + "cart", fetcher, {
    refreshInterval: 1000,
  });

  const navigate = useNavigate();

  if (data) {
    const tableCart = data.data.filter(
      (cart) => cart.table_id == params.id && cart.isBilled == 0
    );

    return (
      <>
        <div className="fixed top-0 bottom-95 left-0 right-0 bg-white py-4 shadow">
          <div className="flex items-center justify-between mx-[1.5rem]">
            <div className="flex items-center gap-8">
              {/* <NavLink to="reception/order"> */}
              <img className="w-20" src="/images/logo.png" alt="Bits" />
              {/* </NavLink> */}
              <div className="relative md:w-96 w-44">
                <input
                  type="search"
                  name="search"
                  id="search"
                  onKeyUp={(e) => {
                    if (e.key == "Enter") {
                      setShowSuggestions(false);
                      if (search.length > 0) {
                        navigate(`/reception/search/${params.id}`, { state: { tableId: params.id, query: search } });
                      }
                    }

                    if (e.key === "Escape") {
                      setSearch("");
                    }
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="md:w-96 w-44 pl-6 pr-12 py-2 rounded-full placeholder:text-sm focus:outline-none bg-gray-200"
                  placeholder="Search category or menu"
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center mr-4">
                  <RiSearch2Line className="text-2xl text-gray-500" />
                </div>
                <div>
                  {showSuggestions ? (
                    <div className="bg-gray-50  shadow-md w-full  h-fit max-h-28 overflow-y-scroll z-50 absolute">
                      {searchResults.map((product) => (
                        <a
                          key={product.id}
                          className="px-5 py-2 text-gray-600 block"
                        >
                          {product.product_name}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
              {
                params.id && <div>
                  <button
                    className="bg-[#b52739] hover:bg-[#75121f] duration-1000 text-white lg:text-sm text-xs rounded-md shadow py-2 lg:px-8 px-4"
                    onClick={toggleShowCart}
                  >
                    Items in Cart (
                    {tableCart.filter((cart) => cart.isOrdered == 0).length})
                  </button>

                  {showCart ? (
                    <Cart
                      cart={tableCart.filter((cart) => cart.isOrdered == 0)}
                      close={toggleShowCart}
                    />
                  ) : null}
                </div>
              }
              {
                params.id && <div>
                  <button
                    className="bg-[#5d8abb] hover:bg-[#2e66a1] duration-1000 text-white lg:text-sm text-xs rounded-md shadow py-2 lg:px-8 px-4"
                    onClick={toggleShowOrder}
                  >
                    Active Orders
                  </button>
                  {showOrder ? (
                    <AllOrder
                      ordered={tableCart.filter((cart) => cart.isOrdered == 1)}
                      close={toggleShowOrder}
                    />
                  ) : null}
                </div>
              }

              <div className="relative">
                <div className="cursor-pointer" onClick={toggleShowLogOutBar}>
                  <img
                    className="lg:w-10 lg:h-10 w-8 h-8 rounded-full object-cover"
                    src="/images/profile-default.jpg"
                    alt=""
                  />
                </div>
                {showLogOutBar ? (
                  <div className="absolute right-2 top-12  w-60 pt-4 bg-white   shadow logoutbar">
                    <div className="flex items-center gap-x-2 px-4 border-b pb-2">
                      <img className="w-14" src="/images/logo.png" alt="" />
                      <div>
                        <h3 className="text-xs text-gray-700">POS</h3>
                      </div>
                    </div>
                    <div
                      className="flex items-center cursor-pointer text-gray-700 px-6 hover:bg-gray-200 hover:text-[#0000cd] py-2 w-full gap-2"
                      onClick={logout}
                    >
                      <RiLogoutCircleLine className="text-lg" />
                      <p className="text-sm">Logout</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default TopBar;
