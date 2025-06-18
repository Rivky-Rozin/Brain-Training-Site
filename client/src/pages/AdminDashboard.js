import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const [usersRes, gamesRes, resultsRes] = await Promise.all([
                    axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/games', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/results/all', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setUsers(usersRes.data.users || []);
                setGames(gamesRes.data.games || []);
                setResults(resultsRes.data.results || []);
            } catch (err) {
                setError('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Export table to Excel
    const exportToExcel = (data, fileName) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, fileName);
    };

    // Upgrade user to admin
    const makeAdmin = async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`/api/users/${userId}/role`, { role: 1 }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update users locally
            setUsers(users => users.map(u => u.id === userId ? { ...u, role: 1 } : u));
        } catch (err) {
            alert('Error upgrading to admin');
        }
    };

    // Calculate game statistics
    const getGameStats = (gameId) => {
        const gameResults = results.filter(r => r.gameId === gameId);
        if (gameResults.length === 0) return { avgScore: '-', avgTime: '-', totalTime: '-' };
        const avgScore = (gameResults.reduce((sum, r) => sum + r.score, 0) / gameResults.length).toFixed(2);
        const avgTime = (gameResults.reduce((sum, r) => sum + r.timeSpent, 0) / gameResults.length).toFixed(2);
        const totalTime = gameResults.reduce((sum, r) => sum + r.timeSpent, 0);
        return { avgScore, avgTime, totalTime };
    };

    if (loading) return <div className="p-8">Loading data...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center drop-shadow">Admin Dashboard</h1>

                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700 border-b pb-2">Users List
                    <button className="ml-4 bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded transition-all duration-200" onClick={() => exportToExcel(users, 'users.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="overflow-x-auto mb-10">
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Username</th>
                            <th className="border px-4 py-2">Role</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-blue-50 transition-all">
                                <td className="border px-4 py-2">{user.id}</td>
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.role === 1 ? 'Admin' : 'User'}</td>
                                <td className="border px-4 py-2">
                                    {user.role !== 1 && (
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded transition-all duration-200" onClick={() => makeAdmin(user.id)}>
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700 border-b pb-2">Games List
                    <button className="ml-4 bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded transition-all duration-200" onClick={() => exportToExcel(games, 'games.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="overflow-x-auto mb-10">
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Game Name</th>
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Difficulty</th>
                            <th className="border px-4 py-2">Avg. Score</th>
                            <th className="border px-4 py-2">Avg. Time (sec)</th>
                            <th className="border px-4 py-2">Total Time (sec)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map(game => {
                            const stats = getGameStats(game.id);
                            return (
                                <tr key={game.id} className="hover:bg-blue-50 transition-all">
                                    <td className="border px-4 py-2">{game.id}</td>
                                    <td className="border px-4 py-2">{game.name}</td>
                                    <td className="border px-4 py-2">{game.category}</td>
                                    <td className="border px-4 py-2">{game.difficulty}</td>
                                    <td className="border px-4 py-2">{stats.avgScore}</td>
                                    <td className="border px-4 py-2">{stats.avgTime}</td>
                                    <td className="border px-4 py-2">{stats.totalTime}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>

                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700 border-b pb-2">User Game Results
                    <button className="ml-4 bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded transition-all duration-200" onClick={() => exportToExcel(results, 'results.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2">User</th>
                            <th className="border px-4 py-2">Game</th>
                            <th className="border px-4 py-2">Score</th>
                            <th className="border px-4 py-2">Time (sec)</th>
                            <th className="border px-4 py-2">Completed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.id} className="hover:bg-blue-50 transition-all">
                                <td className="border px-4 py-2">{result.User?.username}</td>
                                <td className="border px-4 py-2">{result.Game?.name}</td>
                                <td className="border px-4 py-2">{result.score}</td>
                                <td className="border px-4 py-2">{result.timeSpent}</td>
                                <td className="border px-4 py-2">{new Date(result.completedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
