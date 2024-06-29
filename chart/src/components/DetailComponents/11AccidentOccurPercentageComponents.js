import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../css/Detailcomponents/11AccidentOccurPercentageComponents.css';
import { calculateRapidAccelCount, calculateRapidDecelCount } from './8DriverScoreComponents'; // 필요한 함수 임포트

function AccidentOccurPercentageComponent() {
  const [carData, setCarData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [accidentProbability, setAccidentProbability] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [conditionCounts, setConditionCounts] = useState({
    rpm: 0,
    speed: 0,
    throttlePos: 0,
    engineLoad: 0,
    rapidAccelCount: 0,
    rapidDecelCount: 0
  });

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/car-data');
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };

    const interval = setInterval(() => {
      fetchCarData();
    }, 1000); // 1초마다 데이터 갱신

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carData && carData.length > 0) {
      const calculateAccidentProbability = (data) => {
        let totalProbability = 0;
        let conditionCounts = {
          rpm: 0,
          speed: 0,
          throttlePos: 0,
          engineLoad: 0,
          rapidAccelCount: 0,
          rapidDecelCount: 0
        };

        const rapidAccelCount = calculateRapidAccelCount(data);
        const rapidDecelCount = calculateRapidDecelCount(data);

        data.forEach(d => {
          const rpm = parseFloat(d.RPM !== "N/A" ? d.RPM : 0);
          const speed = parseFloat(d.Speed !== "N/A" ? d.Speed : 0);
          const throttlePos = parseFloat(d.ThrottlePos !== "N/A" ? d.ThrottlePos : 0);
          const engineLoad = parseFloat(d.EngineLoad !== "N/A" ? d.EngineLoad : 0);

          let probability = 0;

          if (rpm > 3000) {
            probability += 10;
            conditionCounts.rpm += 1;
          }
          if (speed > 100) {
            probability += 20;
            conditionCounts.speed += 1;
          }
          if (throttlePos > 70) {
            probability += 15;
            conditionCounts.throttlePos += 1;
          }
          if (engineLoad > 80) {
            probability += 15;
            conditionCounts.engineLoad += 1;
          }
          if (rapidAccelCount > 0) {
            probability += 5 * rapidAccelCount;
            conditionCounts.rapidAccelCount = rapidAccelCount;
          }
          if (rapidDecelCount > 0) {
            probability += 5 * rapidDecelCount;
            conditionCounts.rapidDecelCount = rapidDecelCount;
          }

          totalProbability += probability;
        });

        setAccidentProbability(totalProbability / data.length);
        setConditionCounts(conditionCounts);
      };

      const processedData = carData.map(d => ({
        time: new Date(d.Timestamp).toLocaleTimeString(),
        rpm: parseFloat(d.RPM !== "N/A" ? d.RPM : 0),
        speed: parseFloat(d.Speed !== "N/A" ? d.Speed : 0),
        throttlePos: parseFloat(d.ThrottlePos !== "N/A" ? d.ThrottlePos : 0),
        engineLoad: parseFloat(d.EngineLoad !== "N/A" ? d.EngineLoad : 0),
        rapidAccelCount: calculateRapidAccelCount(carData),
        rapidDecelCount: calculateRapidDecelCount(carData),
      }));

      calculateAccidentProbability(carData);

      const labels = processedData.map(d => d.time);
      const rpmData = processedData.map(d => d.rpm);
      const speedData = processedData.map(d => d.speed);
      const throttleData = processedData.map(d => d.throttlePos);
      const loadData = processedData.map(d => d.engineLoad);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'RPM',
            data: rpmData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
          {
            label: 'Speed',
            data: speedData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
          {
            label: 'Throttle Position',
            data: throttleData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: 'Engine Load',
            data: loadData,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: true,
          }
        ]
      });
    }
  }, [carData]);

  return (
    <div className='componentname' style={{ height: '300px', position: 'relative' }}>
      <p>사고 발생 조건</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>사고 발생 확률: {accidentProbability.toFixed(2)}%</p>
        <button 
          onMouseEnter={() => setShowTooltip(true)} 
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          style={{
            marginLeft: '10px', 
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: 'blue',
            textDecoration: 'underline',
            fontSize: '16px'
          }}
        >
          ?
        </button>
      </div>
      {showTooltip && (
        <div className='tooltip' style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#fff', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, borderRadius: '5px', color: 'black', width: '300px', textAlign: 'left' }}>
          <p><strong>사고 발생 확률 계산식:</strong></p>
          <ul>
            <li>사고 발생 확률은 특정 조건을 만족할 때마다 증가합니다.</li>
            <li>RPM이 3000을 초과하면 사고 확률이 10% 증가합니다.</li>
            <li>Speed가 100을 초과하면 사고 확률이 20% 증가합니다.</li>
            <li>Throttle Position이 70을 초과하면 사고 확률이 15% 증가합니다.</li>
            <li>Engine Load가 80을 초과하면 사고 확률이 15% 증가합니다.</li>
            <li>Rapid Accelerations: 5% 증가 (per occurrence)</li>
            <li>Rapid Decelerations: 5% 증가 (per occurrence)</li>
            <li>위의 조건을 만족하는 데이터가 많을수록 사고 발생 확률이 높아집니다.</li>
          </ul>
          <p><strong>사고 발생 확률 조건에 부합한 데이터의 횟수:</strong></p>
          <ul>
            <li>RPM &gt; 3000: {conditionCounts.rpm}회</li>
            <li>Speed &gt; 100: {conditionCounts.speed}회</li>
            <li>Throttle Position &gt; 70: {conditionCounts.throttlePos}회</li>
            <li>Engine Load &gt; 80: {conditionCounts.engineLoad}회</li>
            <li>Rapid Accelerations: {conditionCounts.rapidAccelCount}회</li>
            <li>Rapid Decelerations: {conditionCounts.rapidDecelCount}회</li>
          </ul>
        </div>
      )}
      {chartData.labels ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            }
          }}
          height={300}
        />
      ) : (
        <p>데이터를 불러오는 중...</p>
      )}
    </div>
  );
}

export default AccidentOccurPercentageComponent;

