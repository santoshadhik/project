import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategoryAlt, BiFoodMenu } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { GiExpense, GiSurferVan } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi2";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineMessage, MdOutlineTableChart } from "react-icons/md";
import { RiShoppingCart2Line } from "react-icons/ri";
import { TbDiscount2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { MENULINK } from "../../../constants/ApiConstants";


const SideBar = () => {
  const menuItem = [
    {
      name: "Dashboard",
      icon: <AiOutlineDashboard title="Dashboard" />,
      link: "/admin/dashboard",
    },
    {
      name: "Category",
      icon: <BiCategoryAlt title="Category" />,
      link: "/admin/category",
    },
    {
      name: "Products",
      icon: <BsBoxSeam title="Products" />,
      link: "/admin/Products",
    },
    {
      name: "Discount Code",
      icon: <TbDiscount2 title="Discount Code" />,
      link: "/admin/discountcode",
    },
    {
      name: "Dealers",
      icon: <GiSurferVan title="Dealers" />,
      link: "/admin/dealers",
    },
    {
      name: "Expenses",
      icon: <GiExpense title="Expenses" />,
      link: "/admin/expenses",
    },
    {
      name: "Staffs",
      icon: <HiUserGroup title="Staffs" />,
      link: "/admin/staffs",
    },
    {
      name: "Table",
      icon: <MdOutlineTableChart title="Table" />,
      link: "/admin/table",
    },
    {
      name: "Kitchen Req",
      icon: <MdOutlineMessage title="Kitchen Req" />,
      link: "/admin/application",
    },
    {
      name: "Order",
      icon: <RiShoppingCart2Line title="Order" />,
      link: "/admin/order",
    },
    {
      name: "History",
      icon: <IoTimeOutline title="History" />,
      link: "/admin/history",
    },
  ];

  return (
    <>
      <div className="bg-white border-r border-gray-300 fixed top-0 left-0 bottom-0 shadow-lg w-60 overflow-auto admin-sidebar">
        <div>
          <img className="w-28 mx-auto mt-8" src="/images/logo.png" alt="" />
        </div>
        <div className="mt-8 text-[#4a5a68]">
          <ul>
            {menuItem.map((item, index) => (
              <NavLink
                key={index}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#5d8abb] text-white rounded-xl mx-4 p-2  shadow-md   flex items-center"
                    : " flex p-2 my-4  mx-4  hover:bg-[#94adc7] hover:text-white hover:rounded-xl hover:shadow-md"
                }
                to={item.link}
              >
                <li className="flex items-center gap-x-12">
                  <p className="flex items-center gap-2">
                    <span className="text-lg"> {item.icon}</span>
                    <span>{item.name}</span>
                  </p>
                  {/* <span>{item.pending}</span> */}
                </li>
              </NavLink>
            ))}
           

          </ul>
        </div>
      </div>
    </>
  );
  // }
};

export default SideBar;
