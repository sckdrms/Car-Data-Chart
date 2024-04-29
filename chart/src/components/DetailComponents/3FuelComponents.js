import  { React, useState } from 'react';

import '../../css/Detailcomponents/3FuelComponents.css'

function FuelComponent(){
  let [maxfuelper, setmaxfuelper] = useState()
  let [minfuelper, setminfuelper] = useState()
  let [avgfuelper, setavgfuelper] = useState()
  return(
    <div className='componentname'>
      <p>연료 공급량</p>
      <p className='max-fuel'>최댓값:</p>
      <p className='max-fuel-per'>{maxfuelper}%</p>
      <p className='min-fuel'>최솟값:</p>
      <p className='min-fuel-per'>{minfuelper}%</p>
      <p className='avg-fuel'>평균값:</p>
      <p className='avg-fuel-per'>{avgfuelper}%</p>
    </div>
  )
}

export default FuelComponent