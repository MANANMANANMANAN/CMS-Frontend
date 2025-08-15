import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../Actions/dashboard';

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;