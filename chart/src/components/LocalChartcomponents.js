import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Papa from 'papaparse';

const ChartComponent = () => {
  const [chartDatas, setChartDatas] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/data/car-data.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data;

        // '12:00:00'부터 5분 후까지의 데이터만 필터링
        const startTime = new Date(`1970-01-01T12:00:00Z`);
        const endTime = new Date(startTime.getTime() + 5 * 60000); // 5분 추가

        const filteredData = data.filter(d => {
          const currentTime = new Date(`1970-01-01T${d.Timestamp}Z`);
          return currentTime >= startTime && currentTime <= endTime;
        });

        const timestamps = filteredData.map(d => d.Timestamp);

        const fields = [
          'Speed', 'Engine Load', 'Coolant Temp', 'RPM', 'Intake Temp',
          'Throttle Pos', 'Timing Advance', 'Short Fuel Trim 1', 'Long Fuel Trim 1',
          'O2 B1S1', 'O2 B1S2', 'Safety Score', 'Distance', 'Rapid Acceleration', 'Rapid Deceleration'
        ];
        const colors = [
          'rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)',
          'rgb(255, 206, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)',
          'rgb(255, 159, 64)', 'rgb(199, 199, 199)', 'rgb(153, 159, 64)',
          'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(104, 132, 245)',
          'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)'
        ];

        const chartDatas = fields.map((field, index) => ({
          labels: timestamps,
          datasets: [{
            label: field,
            data: filteredData.map(d => d[field]),
            borderColor: colors[index],
            backgroundColor: `${colors[index]}4D`, // Add transparency
          }]
        }));

        setChartDatas(chartDatas);
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {chartDatas.length > 0 ? chartDatas.map((chartData, index) => (
        <div key={index} style={{ width: '1080px', height: '720px', marginBottom: '20px', border: '1px solid black', boxSizing: 'border-box', margin: 'auto' }}>
          <Line data={chartData} />
        </div>
      )) : <div>Loading...</div>}
    </div>
  );
};

export default ChartComponent;
