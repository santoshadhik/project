import { Outlet } from "react-router-dom";
import MenuSidebar from "../navbar/MenuSidebar";
import MenuTopbar from "../navbar/MenuTopbar";
const WaiterLayout = () => {
  return (
    <>
      <div className="bg-slate-50 fixed inset-0 overflow-auto">
        <MenuSidebar />
        <div>
          <MenuTopbar />
          <div className="ml-[8rem]  pt-16">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaiterLayout;
