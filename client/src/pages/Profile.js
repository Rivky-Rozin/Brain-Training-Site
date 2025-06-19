import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
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
import { useUser } from '../context/UserContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [userData, setUserData] = useState(null);
    const [results, setResults] = useState([]);
    const [streaks, setStreaks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('token');
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
                setProfileImageUrl(user.profile_image || null);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, user]);

    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleProfileImageUpload = async () => {
        if (!profileImage) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', profileImage);
            const uploadRes = await axios.post('/api/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const imageUrl = uploadRes.data.imageUrl;
            setProfileImageUrl(imageUrl);
            // עדכון המשתמש בשרת
            await axios.put(`/api/users/${user.id}/profile-image`, { profile_image: imageUrl });
            // עדכון ב-sessionStorage ובקונטקסט
            const updatedUser = { ...user, profile_image: imageUrl };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setUserData(updatedUser);
        } catch (err) {
            alert('שגיאה בהעלאת תמונת פרופיל');
        }
        setUploading(false);
    };

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
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <img
                    src={profileImageUrl ? profileImageUrl : '/default-profile.png'}
                    alt="Profile"
                    style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4a90e2' }}
                />
                <div style={{ marginTop: '1rem' }}>
                    <input type="file" accept="image/*" onChange={handleProfileImageChange} />
                    <button onClick={handleProfileImageUpload} disabled={uploading || !profileImage} style={{ marginLeft: 8 }}>
                        {uploading ? 'מעלה...' : 'העלה תמונת פרופיל'}
                    </button>
                </div>
            </div>

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