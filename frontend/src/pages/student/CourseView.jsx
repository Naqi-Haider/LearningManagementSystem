import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService, lessonService, assignmentService, enrollmentService } from '../../services/api';

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes, assignmentsRes, enrollmentRes] = await Promise.all([
        courseService.getCourse(id),
        lessonService.getLessons(id),
        assignmentService.getAssignments(id),
        enrollmentService.getEnrollment(id),
      ]);

      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setAssignments(assignmentsRes.data);
      setEnrollment(enrollmentRes.data);

      if (lessonsRes.data.length > 0) {
        setSelectedLesson(lessonsRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await lessonService.completeLesson(lessonId, id);
      fetchCourseData();
    } catch (error) {
      alert('Failed to mark lesson as complete');
    }
  };

  const isLessonComplete = (lessonId) => {
    return enrollment?.completedLessons?.some(l => l._id === lessonId || l === lessonId);
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
          <div className="mt-4 max-w-md">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="text-gray-700">{Math.round(enrollment?.progress || 0)}%</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${enrollment?.progress || 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                {selectedLesson ? (
                  <>
                    <h2 className="font-semibold text-lg text-gray-900">{selectedLesson.title}</h2>
                    <div className="mt-4 prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedLesson.content}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      {!isLessonComplete(selectedLesson._id) ? (
                        <button
                          onClick={() => handleCompleteLesson(selectedLesson._id)}
                          className="btn btn-primary btn-sm"
                        >
                          Mark as Complete
                        </button>
                      ) : (
                        <span className="badge badge-success">Completed</span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No lessons available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lessons List */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">Lessons</h3>
              </div>
              <div className="p-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 ${selectedLesson?._id === lesson._id
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {isLessonComplete(lesson._id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{lesson.sequenceOrder}. {lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">Assignments</h3>
              </div>
              <div className="p-4">
                {assignments.length === 0 ? (
                  <p className="text-xs text-gray-500">No assignments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseView;
