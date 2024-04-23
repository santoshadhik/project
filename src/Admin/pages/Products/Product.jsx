import React, { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";
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

const Product = () => {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const [page, setPage] = useState(1);

  const { data, mutate, error } = useSWR(
    APIURL + "product?page=" + page,
    fetcher
  );

  const { data: categoryData } = useSWR(APIURL + "category", fetcher);

  //* For Category wise Filtering
  const [categoryId, setCategoryId] = useState(0);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(
      data?.data?.filter((product) => product.category_id == categoryId)
    );
  }, [categoryId]);

  const [search, setSearch] = useState("");

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
    fetch(`${APIURL}product/${id}`, {
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

  if (data && categoryData) {
    // const lastPage = data.data.last_page;
    return (
      <div>
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
            <h1 className="text-2xl font-bold">Products</h1>
            <NavLink to="create">
              <AddButton name="Add Product" />
            </NavLink>
          </div>

          <div className="mt-10">
            <DataTable value={data.data} filterDisplay="menu"
              paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
              <Column field="id" header="S.no" style={{ width: '15%' }}></Column>
              <Column field="product_name" filter header="Product Name" style={{ width: '25%' }}></Column>
              <Column field="category_name" filter header="Category Name" style={{ width: '25%' }}></Column>
              <Column body={
                (rowData) => {
                  return (
                    <div>
                      <img
                        className="w-20 mx-auto"
                        src={`${APIIMG}images/product_images/${rowData.photopath}`}
                        alt=""
                      />
                    </div>
                  );
                }
              } header="Photopath" style={{ width: '25%' }}></Column>
              <Column field="description" header="Description" style={{ width: '25%' }}></Column>
              <Column field="price" header="Price (Rs)" style={{ width: '25%' }}></Column>
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

export default Product;
