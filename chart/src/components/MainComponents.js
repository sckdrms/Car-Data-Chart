import React, { useEffect, useState } from 'react';

import DBChartComponent from './DBChartComponents'

import '../css/MainComponents.css'

function MainComponent(){
  return(
    <div className='bg'>
      <DBChartComponent></DBChartComponent>
    </div>
  )
}

export default MainComponent