import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService, lessonService, assignmentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageCourse = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [lessonData, setLessonData] = useState({ title: '', content: '', sequenceOrder: 1 });
  const [assignmentData, setAssignmentData] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(true);

  const isInstructor = user?.role === 'instructor';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes, assignmentsRes] = await Promise.all([
        courseService.getCourse(id),
        lessonService.getLessons(id),
        assignmentService.getAssignments(id),
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await lessonService.createLesson({ ...lessonData, courseId: id });
      setLessonData({ title: '', content: '', sequenceOrder: lessons.length + 1 });
      setShowLessonForm(false);
      fetchCourseData();
    } catch (error) {
      alert('Failed to create lesson');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.createAssignment({ ...assignmentData, courseId: id });
      setAssignmentData({ title: '', description: '', dueDate: '' });
      setShowAssignmentForm(false);
      fetchCourseData();
    } catch (error) {
      alert('Failed to create assignment');
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
          <p className="text-xs text-gray-500 font-mono">{course?.code}</p>
          <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{course?.description}</p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-500">Instructors</p>
            <p className="text-lg font-semibold text-gray-900">{course?.instructors?.length || 0} / {course?.instructorLimit}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-lg font-semibold text-gray-900">{course?.students?.length || 0}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Lessons</p>
            <p className="text-lg font-semibold text-gray-900">{lessons.length}</p>
          </div>
        </div>

        {/* Instructors List */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Instructors</h2>
          </div>
          <div className="p-4">
            {course?.instructors?.length === 0 ? (
              <p className="text-sm text-gray-500">No instructors assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {course?.instructors?.map((instructor) => (
                  <div key={instructor._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                      {instructor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                      <p className="text-xs text-gray-500">{instructor.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Enrolled Students</h2>
          </div>
          <div className="p-4">
            {course?.students?.length === 0 ? (
              <p className="text-sm text-gray-500">No students enrolled yet.</p>
            ) : (
              <div className="space-y-2">
                {course?.students?.map((student) => (
                  <div key={student._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lessons */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Lessons</h2>
            {isInstructor && (
              <button onClick={() => setShowLessonForm(!showLessonForm)} className="btn btn-primary btn-sm">
                {showLessonForm ? 'Cancel' : 'Add Lesson'}
              </button>
            )}
          </div>
          <div className="p-4">
            {showLessonForm && isInstructor && (
              <form onSubmit={handleCreateLesson} className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  className="input"
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Lesson Content"
                  className="textarea"
                  value={lessonData.content}
                  onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Order"
                    className="input w-20"
                    value={lessonData.sequenceOrder}
                    onChange={(e) => setLessonData({ ...lessonData, sequenceOrder: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Create</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {lessons.length === 0 ? (
                <p className="text-sm text-gray-500">No lessons yet.</p>
              ) : (
                lessons.map((lesson) => (
                  <div key={lesson._id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm text-gray-900">{lesson.sequenceOrder}. {lesson.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Assignments</h2>
            {isInstructor && (
              <button onClick={() => setShowAssignmentForm(!showAssignmentForm)} className="btn btn-primary btn-sm">
                {showAssignmentForm ? 'Cancel' : 'Add Assignment'}
              </button>
            )}
          </div>
          <div className="p-4">
            {showAssignmentForm && isInstructor && (
              <form onSubmit={handleCreateAssignment} className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
                <input
                  type="text"
                  placeholder="Assignment Title"
                  className="input"
                  value={assignmentData.title}
                  onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  className="textarea"
                  value={assignmentData.description}
                  onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    className="input"
                    value={assignmentData.dueDate}
                    onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Create</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {assignments.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments yet.</p>
              ) : (
                assignments.map((assignment) => (
                  <div key={assignment._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.description}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageCourse;
