import React from 'react'
import Bookingstoday from './Bookingstoday'
import Addresource from './Addresource'

const Dashboard = () => {
  return (
    <div className='dashboard'>
    <Bookingstoday/>
    <Addresource/>
    </div>
  )
}

export default Dashboard