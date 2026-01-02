import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService, lessonService, assignmentService, enrollmentService } from '../../services/api';
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
  const [editingLesson, setEditingLesson] = useState(null);
  const [myStudents, setMyStudents] = useState([]);

  const isInstructor = user?.role === 'instructor';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      // Instructor sees only their own lessons/assignments
      const instructorId = isInstructor ? user._id : null;

      const [courseRes, lessonsRes, assignmentsRes] = await Promise.all([
        courseService.getCourse(id),
        lessonService.getLessons(id, instructorId),
        assignmentService.getAssignments(id, instructorId),
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setAssignments(assignmentsRes.data);

      // Fetch students enrolled with this instructor
      if (isInstructor && user._id) {
        try {
          const studentsRes = await enrollmentService.getStudentsByInstructor(id, user._id);
          setMyStudents(studentsRes.data);
        } catch (err) {
          console.error('Error fetching students:', err);
        }
      }
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

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      await lessonService.updateLesson(editingLesson._id, lessonData);
      setLessonData({ title: '', content: '', sequenceOrder: 1 });
      setEditingLesson(null);
      fetchCourseData();
    } catch (error) {
      alert('Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonService.deleteLesson(lessonId);
      fetchCourseData();
    } catch (error) {
      alert('Failed to delete lesson');
    }
  };

  const startEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonData({
      title: lesson.title,
      content: lesson.content,
      sequenceOrder: lesson.sequenceOrder,
    });
    setShowLessonForm(false);
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setLessonData({ title: '', content: '', sequenceOrder: lessons.length + 1 });
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
            <p className="text-sm text-gray-500">My Students</p>
            <p className="text-lg font-semibold text-gray-900">{myStudents.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Lessons</p>
            <p className="text-lg font-semibold text-gray-900">{lessons.length}</p>
          </div>
        </div>

        {/* My Enrolled Students */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">My Students</h2>
          </div>
          <div className="p-4">
            {myStudents.length === 0 ? (
              <p className="text-sm text-gray-500">No students enrolled in your section yet.</p>
            ) : (
              <div className="space-y-2">
                {myStudents.map((student) => (
                  <div key={student._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium overflow-hidden">
                      {student.profileImage ? (
                        <img src={student.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        student.name?.charAt(0).toUpperCase()
                      )}
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
            {isInstructor && !editingLesson && (
              <button onClick={() => setShowLessonForm(!showLessonForm)} className="btn btn-primary btn-sm">
                {showLessonForm ? 'Cancel' : 'Add Lesson'}
              </button>
            )}
          </div>
          <div className="p-4">
            {/* Create Lesson Form */}
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

            {/* Edit Lesson Form */}
            {editingLesson && isInstructor && (
              <form onSubmit={handleUpdateLesson} className="space-y-3 p-4 bg-blue-50 rounded-lg mb-4 border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Editing Lesson</p>
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
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" onClick={cancelEdit} className="btn btn-secondary btn-sm">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {lessons.length === 0 ? (
                <p className="text-sm text-gray-500">No lessons yet.</p>
              ) : (
                lessons.map((lesson) => (
                  <div key={lesson._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{lesson.sequenceOrder}. {lesson.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                    </div>
                    {isInstructor && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditLesson(lesson)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
