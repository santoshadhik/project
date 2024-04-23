

import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import useSWR from "swr";
import { APIURL } from "../../../constants/ApiConstants";
import DashboardCard from "../../components/DashboardCard";
ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const fetcher = (...args) => fetch(...args, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  }).then(res => res.json());

  const { data, error } = useSWR(APIURL + 'dashboard', fetcher);
  if (data) {

    //Most Used Table
    const dougData = {
      labels: data.mostUsedTable.lables,
      datasets: [
        {
          label: 'Most Order: ',
          data: data.mostUsedTable.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    //Most sold Products 
    const mostSoldData = {
      labels: data.mostSoldProduct.lables,
      datasets: [
        {
          label: 'Appear in Bill',
          data: data.mostSoldProduct.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    //monthlySales
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Sales',
        },
      },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //Sort monthly sales
    data.monthlySales.sort((a, b) => {
      return a.month - b.month;
    });

    data.monthlyExpenses.sort((a, b) => {
      return a.month - b.month;
    });

    const monthlyValues = data.monthlySales.map((item) => item.total);
    const monthlyExpenses = data.monthlyExpenses.map((item) => item.total);

    const monthlyData = {
      labels,
      datasets: [
        {
          label: 'Total Revenue',
          data: monthlyValues,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Total Expenses',
          data: monthlyExpenses,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ],


    };
    return (
      <div>
        <div className="flex-wrap flex gap-5">
          {/* Total Revenye Box */}
          <DashboardCard color="orange" value={'Rs ' + data.todayRevenue} title="Today Revenue" />

          {/* Total Expenses Card */}
          <DashboardCard color="red" value={data.todayExpenses} title="Today Expenses" />

          {/* TotalProduct Card */}
          <DashboardCard color="blue" value={data.totalProduct} title="Total Products" />

          {/* TotalCategory Card */}
          <DashboardCard color="red" value={data.totalCategory} title="Total Category" />

        </div>

        {/* Months revenue cahrt */}
        <div className='my-10'>
          <Line options={options} data={monthlyData} />
        </div>

        {/* Most used Table */}
        <div className='w-12/12 mb-3 mt-10 grid grid-cols-2'>
          <div>
            <p className='text-lg font-bold text-center'>
              Most Used Table
            </p>
            <Doughnut
              data={dougData}
            />
          </div>

          {/* Most Selled Product */}
          <div>
            <p className='text-lg font-bold text-center'>
              Most Billed Product
            </p>
            <Pie
              data={mostSoldData}
            />
          </div>


        </div>
      </div>
    );
  }
};

export default Dashboard;
