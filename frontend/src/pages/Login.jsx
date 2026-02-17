import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';

const Login = () => {
  const { role } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Determine heading based on role parameter
  const roleConfig = {
    admin: { title: 'Admin Login', subtitle: 'Access the administration panel' },
    instructor: { title: 'Instructor Login', subtitle: 'Manage your courses and students' },
    student: { title: 'Student Login', subtitle: 'Access your enrolled courses' },
  };

  const config = role && roleConfig[role] ? roleConfig[role] : { title: 'Welcome Back', subtitle: 'Sign in to your account' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const data = await dispatch(loginUser({ email, password })).unwrap();

      // If a specific role was requested via URL, validate it matches
      if (role && data.role !== role) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLocalError(`Invalid credentials. This login is for ${role}s only.`);
        return;
      }

      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setLocalError(err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">
          LMS
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{config.title}</h2>
            <p className="text-center text-gray-500 mb-6">{config.subtitle}</p>

            {displayError && (
              <div className="alert alert-error mb-4">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-gray-900 hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-4 text-center">
        <p className="text-sm text-gray-400">© 2026 Learning Management System</p>
      </footer>
    </div>
  );
};

export default Login;
