// src/pages/Profile.js
import React, { useState, useEffect, useRef } from 'react';
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

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token || !user) {
          navigate('/login');
          return;
        }

        const [resultsRes, streaksRes] = await Promise.all([
          axios.get(`/api/results/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/api/streaks/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setResults(resultsRes.data);
        setStreaks(streaksRes.data);
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

  // Handle file selection & auto-upload
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await axios.post('/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = uploadRes.data.imageUrl;
      setProfileImageUrl(imageUrl);

      // update on server
      await axios.put(`/api/users/${user.id}/profile-image`, { profile_image: imageUrl });

      // update context & sessionStorage
      const updatedUser = { ...user, profile_image: imageUrl };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setUserData(updatedUser);
    } catch (err) {
      alert('שגיאה בהעלאת תמונת פרופיל');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Prepare chart data
  const reactionTimeData = results.map(r => ({
    date: new Date(r.completedAt).toLocaleDateString(),
    reactionTime: r.timeSpent
  }));
  const successRateData = results.map(r => ({
    date: new Date(r.completedAt).toLocaleDateString(),
    successRate: (r.score / 100) * 100
  }));

  return (
    <div className="profile-container">
      <h1>Welcome, {userData?.username}!</h1>

      <div className="profile-image-section">
        <img
          src={profileImageUrl || '/default-profile.png'}
          alt="Profile"
          className={`profile-image ${uploading ? 'uploading' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleProfileImageChange}
        />
        {uploading && <div className="uploading-overlay">מעלה...</div>}
      </div>

      {/* <div className="stats-container">
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
      </div> */}

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
            {results.slice(0, 10).map((r, i) => (
              <tr key={i}>
                <td>{r.Game?.name || 'Unknown Game'}</td>
                <td>{r.score}</td>
                <td>{r.timeSpent}s</td>
                <td>{new Date(r.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userData.role !== 1 && (
        <div className="feedback-section">
          <h3>השאר משוב על האתר</h3>
          {/* ... טופס משוב כמו שהיה ... */}
        </div>
      )}
    </div>
  );
};

export default Profile;
