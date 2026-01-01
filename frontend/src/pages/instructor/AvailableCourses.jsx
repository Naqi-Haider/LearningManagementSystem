import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { courseService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AvailableCourses = () => {
  const { user } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseService.getCourses();
      // Filter courses where instructor hasn't joined yet and slots available
      const available = data.filter(c =>
        c.instructors?.length < c.instructorLimit &&
        !c.instructors?.some(i => i._id === user._id)
      );
      setAvailableCourses(available);
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
          <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
          <p className="text-sm text-gray-500">Courses you can join as an instructor</p>
        </div>

        {availableCourses.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500">No available courses to join at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <div key={course._id} className="card p-5">
                <p className="text-xs text-gray-500 font-mono">{course.code}</p>
                <h3 className="font-semibold text-gray-900 mt-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  <span>{course.instructors?.length || 0} / {course.instructorLimit} instructors</span>
                </div>
                <button
                  onClick={() => handleJoinCourse(course._id)}
                  className="btn btn-primary btn-sm mt-4 w-full"
                >
                  Join Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AvailableCourses;
