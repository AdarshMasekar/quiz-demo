import React, { useState, useCallback } from "react";
import axios from "axios";
import { getAuthData } from "../../utils/auth"; // Assuming this utility function exists

const AdminDashboard = () => {
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    totalQuestions: 5,
    timeLimit: 15,
    questions: [],
  });

  // State for theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Generic handler for quiz field changes
  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz((prev) => ({ ...prev, [name]: value }));
  };

  // Generic handler for question field changes
  const handleQuestionChange = useCallback((index, field, value) => {
    setNewQuiz((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  // Generic handler for answer field changes
  const handleAnswerChange = useCallback((qIndex, aIndex, field, value) => {
    setNewQuiz((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedAnswers = [...updatedQuestions[qIndex].answers];
      updatedAnswers[aIndex] = { ...updatedAnswers[aIndex], [field]: value };
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], answers: updatedAnswers };
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  // Add a new question to the quiz
  const handleAddQuizQuestion = useCallback(() => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          questionType: "MULTIPLE_CHOICE",
          difficulty: "EASY",
          answers: Array(4).fill({ answerText: "", isCorrect: false }),
        },
      ],
    }));
  }, []);

  // Submit the quiz data
  const handleSubmitQuiz = useCallback(async () => {
    try {
      const { token } = getAuthData();
      const quizData = {
        ...newQuiz,
        totalQuestions: parseInt(newQuiz.totalQuestions),
        timeLimit: parseInt(newQuiz.timeLimit),
        questions: newQuiz.questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          })),
        })),
      };

      const response = await axios.post(
        "https://my-quiz-backend-1.onrender.com/api/quizzes/create",
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Quiz created successfully!");
        setNewQuiz({
          title: "",
          description: "",
          totalQuestions: 5,
          timeLimit: 15,
          questions: [],
        });
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create the quiz. Please try again.");
    }
  }, [newQuiz]);

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">Create a Quiz</h1>

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className="mb-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">
        Toggle Theme
      </button>

      {/* Quiz Fields */}
      <div className="mb-4">
        <input
          type="text"
          name="title"
          value={newQuiz.title}
          onChange={handleQuizChange}
          className={`border p-2 w-full rounded mb-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          placeholder="Quiz Title"
        />
        <textarea
          name="description"
          value={newQuiz.description}
          onChange={handleQuizChange}
          className={`border p-2 w-full rounded mb-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          placeholder="Quiz Description"
        />
      </div>

      {/* Quiz Settings */}
      <div className="flex mb-4">
        <input
          type="number"
          name="totalQuestions"
          value={newQuiz.totalQuestions}
          onChange={handleQuizChange}
          className={`border p-2 w-1/2 mr-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          placeholder="Total Questions"
        />
        <input
          type="number"
          name="timeLimit"
          value={newQuiz.timeLimit}
          onChange={handleQuizChange}
          className={`border p-2 w-1/2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          placeholder="Time Limit (minutes)"
        />
      </div>

      {/* Questions Section */}
      <h2 className="text-xl font-semibold mb-2">Questions</h2>
      {newQuiz.questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-4 p-4 border rounded">
          <input
            type="text"
            value={question.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
            className={`border p-2 mb-2 w-full rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            placeholder="Question Text"
          />
          <select
            value={question.difficulty}
            onChange={(e) =>
              handleQuestionChange(qIndex, "difficulty", e.target.value)
            }
            className={`border p-2 mb-2 w-full rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Answers */}
          <h4 className="text-md font-semibold mt-2 mb-1">Answers</h4>
          {question.answers.map((answer, aIndex) => (
            <div key={aIndex} className="flex mb-2">
              <input
                type="text"
                value={answer.answerText}
                onChange={(e) =>
                  handleAnswerChange(qIndex, aIndex, "answerText", e.target.value)
                }
                className={`border p-2 flex-grow mr-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                placeholder={`Answer ${aIndex + 1}`}
              />
              <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={() =>
                  handleAnswerChange(
                    qIndex,
                    aIndex,
                    "isCorrect",
                    !answer.isCorrect
                  )
                }
                className="ml-2"
              />
              <label className="ml-2 text-sm">Correct</label>
            </div>
          ))}
        </div>
      ))}

      {/* Add Question Button */}
      <button
        onClick={handleAddQuizQuestion}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        Add Question
      </button>

      {/* Submit Quiz Button */}
      <button
        onClick={handleSubmitQuiz}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default AdminDashboard;
