import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { userService } from '../../services/api';

const AdminUserPanel = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [studentsRes, instructorsRes] = await Promise.all([
        userService.getUsersByRole('student'),
        userService.getUsersByRole('instructor'),
      ]);
      setStudents(studentsRes.data);
      setInstructors(instructorsRes.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const users = activeTab === 'students' ? students : instructors;

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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage students and instructors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Total Instructors</p>
            <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'students'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'instructors'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Instructors ({instructors.length})
          </button>
        </div>

        {/* User List */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No {activeTab} found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
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

export default AdminUserPanel;
