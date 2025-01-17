import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://my-quiz-backend-1.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username,
          password: password 
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { jwtToken, refreshToken, role } = data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', role);

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(jwtToken, username, role);
      } else {
        console.error('onLoginSuccess is not a function');
      }

      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [username, password, navigate, onLoginSuccess]);

  const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-primary-600 dark:text-primary-400 leading-tight">
          Welcome to <span className="text-secondary-500 dark:text-secondary-400">QuizMaster</span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
            Sign in to your account and continue your journey of knowledge!
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 mb-12 max-w-md mx-auto">
          {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4 text-center" role="alert">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow-sm border-2 border-primary-200 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:bg-gray-700"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                required
                aria-label="Username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow-sm border-2 border-primary-200 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent pr-10 dark:bg-gray-700"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  aria-label="Password" 
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <Link
                to="/register"
                className="inline-block align-baseline font-bold text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-300"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default React.memo(Login);
