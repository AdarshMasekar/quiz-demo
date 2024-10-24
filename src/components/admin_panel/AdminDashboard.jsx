import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    categoryId: '',
    questionText: '',
    answers: [
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
    ],
  });
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    totalQuestions: 5,
    timeLimit: 15,
    questions: [],
  });

  useEffect(() => {
    fetchCategories();
    // Set up axios defaults
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8084/api/quizzes/create', { name: newCategory }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleSingleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = newQuestion.answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, [field]: value };
      }
      return answer;
    });
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleAddSingleQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8084/api/quizzes/create', newQuestion, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNewQuestion({
        categoryId: '',
        questionText: '',
        answers: [
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
        ],
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleQuizChange = (e) => {
    setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });
  };

  const handleAddQuizQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          questionText: '',
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          answers: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
          ],
        },
      ],
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = newQuiz.questions.map((question, i) => {
      if (i === index) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleQuizAnswerChange = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = newQuiz.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        const updatedAnswers = question.answers.map((answer, aIndex) => {
          if (aIndex === answerIndex) {
            return { ...answer, [field]: value };
          }
          return answer;
        });
        return { ...question, answers: updatedAnswers };
      }
      return question;
    });
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare the quiz data
      const quizData = {
        title: newQuiz.title,
        description: newQuiz.description,
        totalQuestions: parseInt(newQuiz.totalQuestions),
        timeLimit: parseInt(newQuiz.timeLimit),
        questions: newQuiz.questions.map(question => ({
          questionText: question.questionText,
          questionType: question.questionType,
          difficulty: question.difficulty,
          answers: question.answers.map(answer => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect
          }))
        }))
      };

      // Send the quiz data to the API
      const response = await axios.post('http://localhost:8084/api/quizzes/create', quizData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if the quiz was successfully created (accept both 200 and 201)
      if (response.status === 200 || response.status === 201) {
        console.log('Quiz created successfully:', response.data);
        // Reset all form fields
        setNewQuiz({
          title: '',
          description: '',
          totalQuestions: 5,
          timeLimit: 15,
          questions: [],
        });
        // Show a success message to the user
        alert('Quiz created successfully!');
      } else {
        console.error('Unexpected response status:', response.status);
        alert('An unexpected error occurred while creating the quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error adding quiz:', error);
      alert('An error occurred while creating the quiz. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Category</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 p-2 mr-2 rounded"
          placeholder="Category name"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Quiz</h2>
        <input
          type="text"
          name="title"
          value={newQuiz.title}
          onChange={handleQuizChange}
          className="bg-gray-800 text-white border border-gray-700 p-2 mb-2 w-full rounded"
          placeholder="Quiz title"
        />
        <textarea
          name="description"
          value={newQuiz.description}
          onChange={handleQuizChange}
          className="bg-gray-800 text-white border border-gray-700 p-2 mb-2 w-full rounded"
          placeholder="Quiz description"
        />
        <div className="flex mb-2">
          <input
            type="number"
            name="totalQuestions"
            value={newQuiz.totalQuestions}
            onChange={handleQuizChange}
            className="bg-gray-800 text-white border border-gray-700 p-2 w-1/2 mr-2 rounded"
            placeholder="Total questions"
          />
          <input
            type="number"
            name="timeLimit"
            value={newQuiz.timeLimit}
            onChange={handleQuizChange}
            className="bg-gray-800 text-white border border-gray-700 p-2 w-1/2 rounded"
            placeholder="Time limit (minutes)"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2">Questions</h3>
        {newQuiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-4 p-4 border border-gray-700 rounded">
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 p-2 mb-2 w-full rounded"
              placeholder="Question text"
            />
            <select
              value={question.difficulty}
              onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 p-2 mb-2 w-full rounded"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <h4 className="text-md font-semibold mt-2 mb-1">Answers</h4>
            {question.answers.map((answer, aIndex) => (
              <div key={aIndex} className="flex mb-2">
                <input
                  type="text"
                  value={answer.answerText}
                  onChange={(e) => handleQuizAnswerChange(qIndex, aIndex, 'answerText', e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 p-2 flex-grow mr-2 rounded"
                  placeholder={`Answer ${aIndex + 1}`}
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(e) => handleQuizAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                    className="mr-2 bg-gray-800 border-gray-700"
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={handleAddQuizQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
        >
          Add Question
        </button>
        <button
          onClick={handleSubmitQuiz}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
