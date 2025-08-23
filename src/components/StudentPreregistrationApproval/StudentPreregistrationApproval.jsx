import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_preregdata, update_students } from '../../Actions/dashboard';
import './StudentPreregistrationApproval.css';

const StudentPreregistrationApproval = ({ iid }) => {
    const dispatch = useDispatch();

    const { preregdata, loading_d, error_d } = useSelector((state) => state.course);

    const [acceptedStudents, setAcceptedStudents] = useState([]);
    const [studentUIDs, setStudentUIDs] = useState([]);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [courseTypeFilter, setCourseTypeFilter] = useState('');
    const [courseModeFilter, setCourseModeFilter] = useState('');

    useEffect(() => {
        dispatch(get_preregdata(iid));
    }, [dispatch, iid]);

    useEffect(() => {
        if (preregdata && preregdata.length > 0) {
            const accepted = preregdata
                .filter((student) => student.accept_reject === true)
                .map((student) => student.uid);
            setAcceptedStudents(accepted);
        }
    }, [preregdata]);

    const handleStudentToggle = (studentUID) => {
        setStudentUIDs((prev) =>
            prev.includes(studentUID)
                ? prev.filter((uid) => uid !== studentUID)
                : [...prev, studentUID]
        );
    };

    const handleUpdateStudents = async () => {
        await dispatch(update_students(studentUIDs));
        setStudentUIDs([]);
        await dispatch(get_preregdata(iid));
    };

    // Deregister handler for approved students
    const handleDeregister = async (studentUID) => {
        await dispatch(update_students([studentUID]));
        await dispatch(get_preregdata(iid));
    };

    const getStatusBadge = (acceptReject) => {
        if (acceptReject === true) return { class: 'status-approved', text: 'Approved' };
        if (acceptReject === false) return { class: 'status-rejected', text: 'Rejected' };
        return { class: 'status-pending', text: 'Pending' };
    };

    const getCourseTypeBadge = (type) => {
        const types = {
            FE: { class: 'type-fe', text: 'FE' },
            PE: { class: 'type-pe', text: 'PE' },
            OE: { class: 'type-oe', text: 'OE' },
            IE: { class: 'type-ie', text: 'IE' },
        };
        return types[type] || { class: 'type-default', text: type };
    };

    const getCourseModeLabel = (mode) => {
        return mode === 'audit' ? 'Audit' : 'Credit';
    };

    // Filter and search logic
    const filterStudents = (students) => {
        return students.filter((student) => {
            const matchesSearch =
                searchTerm === '' ||
                student.student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course_code.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesBranch = branchFilter === '' || student.student.branch === branchFilter;
            const matchesCourseType = courseTypeFilter === '' || student.pre_reg_course_type === courseTypeFilter;
            const matchesCourseMode = courseModeFilter === '' || student.pre_reg_course_mode === courseModeFilter;

            return matchesSearch && matchesBranch && matchesCourseType && matchesCourseMode;
        });
    };

    // Get unique values for filters
    const getUniqueValues = (data, path) => {
        if (!data) return [];
        const values = data
            .map((item) => {
                const keys = path.split('.');
                return keys.reduce((obj, key) => obj?.[key], item);
            })
            .filter(Boolean);
        return [...new Set(values)].sort();
    };

    const uniqueBranches = getUniqueValues(preregdata, 'student.branch');
    const uniqueCourseTypes = getUniqueValues(preregdata, 'pre_reg_course_type');
    const uniqueCourseModes = getUniqueValues(preregdata, 'pre_reg_course_mode');

    const clearFilters = () => {
        setSearchTerm('');
        setBranchFilter('');
        setCourseTypeFilter('');
        setCourseModeFilter('');
    };

    const filteredPendingStudents = filterStudents(
        preregdata?.filter((student) => student.accept_reject !== true) || []
    );
    const filteredApprovedStudents = filterStudents(
        preregdata?.filter((student) => student.accept_reject === true) || []
    );

    return (
        <div className="student-prereg-area">
            <div className="section-header">
                <h2 className="section-title">👥 Student Registration Management</h2>
                <p className="section-subtitle">Review and approve student pre-registrations</p>
            </div>

            {/* Filters Section */}
            <div className="filters-card">
                <div className="filters-header">
                    <h3 className="filters-title">🔍 Filters & Search</h3>
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear All
                    </button>
                </div>

                <div className="filters-content">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, student ID, course name, or course code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-row">
                        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="filter-select">
                            <option value="">All Branches</option>
                            {uniqueBranches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>

                        <select
                            value={courseTypeFilter}
                            onChange={(e) => setCourseTypeFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Course Types</option>
                            {uniqueCourseTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <select
                            value={courseModeFilter}
                            onChange={(e) => setCourseModeFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Modes</option>
                            {uniqueCourseModes.map((mode) => (
                                <option key={mode} value={mode}>
                                    {getCourseModeLabel(mode)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Pending Students */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Pending Pre-Registrations</h3>
                    <span className="student-count">{filteredPendingStudents.length} pending</span>
                </div>

                <div className="card-content">
                    {loading_d && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading student data...</p>
                        </div>
                    )}

                    {error_d && (
                        <div className="error-state">
                            <span className="error-icon">⚠️</span>
                            <p>{error_d}</p>
                        </div>
                    )}

                    {filteredPendingStudents.length > 0 ? (
                        <div className="student-list">
                            {filteredPendingStudents
                                .sort((a, b) => a.student.student_name.localeCompare(b.student.student_name))
                                .map((student, index) => {
                                    const initiallyAccepted = acceptedStudents.includes(student.uid);
                                    const isChecked = studentUIDs.includes(student.uid)
                                        ? !initiallyAccepted
                                        : initiallyAccepted;
                                    const courseType = getCourseTypeBadge(student.pre_reg_course_type);

                                    return (
                                        <div key={`${student.course_id}-${index}`} className="student-item">
                                            <label className="student-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleStudentToggle(student.uid)}
                                                />
                                                <span className="checkmark"></span>
                                                <div className="student-info">
                                                    <div className="student-details">
                                                        <div className="student-primary">
                                                            <span className="student-name">{student.student.student_name}</span>
                                                            <span className="student-id">({student.student.student_id})</span>
                                                        </div>
                                                        <div className="student-secondary">
                                                            <span className="course-info">
                                                                {student.course_name} ({student.course_code})
                                                            </span>
                                                            <span className="branch-info">
                                                                {student.student.branch} • {student.student.program}
                                                            </span>
                                                        </div>
                                                        <div className="student-badges">
                                                            <span className={`course-type-badge ${courseType.class}`}>{courseType.text}</span>
                                                            <span
                                                                className={`course-mode-badge ${student.pre_reg_course_mode === 'audit'
                                                                        ? 'mode-audit'
                                                                        : 'mode-credit'
                                                                    }`}
                                                            >
                                                                {getCourseModeLabel(student.pre_reg_course_mode)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="status-section">
                                                        <span className="status-badge status-pending">Pending</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        !loading_d && (
                            <div className="empty-state">
                                <span className="empty-icon">✅</span>
                                <p>No pending pre-registrations match your filters</p>
                            </div>
                        )
                    )}
                </div>

                <div className="card-footer">
                    <button
                        onClick={handleUpdateStudents}
                        className="update-button"
                        disabled={loading_d || studentUIDs.length === 0}
                    >
                        {studentUIDs.length > 0
                            ? `Update ${studentUIDs.length} Student${studentUIDs.length > 1 ? 's' : ''}`
                            : 'Update Students'}
                    </button>
                </div>
            </div>

            {/* Approved Students */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Approved Students</h3>
                    <span className="student-count">{filteredApprovedStudents.length} approved</span>
                </div>

                <div className="card-content">
                    {loading_d && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading approved students...</p>
                        </div>
                    )}

                    {error_d && (
                        <div className="error-state">
                            <span className="error-icon">⚠️</span>
                            <p>{error_d}</p>
                        </div>
                    )}

                    {filteredApprovedStudents.length > 0 ? (
                        <div className="approved-list">
                            {filteredApprovedStudents
                                .sort((a, b) => a.student.student_name.localeCompare(b.student.student_name))
                                .map((student, index) => {
                                    const courseType = getCourseTypeBadge(student.pre_reg_course_type);
                                    return (
                                        <div key={`approved-${student.course_id}-${index}`} className="approved-item">
                                            <div className="approved-info">
                                                <div className="approved-primary">
                                                    <span className="approved-name">{student.student.student_name}</span>
                                                    <span className="approved-id">({student.student.student_id})</span>
                                                </div>
                                                <div className="approved-secondary">
                                                    <span className="approved-course">
                                                        {student.course_name} ({student.course_code})
                                                    </span>
                                                    <span className="approved-branch">
                                                        {student.student.branch} • {student.student.program}
                                                    </span>
                                                </div>
                                                <div className="approved-badges">
                                                    <span className={`course-type-badge ${courseType.class}`}>{courseType.text}</span>
                                                    <span
                                                        className={`course-mode-badge ${student.pre_reg_course_mode === 'audit' ? 'mode-audit' : 'mode-credit'
                                                            }`}
                                                    >
                                                        {getCourseModeLabel(student.pre_reg_course_mode)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="approved-actions">
                                                <span className="status-badge status-approved">Approved</span>
                                                <button
                                                    className="deregister-btn"
                                                    title="Deregister this student"
                                                    onClick={() => handleDeregister(student.uid)}
                                                >
                                                    Deregister
                                                </button>

                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        !loading_d && (
                            <div className="empty-state">
                                <span className="empty-icon">👥</span>
                                <p>No approved students match your filters</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentPreregistrationApproval;
