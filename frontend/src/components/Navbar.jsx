import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log(`User ${user?.name} Logged Out`)
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          LMS
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user.name}</span>
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center text-sm font-medium hover:bg-gray-100 transition-colors overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg border border-gray-700 py-1 hidden group-hover:block z-10 shadow-xl">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
