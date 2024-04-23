import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { mixed, number, object, string } from "yup";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";

const EditProduct = () => {
  const productSchema = object({
    product_name: string().required("Product name is required"),
    price: number().required("Price is required"),
    description: string().required("Description is required"),
    photopath: mixed().nullable(),
    category_id: number().required("Category is required"),
  });

  const navigate = useNavigate();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const params = useParams();
  const { data, mutate, error } = useSWR(`${APIURL}product/${params.id}`, fetcher);

  const { data: categoryData } = useSWR(APIURL + "category", fetcher);

  if (error) {
    return <h1>Error Occured</h1>
  }

  if (data) {
    return (

      <div>
        <div>
          <h1 className="text-lg font-bold">Product Edit</h1>
          <p className="text-sm">Update Your Product</p>
        </div>
        <Formik
          initialValues={{
            product_name: data.data.product_name,
            price: data.data.price,
            description: data.data.description,
            category_id: data.data.category_id,
          }}
          validateOnChange={false}
          validationSchema={productSchema}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("product_name", values.product_name);
            formData.append("price", values.price);
            formData.append("description", values.description);
            formData.append("category_id", values.category_id);
            values.photopath !== undefined
              ? formData.append("photopath", values.photopath)
              : null;
            formData.append("_method", "put");

            const res = await fetch(`${APIURL}product/${params.id}`, {
              method: "post",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            res.json().then((data) => {
              if (data.status) {
                toast(data.message, {
                  type: "success",
                });
                navigate("/admin/products");
                mutate();
              }
            });
          }}
        >
          {({
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
          }) => {
            return (
              <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                <form onSubmit={handleSubmit} className="m-5">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="product_name" className="text-sm">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="product_name"
                        id="product_name"
                        onChange={handleChange}
                        value={values.product_name}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.product_name}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="category_id" className="text-sm">
                        Category
                      </label>
                      <select
                        name="category_id"
                        id="category_id"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3 text-sm"
                      >
                        <option>--Select Category--</option>
                        {!categoryData ? (
                          <></>
                        ) : (
                          categoryData.data.map((category) => {
                            return (
                              <option
                                value={category.id}
                                key={category.id}
                                selected={
                                  values.category_id == category.id
                                    ? true
                                    : false
                                }
                              >
                                {category.category_name}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <p className="text-sm text-red-500 mt-1">
                        {errors.category_id}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="price" className="text-sm">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      onChange={handleChange}
                      value={values.price}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price}
                    </p>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="description" className="text-sm">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      cols="4"
                      rows="8"
                      onChange={handleChange}
                      value={values.description}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    ></textarea>
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="photopath">
                      <div className="w-80 h-[300px] border-2 border-dashed flex items-center justify-center cursor-pointer">
                        {values.photopath ? (
                          <img
                            src={URL.createObjectURL(values.photopath)}
                            className="w-full h-full border border-gray-200 rounded-lg shadow-lg p-1 object-cover"
                            alt=""
                          />
                        ) : (
                          <img
                            src={`${APIIMG}images/product_images/${data.data.photopath}`}
                            className="w-full h-full border border-gray-200 rounded-lg shadow-lg p-1 object-cover"
                            alt=""
                          />
                        )}
                      </div>
                    </label>

                    <input
                      type="file"
                      hidden
                      name="photopath"
                      id="photopath"
                      onChange={(e) => {
                        setFieldValue("photopath", e.currentTarget.files[0]);
                      }}
                      className="file:border-none file:bg-red-400 file:text-white file:hover:bg-red-500 w-full file:shadow-gray-100 file:rounded-md file:shadow-md py-2 px-3 border-none focus-visible:border-indigo-600 my-2"
                    />
                  </div>

                  <div className="mt-8 flex  items-center gap-4">
                    <button
                      type="submit"
                      className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                    >
                      Update Product
                    </button>

                    <button
                      onClick={() => navigate("/admin/products")}
                      className="bg-[#b32234] hover:bg-[#c25b67] text-white py-2 px-4 rounded-full shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            );
          }}
        </Formik>
      </div>

    );
  }
};

export default EditProduct;
