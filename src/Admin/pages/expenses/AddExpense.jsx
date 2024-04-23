import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { number, object, string } from "yup";
import { APIURL } from "../../../constants/ApiConstants";

const AddExpenses = () => {
  const expenseSchema = object({
    particulars: string().required("Particulars is required"),
    amount: number().required("Amount is required"),
    bill_no: string().required("Bill No is required"),
    bill_date: string().required("Bill Date is required"),
    dealer_id: number().required("Dealer is required"),
  });

  // Data Fetching
  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => res.json());

  const { data: dealerData, error: dealerError } = useSWR(
    APIURL + "dealers",
    fetcher
  );

  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div>
          <h1 className="text-lg font-bold">Expenses Add</h1>
          <p className="text-sm">Add new expensees</p>
        </div>
        <Formik
          validateOnChange={false}
          initialValues={{
            particulars: "",
            amount: "",
            bill_no: "",
            bill_date: "",
            dealer_id: "",
          }}
          validationSchema={expenseSchema}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("particulars", values.particulars);
            formData.append("amount", values.amount);
            formData.append("bill_no", values.bill_no);
            formData.append("bill_date", values.bill_date);
            formData.append("dealer_id", values.dealer_id);

            const res = await fetch(APIURL + "expenses", {
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
                navigate("/admin/expenses");
              }
            });
          }}
        >
          {({ errors, handleChange, handleSubmit, setFieldValue, values }) => {
            return (
              <div className="w-full py-5  border rounded-xl mt-6 bg-white">
                <form onSubmit={handleSubmit} className="m-5">
                  <div className="mt-4">
                    <label htmlFor="bill_date" className="text-sm">
                      Bill Date
                    </label>
                    <input
                      type="date"
                      name="bill_date"
                      id="bill_date"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">{errors.bill_date}</p>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="bill_no" className="text-sm">
                      Bill Number
                    </label>
                    <input
                      type="text"
                      name="bill_no"
                      id="bill_no"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">{errors.bill_no}</p>
                  </div>


                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="particulars" className="text-sm">
                        Particulars
                      </label>
                      <input
                        type="text"
                        name="particulars"
                        id="particulars"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                      />
                      <p className="text-sm text-red-500 mt-1">
                        {errors.particulars}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="dealer_id" className="text-sm">
                        Dealer
                      </label>
                      <select
                        name="dealer_id"
                        id="dealer_id"
                        onChange={handleChange}
                        className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3 text-sm"
                      >
                        <option>--Select Dealer--</option>
                        {!dealerData ? (
                          <></>
                        ) : (
                          dealerData.data.map((dealer) => {
                            return (
                              <option value={dealer.id} key={dealer.id}>
                                {dealer.name}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <p className="text-sm text-red-500 mt-1">
                        {errors.dealer_id}
                      </p>
                    </div>
                  </div>


                  <div className="mt-4">
                    <label htmlFor="amount" className="text-sm">
                      Amount
                    </label>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      onChange={handleChange}
                      className="w-full py-2 rounded-lg border outline-none focus:border-[#f0a151] mt-2 pl-3"
                    />
                    <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                  </div>



                  <div className="mt-8 flex  items-center gap-4">
                    <button
                      type="submit"
                      className="bg-[#f0a151] hover:bg-[#f1ba83] text-white py-2 px-4 rounded-full shadow-md"
                    >
                      Add Expenses
                    </button>

                    <button
                      onClick={() => navigate("/admin/expenses")}
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

export default AddExpenses;
