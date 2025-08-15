
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendUrl}`, // base for all routes
  headers: {
    "Content-Type": "application/json",
  },
});

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    
    // Get token from localStorage (or wherever you store it)
    const token = localStorage.getItem('token');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpaWQiOiJQUk9GMDU5MyIsImVtYWlsIjoiam9yZ2U5N0Bob3RtYWlsLmNvbSIsImlhdCI6MTc1NTE3ODI3MiwiZXhwIjoxNzU1MjY0NjcyfQ.bkAaxZLq5m3iRWNxju5D2vSEUg8s9VEOSzUQnQ_9U-I";
    const { data } = await axios.get(`${backendUrl}/api/faculty_service/token_check`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response.data.message,
    });
  }
};
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoginRequest",
    });
    const iid = email
    const { data } = await api.put(
      "/api/faculty_service/professor/login",
      { iid, password }
    );

    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    dispatch({
      type: "LoginSuccess",
      payload: data.student,
    });
  } catch (error) {
    dispatch({
      type: "LoginFailure",
      payload: error.response?.data?.message || "Login failed",
    });
  }
};
export const get_prefinalcourses = () => async (dispatch) => {
  try {
    dispatch({
      type: "preRequest",
    });
    const { data } = await api.get(
      "/api/faculty_service/pre_final_courses"
    );

    dispatch({
      type: "preSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "preFailure",
      payload: error.response.data.message
    });
  }
};
export const get_requestedcourses = (iid) => async (dispatch) => {
  try {
    dispatch({
      type: "reqRequest",
    });
    const { data } = await api.get(
      `/api/faculty_service/requested_courses/${iid}`
    );

    dispatch({
      type: "reqSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "reqFailure",
      payload: error.response.data.message
    });
  }
};

export const request_course = (courseCodes, iid) => async (dispatch) => {
  try {
    dispatch({
      type: "reqCRequest",
    });
    const { data } = await api.put(
      "/api/faculty_service/request_course",
      {courseCodes, iid}
    );
    dispatch({
      type: "reqCSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "reqCFailure",
      payload: error.response.data.message
    });
  }
};

export const get_preregdata = (iid) => async (dispatch) => {
  try {
    dispatch({
      type: "reqDRequest",
    });
    const { data } = await api.get(
      `/api/faculty_service/pre_registered_data/${iid}`
    );

    dispatch({
      type: "reqDSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "reqDFailure",
      payload: error.response.data.message
    });
  }
};

export const update_students = (uids) => async (dispatch) => {
  try {
    dispatch({
      type: "studRequest",
    });
    const { data } = await api.put(
      "/api/faculty_service/pre_registration_accept_reject",
      {uids}
    );
    dispatch({
      type: "studSuccess",
    //   payload: data,
    });
  } catch (error) {
    dispatch({
      type: "studFailure",
      payload: error.response.data.message
    });
  }
};
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LogoutRequest" });

    const { data } = await api.get("/api/faculty_service/professor/logout");

    // Remove token from localStorage after successful API call
    localStorage.removeItem('token');
    dispatch({ type: "LogoutSuccess", payload: "Logged out successfully" });
    window.location.href = '/';

  } catch (error) {
    // Even if logout API fails, still clear localStorage
    localStorage.removeItem('token');
    dispatch({
      type: "LogoutFailure",
      payload: error.response?.data?.message || "Logout failed",
    });
    window.location.href = '/';
  }
};