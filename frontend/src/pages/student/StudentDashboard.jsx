import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { enrollmentService, assignmentService, courseService } from '../../services/api';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, coursesRes] = await Promise.all([
        enrollmentService.getEnrollments(),
        courseService.getCourses(),
      ]);

      setEnrollments(enrollmentsRes.data);

      const enrolledIds = enrollmentsRes.data.map(e => e.courseId._id);
      setAvailableCourses(coursesRes.data.filter(c => !enrolledIds.includes(c._id) && c.instructors?.length > 0));

      const assignments = [];
      for (const enrollment of enrollmentsRes.data) {
        try {
          const { data } = await assignmentService.getAssignments(enrollment.courseId._id, enrollment.instructorId?._id);
          assignments.push(...data.map(a => ({ ...a, course: enrollment.courseId, instructor: enrollment.instructorId })));
        } catch (err) {
          console.error('Error fetching assignments:', err);
        }
      }

      assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setUpcomingAssignments(assignments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (course) => {
    setEnrollModal(course);
    setSelectedInstructor(course.instructors[0]?._id || '');
  };

  const handleEnroll = async () => {
    if (!selectedInstructor) {
      alert('Please select an instructor');
      return;
    }
    try {
      await courseService.enrollCourse(enrollModal._id, selectedInstructor);
      setEnrollModal(null);
      setSelectedInstructor('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="spinner spinner-lg"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Track your courses and progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-500">Enrolled Courses</p>
            <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Upcoming Deadlines</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
          </div>
        </div>

        {/* My Courses */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          <div className="p-4">
            {enrollments.length === 0 ? (
              <p className="text-gray-500 text-sm">You are not enrolled in any courses yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 font-mono">{enrollment.courseId.code}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{enrollment.courseId.title}</h3>
                    <p className="text-xs text-blue-600 mt-1">
                      Instructor: {enrollment.instructorId?.name || 'Unknown'}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-700">{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                    </div>
                    <Link to={`/student/courses/${enrollment.courseId._id}`} className="btn btn-primary btn-sm mt-3">
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines - Now clickable */}
        {upcomingAssignments.length > 0 && (
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            <div className="p-4 space-y-2">
              {upcomingAssignments.map((assignment) => (
                <Link
                  key={assignment._id}
                  to={`/student/courses/${assignment.course?._id}/assignments/${assignment._id}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-500">{assignment.course?.title}</p>
                  </div>
                  <p className="text-sm text-gray-700">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        {availableCourses.length > 0 && (
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Available Courses</h2>
            </div>
            <div className="p-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 font-mono">{course.code}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      {course.instructors?.length} instructor(s) available
                    </p>
                    <button
                      onClick={() => handleEnrollClick(course)}
                      className="btn btn-secondary btn-sm mt-3"
                    >
                      Enroll
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        {enrollModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Enroll in {enrollModal.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Select an instructor to enroll with:</p>

              <div className="space-y-2 mb-4">
                {enrollModal.instructorSections?.map((is) => (
                  <label
                    key={is.instructor._id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedInstructor === is.instructor._id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="instructor"
                      value={is.instructor._id}
                      checked={selectedInstructor === is.instructor._id}
                      onChange={(e) => setSelectedInstructor(e.target.value)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                      {is.instructor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{is.instructor.name}</p>
                      <p className="text-xs text-gray-500">{is.instructor.email}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                      Section {is.section.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={handleEnroll} className="btn btn-primary flex-1">
                  Confirm Enrollment
                </button>
                <button
                  onClick={() => {
                    setEnrollModal(null);
                    setSelectedInstructor('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
