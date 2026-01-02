import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add user ID to requests (simple auth without JWT)
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    config.headers['x-user-id'] = userData._id;
  }
  return config;
});

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Course services
export const courseService = {
  getCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  joinCourse: (id) => api.put(`/courses/${id}/join`),
  enrollCourse: (id, instructorId) => api.put(`/courses/${id}/enroll`, { instructorId }),
};

// Lesson services
export const lessonService = {
  getLessons: (courseId, instructorId) => {
    const params = instructorId ? { instructor: instructorId } : {};
    return api.get(`/lessons/${courseId}`, { params });
  },
  createLesson: (lessonData) => api.post('/lessons', lessonData),
  updateLesson: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
  completeLesson: (id, courseId) => api.put(`/lessons/${id}/complete`, { courseId }),
};

// Assignment services
export const assignmentService = {
  getAssignments: (courseId, instructorId) => {
    const params = instructorId ? { instructor: instructorId } : {};
    return api.get(`/assignments/${courseId}`, { params });
  },
  createAssignment: (assignmentData) => api.post('/assignments', assignmentData),
  updateAssignment: (id, assignmentData) => api.put(`/assignments/${id}`, assignmentData),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
  submitAssignment: (id, content) => api.post(`/assignments/${id}/submit`, { content }),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
};

// Enrollment services
export const enrollmentService = {
  getEnrollments: () => api.get('/enrollments'),
  getEnrollment: (courseId) => api.get(`/enrollments/${courseId}`),
  getStudentsByInstructor: (courseId, instructorId) => api.get(`/enrollments/course/${courseId}/instructor/${instructorId}`),
};

// User services (admin)
export const userService = {
  getAllUsers: () => api.get('/users'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
