import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const DBChartComponent = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/car-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 서버로부터 받은 데이터를 차트 데이터 형식으로 변환
        const timestamps = data.map(item => item.Timestamp);
        const speeds = data.map(item => item.Speed);
        const engineLoads = data.map(item => item.EngineLoad);
        // ... 다른 데이터도 이와 같은 방식으로 매핑합니다.

        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: 'Speed',
              data: speeds,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Engine Load',
              data: engineLoads,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
            // ... 다른 데이터셋을 여기에 추가합니다.
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
