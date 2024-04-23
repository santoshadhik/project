import { Outlet } from "react-router-dom";
import Topbar from "../nav/Topbar";

const KotLayout = () => {
  return (
    <>
      <div className="bg-slate-50 fixed inset-0 overflow-y-auto">
        <Topbar />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default KotLayout;
