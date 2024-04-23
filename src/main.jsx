import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./Admin/layouts/AdminLayout";
import Application from "./Admin/pages/application/Application";
import AddCategory from "./Admin/pages/category/AddCategory";
import Category from "./Admin/pages/category/Category";
import EditCategory from "./Admin/pages/category/EditCategory";
import Dashboard from "./Admin/pages/dashboard/Dashboard";
import AddDealer from "./Admin/pages/dealers/AddDealer";
import Dealer from "./Admin/pages/dealers/Dealer";
import EditDealer from "./Admin/pages/dealers/EditDealer";
import AddDiscountCode from "./Admin/pages/discountCode/AddDiscountCode";
import DiscountCodeIndex from "./Admin/pages/discountCode/DiscountCodeIndex";
import EditDiscountCode from "./Admin/pages/discountCode/EditDiscountCode";
import AddExpenses from "./Admin/pages/expenses/AddExpense";
import EditExpenses from "./Admin/pages/expenses/EditExpense";
import Expense from "./Admin/pages/expenses/Expense";
import AdminAllHistory from "./Admin/pages/history/AdminAllHistory";
import AdminHistory from "./Admin/pages/history/AdminHistory";
import AdminMonthlyHistory from "./Admin/pages/history/AdminMonthlyHistory";
import AddProduct from "./Admin/pages/Products/AddProduct";
import EditProduct from "./Admin/pages/Products/EditProduct";
import Product from "./Admin/pages/Products/Product";
import EditProfile from "./Admin/pages/profile/EditProfile";
import Profile from "./Admin/pages/profile/Profile";
import AddStaff from "./Admin/pages/staff/AddStaff";
import EditStaff from "./Admin/pages/staff/EditStaff";
import Staff from "./Admin/pages/staff/Staff";
import AddTable from "./Admin/pages/table/AddTable";
import EditTable from "./Admin/pages/table/EditTable";
import Table from "./Admin/pages/table/Table";
import Login from "./auth/Login";
import "./index.css";
import EditRequestModal from "./kot/components/EditRequestModal";
import RequestModal from "./kot/components/RequestModal";
import KotLayout from "./kot/layouts/KotLayout";
import KotIndex from "./kot/pages/KotIndex";
import MyRequest from "./kot/pages/MyRequest";
import PageNotFound from "./pages/PageNotFound";
import ReceptionLayout from "./reception/components/layouts/ReceptionLayout";
import AllHistory from "./reception/pages/AllHistory";
import History from "./reception/pages/History";
import Order from "./reception/pages/Order";
import Print from "./reception/pages/Print";
import ReceptionApplication from "./reception/pages/ReceptionApplication";
import ReceptionFoods from "./reception/pages/ReceptionFoods";
import ReceptionIndex from "./reception/pages/ReceptionIndex";
import ReceptionSearchPage from "./reception/pages/SearchPage";
import WaiterLayout from "./waiter/components/layouts/WaiterLayout";
import Foods from "./waiter/pages/Foods";
import WaiterIndex from "./waiter/pages/Index";
import SearchPage from "./waiter/pages/SearchPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ToastContainer
        position="bottom-right"
        pauseOnHover={false}
        autoClose={1000}
      />
      <Routes>
        {/* Login & Register */}
        <Route path="/" element={<Login />} />
        {/* Page Not Found */}
        <Route path="*" element={<PageNotFound />} />

        {/* Waiter Routes */}
        <Route path="/waiter" element={<WaiterLayout />}>
          <Route index element={<WaiterIndex />} />
          <Route path="table/:id" element={<Foods />} />
          {/* Search Page */}
          <Route path="search/:id" element={<SearchPage />} />
        </Route>
        {/* KOT Routes */}
        <Route path="/kot" element={<KotLayout />}>
          <Route index element={<KotIndex />} />
          <Route path="myrequest" element={<MyRequest />} />
          <Route path="request" element={<RequestModal />} />
          <Route path="edit/:id" element={<EditRequestModal />} />
        </Route>
        {/* Reception Routes */}
        <Route path="/reception" element={<ReceptionLayout />}>
          <Route path="home" element={<ReceptionIndex />} />
          <Route path="table/:id" element={<ReceptionFoods />} />
          <Route path="search/:id" element={<ReceptionSearchPage />} />
          <Route path="print" element={<Print />} />
          <Route path="order" element={<Order />} />
          <Route path="history" element={<History />} />
          <Route path="all-history" element={<AllHistory />} />
          <Route path="application" element={<ReceptionApplication />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Profile */}
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
          </Route>
          {/* Category */}
          <Route path="category">
            <Route index element={<Category />} />
            <Route path="create" element={<AddCategory />} />
            <Route path="edit/:id" element={<EditCategory />} />
          </Route>
          {/* Products */}
          <Route path="products">
            <Route index element={<Product />} />
            <Route path="create" element={<AddProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>

          {/* Dealers */}
          <Route path="dealers">
            <Route index element={<Dealer />} />
            <Route path="create" element={<AddDealer />} />
            <Route path="edit/:id" element={<EditDealer />} />
          </Route>

          {/* Expenses */}
          <Route path="expenses">
            <Route index element={<Expense />} />
            <Route path="create" element={<AddExpenses />} />
            <Route path="edit/:id" element={<EditExpenses />} />
          </Route>

          {/* Table */}
          <Route path="table">
            <Route index element={<Table />} />
            <Route path="create" element={<AddTable />} />
            <Route path="edit/:id" element={<EditTable />} />
          </Route>

          {/* Staff */}
          <Route path="staffs">
            <Route index element={<Staff />} />
            <Route path="create" element={<AddStaff />} />
            <Route path="edit/:id" element={<EditStaff />} />
          </Route>

          {/* Application */}
          <Route path="application">
            <Route index element={<Application />} />
          </Route>

          {/* Discount Code */}
          <Route path="discountcode">
            <Route index element={<DiscountCodeIndex />} />
            <Route path="add" element={<AddDiscountCode />} />
            <Route path="edit/:id" element={<EditDiscountCode />} />
          </Route>

          <Route path="order" element={<Order />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="all-history" element={<AdminAllHistory />} />
          <Route path="monthly-history" element={<AdminMonthlyHistory />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
