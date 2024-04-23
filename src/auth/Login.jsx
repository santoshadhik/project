import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { APIURL } from "../constants/ApiConstants";

function Login() {
  const navigate = useNavigate();
  const loginScheme = object({
    email: string().email().required(),
    password: string().required(),
  });

  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      setPageLoad(true);
      navigate("/admin/dashboard");
    }
    setPageLoad(true);
  });

  const [loading, setLoading] = useState(false);
  return pageLoad ? (
    <>
      <div className="w-11/12 mx-auto">
        <div className="grid md:grid-cols-2  my-5 gap-10">
          <div className="hidden md:block">
            <img src="/images/tablet-login.png" alt="" />
          </div>
          <div>
            <div className="flex justify-center items-center h-full">
              <div className="w-full">
                <h1 className="text-4xl my-2 font-bold text-gray-700">Login</h1>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={loginScheme}
                  onSubmit={async (values) => {
                    setLoading(true);
                    const response = await fetch(APIURL + "login", {
                      method: "POST",
                      body: JSON.stringify(values),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });

                    response.json().then((data) => {
                      if (data.success == false) {
                        toast(data.message, {
                          type: "error",
                        });
                      }
                      if (data.success == true) {
                        toast(data.message, {
                          type: "success",
                        });

                        localStorage.setItem("token", data.token);
                        if (data.user.role == "admin") {
                          navigate("/admin/dashboard");
                        } else if (data.user.role == "waiter") {
                          navigate("/waiter");
                        } else if (data.user.role == "kitchen") {
                          navigate("/kot");
                        } else if (data.user.role == "reception") {
                          navigate("/reception");
                        } else {
                          navigate("/");
                        }
                      }
                    });
                    setLoading(false);
                  }}
                >
                  {({ errors, handleChange, handleSubmit }) => {
                    return (
                      <form className="w-10/12" onSubmit={handleSubmit}>
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
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Enter Email Address"
                          />
                          <p className="text-red-500 text-sm">{errors.email}</p>
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
                            className="outline-none rounded-full shadow-sm focus-visible:shadow-md px-4 py-2 border border-gray-400 focus-visible:border-gray-700 w-full"
                            placeholder="Enter password "
                          />
                          <p className="text-red-500 text-sm">
                            {errors.password}
                          </p>
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 my-5 disabled:bg-indigo-300 disabled:hover:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                          Login
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
    </>
  ) : (
    <h1>Loading....</h1>
  );
}

export default Login;
