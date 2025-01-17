import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAuthData } from '../utils/auth';
import axios from 'axios';

const QuizCard = React.memo(({ quiz, onStartQuiz }) => (
  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 max-w-xs mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-between h-full">
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">{quiz.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{quiz.description}</p>
    </div>

    <div className="mt-auto">
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300"
        onClick={() => onStartQuiz(quiz)}
      >
        Start Quiz
      </button>
    </div>
  </div>
));



QuizCard.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onStartQuiz: PropTypes.func.isRequired,
};

function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null); // To handle and display errors
  const { token } = getAuthData();

  useEffect(() => {
    const fetchQuizCategories = async () => {
      try {
        const response = await axios.get('https://my-quiz-backend-1.onrender.com/api/quizzes/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.data;

        // Map API response keys to match `QuizCard`'s expected props
        const responseQuizData = data.map((quiz) => ({
          id: quiz.id,
          title: quiz.title || quiz.name || 'Untitled Quiz',
          description: quiz.description || 'No description provided',
        }));

        setQuizzes(responseQuizData);
      } catch (err) {
        console.error('Error fetching quiz categories:', err);
        setError('Failed to fetch quiz categories. Please try again later.');
      }
    };

    fetchQuizCategories();
  }, [token]);

  const startQuiz = useCallback((quiz) => {
    navigate(`/quiz/${quiz.id}`);
    console.log('Starting Quiz ID:', quiz.id);
  }, [navigate]);

  const renderedQuizCards = useMemo(() =>
    quizzes.map((quiz) => (
      <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={startQuiz} />
    )),
    [quizzes, startQuiz]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {quizzes == [] ? <h2 className="text-3xl font-bold mb-6 text-center text-red-300 dark:text-red-300">Not available</h2> : <h2 className="text-3xl font-bold mb-6 text-center text-green-500 dark:text-green-500">Choose A Quiz</h2>}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedQuizCards}
      </div>
    </div>
  );
}

export default QuizList;
