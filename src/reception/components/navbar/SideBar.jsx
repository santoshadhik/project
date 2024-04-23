import { BiCategory, BiFoodMenu } from "react-icons/bi";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import {
  RiShoppingCart2Line
} from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import { MENULINK } from "../../../constants/ApiConstants";

const SideBar = () => {
  const params = useParams();
  const ReceptionMenuItem = [
    // {
    //   name: "Home",
    //   icon: <RiHome3Line className="mx-auto text-2xl" title="Home" />,
    //   link: "/reception/table/" + params.id,
    // },
    {
      name: "Table",
      icon: <BiCategory className="mx-auto text-2xl" title="Table" />,
      link: "/reception/home",
    },
    {
      name: "Order",
      icon: <RiShoppingCart2Line className="mx-auto text-2xl" title="Order" />,
      link: "/reception/order",
    },
    {
      name: "History",
      icon: <IoTimeOutline className="mx-auto text-2xl" title="History" />,
      link: "/reception/history",
    },
    {
      name: "Kitchen Req",
      icon: <MdOutlineMessage title="Kitchen Req" className="mx-auto text-2xl" />,
      link: "/reception/application",
    },
    // {
    //   name: "Settings",
    //   icon: <RiSettings2Line className="mx-auto text-2xl" title="Settings" />,
    //   link: "/reception/settings",
    // },
  ];

  return (
    <>
      <div className="fixed bottom-0 top-20 left-0 w-28 overflow-y-auto sidebar shadow-2xl">
        <div className="mt-8 mb-4">
          <div className="mt-8">
            <ul>
              {ReceptionMenuItem.map((item, index) => (
                <NavLink
                  key={index}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#5d8abb] text-white rounded-xl mx-4 p-2  shadow-md flex justify-center"
                      : " flex p-2 my-4  mx-4  justify-center hover:bg-[#94adc7] hover:text-white hover:rounded-xl hover:shadow-md"
                  }
                  to={item.link}
                >
                  <li className="text-center">
                    {item.icon}
                    <small>{item.name}</small>
                  </li>
                </NavLink>
              ))}
             







  `/             

            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
