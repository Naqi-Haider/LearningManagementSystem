import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            LMS
          </Link>
          <div className="flex gap-3">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Learning Management System
          </h1>
          <p className="text-gray-600 mb-12 text-lg">
            A simple platform for managing courses, lessons, and student progress.
          </p>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Card */}
            <Link
              to="/login"
              className="card p-6 hover:border-gray-900 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mb-4 mx-auto transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin</h2>
              <p className="text-sm text-gray-500">
                Manage courses, users, and system settings
              </p>
            </Link>

            {/* Instructor Card */}
            <Link
              to="/login"
              className="card p-6 hover:border-gray-900 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mb-4 mx-auto transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Instructor</h2>
              <p className="text-sm text-gray-500">
                Create lessons, assignments, and track students
              </p>
            </Link>

            {/* Student Card */}
            <Link
              to="/login"
              className="card p-6 hover:border-gray-900 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mb-4 mx-auto transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Student</h2>
              <p className="text-sm text-gray-500">
                Enroll in courses and track your progress
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center">
        <p className="text-sm text-gray-400">
          © 2024 Learning Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
