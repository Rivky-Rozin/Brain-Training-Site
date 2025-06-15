import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [results, setResults] = useState([]);
    const [streaks, setStreaks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                
                if (!token || !user) {
                    navigate('/login');
                    return;
                }

                // Fetch user results
                const resultsResponse = await axios.get(`/api/results/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(resultsResponse.data);

                // Fetch user streaks
                const streaksResponse = await axios.get(`/api/streaks/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStreaks(streaksResponse.data);

                setUserData(user);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    // Prepare data for graphs
    const reactionTimeData = results.map(result => ({
        date: new Date(result.completedAt).toLocaleDateString(),
        reactionTime: result.timeSpent
    }));

    const successRateData = results.map(result => ({
        date: new Date(result.completedAt).toLocaleDateString(),
        successRate: (result.score / 100) * 100 // Assuming score is out of 100
    }));

    return (
        <div className="profile-container">
            <h1>Welcome, {userData?.username}!</h1>
            
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Current Streak</h3>
                    <p>{streaks?.currentStreak || 0} days</p>
                </div>
                <div className="stat-card">
                    <h3>Longest Streak</h3>
                    <p>{streaks?.bestStreak || 0} days</p>
                </div>
                <div className="stat-card">
                    <h3>Last Training</h3>
                    <p>{streaks?.lastPlayedAt ? new Date(streaks.lastPlayedAt).toLocaleDateString() : 'Never'}</p>
                </div>
            </div>

            <div className="graphs-container">
                <div className="graph-card">
                    <h3>Average Reaction Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reactionTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="reactionTime" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="graph-card">
                    <h3>Success Rate</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={successRateData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="successRate" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recent-results">
                <h3>Recent Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Score</th>
                            <th>Time Spent</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.slice(0, 10).map((result, index) => (
                            <tr key={index}>
                                <td>{result.Game?.name || 'Unknown Game'}</td>
                                <td>{result.score}</td>
                                <td>{result.timeSpent}s</td>
                                <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;