import { useState } from "react"
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(email, password)
  }

  return (
    <div style={{ display: "flex", height: "80vh"}}>

    {/* Left side: Image 
    <div style={{ flex: "2", display: "flex", justifyContent: "left"}}>
      
      <img src="/login_picture.jpg" alt="Diyana Fashion" style={{ width: "80%", height: "100%", objectFit: "cover" }} />
  </div>*/}

    {/* Right side: Form */}
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh"}}>
      <div style={{border: "1.5px solid #ccc", borderRadius: "8px", padding: "40px", maxWidth: "500px"}}>
        <form className="login" onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlfor="InputEmail1" className="form-label">Email Address</label>
            <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            value={email}/>
          </div>
              
          <div className="mb-3">
            <label htmlfor="InputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="InputPassword1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}/>
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="Check1"/>
            <label className="form-check-label" htmlfor="Check1">OKAY</label>
          </div>

          <button disabled={isLoading} type="submit" className="btn btn-primary">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login