import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_prefinalcourses, get_requestedcourses, request_course } from '../../Actions/dashboard';
import './CourseRequestArea.css';

const CourseRequestArea = ({ iid }) => {
    const dispatch = useDispatch();

    const {
        requests,
        error_b,
        loading_b,
        courses,
        loading,
        error
    } = useSelector((state) => state.course);

    const [requestedCodes, setRequestedCodes] = useState([]);
    const [courseCodes, setCourseCodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');

    useEffect(() => {
        dispatch(get_prefinalcourses());
        dispatch(get_requestedcourses(iid));
    }, [dispatch, iid]);

    useEffect(() => {
        if (requests && requests.length > 0) {
            setRequestedCodes(requests.map((course) => course.course_code));
        }
    }, [requests]);

    // Get unique schools from courses
    const availableSchools = useMemo(() => {
        if (!courses || courses.length === 0) return [];
        const schools = [...new Set(courses.map(course => course.school))];
        return schools.filter(Boolean).sort();
    }, [courses]);

    // Filter courses based on search term and selected school
    const filteredCourses = useMemo(() => {
        if (!courses) return [];
        
        return courses.filter(course => {
            const matchesSearch = searchTerm === '' || 
                course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSchool = selectedSchool === '' || course.school === selectedSchool;
            
            return matchesSearch && matchesSchool;
        });
    }, [courses, searchTerm, selectedSchool]);

    const handleToggle = (courseCode) => {
        setCourseCodes((prev) =>
            prev.includes(courseCode)
                ? prev.filter((code) => code !== courseCode)
                : [...prev, courseCode]
        );
    };

    const handleUpdateRequests = async () => {
        console.log("User-toggled course codes:", courseCodes);
        await dispatch(request_course(courseCodes, iid));
        setCourseCodes([]);
        dispatch(get_requestedcourses(iid));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedSchool('');
    };

    const getStatusBadge = (acceptReject) => {
        if (acceptReject === true) return { class: 'status-approved', text: 'Approved' };
        if (acceptReject === false) return { class: 'status-rejected', text: 'Rejected' };
        return { class: 'status-pending', text: 'Pending' };
    };

    return (
        <div className="course-request-area">
            <div className="section-header">
                <h2 className="section-title">📚 Course Request Management</h2>
                <p className="section-subtitle">Select courses to request and manage your course portfolio</p>
            </div>

            {/* Available Courses */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Available Courses</h3>
                    <span className="course-count">
                        {filteredCourses?.length || 0} of {courses?.length || 0} courses
                    </span>
                </div>

                {/* Search and Filter Controls */}
                <div className="filters-section">
                    <div className="search-box">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by course name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="clear-search"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-controls">
                        <div className="school-filter">
                            <select
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                className="school-select"
                            >
                                <option value="">All Schools</option>
                                {availableSchools.map(school => (
                                    <option key={school} value={school}>{school}</option>
                                ))}
                            </select>
                        </div>

                        {(searchTerm || selectedSchool) && (
                            <button onClick={handleClearFilters} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="card-content">
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading courses...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-state">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {!loading && !error && filteredCourses && filteredCourses.length > 0 ? (
                        <div className="course-list">
                            {filteredCourses.map((course) => {
                                const initiallyChecked = requestedCodes.includes(course.course_code);
                                const isChecked = courseCodes.includes(course.course_code)
                                    ? !initiallyChecked
                                    : initiallyChecked;

                                return (
                                    <div key={course.course_id} className="course-item">
                                        <label className="course-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggle(course.course_code)}
                                            />
                                            <span className="checkmark"></span>
                                            <div className="course-info">
                                                <div className="course-details">
                                                    <span className="course-name">{course.course_name}</span>
                                                    <div className="course-meta">
                                                        <span className="course-code">{course.course_code}</span>
                                                        <span className="course-school">{course.school}</span>
                                                    </div>
                                                </div>
                                                <div className="course-ltpc">
                                                    <span className="ltpc-label">L-T-P-C:</span>
                                                    <span className="ltpc-values">
                                                        {course.lecture}-{course.tutorial}-{course.practical}-{course.credits}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    ) : !loading && !error && (
                        <div className="empty-state">
                            <span className="empty-icon">
                                {searchTerm || selectedSchool ? '🔍' : '📚'}
                            </span>
                            <p>
                                {searchTerm || selectedSchool 
                                    ? 'No courses match your search criteria' 
                                    : 'No courses available'
                                }
                            </p>
                            {(searchTerm || selectedSchool) && (
                                <button onClick={handleClearFilters} className="clear-filters-link">
                                    Clear filters to show all courses
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="card-footer">
                    <button 
                        onClick={handleUpdateRequests}
                        className="update-button"
                        disabled={loading || courseCodes.length === 0}
                    >
                        {courseCodes.length > 0 ? `Update ${courseCodes.length} Request${courseCodes.length > 1 ? 's' : ''}` : 'Update Requests'}
                    </button>
                </div>
            </div>

            {/* Requested Courses */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Your Requested Courses</h3>
                    <span className="course-count">{requests?.length || 0} requests</span>
                </div>
                
                <div className="card-content">
                    {loading_b && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading requests...</p>
                        </div>
                    )}
                    
                    {error_b && (
                        <div className="error-state">
                            <span className="error-icon">⚠️</span>
                            <p>{error_b}</p>
                        </div>
                    )}
                    
                    {requests && requests.length > 0 ? (
                        <div className="request-list">
                            {requests.map((course, index) => {
                                const status = getStatusBadge(course.accept_reject);
                                return (
                                    <div key={`${course.course_code}-${index}`} className="request-item">
                                        <div className="request-info">
                                            <span className="request-name">{course.course_name}</span>
                                            <div className="request-meta">
                                                <span className="request-code">{course.course_code}</span>
                                                {course.school && <span className="request-school">{course.school}</span>}
                                            </div>
                                        </div>
                                        <span className={`status-badge ${status.class}`}>
                                            {status.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        !loading_b && (
                            <div className="empty-state">
                                <span className="empty-icon">📋</span>
                                <p>No course requests available</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseRequestArea;