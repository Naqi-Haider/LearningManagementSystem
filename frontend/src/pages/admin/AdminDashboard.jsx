import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService } from '../../services/api';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your courses and users</p>
          </div>
          <Link to="/admin/courses/new" className="btn btn-primary btn-sm">
            Add Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Active Instructors</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(courses.flatMap(c => c.instructors?.map(i => i._id) || [])).size}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Enrolled Students</p>
            <p className="text-2xl font-bold text-gray-900">
              {courses.reduce((acc, c) => acc + (c.students?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">All Courses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No courses yet. Create your first course.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{course.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{course.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{course.instructors?.length || 0} / {course.instructorLimit}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{course.students?.length || 0}</td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/courses/${course._id}`} className="text-primary-600 hover:underline text-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
