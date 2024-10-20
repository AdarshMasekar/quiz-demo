import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ onClick, className, children }) => (
  <button
    className={`text-white font-bold py-2 px-4 rounded transition-colors duration-300 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchQuizResult = () => {
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      const result = storedResults.find(result => result.quizId === id);
      if (result) {
        setQuizResult(result);
      } else {
        console.error('Quiz result not found');
        // Optionally, you can navigate to an error page or show an error message
      }
    };

    fetchQuizResult();
  }, [id]);

  const score = useMemo(() => quizResult?.score || 0, [quizResult]);
  const totalQuestions = useMemo(() => quizResult?.totalQuestions || 0, [quizResult]);

  const handleNavigateToDashboard = useCallback(() => navigate('/'), [navigate]);
  const handleNavigateToPastResults = useCallback(() => navigate('/stats'), [navigate]);

  if (!quizResult) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-6">Your Score: {score} / {totalQuestions}</p>
        <div className="flex justify-between">
          <Button
            className="bg-gray-500 hover:bg-gray-700"
            onClick={handleNavigateToDashboard}
          >
            Back to Dashboard
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700"
            onClick={handleNavigateToPastResults}
          >
            View Past Results
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Result;