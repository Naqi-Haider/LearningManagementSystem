import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService } from '../../services/api';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    instructorLimit: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await courseService.createCourse(formData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
          <p className="text-sm text-gray-500">Add a new course to the system</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        <div className="card p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="CS101"
                className="input"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Introduction to Computer Science"
                className="input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Course description..."
                className="textarea h-24"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor Limit
              </label>
              <input
                type="number"
                name="instructorLimit"
                min="1"
                className="input w-24"
                value={formData.instructorLimit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : 'Create Course'}
              </button>
              <Link to="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateCourse;
