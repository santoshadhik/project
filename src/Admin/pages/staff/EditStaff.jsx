import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { number, object, ref, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";
import ServerError from "../../../pages/ServerError";

const EditStaff = () => {
  const staffSchema = object({
    name: string().required("Name is required"),
    phone: number().required("Phone Number is required"),
    email: string().required("Email is required"),
    address: string().required("Address is required"),
    role: string().required("Role is required"),
    password: string().nullable(),
    confirm_password: string()
      .oneOf([ref("password"), null], "Confirm Password doesn't must match")
      .nullable(),
  });

  const params = useParams();
  const navigate = useNavigate();
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(`${APIURL}user/${params.id}`, fetcher);

  if (error) {
    return <ServerError />;
  }

  if (data) {
    return (
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Staff Add</h1>
            <p className="text-sm">Create new staff</p>
          </div>
          <Formik
            validateOnChange={false}
            initialValues={{
              name: data.data.name,
              phone: data.data.phone,
              email: data.data.email,
              address: data.data.address,
              role: data.data.role,
              password: "",
              confirm_password: "",
            }}
            validationSchema={staffSchema}
            onSubmit={async (values) => {
              const formData = new FormData();
              formData.append("id", params.id);
              formData.append("name", values.name);
              formData.append("phone", values.phone);
              formData.append("email", values.email);
              formData.append("address", values.address);
              formData.append("role", values.role);
              if (values.password != "") {
                formData.append("password", values.password);
              }
              else {
                formData.append("password", data.data.password);
              }

              const response = await fetch(`${APIURL}admin/user/update`, {
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
                  navigate("/admin/staffs");
                }
              });
            }}
          >
            {({ errors, handleChange, handleSubmit, values }) => {
              return (
                <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                  <form onSubmit={handleSubmit} className="m-5">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="name" className="text-sm">
                          Staff Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          value={values.name}
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        />
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="phone" className="text-sm">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          onChange={handleChange}
                          value={values.phone}
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        />
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="mt-4">
                        <label htmlFor="email" className="text-sm">
                          Email
                        </label>
                        <input
                          type="text"
                          name="email"
                          readOnly={true}
                          id="email"
                          onChange={handleChange}
                          value={values.email}
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        />
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email}
                        </p>
                      </div>

                      <div className="my-5">
                        <label
                          htmlFor="role"
                          className="block text-gray-600 py-1 "
                        >
                          Role
                        </label>
                        <select
                          name="role"
                          id="role"
                          onChange={handleChange}
                          value={values.role}
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        >
                          <option value="waiter">Waiter</option>
                          <option value="reception">Reception</option>
                          <option value="kitchen">Kitchen</option>
                        </select>
                        <p className="text-red-500 text-sm">{errors.role}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="address" className="text-sm">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        onChange={handleChange}
                        value={values.address}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address}
                      </p>
                    </div>

                    <div className="my-5">
                      <label
                        htmlFor="password"
                        className="block text-gray-600 py-1 "
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        placeholder="Enter password "
                      />
                      <p className="text-red-500 text-sm">
                        {errors.password}
                      </p>
                    </div>

                    <div className="my-5">
                      <label
                        htmlFor="confirm_password"
                        className="block text-gray-600 py-1 "
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        placeholder="Confirm password "
                      />
                      <p className="text-red-500 text-sm">
                        {errors.confirm_password}
                      </p>
                    </div>

                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Update Staff
                      </button>

                      <button
                        onClick={() => navigate("/admin/staffs")}
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

export default EditStaff;
