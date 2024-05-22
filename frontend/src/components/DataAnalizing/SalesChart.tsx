import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSalesData } from './contex/SalesDataContext';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart: React.FC = () => {
  const { salesData } = useSalesData();
  const [chartData, setChartData] = useState<any>(null);

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
    }
  }, [salesData]);

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Sales Data</h2>
      {chartData && (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default SalesChart;
