import { useState } from "react";
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the login function from the useLogin hook
    await login(email, password);

    // Navigate to the login page after successful login
    
  };

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      {/* Right side: Form */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
        <div style={{ border: "1.5px solid #ccc", borderRadius: "8px", padding: "40px", maxWidth: "500px" }}>
          <form className="login" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="InputEmail1" className="form-label">Email Address</label>
              <input type="email" className="form-control" id="InputEmail1" aria-describedby="emailHelp"
                onChange={(e) => setEmail(e.target.value)}
                value={email} />
            </div>
            <div className="mb-3">
              <label htmlFor="InputPassword1" className="form-label">Password</label>
              <input type="text" className="form-control" id="InputPassword1"
                onChange={(e) => setPassword(e.target.value)}
                value={password} />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="Check1" />
              <label className="form-check-label" htmlFor="Check1">OKAY</label>
            </div>
            <button disabled={isLoading} type="submit" className="btn btn-primary">Login</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;