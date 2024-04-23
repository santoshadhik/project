import { NavLink } from "react-router-dom";
import useSwr from "swr";

//* For Pagination of Table
import "primeicons/primeicons.css";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useState } from "react";
import { APIURL } from "../../constants/ApiConstants";

const AllHistory = () => {

  //* For Expanding Row Data
  const [expandedRows, setExpandedRows] = useState(null);
  const allowExpansion = (rowData) => {
    return rowData.order.product_name.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5 className="text-2xl text-center font-bold">Order Items</h5>
        <table className="w-full">
          <thead>
            <tr className="border-b py-2">
              <th className="py-2">Product Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.order.product_name.map((item, index) => {
              return (
                <tr key={index} className="border-b">
                  <td className="py-3">{item}</td>
                  <td>{data.order.quantity[index]} </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };


  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());
  const { data, error } = useSwr(`${APIURL}fetchBill`, fetcher);
  if (data) {
    return (
      <>
        <div>
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold"> All History</h1>
              <hr className="my-2" />
              <div>
                <div className="flex gap-5">
                  <NavLink to="/reception/history">
                    <button className="bg-[#5d8abb] hover:bg-[#2e66a1] duration-1000 rounded-md shadow-md text-white py-2 px-7">
                      Today
                    </button>
                  </NavLink>

                </div>
              </div>
            </div>
            <div className="w-56 rounded-md shadow-md mt-5 h-32 bg-emerald-500 hover:bg-emerald-700 cursor-pointer flex items-center justify-center">
              <div>
                <h1 className="text-center my-2 text-2xl text-white">
                  Total Sales
                </h1>
                <h3 className="text-4xl text-white font-bold">
                  Rs {
                    data.data.reduce((acc, bill) => {
                      return acc + parseInt(bill.total_amount);
                    }, 0)
                  }
                </h3>
              </div>
            </div>
            <div className="mt-8">
              <div className="card">
                <DataTable value={data.data} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                  rowExpansionTemplate={rowExpansionTemplate} responsiveLayout="scroll" filterDisplay="menu" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                  <Column field="id" expander={allowExpansion} header="S.no" style={{ width: '15%' }}></Column>
                  <Column field="date" filter header="Date" style={{ width: '25%' }}></Column>
                  <Column field="bill_no" filter header="Bill Number" style={{ width: '25%' }}></Column>
                  <Column field="total_amount" header="Amount (Rs)" style={{ width: '25%' }}></Column>
                  <Column field="table_name" header="Table" style={{ width: '25%' }}></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default AllHistory;
