import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const reg = () => {
    axios.post("http://localhost:5000/signup", data)
      .then((res) => {
        if (res.data.message === "User registered successfully") {
          navigate("/login")
        } else {
          setMsg(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
        setMsg("Something went wrong")
      })
  }

  return (
   <div className="register">
  <div className="register-box">
    <h2>Register</h2>

    <input 
      type="text" 
      name="name" 
      placeholder="Name" 
      onChange={handleChange}
    />

    <input 
      type="email" 
      name="email" 
      placeholder="Email" 
      onChange={handleChange}
    />

    <input 
      type="password" 
      name="password" 
      placeholder="Password" 
      onChange={handleChange}
    />

    <button onClick={reg}>Register</button>

    <p>{msg}</p>
  </div>
</div>
  )
}

export default Register