import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { number, object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

const AddCategory = () => {
  const categorySchema = object({
    category_name: string().required("Category Name is required"),
    priority: number().required("Priority is required"),
  });
  const { state } = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Category Add</h1>
            <p className="text-sm">Create new Category</p>
          </div>

          <Formik
            initialValues={{ category_name: "", priority: state + 1 }}
            validationSchema={categorySchema}
            validateOnChange={false}
            onSubmit={async (values) => {
              fetch(APIURL + "category", {
                method: "post",
                body: JSON.stringify(values),
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }).then((res) => {
                res.json().then((data) => {
                  if (data.status) {
                    toast(data.message, {
                      type: "success",
                    });
                    navigate("/admin/category");
                  }
                });
              });
            }}
          >
            {({ errors, handleChange, values, handleSubmit }) => {
              return (
                <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                  <form onSubmit={handleSubmit} className="m-5">
                    <div>
                      <label htmlFor="category_name" className="text-sm">
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="category_name"
                        id="category_name"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.category_name}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="priority" className="text-sm">
                        Priority
                      </label>
                      <input
                        type="text"
                        name="priority"
                        id="priority"
                        value={values.priority}
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.priority}
                      </p>
                    </div>

                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Add Category
                      </button>

                      <button
                        onClick={() => navigate("/admin/category")}
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
      </div>
    </>
  );
};

export default AddCategory;
