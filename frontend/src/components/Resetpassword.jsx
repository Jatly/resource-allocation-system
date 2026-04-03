import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Resetpassword = () => {
  let [email, setEmail] = useState("")
  let [msg, SetMsg] = useState("")
  let [f, setF] = useState(false)
  let [otp, setOtp] = useState("")
  let [newpwd, setNewpwd] = useState("")
  let [c, setC] = useState(300)
  let [iid, setIid] = useState(null)
  const inputs = useRef([]);

  const navigate = useNavigate();

  // ✅ 2. Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (iid) clearInterval(iid)
    }
  }, [iid])

  let sendotp = () => {
    axios.get(`https://resource-allocation-system.onrender.com/sendotp/${email}`)
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
  <div className="otp-container">
    {[...Array(6)].map((_, index) => (
      <input
        key={index}
        type="text"
        maxLength="1"
        value={otp[index] || ""}
        ref={(el) => (inputs.current[index] = el)}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^[0-9]?$/.test(value)) return;

          let newOtp = otp.split("");
          newOtp[index] = value;
          setOtp(newOtp.join(""));

          if (value && index < 5) {
            inputs.current[index + 1].focus();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
          }
        }}
        className="otp-box"
      />
    ))}
  </div>
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
              axios.post("https://resource-allocation-system.onrender.com/reset", {
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