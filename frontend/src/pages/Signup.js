import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setuserRole] = useState("");
  const { signup, error, isLoading } = useSignup();

  //handleSubmit function - triggered when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent default form submission

    //call the signup function with the user inputs
    await signup(first_name, last_name, email, password, userRole);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
      }}
    >
      <div
        style={{
          border: "1.5px solid #ccc",
          borderRadius: "8px",
          padding: "40px",
          maxWidth: "500px",
        }}
      >
        <div className="signup-container">
          <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up</h3>

            <div className="mb-3">
              <label htmlFor="validationDefault01" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="validationDefault01"
                required
                onChange={(e) => setfirst_name(e.target.value)}
                value={first_name}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="validationDefault02" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="validationDefault02"
                required
                onChange={(e) => setlast_name(e.target.value)}
                value={last_name}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="validationDefaultUsername" className="form-label">
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend2">
                  @
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="validationDefaultUsername"
                  aria-describedby="inputGroupPrepend2"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="validationDefault03" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="validationDefault03"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="validationDefault04" className="form-label">
                User Role
              </label>
              <select
                className="form-select"
                id="validationDefault04"
                required
                onChange={(e) => setuserRole(e.target.value)}
                value={userRole}
              >
                <option selected disabled value="">
                  Choose...
                </option>
                <option>Cashier</option>
                <option>Staff Manager</option>
                <option>Training Coordinator</option>
                <option>Financial Manager</option>
                <option>Logistic Manager</option>
                <option>Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="invalidCheck2"
                  required
                />
                <label className="form-check-label" htmlFor="invalidCheck2">
                  Agree to Terms and Conditions
                </label>
              </div>
            </div>

            <div className="mb-3">
              <button
                disabled={isLoading}
                className="btn btn-primary"
                type="submit"
              >
                Sign Up
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
