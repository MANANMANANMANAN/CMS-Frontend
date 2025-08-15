import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../Actions/User";
import { loginUser } from "../../Actions/dashboard";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };
  
  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <input
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;