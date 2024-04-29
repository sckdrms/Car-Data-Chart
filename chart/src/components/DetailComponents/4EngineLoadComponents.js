import  { React, useState } from 'react';

import '../../css/Detailcomponents/4EngineLoadComponents.css'

function EngineLoadComponent(){
  let [maxengineper, setmaxengineper] = useState()
  let [minengineper, setminengineper] = useState()
  let [avgengineper, setavgengineper] = useState()
  return(
    <div className='componentname'>
      <p>엔진 부하량</p>
      <p className='max-engine'>최댓값:</p>
      <p className='max-engine-per'>{maxengineper}%</p>
      <p className='min-engine'>최솟값:</p>
      <p className='min-engine-per'>{minengineper}%</p>
      <p className='avg-engine'>평균값:</p>
      <p className='avg-engine-per'>{avgengineper}%</p>
    </div>
  )
}

export default EngineLoadComponent