import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Resetpassword = () => {
  let [email, setEmail] = useState("")
  let [msg, SetMsg] = useState("")
  let [f, setF] = useState(false)
  let [otp, setOtp] = useState("")
  let [newpwd, setNewpwd] = useState("")
  let [c, setC] = useState(300)
  let [iid, setIid] = useState(null)

  const navigate = useNavigate();

  // ✅ 2. Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (iid) clearInterval(iid)
    }
  }, [iid])

  let sendotp = () => {
    axios.get(`http://localhost:5000/sendotp/${email}`)
      .then(res => {
        SetMsg(res.data.msg)

        if (res.data.msg === "OTP sent") {
          setF(true)
          setC(300)

          let intervalId = setInterval(() => {
            // ✅ 1. Prevent negative timer
            setC(prev => (prev > 0 ? prev - 1 : 0))
          }, 1000)

          setIid(intervalId)

          setTimeout(() => {
            setF(false)
            clearInterval(intervalId)
            setC(300)
          }, 300000)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="reset-container">
      <div className="reset-card">

        <h2 className="reset-message">{msg}</h2>

        <input
          className="reset-input"
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={f}
        />

        {!f && (
          <button className="reset-btn" onClick={sendotp}>
            Send OTP
          </button>
        )}

        {f && (
          <input
            className="reset-input otp-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />
        )}

        {f && (
          <input
            className="reset-input"
            type="password"
            placeholder="Enter new password"
            value={newpwd}
            onChange={(e) => setNewpwd(e.target.value)}
          />
        )}

        {f && (
          <h2 className="reset-timer">
            {Math.floor(c / 60)}:{String(c % 60).padStart(2, "0")}
          </h2>
        )}

        {f && (
          <button
            className="reset-btn"
            onClick={() => {
              axios.post("http://localhost:5000/reset", {
                email,
                otp,
                password: newpwd
              }).then(res => {
                SetMsg(res.data.msg)

                // ✅ 3. Navigate only on success
                if (res.data.msg === "Password reset successful") {
                  navigate('/login')
                }
              })
            }}
          >
            Reset Password
          </button>
        )}

      </div>
    </div>
  )
}

export default Resetpassword