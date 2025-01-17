import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizList from './QuizList';
import {
  LightBulbIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/outline';
import { getAuthData } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const quizSectionRef = useRef(null);
  const { username } = getAuthData();

  const handleViewPastResults = useCallback(() => {
    navigate('/past-results');
  }, [navigate]);

  const handleStartNewQuiz = useCallback(() => {
    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const features = [
    { icon: LightBulbIcon, text: 'Diverse range of topics', color: 'text-yellow-500' },
    { icon: AcademicCapIcon, text: 'Adaptive difficulty levels', color: 'text-blue-500' },
    { icon: ChartBarIcon, text: 'Track your progress', color: 'text-green-500' },
    { icon: UserGroupIcon, text: 'Compete with friends', color: 'text-purple-500' },
    { icon: BookOpenIcon, text: 'Expand your knowledge', color: 'text-red-500' },
    { icon: ClockIcon, text: 'Timed challenges', color: 'text-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-0">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-primary-600 dark:text-primary-400 leading-tight">
          Welcome to <span className="text-secondary-500">QuizMaster</span>
          {username && <span className="block text-3xl mt-2">{username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}</span>}
        </h1>

        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
            Embark on a journey of knowledge and challenge yourself with our diverse range of quizzes!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={handleViewPastResults}
            aria-label="View Past Results"
          >
            View Past Results
          </button>
          <button
            className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={handleStartNewQuiz}
            aria-label="Start New Quiz"
          >
            Start New Quiz
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-primary-600 dark:text-primary-400 text-center">
            Why Choose QuizMaster?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: IconComponent, text, color }, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-200/50 dark:bg-gray-900/80 rounded-lg"
              >
                <IconComponent className={`h-8 w-8 ${color}`} />
                <span className="text-lg text-gray-700 dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-6 text-center text-primary-600 dark:text-primary-400">
          Available Quizzes
        </h2>
        <div ref={quizSectionRef} className="bg-white dark:bg-gray-800/80 shadow-2xl rounded-lg p-8">
          <QuizList />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
