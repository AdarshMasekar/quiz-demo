import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../utils/auth';

const PastResults = () => {
  const navigate = useNavigate();
  const [pastResults, setPastResults] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const { username } = getAuthData();

  useEffect(() => {
    if (!username) {
      // Redirect to login if no username is found
      navigate('/login');
      return;
    }

    try {
      const storedResults = JSON.parse(localStorage.getItem(`quizResults${username}`)) || [];
      setPastResults(storedResults);
    } catch (error) {
      console.error('Error fetching past results:', error);
    } finally {
      setLoading(false); // Turn off loading after fetching
    }
  }, [username, navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-0 mt-0">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-primary-600 dark:text-primary-400 leading-tight">
          Past Results
        </h1>

        {loading ? (
          <div className="text-center text-xl text-gray-700 dark:text-gray-300">Loading...</div>
        ) : pastResults.length === 0 ? (
          <div className="text-center text-xl text-gray-700 dark:text-gray-300">
            You have no past results.
          </div>
        ) : (
          <div className="space-y-6">
            {pastResults.map((result, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-primary-600 dark:text-primary-400">{result.quizTitle}</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">Score: {result.score}/100</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken: {Math.floor(result.timeTaken / 60)}:{result.timeTaken % 60} min</p>
                <div className="mt-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                    onClick={() => navigate(`/result/${result.quizId}`, { state: { quizResult: result } })}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastResults;
