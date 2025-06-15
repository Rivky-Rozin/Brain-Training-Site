import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/games');
                console.log('Games fetched:', response.data);
                setGames(response.data.games);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('שגיאה בטעינת המשחקים');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return <div className="text-center mt-4">טוען משחקים...</div>;
    }

    if (error) {
        return <div className="text-center mt-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">משחקי מוח</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                    <Link 
                        key={game.id} 
                        to={`/game/${game.id}`}
                        className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                            <p className="text-gray-600 mb-4">{game.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    רמת קושי: {game.difficulty === 1 ? 'קל' : game.difficulty === 2 ? 'בינוני' : 'קשה'}
                                </span>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                                    התחל משחק
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GameList; 