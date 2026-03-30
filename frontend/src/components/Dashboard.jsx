import { useContext, useEffect } from 'react'
import Bookingstoday from './Bookingstoday'
import { useNavigate } from 'react-router-dom'
import Ct from './ct'
import Cookies from 'js-cookie'
import Booking from './Booking'

const Dashboard = () => {
  const navigate = useNavigate()
  const obj = useContext(Ct)

  useEffect(() => {
    const data = Cookies.get("loginDetails")

    // ❌ No cookie → redirect
    if (!data) {
      navigate("/login")
      return
    }

    // ✅ Restore state if missing
    if (data && !obj?.state?.role) {
      obj.updstate(JSON.parse(data))
    }

  }, [])

  return (
    <div className='dashboard'>
      <Bookingstoday />
      <Booking />
    </div>
  )
}

export default Dashboard