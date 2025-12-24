import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/courses', label: 'Courses' },
  ];

  const instructorLinks = [
    { path: '/instructor', label: 'Dashboard' },
    { path: '/instructor/available', label: 'Available Courses' },
  ];

  const studentLinks = [
    { path: '/student', label: 'Dashboard' },
    { path: '/student/profile', label: 'Profile' },
  ];

  let links = [];
  if (user?.role === 'admin') links = adminLinks;
  else if (user?.role === 'instructor') links = instructorLinks;
  else if (user?.role === 'student') links = studentLinks;

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-[calc(100vh-65px)]">
      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:bg-gray-800'
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
