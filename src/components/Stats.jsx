
import React, { useState, useEffect } from 'react';

function Stats() {
    const [quizResults, setQuizResults] = useState([]);

    useEffect(() => {
        const fetchQuizResults = () => {
            try {
                const userId = localStorage.getItem('userId') || '4'; // Get user ID from localStorage, default to '4' if not found
                const storedResults = JSON.parse(localStorage.getItem('quizResults')) || [];
                const filteredResults = storedResults.filter(result => result.user_id === userId);
                setQuizResults(filteredResults);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
            }
        };

        fetchQuizResults();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Quiz Results</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Quiz Name</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Score</th>
                            <th className="px-4cls py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Time Taken</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {quizResults.map((result, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">{result.quiz_name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">{new Date(result.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">{result.score}/{result.total_questions}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">{Math.floor(result.time_taken / 60)} minutes</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stats;