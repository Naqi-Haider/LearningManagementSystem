import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseService.getCourses();
      setMyCourses(data.filter(c => c.instructors?.some(i => i._id === user._id)));
      setAvailableCourses(data.filter(c =>
        c.instructors?.length < c.instructorLimit &&
        !c.instructors?.some(i => i._id === user._id)
      ));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCourse = async (courseId) => {
    try {
      await courseService.joinCourse(courseId);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join course');
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
          <p className="text-sm text-gray-500">Manage your teaching courses</p>
        </div>

        {/* My Courses */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          <div className="p-4">
            {myCourses.length === 0 ? (
              <p className="text-gray-500 text-sm">You are not teaching any courses yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myCourses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 font-mono">{course.code}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{course.students?.length || 0} students</p>
                    <Link to={`/instructor/courses/${course._id}`} className="btn btn-primary btn-sm mt-3">
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Courses */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Available Courses</h2>
          </div>
          <div className="p-4">
            {availableCourses.length === 0 ? (
              <p className="text-gray-500 text-sm">No available courses to join.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 font-mono">{course.code}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.instructors?.length || 0} / {course.instructorLimit} instructors
                    </p>
                    <button
                      onClick={() => handleJoinCourse(course._id)}
                      className="btn btn-secondary btn-sm mt-3"
                    >
                      Join Course
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InstructorDashboard;
