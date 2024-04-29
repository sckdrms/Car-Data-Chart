import  { React, useState } from 'react';

import '../../css/Detailcomponents/5SpeedComponents.css'

function SpeedComponent(){
  let [maxspeed, setmaxspeed] = useState()
  let [avgspeed, setavgspeed] = useState()
  return(
    <div className='componentname'>
      <p>속도</p>
      <p className='max-speed'>최댓값:</p>
      <p className='max-speed-per'>{maxspeed}km/h</p>
      <p className='avg-speed'>평균값:</p>
      <p className='avg-speed-per'>{avgspeed}km/h</p>
    </div>
  )
}

export default SpeedComponent