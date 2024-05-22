import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SalesChartProps {
  userId?: string;
}

const UserChart: React.FC<SalesChartProps> = ({ userId }) => {
  const [salesData, setSalesData] = useState<{ month: string, orders_count: number }[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      setChartData(null);
      setSalesData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const url = `http://localhost:3001/analizing/user/${userId}`;
        const response = await axios.get(url);
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data', error);
        setChartData(null);
        setSalesData([]);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (salesData.length > 0) {
      const labels = salesData.map(data => data.month);
      const data = salesData.map(data => data.orders_count);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Orders',
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    } else {
      setChartData({
        labels: [],
        datasets: [
          {
            label: 'Number of Orders',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [salesData]);

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Sales Data for selected user</h2>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>No data available. Please select a user.</p>
      )}
    </div>
  );
};

export default UserChart;
