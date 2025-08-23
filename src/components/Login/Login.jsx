import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Actions/dashboard";
// Import the CSS file
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };
  const { prof, isAuthenticated } = useSelector((state) => state.user);
  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        {/* Email Input */}
        <div className="input-group">
          <label >Professor Id</label>
          <input
            id="email"
            
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Password Input */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;