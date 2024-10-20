import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LightBulbIcon, AcademicCapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

const FeatureCard = React.memo(({ icon: Icon, title, description }) => (
  <div className="hover:cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <div className="flex justify-center mb-4">
      <Icon className="h-12 w-12 text-primary-500" />
    </div>
    <h2 className="text-xl font-semibold mb-3 text-center text-primary-600 dark:text-primary-400">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
  </div>
));

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

FeatureCard.displayName = 'FeatureCard';

const defaultFeatures = [
  {
    icon: LightBulbIcon,
    title: "Diverse Topics",
    description: "Explore a wide range of quiz categories to suit all interests.",
  },
  {
    icon: AcademicCapIcon,
    title: "Learn & Grow",
    description: "Get instant feedback and expand your knowledge with every quiz.",
  },
  {
    icon: ClockIcon,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed statistics.",
  },
  {
    icon: UserGroupIcon,
    title: "Compete & Connect",
    description: "Challenge friends and climb the global leaderboard.",
  },
];

const Home = () => {
  const [features, setFeatures] = useState(() => {
    const storedFeatures = localStorage.getItem('quizMasterFeatures');
    return storedFeatures ? JSON.parse(storedFeatures) : defaultFeatures;
  });

  useEffect(() => {
    if (!localStorage.getItem('quizMasterFeatures')) {
      localStorage.setItem('quizMasterFeatures', JSON.stringify(defaultFeatures));
    }
  }, []);

  const renderedFeatures = useMemo(() => (
    features.map((feature, index) => (
      <FeatureCard
        key={index}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))
  ), [features]);

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