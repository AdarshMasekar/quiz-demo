import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ClockIcon } from '@heroicons/react/outline';

const mockQuizData = {
  id: 1,
  name: "General Knowledge Quiz",
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      id: 4,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      id: 5,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Silver", "Oxygen", "Iron"],
      correctAnswer: "Oxygen"
    },
    {
      id: 6,
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswer: "Tokyo"
    },
    {
      id: 7,
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare"
    },
    {
      id: 8,
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: "Blue Whale"
    },
    {
      id: 9,
      question: "Which country is home to the Great Barrier Reef?",
      options: ["Brazil", "Australia", "Indonesia", "Philippines"],
      correctAnswer: "Australia"
    },
    {
      id: 10,
      question: "What is the chemical symbol for gold?",
      options: ["Ag", "Au", "Fe", "Cu"],
      correctAnswer: "Au"
    },
    {
      id: 11,
      question: "Who is known as the father of modern physics?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
      correctAnswer: "Albert Einstein"
    },
    {
      id: 12,
      question: "What is the largest desert in the world?",
      options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Antarctic Desert"],
      correctAnswer: "Antarctic Desert"
    },
    {
      id: 13,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "South Korea", "Japan", "Thailand"],
      correctAnswer: "Japan"
    },
    {
      id: 14,
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctAnswer: "2"
    },
    {
      id: 15,
      question: "Who invented the telephone?",
      options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
      correctAnswer: "Alexander Graham Bell"
    },
    {
      id: 16,
      question: "What is the capital of Brazil?",
      options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
      correctAnswer: "Brasília"
    },
    {
      id: 17,
      question: "Which planet in our solar system is known for its prominent rings?",
      options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
      correctAnswer: "Saturn"
    },
    {
      id: 18,
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Onion", "Lime"],
      correctAnswer: "Avocado"
    },
    {
      id: 19,
      question: "Who wrote '1984'?",
      options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
      correctAnswer: "George Orwell"
    },
    {
      id: 20,
      question: "What is the largest organ in the human body?",
      options: ["Brain", "Liver", "Skin", "Heart"],
      correctAnswer: "Skin"
    },
  ]
};

function Quiz({ timeLimit = 10 }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  const handleQuizCompletion = useCallback(() => {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

    let score = 0;
    const detailedAnswers = quizData.questions.map((question, index) => {
      const userAnswer = answers[index]?.answer || 'Not attempted';
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });

    const quizResult = {
      quizId: id,
      quizName: quizData.name,
      score,
      totalQuestions: quizData.questions.length,
      timeTaken,
      detailedAnswers,
      date: new Date().toISOString()
    };

    // Store quiz result in localStorage using the saveQuizResult function
    try {
      const pastResults = JSON.parse(localStorage.getItem('quizResults')) || [];
      pastResults.push(quizResult);
      localStorage.setItem('quizResults', JSON.stringify(pastResults));
    } catch (error) {
      console.error('Error saving quiz result to localStorage:', error);
    }

    navigate(`/result/${id}`, { state: { quizResult } });
  }, [id, quizData, answers, startTime, navigate]);

  useEffect(() => {
    // Fetch quiz data from localStorage
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const currentQuiz = storedQuizzes.find(quiz => quiz.id === parseInt(id));
    
    if (currentQuiz) {
      setQuizData(currentQuiz);
    } else {
      // If not found in localStorage, use mockQuizData
      setQuizData(mockQuizData);
    }
    
    setIsLoading(false);
    setStartTime(new Date());
  }, [id]);

  useEffect(() => {
    if (quizData) {
      setSelectedAnswer(answers[currentQuestionIndex]?.answer || '');
    }
  }, [currentQuestionIndex, answers, quizData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizCompletion();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleQuizCompletion]);

  const handleNextQuestion = useCallback(() => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = { questionId: quizData.questions[currentQuestionIndex].id, answer: selectedAnswer };
      return newAnswers;
    });

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleQuizCompletion();
    }
  }, [currentQuestionIndex, quizData, selectedAnswer, handleQuizCompletion]);

  const handleQuestionNavigation = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const currentQuestion = useMemo(() => {
    return quizData?.questions[currentQuestionIndex];
  }, [quizData, currentQuestionIndex]);

  if (isLoading) {
    return <div className="text-center mt-8 text-2xl text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  if (!quizData || !currentQuestion) {
    return <div className="text-center mt-8 text-2xl text-gray-600 dark:text-gray-300">No quiz data available.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 pt-4 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{quizData.name}</h3>
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-300" />
            <span className="mr-2 text-gray-600 dark:text-gray-300">Time Remaining:</span>
            <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">{formatTime(timeRemaining)}</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/5 mr-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Questions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quizData.questions.map((_, index) => (
                <div key={index} className="flex items-center justify-center">
                  <button
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                      ${answers[index] ? 'bg-green-500' : 'bg-gray-400'}
                      ${currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-4/5">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Question {currentQuestionIndex + 1} of {quizData.questions.length}</h2>
            <h3 className="text-2xl mb-8 text-center text-gray-700 dark:text-gray-200">{currentQuestion.question}</h3>
            <form className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center justify-center">
                  <label className="inline-flex items-center w-full max-w-md p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <input
                      type="radio"
                      className="form-radio text-blue-600 h-5 w-5"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                    />
                    <span className="ml-3 text-lg text-gray-700 dark:text-gray-200">{option}</span>
                  </label>
                </div>
              ))}
            </form>
            <div className="flex justify-center mt-10">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Quiz.propTypes = {
  timeLimit: PropTypes.number
};

export default Quiz;