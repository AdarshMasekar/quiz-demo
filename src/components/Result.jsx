import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getAuthData } from '../utils/auth';

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
  const [quizTitle, setQuizTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { token, username } = getAuthData();

  // Fetch quiz title using the quizId
  useEffect(() => {
    const fetchQuizTitle = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuizTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching quiz title:', error);
      }
    };

    fetchQuizTitle();
  }, [id]);

  useEffect(() => {
    // If quizResult is not in state, fallback to a result object passed via `localStorage` or `navigate`.
    if (!quizResult) {
      const storedResults = JSON.parse(localStorage.getItem(`quizResults${username}`) || '[]');
      const result = storedResults.find((result) => result.quizId === parseInt(id, 10));
      if (result) {
        setQuizResult(result);
      } else {
        console.error('Quiz result not found');
        navigate('/dashboard', { replace: true });
      }
    }
    setIsLoading(false);
  }, [id, quizResult, navigate]);

  const handleNavigateToDashboard = useCallback(() => navigate('/dashboard'), [navigate]);

  const handleNavigateToPastResults = useCallback(() => {
    const results = JSON.parse(localStorage.getItem(`quizResults${username}`) || '[]');
    navigate('/past-results', { state: { results } });
  }, [navigate]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!quizResult) {
    return <div className="container mx-auto px-4 py-8 text-center">No quiz result found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-lg mb-2 font-semibold text-gray-700 dark:text-gray-200">
          Quiz Title: <span className="text-blue-600">{quizTitle || 'Loading...'}</span>
        </p>
        <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
          Total Questions: <span className="font-semibold">{quizResult.totalQuestions}</span>
        </p>
        <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
          Correct Answers: <span className="font-semibold">{quizResult.correctAnswers}</span>
        </p>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Your Score: <span className="text-green-600 dark:text-green-400">{quizResult.score}/100</span>
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your Answers:</h3>
          {quizResult.response.map((answer, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                <strong>Question {index + 1}:</strong> {answer.questionTitle}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Your Answer:</strong> {answer.selectedAnswer}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Correct Answer:</strong> {answer.correctAnswer}
              </p>
              <p className={`text-sm ${answer.selectedAnswer === answer.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {answer.selectedAnswer === answer.correctAnswer ? 'Correct' : 'Incorrect'}
              </p>
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
