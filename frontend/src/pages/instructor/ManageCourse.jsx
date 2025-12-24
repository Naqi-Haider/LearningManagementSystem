import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService, lessonService, assignmentService } from '../../services/api';

const ManageCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [lessonData, setLessonData] = useState({ title: '', content: '', sequenceOrder: 1 });
  const [assignmentData, setAssignmentData] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(true);

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

        {/* Lessons */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Lessons</h2>
            <button onClick={() => setShowLessonForm(!showLessonForm)} className="btn btn-primary btn-sm">
              {showLessonForm ? 'Cancel' : 'Add Lesson'}
            </button>
          </div>
          <div className="p-4">
            {showLessonForm && (
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
            <button onClick={() => setShowAssignmentForm(!showAssignmentForm)} className="btn btn-primary btn-sm">
              {showAssignmentForm ? 'Cancel' : 'Add Assignment'}
            </button>
          </div>
          <div className="p-4">
            {showAssignmentForm && (
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
