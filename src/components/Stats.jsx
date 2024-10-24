import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Stats() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Add immediate console logs to debug
    console.log("Stats Component Rendered");
    console.log("Location State:", location.state);
    
    // If there's no state, show a message
    if (!location.state) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/')}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const results = location.state.results || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Past Quiz Results</h2>
                {results.length === 0 ? (
                    <p>No past results found.</p>
                ) : (
                    <div>
                        <p>Found {results.length} results</p>
                        {results.map((result, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                                <p className="text-xl mb-2">
                                    Quiz {result.quizId}
                                </p>
                                <p>
                                    Score: {result.score} / {result.totalQuestions}
                                </p>
                                <p>
                                    Time: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/')}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Stats;
