import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { APIURL } from "../../constants/ApiConstants";

const RequestModal = () => {
  const kitchenSchema = object({
    description: string().required("Description is required"),
  });

  const navigate = useNavigate();

  return (
    <>
      <div>
        {/* KOT EDIT REQUEST */}
        <Formik
          initialValues={{ description: "" }}
          validationSchema={kitchenSchema}
          validateOnChange={false}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("description", values.description);
            fetch(APIURL + "kitchen", {
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
                  navigate("/kot/myrequest");
                }
              });
            });
          }}
        >
          {({ errors, handleChange, handleSubmit }) => {
            return (
              <div className="max-w-[1080px] mx-auto  w-full py-5  border rounded-xl mt-20 bg-white">
                <h1 className="text-2xl mx-5 font-bold">KOT REQUEST</h1>
                <form onSubmit={handleSubmit} className="m-5">
                  <div>
                    <label htmlFor="description" className="text-lg font-bold">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Description"
                      onChange={handleChange}
                      cols="8"
                      rows="6"
                      className="block w-full py-2 rounded-lg focus:outline-none bg-gray-200 pl-3"
                    ></textarea>
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
};

export default RequestModal;
