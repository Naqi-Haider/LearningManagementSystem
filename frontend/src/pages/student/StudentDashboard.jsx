import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { enrollmentService, assignmentService, courseService } from '../../services/api';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setAvailableCourses(coursesRes.data.filter(c => !enrolledIds.includes(c._id)));

      const assignments = [];
      for (const enrollment of enrollmentsRes.data) {
        try {
          const { data } = await assignmentService.getAssignments(enrollment.courseId._id);
          assignments.push(...data.map(a => ({ ...a, course: enrollment.courseId })));
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

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
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

        {/* Upcoming Deadlines */}
        {upcomingAssignments.length > 0 && (
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            <div className="p-4 space-y-2">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-500">{assignment.course?.title}</p>
                  </div>
                  <p className="text-sm text-gray-700">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
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
                    <button
                      onClick={() => handleEnroll(course._id)}
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
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
