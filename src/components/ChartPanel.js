import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

const ChartPanel = ({ data, chartType, xAxis, yAxis }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (data.length > 0 && xAxis && yAxis) {
      prepareChartData();
    }
  }, [data, chartType, xAxis, yAxis]);

  const prepareChartData = () => {
    // For pie charts, we need to aggregate the data
    if (chartType === 'pie') {
      const aggregatedData = {};
      
      data.forEach(item => {
        const key = item[xAxis];
        if (key) {
          if (!aggregatedData[key]) {
            aggregatedData[key] = 0;
          }
          aggregatedData[key] += Number(item[yAxis]) || 0;
        }
      });
      
      const labels = Object.keys(aggregatedData);
      const values = Object.values(aggregatedData);
      
      // Generate random colors for each segment
      const backgroundColors = labels.map(() => 
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
      );
      
      setChartData({
        labels,
        datasets: [
          {
            label: yAxis,
            data: values,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 1,
          },
        ],
      });
    } 
    // For scatter plots
    else if (chartType === 'scatter') {
      const scatterData = data.map(item => ({
        x: Number(item[xAxis]) || 0,
        y: Number(item[yAxis]) || 0,
      }));
      
      setChartData({
        datasets: [
          {
            label: `${xAxis} vs ${yAxis}`,
            data: scatterData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      });
    }
    // For bar and line charts
    else {
      // Get unique x-axis values and sort them
      const uniqueXValues = [...new Set(data.map(item => item[xAxis]))];
      
      // Aggregate y values for each x value
      const aggregatedData = {};
      uniqueXValues.forEach(x => {
        aggregatedData[x] = 0;
      });
      
      data.forEach(item => {
        const x = item[xAxis];
        if (x && aggregatedData.hasOwnProperty(x)) {
          aggregatedData[x] += Number(item[yAxis]) || 0;
        }
      });
      
      const sortedLabels = Object.keys(aggregatedData);
      const values = sortedLabels.map(label => aggregatedData[label]);
      
      setChartData({
        labels: sortedLabels,
        datasets: [
          {
            label: yAxis,
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  };

  const renderChart = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${yAxis} by ${xAxis}`,
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} height={300} />;
      case 'line':
        return <Line data={chartData} options={options} height={300} />;
      case 'pie':
        return <Pie data={chartData} options={options} height={300} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} height={300} />;
      default:
        return <Bar data={chartData} options={options} height={300} />;
    }
  };

  return (
    <Card className="chart-container mb-4">
      <Card.Body>
        <Card.Title>Data Visualization</Card.Title>
        <div style={{ height: '400px' }}>
          {data.length > 0 && xAxis && yAxis ? (
            renderChart()
          ) : (
            <div className="text-center p-5">
              <p>Select axes to visualize data</p>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartPanel;