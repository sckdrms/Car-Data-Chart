import  { React, useState } from 'react';

import '../../css/Detailcomponents/1DIstanceComponents.css'

function DIstanceComponent(){
  let [currentdistance, setcurrentdistance] = useState()
  let [totaldistance, settotaldistance] = useState()
  return(
    <div className='componentname'>
      <p>주행 거리</p>
      <p className='currentdistance'>{currentdistance}km</p>
      <p className='totaldistance-title'>누적 주행 거리</p>
      <p className='totaldistance'>{totaldistance}km</p>
    </div>
  )
}

export default DIstanceComponent