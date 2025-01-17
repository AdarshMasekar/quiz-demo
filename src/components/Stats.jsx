import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/outline';
import { getAuthData } from '../utils/auth';

function Stats() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        averageScore: 0,
        totalTime: 0
    });
    const { token, username } = getAuthData();
    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem(`quizResults${username}`)) || [];
        setResults(storedResults);
        if (storedResults.length > 0) {
            const totalQuizzes = storedResults.length;
            const totalScore = storedResults.reduce((acc, result) => acc + result.score, 0);
            const totalTime = storedResults.reduce((acc, result) => acc + result.timeTaken, 0);
            const averageScore = totalScore / totalQuizzes;

            setStats({
                totalQuizzes,
                averageScore: averageScore.toFixed(2),
                totalTime: Math.floor(totalTime / 60)
            });
        }
    }, []);

    if (results.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
                <button
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400 text-center mb-8">Past Quiz Results</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg shadow-lg text-center">
                        <ChartBarIcon className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Total Quizzes</h3>
                        <p className="text-3xl font-bold">{stats.quizTitle}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-lg shadow-lg text-center">
                        <AcademicCapIcon className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Average Score</h3>
                        <p className="text-3xl font-bold">{stats.averageScore}%</p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white p-6 rounded-lg shadow-lg text-center">
                        <ClockIcon className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Total Time Spent</h3>
                        <p className="text-3xl font-bold">{stats.totalTime} min</p>
                    </div>
                </div>

                {/* Individual Results */}
                {results.length > 0 && (
                    <div>
                        {results.map((result, index) => (
                            <div key={index} className="bg-white dark:bg-gray-700 mb-6 p-6 border-2 rounded-lg shadow-lg dark:border-gray-600">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">{result.quizTitle}</p>
                                        <p className="text-gray-500 dark:text-gray-300">Score: {result.score} / {result.totalQuestions}</p>
                                        <p className="text-gray-500 dark:text-gray-300">Time: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
                                    </div>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                                        onClick={() => navigate(`/result/${result.quizId}`, {
                                            state: {
                                                quizResult: result,
                                                score: result.score,
                                                totalQuestions: result.totalQuestions,
                                                timeTaken: result.timeTaken,
                                                answers: result.answers,
                                                questions: result.questions
                                            }
                                        })}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Stats;
