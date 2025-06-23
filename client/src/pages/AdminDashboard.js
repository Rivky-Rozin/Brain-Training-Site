import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);
    const [results, setResults] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userFilter, setUserFilter] = useState('');
    const [userSort, setUserSort] = useState({ key: 'id', direction: 'asc' });
    const [gameFilter, setGameFilter] = useState('');
    const [gameSort, setGameSort] = useState({ key: 'id', direction: 'asc' });
    const [resultFilter, setResultFilter] = useState('');
    const [resultSort, setResultSort] = useState({ key: 'id', direction: 'asc' });

    const PAGE_SIZE = 10;
    const ROWS_VISIBLE = 7;
    const [userPage, setUserPage] = useState(1);
    const [gamePage, setGamePage] = useState(1);
    const [resultPage, setResultPage] = useState(1);
    const [feedbackPage, setFeedbackPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const [usersRes, gamesRes, resultsRes, feedbacksRes] = await Promise.all([
                    axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/games', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/results/all', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/feedback', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setUsers(usersRes.data.users || []);
                setGames(gamesRes.data.games || []);
                setResults(resultsRes.data.results || []);
                setFeedbacks(feedbacksRes.data || []);
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

    // Sorting helpers
    const sortData = (data, sort) => {
        const sorted = [...data].sort((a, b) => {
            let aValue = a[sort.key];
            let bValue = b[sort.key];
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    // Filtered and sorted data
    const filteredUsers = sortData(
        users.filter(u => u.username?.toLowerCase().includes(userFilter.toLowerCase())),
        userSort
    );
    const filteredGames = sortData(
        games.filter(g => g.name?.toLowerCase().includes(gameFilter.toLowerCase())),
        gameSort
    );
    const filteredResults = sortData(
        results.filter(r => {
            const user = r.User?.username || '';
            const game = r.Game?.name || '';
            return (
                user.toLowerCase().includes(resultFilter.toLowerCase()) ||
                game.toLowerCase().includes(resultFilter.toLowerCase())
            );
        }),
        resultSort
    );
    // Pagination slices (הסר פאגינציה)
    // const pagedUsers = filteredUsers.slice((userPage-1)*PAGE_SIZE, userPage*PAGE_SIZE);
    // const pagedGames = filteredGames.slice((gamePage-1)*PAGE_SIZE, gamePage*PAGE_SIZE);
    // const pagedResults = filteredResults.slice((resultPage-1)*PAGE_SIZE, resultPage*PAGE_SIZE);
    // const pagedFeedbacks = feedbacks.slice((feedbackPage-1)*PAGE_SIZE, feedbackPage*PAGE_SIZE);

    // Table header sort click handler
    const handleSort = (sortSetter, sort, key) => {
        if (sort.key === key) {
            sortSetter({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            sortSetter({ key, direction: 'asc' });
        }
    };

    if (loading) return <div className="p-8">Loading data...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <h1 className="text-3xl font-bold mb-8 text-black text-center drop-shadow">Admin Dashboard</h1>

                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700 border-b pb-2">Users List
                    <button className="ml-4" style={{background:'#F46447',color:'#fff',padding:'0.18rem 0.55rem',borderRadius:'0.32rem',fontWeight:700,transition:'background 0.2s',border:'none',fontSize:'0.93rem',boxShadow:'0 2px 8px #F4644722',letterSpacing:'0.1px',minWidth:'unset',width:'auto',display:'inline-block'}} onClick={() => exportToExcel(users, 'users.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="flex mb-2">
                    <input
                        type="text"
                        placeholder="Filter by username..."
                        className="border rounded px-2 py-1 mr-2"
                        value={userFilter}
                        onChange={e => setUserFilter(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto mb-10" style={{maxHeight:`${ROWS_VISIBLE*42}px`,overflowY:'auto'}}>
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setUserSort, userSort, 'id')}>ID {userSort.key === 'id' ? (userSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setUserSort, userSort, 'username')}>Username {userSort.key === 'username' ? (userSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setUserSort, userSort, 'role')}>Role {userSort.key === 'role' ? (userSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-blue-50 transition-all">
                                <td className="border px-4 py-2">{user.id}</td>
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.role === 1 ? 'Admin' : 'User'}</td>
                                <td className="border px-4 py-2">
                                    {user.role !== 1 && (
                                        <button className="" style={{background:'#58A9A5',color:'#fff',padding:'0.35rem 0.9rem',borderRadius:'0.4rem',fontWeight:600,transition:'background 0.2s',border:'none'}} onClick={() => makeAdmin(user.id)}>
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
                    <button className="ml-4" style={{background:'#F46447',color:'#fff',padding:'0.18rem 0.55rem',borderRadius:'0.32rem',fontWeight:700,transition:'background 0.2s',border:'none',fontSize:'0.93rem',boxShadow:'0 2px 8px #F4644722',letterSpacing:'0.1px',minWidth:'unset',width:'auto',display:'inline-block'}} onClick={() => exportToExcel(games, 'games.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="flex mb-2">
                    <input
                        type="text"
                        placeholder="Filter by game name..."
                        className="border rounded px-2 py-1 mr-2"
                        value={gameFilter}
                        onChange={e => setGameFilter(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto mb-10" style={{maxHeight:`${ROWS_VISIBLE*42}px`,overflowY:'auto'}}>
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setGameSort, gameSort, 'id')}>ID {gameSort.key === 'id' ? (gameSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setGameSort, gameSort, 'name')}>Game Name {gameSort.key === 'name' ? (gameSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setGameSort, gameSort, 'category')}>Category {gameSort.key === 'category' ? (gameSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setGameSort, gameSort, 'difficulty')}>Difficulty {gameSort.key === 'difficulty' ? (gameSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2">Avg. Score</th>
                            <th className="border px-4 py-2">Avg. Time (sec)</th>
                            <th className="border px-4 py-2">Total Time (sec)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.map(game => {
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
                    <button className="ml-4" style={{background:'#F46447',color:'#fff',padding:'0.18rem 0.55rem',borderRadius:'0.32rem',fontWeight:700,transition:'background 0.2s',border:'none',fontSize:'0.93rem',boxShadow:'0 2px 8px #F4644722',letterSpacing:'0.1px',minWidth:'unset',width:'auto',display:'inline-block'}} onClick={() => exportToExcel(results, 'results.xlsx')}>
                        Export to Excel
                    </button>
                </h2>
                <div className="flex mb-2">
                    <input
                        type="text"
                        placeholder="Filter by user or game..."
                        className="border rounded px-2 py-1 mr-2"
                        value={resultFilter}
                        onChange={e => setResultFilter(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto" style={{maxHeight:`${ROWS_VISIBLE*42}px`,overflowY:'auto'}}>
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setResultSort, resultSort, 'User')}>User</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setResultSort, resultSort, 'Game')}>Game</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setResultSort, resultSort, 'score')}>Score {resultSort.key === 'score' ? (resultSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setResultSort, resultSort, 'timeSpent')}>Time (sec) {resultSort.key === 'timeSpent' ? (resultSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort(setResultSort, resultSort, 'completedAt')}>Completed At {resultSort.key === 'completedAt' ? (resultSort.direction === 'asc' ? '▲' : '▼') : ''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map(result => (
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

                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700 border-b pb-2">משובים מהמשתמשים</h2>
                <div className="overflow-x-auto mb-10" style={{maxHeight:`${ROWS_VISIBLE*42}px`,overflowY:'auto'}}>
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">User</th>
                            <th className="border px-4 py-2">Content</th>
                            <th className="border px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(fb => (
                            <tr key={fb.id} className="hover:bg-blue-50 transition-all">
                                <td className="border px-4 py-2">{fb.id}</td>
                                <td className="border px-4 py-2">{fb.User?.username || fb.userId}</td>
                                <td className="border px-4 py-2">{fb.content}</td>
                                <td className="border px-4 py-2">{new Date(fb.createdAt).toLocaleString()}</td>
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
