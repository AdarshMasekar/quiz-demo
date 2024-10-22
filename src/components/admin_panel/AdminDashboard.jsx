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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleQuestionChange = (e) => {
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

  const handleAddQuestion = async () => {
    try {
      await axios.post('/api/questions', newQuestion);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Category</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Category name"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Add Question</h2>
        <select
          name="categoryId"
          value={newQuestion.categoryId}
          onChange={handleQuestionChange}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <textarea
          name="questionText"
          value={newQuestion.questionText}
          onChange={handleQuestionChange}
          className="border p-2 mb-2 w-full"
          placeholder="Question text"
        />
        {newQuestion.answers.map((answer, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={answer.answerText}
              onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
              className="border p-2 flex-grow mr-2"
              placeholder={`Answer ${index + 1}`}
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                className="mr-2"
              />
              Correct
            </label>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;