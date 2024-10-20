import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const defaultQuizCategories = [
  { id: 1, name: 'General Knowledge', description: 'Test your general knowledge' },
  { id: 2, name: 'Science', description: 'Explore scientific concepts' },
  { id: 3, name: 'History', description: 'Journey through historical events' },
  { id: 4, name: 'Geography', description: 'Discover the world around you' },
];

const QuizCard = React.memo(({ category, onStartQuiz }) => (
  <div className="bg-gray-200/50 dark:bg-gray-900/80 shadow-md rounded-lg p-6 scale-95 transition-transform duration-300 hover:scale-100">
    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      onClick={() => onStartQuiz(category.id)}
    >
      Start Quiz
    </button>
  </div>
));

QuizCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onStartQuiz: PropTypes.func.isRequired,
};

function QuizList() {
  const navigate = useNavigate();
  const [quizCategories, setQuizCategories] = useState([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem('quizCategories');
    if (storedCategories) {
      setQuizCategories(JSON.parse(storedCategories));
    } else {
      localStorage.setItem('quizCategories', JSON.stringify(defaultQuizCategories));
      setQuizCategories(defaultQuizCategories);
    }
  }, []);

  const startQuiz = useCallback((quizId) => {
    navigate(`/quiz/${quizId}`);
  }, [navigate]);

  const renderedQuizCards = useMemo(() => 
    quizCategories.map((category) => (
      <QuizCard key={category.id} category={category} onStartQuiz={startQuiz} />
    ))
  , [quizCategories, startQuiz]);

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h2 className="text-3xl font-bold mb-6 text-center">Choose a Quiz Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedQuizCards}
      </div>
    </div>
  );
}

export default QuizList;