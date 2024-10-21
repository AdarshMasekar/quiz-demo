import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LightBulbIcon, AcademicCapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

const FeatureCard = React.memo(({ icon: Icon, title, description, iconColor }) => (
  <div className="hover:cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <div className="flex justify-center mb-4">
      <Icon className={`h-12 w-12 ${iconColor}`} />
    </div>
    <h2 className="text-xl font-semibold mb-3 text-center text-primary-600 dark:text-primary-400">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
  </div>
));

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
};

FeatureCard.displayName = 'FeatureCard';

const defaultFeatures = [
  {
    icon: LightBulbIcon,
    title: "Diverse Topics",
    description: "Explore a wide range of quiz categories to suit all interests.",
    iconColor: "text-yellow-500",
  },
  {
    icon: AcademicCapIcon,
    title: "Learn & Grow",
    description: "Get instant feedback and expand your knowledge with every quiz.",
    iconColor: "text-blue-500",
  },
  {
    icon: ClockIcon,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed statistics.",
    iconColor: "text-indigo-500",
  },
  {
    icon: UserGroupIcon,
    title: "Compete & Connect",
    description: "Challenge friends and climb the global leaderboard.",
    iconColor: "text-purple-500",
  },
];

const Home = () => {
  const [features, setFeatures] = useState(defaultFeatures);
  const [leaderboard, setLeaderboard] = useState([
    { username: 'QuizMaster123', timeTaken: '2m 30s', score: '95/100', category: 'Science' },
    { username: 'BrainiacQueen', timeTaken: '3m 15s', score: '90/100', category: 'History' },
    { username: 'TriviaKing', timeTaken: '2m 45s', score: '88/100', category: 'Geography' },
    { username: 'KnowledgeNinja', timeTaken: '3m 00s', score: '85/100', category: 'Literature' },
    { username: 'QuizWhiz', timeTaken: '3m 30s', score: '82/100', category: 'Sports' },
  ]);

  const renderedFeatures = useMemo(() => {
    return features.map((feature, index) => (
      <FeatureCard
        key={index}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
        iconColor={feature.iconColor}
      />
    ));
  }, [features]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-primary-600 dark:text-primary-400">Welcome to QuizMaster</h1>
        <p className="text-2xl text-center mb-12 text-gray-700 dark:text-gray-300">
          Embark on a journey of knowledge, challenge yourself, and have fun!
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {renderedFeatures}
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-600 dark:text-primary-400">Leaderboard</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-300">
                  <th className="py-2">Username</th>
                  <th className="py-2">Time Taken</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">category</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2 text-primary-600 dark:text-primary-400">{entry.username}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">{entry.timeTaken}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">{entry.score}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">{entry.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;