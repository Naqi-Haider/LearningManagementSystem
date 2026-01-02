import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { assignmentService } from '../../services/api';

const AssignmentDetail = () => {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const { data } = await assignmentService.getAssignments(courseId);
      const found = data.find(a => a._id === assignmentId);
      setAssignment(found);

      // Check if already submitted
      if (found?.submissions?.length > 0) {
        setExistingSubmission(found.submissions[0]);
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission.trim()) {
      setMessage('Please enter your submission content');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await assignmentService.submitAssignment(assignmentId, submission);
      setMessage('Assignment submitted successfully!');
      fetchAssignment();
      setSubmission('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const isPastDue = assignment && new Date(assignment.dueDate) < new Date();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="spinner spinner-lg"></div>
        </div>
      </MainLayout>
    );
  }

  if (!assignment) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Assignment not found</p>
          <Link to={`/student/courses/${courseId}`} className="btn btn-primary btn-sm mt-4">
            Back to Course
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Link
            to={`/student/courses/${courseId}`}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className={`badge ${isPastDue ? 'badge-error' : 'badge-warning'}`}>
              Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString()}
            </span>
            {existingSubmission && (
              <span className="badge badge-success">Submitted</span>
            )}
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {/* Assignment Description */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Assignment Details</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
        </div>

        {/* Existing Submission */}
        {existingSubmission && (
          <div className="card p-6 border-green-200 bg-green-50">
            <h2 className="font-semibold text-green-800 mb-3">Your Submission</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{existingSubmission.content}</p>
            <p className="text-xs text-gray-500 mt-3">
              Submitted on: {new Date(existingSubmission.submittedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Submission Form */}
        {!existingSubmission && !isPastDue && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Submit Your Work</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="textarea w-full h-40"
                placeholder="Enter your assignment submission here..."
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Past Due Message */}
        {isPastDue && !existingSubmission && (
          <div className="card p-6 border-red-200 bg-red-50">
            <p className="text-red-700 font-medium">
              This assignment is past its due date. Submissions are no longer accepted.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AssignmentDetail;
