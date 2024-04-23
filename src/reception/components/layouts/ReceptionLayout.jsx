import { Outlet } from "react-router-dom";
import SideBar from "../navbar/SideBar";
import TopBar from "../navbar/TopBar";
const ReceptionLayout = () => {
  return (
    <>
      <div className="bg-slate-50 fixed inset-0 overflow-auto">
        <SideBar />
        <div>
          <TopBar />
          <div className="ml-[8rem] pt-16">
            <div className="mr-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceptionLayout;
