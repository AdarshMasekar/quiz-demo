import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-900 dark:text-white mb-4 animate-pulse">
          4<span className="text-blue-600">0</span>4
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Oops! Looks like you've ventured into unknown territory.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-all duration-300 transform hover:scale-105 
                     hover:shadow-lg inline-flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return to Safety</span>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
