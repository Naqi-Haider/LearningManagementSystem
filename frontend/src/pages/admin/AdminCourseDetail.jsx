import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { courseService, lessonService, assignmentService } from '../../services/api';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await courseService.getCourse(id);
      setCourse(data);
      if (data.instructors?.length > 0) {
        setSelectedInstructor(data.instructors[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInstructor) {
      fetchInstructorContent();
    }
  }, [selectedInstructor]);

  const fetchInstructorContent = async () => {
    try {
      const [lessonsRes, assignmentsRes] = await Promise.all([
        lessonService.getLessons(id, selectedInstructor._id),
        assignmentService.getAssignments(id, selectedInstructor._id),
      ]);
      setLessons(lessonsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error fetching instructor content:', error);
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
        {/* Header */}
        <div>
          <Link to="/admin/courses" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Back to Courses
          </Link>
          <p className="text-xs text-gray-500 font-mono">{course?.code}</p>
          <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{course?.description}</p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-500">Total Instructors</p>
            <p className="text-2xl font-bold text-gray-900">{course?.instructors?.length || 0}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{course?.students?.length || 0}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500">Instructor Limit</p>
            <p className="text-2xl font-bold text-gray-900">{course?.instructorLimit || 1}</p>
          </div>
        </div>

        {/* Instructor Tabs */}
        {course?.instructorSections?.length > 0 ? (
          <>
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Select Instructor to View Content</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {course.instructorSections.map((is) => (
                  <button
                    key={is.instructor._id}
                    onClick={() => setSelectedInstructor(is.instructor)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedInstructor?._id === is.instructor._id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {is.instructor.name}
                    <span className={`px-2 py-0.5 text-xs rounded ${selectedInstructor?._id === is.instructor._id ? 'bg-white text-gray-900' : 'bg-blue-100 text-blue-800'}`}>
                      {is.section.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Instructor Content */}
            {selectedInstructor && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Viewing content from: {selectedInstructor.name} ({selectedInstructor.email}) - Section {course.instructorSections.find(s => s.instructor._id === selectedInstructor._id)?.section?.toUpperCase()}
                  </p>
                </div>

                {/* Lessons */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Lessons by {selectedInstructor.name}</h2>
                  </div>
                  <div className="p-4">
                    {lessons.length === 0 ? (
                      <p className="text-sm text-gray-500">No lessons created yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {lessons.map((lesson) => (
                          <div key={lesson._id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-sm text-gray-900">
                              {lesson.sequenceOrder}. {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Assignments */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Assignments by {selectedInstructor.name}</h2>
                  </div>
                  <div className="p-4">
                    {assignments.length === 0 ? (
                      <p className="text-sm text-gray-500">No assignments created yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {assignments.map((assignment) => (
                          <div key={assignment._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                              <p className="text-xs text-gray-500">{assignment.description}</p>
                            </div>
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
            )}
          </>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500">No instructors have joined this course yet.</p>
          </div>
        )}

        {/* All Students */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">All Enrolled Students</h2>
          </div>
          <div className="p-4">
            {course?.students?.length === 0 ? (
              <p className="text-sm text-gray-500">No students enrolled yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
      </div>
    </MainLayout>
  );
};

export default AdminCourseDetail;
