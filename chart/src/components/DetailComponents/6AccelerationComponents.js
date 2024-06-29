import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/6AccelerationComponents.css';

function AccelerationComponent() {
  const [extraspeed, setExtraspeed] = useState(7); // 급가속 기준: 7 km/h 증가
  const [extraspeedcount, setExtraspeedcount] = useState(0);
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    // car-data 엔드포인트에서 데이터 가져오기
    fetch('/car-data')
      .then(response => response.json())
      .then(data => setCarData(data))
      .catch(error => console.error('Error fetching car data:', error));
  }, []);

  useEffect(() => {
    if (carData && carData.length > 1) {
      let rapidAccelCount = 0;
      for (let i = 1; i < carData.length; i++) {
        const previousSpeed = parseFloat(carData[i - 1].Speed);
        const currentSpeed = parseFloat(carData[i].Speed);
        const timeDifference = new Date(carData[i].Timestamp).getTime() - new Date(carData[i - 1].Timestamp).getTime();
        
        // 시간 차이가 1초인지 확인 및 현재 속도가 20km/h 이상인지 확인
        if (timeDifference === 1000 && previousSpeed !== "N/A" && previousSpeed >= 20) {
          const speedIncrease = currentSpeed - previousSpeed;
          if (speedIncrease >= extraspeed) {
            rapidAccelCount++;
          }
        }
      }
      setExtraspeedcount(rapidAccelCount);
    }
  }, [carData, extraspeed]);

  return (
    <div className='componentname'>
      <p>급가속 횟수</p>
      <p className='acceleration'>기준 1초당 {extraspeed}km/h 증가 {extraspeedcount}회</p>
    </div>
  );
}

export default AccelerationComponent;