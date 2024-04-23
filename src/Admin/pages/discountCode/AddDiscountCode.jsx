import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

export const Role = [{}];

function AddDiscountCode() {
  const navigate = useNavigate();

  const addDiscountCode = object({
    code: string().required("Code is required"),
    type: string().required("Type is required"),
    value: string().required("Value is required"),
    status: string().required("Status is required"),
  });

  const [loading, setLoading] = useState(false);
  return (
    <>
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Add Discount Code Add</h1>
          </div>
          <Formik
            initialValues={{
              code: "",
              type: "",
              value: "",
              status: "",
            }}
            validationSchema={addDiscountCode}
            validateOnChange={false}
            onSubmit={async (values) => {
              setLoading(true);
              const formData = new FormData();
              formData.append("code", values.code);
              formData.append("type", values.type);
              formData.append("value", values.value);
              formData.append("status", values.status);

              const response = await fetch(APIURL + "discountCode", {
                body: formData,
                method: "post",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              response.json().then((data) => {
                if (data.token) {
                  navigate("/admin/discountCode");
                }
                if (data.details) {
                  toast(data.details, {
                    type: "error",
                  });
                }
                if (data.status) {
                  toast(data.message, {
                    type: "success",
                  });
                }
              });
              setLoading(false);
            }}
          >
            {({
              errors,
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                  <form onSubmit={handleSubmit} className="m-5">

                    {/* For Discount Code */}
                    <div className="my-5">
                      <label
                        htmlFor="code"
                        className="block text-gray-600 py-1 "
                      >
                        Discount Code
                      </label>
                      <input
                        type="code"
                        id="code"
                        onChange={handleChange}
                        name="code"
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        placeholder="Enter discount code "
                      />
                      <p className="text-red-500 text-sm">{errors.code}</p>
                    </div>

                    {/* For Discount Type */}
                    <div className="my-5">
                      <label
                        htmlFor="type"
                        className="block text-gray-600 py-1 "
                      >
                        Discount Type
                      </label>
                      <select id="type"
                        onChange={handleChange}
                        name="type"
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3">
                        <option selected={true} disabled={true}>--Select Type--</option>
                        <option value="percentage">Percentage</option>
                        <option value="amount">Amount</option>
                      </select>

                      <p className="text-red-500 text-sm">{errors.type}</p>
                    </div>

                    {/* For Discount value */}
                    <div className="my-5">
                      <label
                        htmlFor="code"
                        className="block text-gray-600 py-1 "
                      >
                        Discount Value
                      </label>
                      <input
                        type="value"
                        id="value"
                        onChange={handleChange}
                        name="value"
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        placeholder="Enter Discount Value "
                      />
                      <p className="text-red-500 text-sm">{errors.value}</p>
                    </div>

                    {/* For Discount Status */}
                    <div className="my-5">
                      <label
                        htmlFor="status"
                        className="block text-gray-600 py-1 "
                      >
                        Discount Status
                      </label>
                      <select id="status"
                        onChange={handleChange}
                        name="status"
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3">
                        <option selected={true} disabled={true}>--Select Status--</option>
                        <option value="hide">Hide</option>
                        <option value="show">Show</option>
                      </select>

                      <p className="text-red-500 text-sm">{errors.status}</p>
                    </div>





                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Add Discount Code
                      </button>
                      <button
                        onClick={() => navigate("/admin/staff")}
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
}

export default AddDiscountCode;
