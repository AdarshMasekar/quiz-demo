import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PastResults() {
  const navigate = useNavigate();
  const [pastResults, setPastResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastResults = () => {
      try {
        const storedResults = localStorage.getItem('pastResults');
        if (storedResults) {
          setPastResults(JSON.parse(storedResults));
        } else {
          setPastResults([]);
        }
      } catch (err) {
        console.error('Error fetching past results:', err);
        setError('Failed to load past results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastResults();
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-500">{error}</h1>
        <button
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={handleNavigateToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary-600 dark:text-primary-400">Past Quiz Results</h1>
      {pastResults.length === 0 ? (
        <p className="text-center text-lg mb-6">You haven't taken any quizzes yet. Start a new quiz to see your results here!</p>
      ) : (
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {pastResults.map((result) => (
            <div key={result.id} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-3 text-primary-600 dark:text-primary-400">{result.quizName}</h3>
              <p className="mb-2 text-lg">Score: <span className="font-semibold">{result.score} / {result.totalQuestions}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Date: {new Date(result.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <button
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={handleNavigateToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PastResults;