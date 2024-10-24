import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [quizResult, setQuizResult] = useState(location.state?.quizResult || null);
  const [storedResults] = useState(JSON.parse(localStorage.getItem('quizResults') || '[]'));

  useEffect(() => {
    console.log('Location State:', location.state); // Debug log
    console.log('Stored Results:', storedResults); // Debug log
    
    if (!quizResult) {
      const result = storedResults.find(result => result.quizId === id);
      console.log('Found Result:', result); // Debug log
      
      if (result) {
        setQuizResult(result);
      } else {
        console.error('Quiz result not found');
        navigate('/', { replace: true });
      }
    } else {
      // Store new quiz result if it doesn't exist in localStorage
      const existingResult = storedResults.find(result => result.quizId === id);
      if (!existingResult) {
        const updatedResults = [...storedResults, quizResult];
        localStorage.setItem('quizResults', JSON.stringify(updatedResults));
        console.log('Updated Results:', updatedResults); // Debug log
      }
    }
  }, [id, storedResults, quizResult, navigate, location.state]);

  // Add error boundary
  if (!quizResult) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  const handleNavigateToDashboard = useCallback(() => navigate('/'), [navigate]);
  const handleNavigateToPastResults = useCallback(() => {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    console.log('About to navigate with results:', results); // Debug log
    
    if (results.length === 0) {
      console.log('No results found in localStorage');
    }
    
    navigate('/stats', { 
      state: { results: results }
    });
  }, [navigate]);

  // Add a function to clear results
  const clearResults = useCallback(() => {
    localStorage.removeItem('quizResults');
    console.log('Results cleared from localStorage');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-6">
          Your Score: {quizResult.score} / {quizResult.totalQuestions}
        </p>
        <p className="text-lg mb-6">
          Time Taken: {Math.floor(quizResult.timeTaken / 60)}m {quizResult.timeTaken % 60}s
        </p>
        
        {/* Questions Review Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Questions Review</h3>
          {quizResult.detailedAnswers?.map((answer, index) => (
            <div 
              key={index} 
              className="mb-6 p-4 border rounded-lg dark:border-gray-700"
            >
              <p className="font-medium mb-2">
                Question {index + 1}: {answer.question}
              </p>
              <div className="ml-4">
                <p className="text-green-600 dark:text-green-400">
                  Correct Answer: {answer.correctAnswer}
                </p>
                <p className={`${
                  answer.isCorrect
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  Your Answer: {answer.userAnswer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-gray-500 hover:bg-gray-700"
            onClick={handleNavigateToDashboard}
          >
            Back to Dashboard
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700"
            onClick={clearResults}
          >
            Clear All Results
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
