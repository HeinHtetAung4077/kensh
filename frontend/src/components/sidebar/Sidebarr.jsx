import React from 'react';
import Conversations from './Conversations';

const Sidebarr = () => {
  
  return (
    <div className='border-r border-slate-500 p-3 flex flex-col'>
        <Conversations />
        <div className='divider px-1'></div>
    </div>
  )
}

export default Sidebarr