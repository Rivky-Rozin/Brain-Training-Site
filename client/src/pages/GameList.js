import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function that receives a category number and returns its name
    const getCategoryName = (category) => {
        switch (category) {
            case 1: return 'Memory';
            case 2: return 'Hand Speed';
            case 3: return 'Thinking';
            case 4: return 'Spatial Perception';
            case 5: return 'Quick Reaction';
            default: return 'Other';
        }
    };

    // Function that receives a category number and returns its color
    const getCategoryColor = (category) => {
        switch (category) {
            case 1: return 'bg-purple-100 border-purple-500';
            case 2: return 'bg-blue-100 border-blue-500';
            case 3: return 'bg-green-100 border-green-500';
            case 4: return 'bg-yellow-100 border-yellow-500';
            case 5: return 'bg-red-100 border-red-500';
            default: return 'bg-gray-100 border-gray-500';
        }
    };

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('/api/games');
                console.log('Games fetched:', response.data);
                setGames(response.data.games);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Error loading games');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading games...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    // Sort games by categories
    const gamesByCategory = games.reduce((acc, game) => {
        if (!acc[game.category]) {
            acc[game.category] = [];
        }
        acc[game.category].push(game);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Brain Games</h1>
                
                {/* Display games by categories */}
                {Object.entries(gamesByCategory).map(([category, categoryGames]) => (
                    <div key={category} className="mb-12">
                        <h2 className={`text-2xl font-bold mb-6 p-4 rounded-lg border-r-4 ${getCategoryColor(parseInt(category))}`}>
                            {getCategoryName(parseInt(category))}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryGames.map((game) => (
                                <Link 
                                    key={game.id} 
                                    to={`/game/${game.id}`}
                                    className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-3 text-gray-800">{game.name}</h3>
                                        <p className="text-gray-600 mb-6">{game.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Difficulty: {game.difficulty === 1 ? 'Easy' : game.difficulty === 2 ? 'Medium' : 'Hard'}
                                            </span>
                                            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                                                Start Game
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameList;
