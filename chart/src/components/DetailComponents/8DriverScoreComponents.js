import React, { useState, useEffect, useContext, createContext } from 'react';
import '../../css/Detailcomponents/8DriverScoreComponents.css';

export const DriverScoreContext = createContext();

export const calculateRapidAccelCount = (data) => {
  let rapidAccelCount = 0;
  for (let i = 1; i < data.length; i++) {
    const previousSpeed = parseFloat(data[i - 1].Speed);
    const currentSpeed = parseFloat(data[i].Speed);
    const timeDifference = new Date(data[i].Timestamp).getTime() - new Date(data[i - 1].Timestamp).getTime();

    if (timeDifference === 1000 && previousSpeed >= 20) {
      const speedIncrease = currentSpeed - previousSpeed;
      if (speedIncrease >= 7) {
        rapidAccelCount++;
      }
    }
  }
  return rapidAccelCount;
};

export const calculateRapidDecelCount = (data) => {
  let rapidDecelCount = 0;
  for (let i = 1; i < data.length; i++) {
    const previousSpeed = parseFloat(data[i - 1].Speed);
    const currentSpeed = parseFloat(data[i].Speed);
    const timeDifference = new Date(data[i].Timestamp).getTime() - new Date(data[i - 1].Timestamp).getTime();

    if (timeDifference === 1000) {
      const speedDecrease = previousSpeed - currentSpeed;
      if (speedDecrease >= 9) {
        rapidDecelCount++;
      }
    }
  }
  return rapidDecelCount;
};

function DriverScoreComponent() {
  const [currentDriveScore, setCurrentDriveScore] = useState(100);
  const [accelerationCount, setAccelerationCount] = useState(0);
  const [decelerationCount, setDecelerationCount] = useState(0);
  const [carData, setCarData] = useState([]);
  const { scores, setScores } = useContext(DriverScoreContext);

  const calculateDrivingScore = (speed, rpm, load, throttlePos, rapidAccelCount, rapidDecelCount) => {
    let drivingScore = 100;
    const speedWeight = 0.1, rpmWeight = 0.1, loadWeight = 0.1, throttlePosWeight = 0.1;

    if (speed !== "N/A" && speed >= 80) {
      const speedRatio = (speed - 20) / 80;
      drivingScore -= Math.sqrt(speedRatio) * speedWeight;
    }

    if (rpm !== "N/A" && rpm >= 2500) {
      const rpmRatio = (rpm - 1800) / 2000;
      drivingScore -= Math.sqrt(rpmRatio) * rpmWeight;
    }

    if (load !== "N/A" && load >= 50) {
      const loadRatio = (load - 35) / 65;
      drivingScore -= Math.sqrt(loadRatio) * loadWeight;
    }

    if (throttlePos !== "N/A" && throttlePos >= 30) {
      const throttlePosRatio = (throttlePos - 25) / 75;
      drivingScore -= Math.sqrt(throttlePosRatio) * throttlePosWeight;
    }

    drivingScore -= rapidAccelCount;
    drivingScore -= rapidDecelCount;

    return Math.max(drivingScore, 0);
  };

  const checkAndUpdateDrivingScore = (speed, rpm, load, throttlePos, rapidAccelCount, rapidDecelCount) => {
    const newScore = calculateDrivingScore(speed, rpm, load, throttlePos, rapidAccelCount, rapidDecelCount);
    setCurrentDriveScore(newScore);
    setScores((prevScores) => [...prevScores, newScore]);
  };

  useEffect(() => {
    fetch('/car-data')
      .then(response => response.json())
      .then(data => {
        setCarData(data);
        if (data.length > 0) {
          const { Speed: speed, RPM: rpm, EngineLoad: load, ThrottlePos: throttlePos } = data[data.length - 1];
          const rapidAccelCount = calculateRapidAccelCount(data);
          const rapidDecelCount = calculateRapidDecelCount(data);
          setAccelerationCount(rapidAccelCount);
          setDecelerationCount(rapidDecelCount);
          checkAndUpdateDrivingScore(parseFloat(speed), parseFloat(rpm), parseFloat(load), parseFloat(throttlePos), rapidAccelCount, rapidDecelCount);
        }
      })
      .catch(error => console.error('Error fetching car data:', error));
  }, []);

  return (
    <div className='componentname'>
      <p>운전자 점수</p>
      <p className='current-drive-score-title'>현재 운전자 점수</p>
      <p className='current-drive-score'>{currentDriveScore}점</p>
      <p className='deduction-title'>감점 사유</p>
      <p className='deduction-acceleration'>기준 1초당 7km/h 증가 {accelerationCount}회</p>
      <p className='deduction-deceleration'>기준 1초당 9km/h 감소 {decelerationCount}회</p>
    </div>
  );
}

export default DriverScoreComponent;
