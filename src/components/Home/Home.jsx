import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_prefinalcourses, get_requestedcourses, request_course, get_preregdata } from '../../Actions/dashboard';
import { update_students } from '../../Actions/dashboard';
const Home = ({ iid }) => {
    const dispatch = useDispatch();

    const {
        requests,
        error_b,
        loading_b,
        courses,
        loading,
        error,
        preregdata,     // <-- pre-registered students list
        loading_d,      // <-- loading state for preregdata
        error_d         // <-- error state for preregdata
    } = useSelector((state) => state.course);

    const [requestedCodes, setRequestedCodes] = useState([]); // From API for auto-check
    const [courseCodes, setCourseCodes] = useState([]); // User toggles
    const [acceptedStudents, setAcceptedStudents] = useState([]); // Initially accepted students UIDs
    const [studentUIDs, setStudentUIDs] = useState([]); // User-toggled student UIDs

    // Fetch all needed data
    useEffect(() => {
        dispatch(get_prefinalcourses());
        dispatch(get_requestedcourses(iid));
        dispatch(get_preregdata(iid));
    }, [dispatch, iid]);

    // Store requested courses separately
    useEffect(() => {
        if (requests && requests.length > 0) {
            setRequestedCodes(requests.map((course) => course.course_code));
        }
    }, [requests]);

    // Store initially accepted students
    useEffect(() => {
        if (preregdata && preregdata.length > 0) {
            const accepted = preregdata
                .filter((student) => student.accept_reject === true)
                .map((student) => student.uid);
            setAcceptedStudents(accepted);
        }
    }, [preregdata]);

    // Course toggle handler
    const handleToggle = (courseCode) => {
        setCourseCodes((prev) =>
            prev.includes(courseCode)
                ? prev.filter((code) => code !== courseCode)
                : [...prev, courseCode]
        );
    };

    // Student toggle handler
    const handleStudentToggle = (studentUID) => {
        setStudentUIDs((prev) =>
            prev.includes(studentUID)
                ? prev.filter((uid) => uid !== studentUID)
                : [...prev, studentUID]
        );
    };

    // Submit handler for courses
    const handleUpdateRequests = async () => {
        console.log("User-toggled course codes:", courseCodes);
        await dispatch(request_course(courseCodes, iid)); // Wait until completed
        setCourseCodes([]);
        dispatch(get_requestedcourses(iid)); // Refresh requests list
    };

    // Submit handler for students (placeholder - you'll provide the function)
    const handleUpdateStudents = async () => {
        console.log("User-toggled student UIDs:", studentUIDs);
        await dispatch(update_students(studentUIDs));
        setStudentUIDs([]);
        await dispatch(get_preregdata(iid)); // Refresh pre-reg data
    };

    return (
        <div>
            <h2>Home</h2>

            {/* ---------------- Total Courses ---------------- */}
            <div>
                <h3>Total Courses</h3>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {courses && courses.length > 0 ? (
                    <ul>
                        {courses.map((course) => {
                            const initiallyChecked = requestedCodes.includes(course.course_code);
                            const isChecked = courseCodes.includes(course.course_code)
                                ? !initiallyChecked
                                : initiallyChecked;

                            return (
                                <li key={course.course_id}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggle(course.course_code)}
                                    />
                                    {course.course_name} ({course.course_code})
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    !loading && <p>No courses available</p>
                )}
                <button onClick={handleUpdateRequests}>Update Requests</button>
            </div>

            {/* ---------------- Requested Courses ---------------- */}
            <div>
                <h3>Requested Courses</h3>
                {loading_b && <p>Loading...</p>}
                {error_b && <p style={{ color: 'red' }}>{error_b}</p>}
                {requests && requests.length > 0 ? (
                    <ul>
                        {requests.map((course, index) => (
                            <li key={`${course.course_code}-${index}`}>
                                {course.course_name} ({course.course_code}) ({String(course.accept_reject)})
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading_b && <p>No courses' requests available</p>
                )}
            </div>

            {/* ---------------- Pre-Registered Students ---------------- */}
            <div>
                <h3>Pre-Registered Students</h3>
                {loading_d && <p>Loading pre-registered data...</p>}
                {error_d && <p style={{ color: 'red' }}>{error_d}</p>}
                {preregdata && preregdata.length > 0 ? (
                    <ul>
                        {[...preregdata] // spread to avoid mutating original state
                            .sort((a, b) => {
                                // First by course_name, then by student_name
                                if (a.student.student_name < b.student.student_name) return -1;
                                if (a.student.student_name > b.student.student_name) return 1;
                                return a.student.student_name.localeCompare(b.student.student_name);
                            })
                            .map((student, index) => {
                                const initiallyAccepted = acceptedStudents.includes(student.uid);
                                const isChecked = studentUIDs.includes(student.uid)
                                    ? !initiallyAccepted
                                    : initiallyAccepted;

                                return (
                                    <li key={`${student.course_id}-${index}`}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleStudentToggle(student.uid)}
                                        />
                                        {student.student.student_name} - {student.course_name} — {String(student.accept_reject)}
                                    </li>
                                );
                            })}
                    </ul>
                ) : (
                    !loading_d && <p>No pre-registered students found</p>
                )}
                <button onClick={handleUpdateStudents}>Update Students</button>
            </div>


            {/* ---------------- Registered Students (Accept_Reject = true) ---------------- */}
            <div>
                <h3>Registered Students</h3>
                {loading_d && <p>Loading registered students...</p>}
                {error_d && <p style={{ color: 'red' }}>{error_d}</p>}
                {preregdata && preregdata.length > 0 ? (
                    <ul>
                        {preregdata
                            .filter((student) => student.accept_reject === true)
                            .map((student, index) => (
                                <li key={`registered-${student.course_id}-${index}`}>
                                    {student.student.student_name} - {student.course_name}
                                </li>
                            ))}
                    </ul>
                ) : (
                    !loading_d && <p>No registered students found</p>
                )}
            </div>
        </div>
    );
};

export default Home;