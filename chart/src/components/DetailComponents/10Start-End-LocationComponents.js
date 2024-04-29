import { React, useState } from 'react';

import '../../css/Detailcomponents/10Start-End-LocationComponents.css'

function StartEndLocationComponent(){
  let [startlocation, setstartlocation] = useState()
  let [endlocation, setendlocation] = useState()
  return(
    <div className='componentname'>
      <p className='start-location-title'>출발 위치</p>
      <p className='start-location'>{startlocation}출발</p>
      <p className='end-location-title'>도착 위치</p>
      <p className='end-location'>{endlocation}도착</p>
      <button className='map-button'><a href="#" className='map-button-text'>이동 지도 보기</a></button>
    </div>
  )
}

export default StartEndLocationComponent