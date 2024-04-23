import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";

const EditTable = () => {
  const tableSchema = object({
    table_number: string().required("Table Number is required"),
  });

  const params = useParams();
  const navigate = useNavigate();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(
    `${APIURL}table/${params.id}`,
    fetcher
  );

  if (error) {
    return <ServerError />;
  }

  if (data) {
    return (
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Table Edit</h1>
            <p className="text-sm">Update Your Table</p>
          </div>
          <Formik
            initialValues={{
              table_number: data.data.table_number,
            }}
            validateOnChange={false}
            validationSchema={tableSchema}
            onSubmit={async (values) => {
              const formData = new FormData();
              formData.append("table_number", values.table_number);
              formData.append("_method", "PUT");
              const response = await fetch(`${APIURL}table/${params.id}`, {
                method: "POST",
                body: formData,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              response.json().then((data) => {
                if (data.status) {
                  toast(data.message, {
                    type: "success",
                  });
                  mutate();
                  navigate("/admin/table");
                }
              });
            }}
          >
            {({ errors, handleChange, handleSubmit, values }) => {
              return (
                <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                  <form onSubmit={handleSubmit} className="m-5">
                    <div>
                      <label htmlFor="table_number" className="text-sm">
                        Table Number
                      </label>
                      <input
                        type="text"
                        name="table_number"
                        id="table_number"
                        onChange={handleChange}
                        value={values.table_number}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.table_number}
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
                        onClick={() => navigate("/admin/table")}
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

export default EditTable;
