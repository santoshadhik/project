import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

const AddDealer = () => {
  const dealerSchema = object({
    name: string().required("Dealer name is required"),
    phone: string().required("Phone is required"),
    address: string().required("Address is required"),
  });



  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div>
          <h1 className="text-lg font-bold">Add  New Dealer</h1>
        </div>
        <Formik
          validateOnChange={false}
          initialValues={{
            name: "",
            phone: "",
            address: "",
          }}
          validationSchema={dealerSchema}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("phone", values.phone);
            formData.append("address", values.address);

            const res = await fetch(APIURL + "dealers", {
              method: "post",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            res.json().then((data) => {
              if (data.status) {
                toast(data.message, {
                  type: "success",
                });
                navigate("/admin/dealers");
              }
            });
          }}
        >
          {({ errors, handleChange, handleSubmit, setFieldValue, values }) => {
            return (
              <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                <form onSubmit={handleSubmit} className="m-5">

                  {/* dealer Name */}
                  <div>
                    <label htmlFor="name" className="text-sm">
                      Dealer Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name}
                    </p>
                  </div>

                  {/* Dealer Phone */}
                  <div>
                    <label htmlFor="phone" className="text-sm">
                      Dealer Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  </div>

                  {/* Dealer Address */}
                  <div>
                    <label htmlFor="address" className="text-sm">
                      Dealer Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">
                      {errors.address}
                    </p>
                  </div>

                  <div className="mt-8 flex  items-center gap-4">
                    <button
                      type="submit"
                      className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                    >
                      Add Dealer
                    </button>

                    <button
                      onClick={() => navigate("/admin/dealers")}
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
};

export default AddDealer;
