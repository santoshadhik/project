import React, { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";
import AddButton from "../../components/utils/AddButton";
import DeleteButton from "../../components/utils/DeleteButton";
import EditButton from "../../components/utils/EditButton";
import ShowDelete from "../../components/utils/ShowDelete";
import AdminLayout from "../../layouts/AdminLayout";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import DashboardCard from "../../components/DashboardCard";

const Expense = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const [page, setPage] = useState(1);

  const { data, mutate, error } = useSWR(
    APIURL + "expenses",
    fetcher
  );


  //* For deleting data
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState();

  const toggleIsDelete = () => {
    if (isDelete) {
      setIsDelete(false);
    } else {
      setIsDelete(true);
    }
  };

  //* For Deleteing Product
  const deleteProduct = async (id) => {
    fetch(`${APIURL}expenses/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        toast(data.message, {
          type: "success",
        });
      });
    });
    mutate();
    toggleIsDelete();
  };

  //! Show Error
  if (error) {
    if (!localStorage.getItem("token")) {
      return <Navigate to="/" />;
    } else {
      return <ServerError />;
    }
  }

  //*Show Loading
  if (!data && !error) {
    return <AdminLayout />;
  }

  if (data) {
    return (
      <div>
        <div className="my-4">
          <DashboardCard title="Today Expenses" color="orange" value={`Rs ${data.todayExpenses}`} />
        </div>
        {isDelete ? (
          <ShowDelete
            delete={deleteProduct}
            hideDelete={toggleIsDelete}
            id={id}
          />
        ) : (
          <></>
        )}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Expenses</h1>
            <NavLink to="create">
              <AddButton name="Add Expense" />
            </NavLink>
          </div>

          <div className="mt-10">
            <DataTable value={data.data} filterDisplay="menu"
              paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
              <Column field="id" header="S.no" style={{ width: '15%' }}></Column>
              <Column field="bill_date" filter header="Bill Date" style={{ width: '15%' }}></Column>
              <Column field="bill_no" filter header="Bill No" style={{ width: '25%' }}></Column>
              <Column field="particulars" filter header="Particulars" style={{ width: '25%' }}></Column>
              <Column field="amount" filter header="Amount" style={{ width: '25%' }}></Column>
              <Column field="dealer_name" filter header="Dealer Name" style={{ width: '25%' }}></Column>
              <Column body={
                (rowData) => {
                  return (
                    <div className="flex gap-2 justify-center">
                      <NavLink to={`edit/${rowData.id}`}>
                        <EditButton />
                      </NavLink>
                      <DeleteButton
                        delete={() => {
                          toggleIsDelete();
                          setId(rowData.id);
                        }}
                      />
                    </div>
                  );
                }
              } header="Action" style={{ width: '25%' }}></Column>
            </DataTable>

          </div>

        </div>

      </div>
    );
  }
};

export default Expense;
