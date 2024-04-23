import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";

const EditDiscountCode = () => {
  const editDiscountCode = object({
    code: string().required("Code is required"),
    type: string().required("Type is required"),
    value: string().required("Value is required"),
    status: string().required("Status is required"),
  });

  const params = useParams();
  const navigate = useNavigate();
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(`${APIURL}discountCode/${params.id}`, fetcher);

  if (error) {
    return <ServerError />;
  }

  if (data) {
    return (
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Edit Discount Code</h1>
          </div>
          <Formik
            validateOnChange={false}
            initialValues={{
              code: data.data.code,
              type: data.data.type,
              value: data.data.value,
              status: data.data.status,
            }}
            validationSchema={editDiscountCode}
            onSubmit={async (values) => {
              const formData = new FormData();
              formData.append("code", values.code);
              formData.append("type", values.type);
              formData.append("value", values.value);
              formData.append("status", values.status);
              formData.append("_method", "PUT");

              const response = await fetch(`${APIURL}discountCode/${params.id}`, {
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
                  navigate("/admin/discountCode");
                }
              });
            }}
          >
            {({ errors, handleChange, handleSubmit, values }) => {
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
                        value={values.code}
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
                        <option value="percentage" selected={values.type == 'percentage' ? true : false} >Percentage</option>
                        <option value="amount" selected={values.type == 'amount' ? true : false}>Amount</option>
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
                        value={values.value}
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
                        <option value="hide" selected={values.status == 'hide' ? true : false}>Hide</option>
                        <option value="show" selected={values.status == 'show' ? true : false}>Show</option>
                      </select>

                      <p className="text-red-500 text-sm">{errors.status}</p>
                    </div>

                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Edit Discount Code
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
    );
  }
};

export default EditDiscountCode;
