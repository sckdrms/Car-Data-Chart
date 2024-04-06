import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

import '../css/DBChart.css';

const DBChartComponent = () => {
  const [chartData, setChartData] = useState({
    speed: {},
    rpm: {}, // RPM 차트 데이터를 위한 상태
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/car-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
  
        const groupedByMinute = {};
        rawData.forEach(item => {
          const time = moment(item.Timestamp, 'HH:mm:ss').startOf('minute').format('HH:mm');
          if (!groupedByMinute[time]) {
            groupedByMinute[time] = [];
          }
          groupedByMinute[time].push(item);
        });

        const labels = [];
        const speedAverages = [];
        const engineLoadAverages = []; // Engine Load 데이터를 위한 배열, 이전에 사용되었습니다.
        const rpmAverages = []; // RPM 데이터를 위한 새 배열

        Object.keys(groupedByMinute).forEach(time => {
          labels.push(time);
          const totalSpeed = groupedByMinute[time].reduce((sum, current) => sum + current.Speed, 0);
          const totalEngineLoad = groupedByMinute[time].reduce((sum, current) => sum + current.EngineLoad, 0);
          const totalRPM = groupedByMinute[time].reduce((sum, current) => sum + current.RPM, 0); // RPM 합계 계산

          speedAverages.push(totalSpeed / groupedByMinute[time].length);
          engineLoadAverages.push(totalEngineLoad / groupedByMinute[time].length); // 이전에 사용되었습니다.
          rpmAverages.push(totalRPM / groupedByMinute[time].length); // RPM 평균 계산
        });

        setChartData({
          labels,
          speed: {
            labels,
            datasets: [{
              label: 'Speed',
              data: speedAverages,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          rpm: {
            labels,
            datasets: [{
              label: 'RPM',
              data: rpmAverages,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }]
          }
        });
      } catch (error) {
        console.error("Fetching data error: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='DBchart' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100vh' }}>
      <div className='speedchart' style={{ gridArea: '2 / 1 / 3 / 3' }}>
        {chartData.speed.datasets && chartData.speed.datasets.length > 0 ? (
          <Line data={chartData.speed} />
        ) : (
          <p>Loading Speed data...</p>
        )}
      </div>
      <div className='rpmchart' style={{ gridArea: '2 / 3 / 3 / 5' }}>
        {chartData.rpm.datasets && chartData.rpm.datasets.length > 0 ? (
          <Line data={chartData.rpm} />
        ) : (
          <p>Loading RPM data...</p>
        )}
      </div>
    </div>
  );
};

export default DBChartComponent;
