import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/navbar/SideBar";
import TopBar from "../components/navbar/TopBar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate('/');
      setLoading(false);
    }
    setLoading(false);

  }, []);

  if (loading) {
    return <h1>Loading.....</h1>
  }
  else {
    return (
      <>
        <div className="bg-slate-50 fixed inset-0 overflow-auto">
          <SideBar />
          <div>
            <TopBar />
            <div className="ml-60 mt-[6rem]">
              <div className="mx-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

};

export default AdminLayout;
