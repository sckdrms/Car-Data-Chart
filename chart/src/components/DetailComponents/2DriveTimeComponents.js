import  { React, useState } from 'react';

import '../../css/Detailcomponents/2DriveTimeComponents.css'

function DriveTimeComponent(){
  let [drivestarttime, setdrivestarttime] = useState()
  let [driveendtime, setdriveendtime] = useState()
  let [totaldrivetime, settotaldrivetime] = useState()
  let [collisiontime, setcollisiontime] = useState()
  return(
    <div className='componentname '>
      <p>운행 시간</p>
      <p className='drivestarttime-title'>운행 시작 시간: </p>
      <p className='drivestarttime'>{drivestarttime}</p>
      <p className='driveendtime-title'>운행 종료 시간: </p>
      <p className='driveendtime'>{driveendtime}</p>
      <p className='totaldrivetime-title'>총 운행 시간: </p>
      <p className='totaldrivetime'>{totaldrivetime}</p>
      <p className='collisiontime-title'>충돌 발생 시간: </p>
      <p className='collisiontime'>{collisiontime}</p>
    </div>
  )
}

export default DriveTimeComponent