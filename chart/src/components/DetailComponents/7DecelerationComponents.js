import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/7DecelerationComponents.css';

function DecelerationComponent() {
  const [leakspeed, setLeakspeed] = useState(9); // 급감속 기준: 10 km/h 감소
  const [leakspeedcount, setLeakspeedcount] = useState(0);
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
      let rapidDecelCount = 0;
      for (let i = 1; i < carData.length; i++) {
        const previousSpeed = parseFloat(carData[i - 1].Speed);
        const currentSpeed = parseFloat(carData[i].Speed);
        const timeDifference = new Date(carData[i].Timestamp).getTime() - new Date(carData[i - 1].Timestamp).getTime();
        
        // 시간 차이가 1초인지 확인
        if (timeDifference === 1000) {
          const speedDecrease = previousSpeed - currentSpeed;
          if (speedDecrease >= leakspeed) {
            rapidDecelCount++;
          }
        }
      }
      setLeakspeedcount(rapidDecelCount);
    }
  }, [carData, leakspeed]);

  return (
    <div className='componentname'>
      <p>급감속 횟수</p>
      <p className='deceleration'>기준 초당 {leakspeed}km/h 감소 {leakspeedcount}회</p>
    </div>
  );
}

export default DecelerationComponent;
