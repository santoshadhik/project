import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { object, string } from "yup";
import { APIURL } from "../../constants/ApiConstants";
import ServerError from "../../pages/ServerError";
import KotLayout from "../layouts/KotLayout";

const EditRequestModal = () => {
  const kitchenSchema = object({
    description: string().required("Description is required"),
  });

  const params = useParams();
  const navigate = useNavigate();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data, error, mutate } = useSWR(
    `${APIURL}kitchen/${params.id}`,
    fetcher
  );
  if (error) {
    <ServerError />;
  }

  //*Show Loading
  if (!data && !error) {
    return <KotLayout />;
  }

  if (data) {
    return (
      <>
        <div>
          {/* KOT EDIT REQUEST */}
          <Formik
            initialValues={{
              description: data.data.description,
            }}
            validateOnChange={false}
            validationSchema={kitchenSchema}
            onSubmit={async (values) => {
              const response = await fetch(`${APIURL}kitchen/${data.data.id}`, {
                method: "PUT",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              response.json().then((data) => {
                if (data.status) {
                  toast(data.message, {
                    type: "success",
                  });
                  navigate("/kot/myrequest");
                }
              });
              mutate();
            }}
          >
            {({ errors, handleChange, handleSubmit, values }) => {
              return (
                <div className="max-w-[1080px] mx-auto  w-full py-5  border rounded-xl mt-20 bg-white">
                  <h1 className="text-2xl mx-5 font-bold">Edit KOT REQUEST</h1>
                  <form onSubmit={handleSubmit} className="m-5">
                    <div>
                      <label htmlFor="description" className="text-sm">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        cols="8"
                        rows="6"
                        onChange={handleChange}
                        value={values.description}
                        className="w-full py-2 rounded-lg border focus:outline focus:outline-[#f0a151] mt-2 pl-3"
                      ></textarea>
                      <input
                        type="text"
                        name="category_name"
                        id="category_name"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description}
                      </p>
                    </div>

                    <div className="mt-8 flex  items-center gap-4">
                      <button
                        type="submit"
                        className="bg-[#225fa2] hover:bg-[#5980aa] text-white py-2 px-4 rounded-full shadow-md"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => navigate("/kot/myrequest")}
                        className="bg-[#b52739] hover:bg-[#c25b67] text-white py-2 px-4 rounded-full shadow-md"
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
      </>
    );
  }
};

export default EditRequestModal;
