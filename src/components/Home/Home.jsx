import React from 'react';
import CourseRequestArea from '../CourseRequestArea/CourseRequestArea';
import StudentPreregistrationApproval from '../StudentPreregistrationApproval/StudentPreregistrationApproval';
import './Home.css';

const Home = ({ iid }) => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Professor Dashboard</h1>
        <p className="home-subtitle">Manage course requests and student registrations</p>
      </div>
      
      <div className="dashboard-grid">
        <CourseRequestArea iid={iid} />
        <StudentPreregistrationApproval iid={iid} />
      </div>
    </div>
  );
};

export default Home;