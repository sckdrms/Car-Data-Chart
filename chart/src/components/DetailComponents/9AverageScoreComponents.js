import React, { useContext, useEffect, useState } from 'react';
import '../../css/Detailcomponents/9AverageScoreComponents.css';
import { DriverScoreContext } from './8DriverScoreComponents';

function AverageScoreComponent() {
  const { scores } = useContext(DriverScoreContext);
  const [avgDriveScore, setAvgDriveScore] = useState(0);

  useEffect(() => {
    if (scores && scores.length > 0) {
      const totalScore = scores.reduce((acc, score) => acc + score, 0);
      setAvgDriveScore(totalScore / scores.length);
    }
  }, [scores]);

  return (
    <div className='componentname'>
      <p>평균 점수</p>
      <p className='avg-drive-score'>{avgDriveScore.toFixed(2)}점</p>
    </div>
  );
}

export default AverageScoreComponent;
