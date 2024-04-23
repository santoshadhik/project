import { Formik } from "formik";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mixed, object, ref, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

export const Role = [{}];

function AddStaff() {
  const navigate = useNavigate();

  const registerScheme = object({
    email: string().email().required("Email is a required"),
    name: string().required("Name is a required"),
    phone: string().required("Phone is a required"),
    address: string().required("Address is a required"),
    password: string().required(),
    confirm_password: string()
      .oneOf([ref("password"), null], "Confirm Password doesn't must match")
      .required("Confirm Password is Required"),
    profile_photo: mixed().nullable(),
  });

  const [loading, setLoading] = useState(false);
  return (
    <>
      <div>
        <div>
          <div>
            <h1 className="text-lg font-bold">Staff Add</h1>
            <p className="text-sm">Create new staff</p>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
              name: "",
              phone: "",
              address: "",
              role: "",
              confirm_password: "",
              profile_photo: "",
            }}
            validationSchema={registerScheme}
            validateOnChange={false}
            onSubmit={async (values) => {
              setLoading(true);
              const formData = new FormData();
              formData.append("email", values.email);
              formData.append("password", values.password);
              formData.append("confirm_password", values.confirm_password);
              formData.append("name", values.name);
              formData.append("phone", values.phone);
              formData.append("address", values.address);
              formData.append("role", values.role);
              formData.append("profile_photo", values.profile_photo);

              const response = await fetch(APIURL + "register", {
                body: formData,
                method: "post",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              response.json().then((data) => {
                if (data.token) {
                  navigate("/admin/staffs");
                }
                if (data.details) {
                  if (data.details["email"]) {
                    toast("The email has already been taken.", {
                      type: "error",
                    });
                  }
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
                    <div className="grid grid-cols-3 gap-x-8">
                      <div className="my-5">
                        <label
                          htmlFor="name"
                          className="block text-gray-600 py-1 "
                        >
                          User Name
                        </label>
                        <input
                          type="name"
                          id="name"
                          onChange={handleChange}
                          name="name"
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                          placeholder="Enter name "
                        />
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      </div>

                      <div className="my-5">
                        <label
                          htmlFor="email"
                          className="block text-gray-600 py-1 "
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          onChange={handleChange}
                          name="email"
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                          placeholder="Enter Email Address"
                        />
                        <p className="text-red-500 text-sm">{errors.email}</p>
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
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                        >
                          <option>--Select Role--</option>
                          <option value="waiter">Waiter</option>
                          <option value="reception">Reception</option>
                          <option value="kitchen">Kitchen</option>
                        </select>
                        <p className="text-red-500 text-sm">{errors.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8">
                      <div className="my-5">
                        <label
                          htmlFor="phone"
                          className="block text-gray-600 py-1 "
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          onChange={handleChange}
                          name="phone"
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                          placeholder="Enter Phone"
                        />
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      </div>

                      <div className="my-5">
                        <label
                          htmlFor="address"
                          className="block text-gray-600 py-1 "
                        >
                          Address
                        </label>
                        <input
                          type="address"
                          id="address"
                          onChange={handleChange}
                          name="address"
                          className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                          placeholder="Enter Address"
                        />
                        <p className="text-red-500 text-sm">{errors.address}</p>
                      </div>
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
                      <p className="text-red-500 text-sm">{errors.password}</p>
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

                    <div className="my-5">
                      <div className="mx-2">
                        <p className="my-2 text-gray-500 ">
                          Select Profile Picture
                        </p>
                        <label
                          htmlFor="profile_photo"
                          className="my-2 text-gray-500 "
                        >
                          <div className="w-[220px] h-[220px] border-2 border-dashed flex items-center justify-center ">
                            {values.profile_photo ? (
                              <img
                                src={URL.createObjectURL(values.profile_photo)}
                                className="w-full h-full border border-gray-200 rounded-lg shadow-lg p-1 object-cover"
                                alt=""
                              />
                            ) : (
                              <RiAddLine className="text-6xl text-gray-300" />
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          hidden
                          name="profile_photo"
                          id="profile_photo"
                          onChange={(e) => {
                            setFieldValue(
                              "profile_photo",
                              e.currentTarget.files[0]
                            );
                          }}
                          className="file:border-none file:bg-red-400 file:text-white file:hover:bg-red-500 w-full file:shadow-gray-100 file:rounded-md file:shadow-md py-2 px-3 border-none focus-visible:border-gray-600 my-2"
                        />
                        <p className="text-sm text-red-500 pb-3">
                          {errors.profile_photo}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Register
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

export default AddStaff;
