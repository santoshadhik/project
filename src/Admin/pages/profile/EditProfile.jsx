import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { mixed, object, ref, string } from "yup";
import { APIIMG, APIURL } from "../../../constants/ApiConstants";

function EditProfile() {
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(APIURL + "admin", fetcher);

  const detailsSchema = object({
    email: string().email().required(),
    name: string().required(),
    profile_photo: mixed().nullable(),
  });

  const passwordSchema = object({
    current_password: string().required(),
    new_password: string().required(),
    re_password: string()
      .oneOf([ref("new_password"), null], "Confirm Password doesn't must match")
      .required("Confirm Password is Required"),
  });

  const navigate = useNavigate();

  if (error) {
    if (localStorage.getItem("token")) {
      navigate("../../../pages/PageNotFound.jsx");
    } else {
      navigate("/");
    }
  }

  if (data) {
    return (
      <div>
        <div className="w-11/12 mx-auto">
          <h1 className="text-gray-700 text-xl md:text-2xl font-bold mt-7">
            Edit Profile
          </h1>
          <hr className="my-2" />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="border border-gray-200 rounded-md p-5">
                <Formik
                  initialValues={{
                    email: data.user.email,
                    name: data.user.name,
                    profile_photo: "",
                  }}
                  validationSchema={detailsSchema}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    const formData = new FormData();
                    formData.append("email", values.email);
                    formData.append("name", values.name);
                    if (values.profile_photo != "") {
                      formData.append("profile_photo", values.profile_photo);
                    }

                    fetch(APIURL + "admin/update", {
                      method: "Post",
                      body: formData,
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }).then((res) => {
                      res.json().then((data) => {
                        if (data.status) {
                          toast(data.message, {
                            type: "success",
                          });
                          mutate();
                          navigate("/admin/profile");
                        }
                      });
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
                      <form className="w-10/12" onSubmit={handleSubmit}>
                        <div className="my-5 relative">
                          <label htmlFor="profile_photo">
                            <img
                              src={
                                values.profile_photo == ""
                                  ? APIIMG +
                                  `images/profiles/${data.user.profile_photo}`
                                  : URL.createObjectURL(values.profile_photo)
                              }
                              alt=""
                              className="w-32 h-32 cursor-pointer rounded-full mx-auto"
                            />
                            <div className=" justify-center text-gray-600 flex items-center right-0 top">
                              <p>
                                <i className="ri-edit-box-line px-1 "></i>{" "}
                              </p>
                              <p>Change Profile</p>
                            </div>
                          </label>
                          <input
                            type="file"
                            name="profile_photo"
                            id="profile_photo"
                            className="hidden"
                            onChange={(e) => {
                              setFieldValue(
                                "profile_photo",
                                e.currentTarget.files[0]
                              );
                            }}
                          />
                        </div>
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
                            value={values.name}
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
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
                            value={values.email}
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Enter Email Address"
                          />
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 my-5"
                        >
                          Update Details
                        </button>
                      </form>
                    );
                  }}
                </Formik>
              </div>
            </div>
            <div>
              <div className="border border-gray-200 rounded-md p-5">
                <Formik
                  initialValues={{
                    current_password: "",
                    new_password: "",
                    re_password: "",
                  }}
                  validationSchema={passwordSchema}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    const formData = new FormData();
                    formData.append(
                      "current_password",
                      values.current_password
                    );
                    formData.append("new_password", values.new_password);
                    formData.append("re_password", values.re_password);
                    fetch(APIURL + "admin/changepass", {
                      method: "Post",
                      body: formData,
                      headers: {
                        contentType: "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }).then((res) => {
                      res.json().then((data) => {
                        if (data.status) {
                          toast(data.message, {
                            type: "success",
                          });
                          localStorage.removeItem("token");
                          navigate("/");
                        } else {
                          toast(data.message, {
                            type: "error",
                          });
                        }
                      });
                    });
                  }}
                >
                  {({ errors, handleChange, handleSubmit }) => {
                    return (
                      <form className="w-10/12" onSubmit={handleSubmit}>
                        <div className="my-5">
                          <label
                            htmlFor="current_password"
                            className="block text-gray-600 py-1 "
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current_password"
                            name="current_password"
                            onChange={handleChange}
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Enter Current password "
                          />
                          <p className="text-red-500 text-sm">
                            {errors.current_password}
                          </p>
                        </div>

                        <div className="my-5">
                          <label
                            htmlFor="new_password"
                            className="block text-gray-600 py-1 "
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            onChange={handleChange}
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Enter password "
                          />
                          <p className="text-red-500 text-sm">
                            {errors.new_password}
                          </p>
                        </div>

                        <div className="my-5">
                          <label
                            htmlFor="re_password"
                            className="block text-gray-600 py-1 "
                          >
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="re_password"
                            name="re_password"
                            onChange={handleChange}
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Confirm password "
                          />
                          <p className="text-red-500 text-sm">
                            {errors.re_password}
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 my-5"
                        >
                          Update Password
                        </button>
                      </form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
