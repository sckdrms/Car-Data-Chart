import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

import '../css/DBChart.css';

const DBChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/car-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();

        const groupedBySecond = {};
        rawData.forEach(item => {
          const time = moment(item.Timestamp).format('YYYY-MM-DD HH:mm:ss');
          if (!groupedBySecond[time]) {
            groupedBySecond[time] = [];
          }
          groupedBySecond[time].push(item);
        });

        const labels = [];
        const speedAverages = [];
        const rpmAverages = [];
        const engineLoadAverages = [];

        Object.keys(groupedBySecond).forEach(time => {
          labels.push(time);
          const totalSpeed = groupedBySecond[time].reduce((sum, current) => sum + parseInt(current.Speed), 0);
          const totalEngineLoad = groupedBySecond[time].reduce((sum, current) => sum + parseFloat(current.EngineLoad), 0);
          const totalRPM = groupedBySecond[time].reduce((sum, current) => sum + parseInt(current.RPM), 0);
        
          speedAverages.push(totalSpeed / groupedBySecond[time].length);
          engineLoadAverages.push(totalEngineLoad / groupedBySecond[time].length);
          rpmAverages.push(totalRPM / groupedBySecond[time].length);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Speed',
              data: speedAverages,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'RPM',
              data: rpmAverages,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
            {
              label: 'Engine Load',
              data: engineLoadAverages,
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error("Fetching data error: ", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className='DBChartBox' style={{ }}>
      {chartData.datasets && chartData.datasets.length > 0 ? (
        <div className='DBchart'>
        <Line data={chartData} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default DBChartComponent;
