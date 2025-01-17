import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClockIcon } from '@heroicons/react/outline';
import { getAuthData } from '../utils/auth';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, username } = getAuthData();
  const [showModal, setShowModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const calculateResult = useCallback(() => {
    const totalQuestions = quizData.questions.length;
    const correctAnswers = answers.reduce(
      (acc, answer) => (answer.correctAnswer === answer.selectedAnswer ? acc + 1 : acc),
      0
    );
    const score = (correctAnswers / totalQuestions) * 100;

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const storedResults = JSON.parse(localStorage.getItem(`quizResults${username}`) || '[]');

    const newResult = {
      quizId: parseInt(id, 10),
      quizTitle: quizData.title,
      score,
      totalQuestions,
      correctAnswers,
      response: answers,
      date: new Date().toISOString(),
      timeTaken: elapsedTime,
    };

    localStorage.setItem(`quizResults${username}`, JSON.stringify([...storedResults, newResult]));

    navigate(`/result/${id}`, {
      state: { quizResult: newResult },
      replace: true,
    });
  }, [answers, quizData, id, navigate, startTime, username]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedQuiz = response.data;
        setQuizData(fetchedQuiz);
        setTimeRemaining(fetchedQuiz.timeLimit * 60);
        setStartTime(Date.now());
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateResult]);

  const handleNextQuestion = useCallback(() => {
    if (!selectedAnswer) return;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const correctOption = currentQuestion.options.find((opt) => opt.isCorrect);

    setAnswers((prev) => [
      ...prev,
      {
        questionTitle: currentQuestion.questionText,
        correctAnswer: correctOption.answerText,
        selectedAnswer,
      },
    ]);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer('');
    } else {
      setIsFinished(true);
      setShowModal(true);
    }
  }, [selectedAnswer, currentQuestionIndex, quizData]);

  const handleSubmitQuiz = () => {
    setShowModal(false);
    calculateResult();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isQuestionAnswered = (index) => {
    return answers.some((answer) => answer.questionTitle === quizData.questions[index].questionText);
  };

  if (isLoading) {
    return <div className="text-center mt-8 text-xl text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  if (!quizData) {
    return <div className="text-center mt-8 text-xl text-gray-600 dark:text-gray-300">Quiz not found.</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="flex min-h-screen text-sm">
      {/* Sidebar for Question Numbers */}
      <div className="w-1/6 bg-gray-200 dark:bg-gray-700 p-4">
        <h3 className="text-md font-bold text-center text-gray-800 dark:text-white mb-4">Questions</h3>
        <div className="flex flex-col space-y-1">
          {quizData.questions.map((_, index) => (
            <div
              key={index}
              className={`text-lg font-semibold py-1 px-3 rounded-full cursor-pointer text-center ${isQuestionAnswered(index)
                ? 'bg-green-500 text-white'
                : index === currentQuestionIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
                }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="w-5/6 flex flex-col p-6 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{quizData.title}</h3>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
            <span className="mr-2 text-gray-600 dark:text-gray-300">Time Remaining:</span>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{formatTime(timeRemaining)}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </h2>
          <h3 className="text-lg mb-6 text-center text-gray-700 dark:text-gray-200">{currentQuestion.questionText}</h3>
          <form className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center justify-center">
                <label className="inline-flex items-center w-full max-w-md p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-blue-600 h-4 w-4"
                    name="answer"
                    value={option.answerText}
                    checked={selectedAnswer === option.answerText}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  />
                  <span className="ml-3 text-base text-gray-700 dark:text-gray-200">{option.answerText}</span>
                </label>
              </div>
            ))}
          </form>

          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full text-base"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {isFinished ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg w-1/4">
            <h3 className="text-lg text-center text-gray-800 dark:text-white mb-3">Are you sure you want to submit the quiz?</h3>
            <div className="flex justify-between">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleSubmitQuiz}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
