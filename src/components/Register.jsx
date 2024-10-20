import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get existing users from localStorage or initialize an empty array
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

      // Check if user already exists
      const userExists = existingUsers.some(user => user.email === email || user.username === username);

      if (userExists) {
        setError('User with this email or username already exists.');
        setIsLoading(false);
        return;
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        isAdmin
      };

      // Add new user to the array
      existingUsers.push(newUser);

      // Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(existingUsers));

      console.log('User registered:', newUser);
      onRegisterSuccess();
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password, isAdmin, navigate, onRegisterSuccess]);

  const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleAdminChange = useCallback((e) => setIsAdmin(e.target.checked), []);
  const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-0 mt-0">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-primary-600 dark:text-primary-400 leading-tight">
          Join <span className="text-secondary-500 dark:text-secondary-400">QuizMaster</span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
            Create your account and start your journey of knowledge!
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 mb-12 max-w-md mx-auto">
          {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4 text-center" role="alert">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow-sm border-2 border-primary-200 dark:border-primary-100 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:bg-gray-700"
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={handleUsernameChange}
                required
                aria-label="Username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow-sm border-2 border-primary-200 dark:border-primary-700 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:bg-gray-700"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                aria-label="Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow-sm border-2 border-primary-200 dark:border-primary-700 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent pr-10 dark:bg-gray-700"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 bg-transparent"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={handleAdminChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Register as Admin
              </label>
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                className="bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <Link
                to="/login"
                className="inline-block align-baseline font-bold text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-300"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  onRegisterSuccess: PropTypes.func.isRequired,
};

export default Register;