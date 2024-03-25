import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

const DBChartComponent = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/car-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
  
        // 데이터를 분(minute) 별로 그룹화합니다.
        const groupedByMinute = {};
        rawData.forEach(item => {
          // 타임스탬프를 분으로 변환합니다.
          const time = moment(item.Timestamp, 'HH:mm:ss').startOf('minute').format('HH:mm');
          if (!groupedByMinute[time]) {
            groupedByMinute[time] = [];
          }
          groupedByMinute[time].push(item);
        });
  
        // 각 분에 대한 평균 속도와 엔진 부하를 계산합니다.
        const labels = [];
        const speedAverages = [];
        const engineLoadAverages = [];
  
        Object.keys(groupedByMinute).forEach(time => {
          labels.push(time);
          const totalSpeed = groupedByMinute[time].reduce((sum, current) => sum + current.Speed, 0);
          const totalEngineLoad = groupedByMinute[time].reduce((sum, current) => sum + current.EngineLoad, 0);
          speedAverages.push(totalSpeed / groupedByMinute[time].length);
          engineLoadAverages.push(totalEngineLoad / groupedByMinute[time].length);
        });
  
        // 차트 데이터를 설정합니다.
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
              label: 'Engine Load',
              data: engineLoadAverages,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
          ]
        });
  
      } catch (error) {
        console.error("Fetching data error: ", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <div>Loading chart...</div>
      )}
    </div>
  );
};

export default DBChartComponent;
