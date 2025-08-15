import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./Actions/dashboard";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home"; 
import Login from "./components/Login/Login";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  const { prof, isAuthenticated } = useSelector((state) => state.user);
  console.log(prof?.iid)
  return (
    <Router>
        {isAuthenticated && <Header />}
        <Routes>
              <Route path="/" element={isAuthenticated ? <Home iid={prof?.iid} /> : <Login />} />
        </Routes>
    </Router>
  );
}

export default App;
