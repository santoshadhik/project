import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { number, object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";

const EditCategory = () => {
  const categorySchema = object({
    category_name: string().required("Category Name is required"),
    priority: number().required("Priority is required"),
  });

  const params = useParams();
  const navigate = useNavigate();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(`${APIURL}category/${params.id}`, fetcher);

  if (error) {
    return <ServerError />;
  }

  // if (!error && !data) {
  //   return <AdminLayout loading={true} />;
  // }

  if (data) {
    return (
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Category Edit</h1>
            <p className="text-sm">Update Your Category</p>
          </div>
          <Formik
            initialValues={{
              category_name: data.data.category_name,
              priority: data.data.priority,
            }}
            validateOnChange={false}
            validationSchema={categorySchema}
            onSubmit={async (values) => {
              const response = await fetch(
                `${APIURL}category/${data.data.id}`,
                {
                  method: "PUT",
                  body: JSON.stringify(values),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              response.json().then((data) => {
                if (data.status) {
                  toast(data.message, {
                    type: "success",
                  });
                  mutate();
                  navigate("/admin/category");
                }
              });
            }}
          >
            {({ errors, handleChange, handleSubmit, values }) => {
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
                        value={values.category_name}
                        className="w-full py-2 rounded-lg border outline-none  focus:border-[#f0a151] mt-2 pl-3"
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
                        onChange={handleChange}
                        value={values.priority}
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
                        Update
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
    );
  }
};

export default EditCategory;
