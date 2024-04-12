// DBChartComponents.js
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
        const throttlePosAverages = [];
        const engineLoadAverages = [];
    
        Object.keys(groupedBySecond).forEach(time => {
          labels.push(time);
          const totalSpeed = groupedBySecond[time].reduce((sum, current) => sum + parseInt(current.Speed), 0);
          const totalRPM = groupedBySecond[time].reduce((sum, current) => sum + parseInt(current.RPM), 0);
          const totalThrottlePos = groupedBySecond[time].reduce((sum, current) => sum + parseFloat(current.ThrottlePos), 0); // 수정 필요
          const totalEngineLoad = groupedBySecond[time].reduce((sum, current) => sum + parseFloat(current.EngineLoad), 0);
    
          speedAverages.push(totalSpeed / groupedBySecond[time].length);
          rpmAverages.push(totalRPM / groupedBySecond[time].length);
          throttlePosAverages.push(totalThrottlePos / groupedBySecond[time].length); // 여기를 수정
          engineLoadAverages.push(totalEngineLoad / groupedBySecond[time].length);
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
              label: 'Throttle Pos',
              data: throttlePosAverages,
              borderColor: 'rgb(154, 162, 235)',
              tension: 0.1
            },
            {
              label: 'Engine Load',
              data: engineLoadAverages,
              borderColor: 'rgb(54, 255, 20)',
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
      <div className='speedchart'>
        {chartData.datasets && chartData.datasets.length > 0 ? (
          <Line data={{
            labels: chartData.labels,
            datasets: [chartData.datasets[0]]
          }} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className='rpmchart'>
        {chartData.datasets && chartData.datasets.length > 0 ? (
          <Line data={{
            labels: chartData.labels,
            datasets: [chartData.datasets[1]]
          }} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className='throttleposchart'>
        {chartData.datasets && chartData.datasets.length > 0 ? (
          <Line data={{
            labels: chartData.labels,
            datasets: [chartData.datasets[2]]
          }} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className='engineloadchart'>
        {chartData.datasets && chartData.datasets.length > 0 ? (
          <Line data={{
            labels: chartData.labels,
            datasets: [chartData.datasets[3]]
          }} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default DBChartComponent;
