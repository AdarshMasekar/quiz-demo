import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/solid';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newQuestion, setNewQuestion] = useState({ category: '', question: '', options: ['', '', '', ''], correctAnswer: '' });

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setUsers(storedUsers);
    setCategories(storedCategories);
  }, []);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      saveToLocalStorage('categories', updatedCategories);
      setNewCategory('');
    }
  };

  const handleAddQuestion = () => {
    const updatedUsers = [...users];
    const categoryIndex = updatedUsers.findIndex(user => user.category === newQuestion.category);
    if (categoryIndex > -1) {
      updatedUsers[categoryIndex].questions.push(newQuestion);
    } else {
      updatedUsers.push({ category: newQuestion.category, questions: [newQuestion] });
    }
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
    setNewQuestion({ category: '', question: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-2" title="View Results">
                      <EyeIcon className="h-5 w-5 inline" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 mr-2" title="Edit User">
                      <PencilIcon className="h-5 w-5 inline" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Category Management</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAddCategory} 
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 inline mr-1" />
            Add
          </button>
        </div>
        <ul className="bg-white shadow-md rounded-lg overflow-hidden">
          {categories.map((category, index) => (
            <li key={index} className="px-4 py-3 border-b last:border-b-0 text-gray-700">{category}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add Question</h2>
        <div className="space-y-4 bg-white shadow-md rounded-lg p-6">
          <select
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            placeholder="Question"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...newQuestion.options];
                newOptions[index] = e.target.value;
                setNewQuestion({...newQuestion, options: newOptions});
              }}
              placeholder={`Option ${index + 1}`}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <select
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Correct Answer</option>
            {newQuestion.options.map((option, index) => (
              <option key={index} value={option}>{option || `Option ${index + 1}`}</option>
            ))}
          </select>
          <button 
            onClick={handleAddQuestion} 
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 inline mr-1" />
            Add Question
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
