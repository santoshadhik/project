import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

const AddTable = () => {
  const tableSchema = object({
    table_number: string().required("Table Number is required"),
  });
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Table Add</h1>
            <p className="text-sm">Create new Table</p>
          </div>

          <Formik
            initialValues={{ table_number: "" }}
            validationSchema={tableSchema}
            validateOnChange={false}
            onSubmit={async (values) => {
              console.log(values);
              const formData = new FormData();
              formData.append("table_number", values.table_number);
              fetch(APIURL + "table", {
                method: "post",
                body: formData,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }).then((res) => {
                res.json().then((data) => {
                  if (data.status) {
                    toast(data.message, {
                      type: "success",
                    });
                    navigate("/admin/table");
                  }
                });
              });
            }}
          >
            {({ errors, handleChange, handleSubmit }) => {
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
                        Add Table
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
    </>
  );
};

export default AddTable;
