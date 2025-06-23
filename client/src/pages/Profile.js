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
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Feedback form state
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token || !user) {
          navigate('/login');
          return;
        }

        const resultsRes = await axios.get(`/api/results/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
        setResults(resultsRes.data);
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
      const token = sessionStorage.getItem('token');
      const uploadRes = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      const imageUrl = uploadRes.data.imageUrl;
      setProfileImageUrl(imageUrl);

      // update on server
      await axios.put(`/api/users/${user.id}/profile-image`, { profile_image: imageUrl }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

  // Handle feedback submit
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      setFeedbackStatus('נא למלא משוב.');
      return;
    }
    setFeedbackLoading(true);
    setFeedbackStatus("");
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('/api/feedback', { content: feedback }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback("");
      setFeedbackStatus('תודה על המשוב!');
    } catch (err) {
      setFeedbackStatus('שגיאה בשליחת המשוב');
    }
    setFeedbackLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // עיבוד ממוצע יומי לזמן תגובה
  const dailyReactionTimeMap = results.reduce((acc, r) => {
    const date = new Date(r.completedAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(r.timeSpent);
    return acc;
  }, {});
  const reactionTimeData = Object.entries(dailyReactionTimeMap).map(([date, times]) => ({
    date,
    reactionTime: (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
  }));
  const avgReactionTime = reactionTimeData.length > 0 ?
    (reactionTimeData.reduce((a, b) => a + parseFloat(b.reactionTime), 0) / reactionTimeData.length).toFixed(2) : 0;

  // עיבוד ממוצע יומי לאחוזי הצלחה
  // נניח ש-score הוא ניקוד מוחלט, ונחשב את האחוז מתוך ניקוד מקסימלי אפשרי (למשל 10)
  const MAX_SCORE = 10; // שנה כאן אם הניקוד המקסימלי שונה
  const dailySuccessRateMap = results.reduce((acc, r) => {
    const date = new Date(r.completedAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    // נחשב אחוז הצלחה לכל תוצאה
    acc[date].push((r.score / MAX_SCORE) * 100);
    return acc;
  }, {});
  const successRateData = Object.entries(dailySuccessRateMap).map(([date, scores]) => ({
    date,
    successRate: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
  }));
  const avgSuccessRate = successRateData.length > 0 ?
    (successRateData.reduce((a, b) => a + parseFloat(b.successRate), 0) / successRateData.length).toFixed(2) : 0;

  // גרף עמודות של ימים פעילים (רצף)
  const streakDaysMap = results.reduce((acc, r) => {
    const date = new Date(r.completedAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const streakDaysData = Object.entries(streakDaysMap).map(([date, count]) => ({ date, count }));

  // התפלגות משחקים
  const gamesMap = results.reduce((acc, r) => {
    const name = r.Game?.name || 'Unknown Game';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const gamesData = Object.entries(gamesMap).map(([name, value]) => ({ name, value }));

  // צבעים לגרף עוגה
  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#8dd1e1", "#d88884", "#b0a4e3", "#e384d8"];

  // ממוצעים לטבלת תוצאות
  const avgScore = results.length > 0 ? (results.reduce((a, b) => a + b.score, 0) / results.length).toFixed(2) : 0;
  const avgTimeSpent = results.length > 0 ? (results.reduce((a, b) => a + b.timeSpent, 0) / results.length).toFixed(2) : 0;

  // Calculate streaks from results only
  // 1. Get all unique days with results
  const daysWithResults = Array.from(new Set(results.map(r => new Date(r.completedAt).toDateString()))).sort((a, b) => new Date(a) - new Date(b));

  // 2. Calculate best streak (longest consecutive days)
  let bestStreak = 0, currentStreak = 0, prevDate = null;
  daysWithResults.forEach(dateStr => {
    const date = new Date(dateStr);
    if (prevDate) {
      const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    if (currentStreak > bestStreak) bestStreak = currentStreak;
    prevDate = date;
  });

  // 3. Calculate current streak (from today backwards)
  let today = new Date();
  today.setHours(0,0,0,0);
  let streak = 0;
  for (let i = daysWithResults.length - 1; i >= 0; i--) {
    const date = new Date(daysWithResults[i]);
    if (streak === 0 && (today - date) / (1000 * 60 * 60 * 24) > 0) {
      // If today is not in the list, check if yesterday is
      if ((today - date) / (1000 * 60 * 60 * 24) === 1) {
        streak = 1;
        today = date;
      } else {
        break;
      }
    } else if ((today - date) / (1000 * 60 * 60 * 24) === 0) {
      streak++;
      today = new Date(date);
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }
  const lastPlayedAt = results.length > 0 ? new Date(Math.max(...results.map(r => new Date(r.completedAt)))) : null;

  return (
    <div className="profile-container">
      <h1>Welcome, {userData?.username}!</h1>

      <div className="profile-image-section" style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src={profileImageUrl || '/default-profile.png'}
          alt="Profile"
          className={`profile-image ${uploading ? 'uploading' : ''}`}
          style={{ cursor: 'pointer', border: '2px solid #8884d8', borderRadius: '50%', width: 120, height: 120, objectFit: 'cover' }}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleProfileImageChange}
        />
        <div style={{ marginTop: 8 }}>

        </div>
        {uploading && <div className="uploading-overlay">Uploading...</div>}
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p>{streak || 0} days</p>
          <span style={{ color: '#8884d8', fontSize: 12 }}>
            {streak > 0 ? `🔥 Keep it up!` : 'Start your streak today!'}
          </span>
        </div>
        <div className="stat-card">
          <h3>Longest Streak</h3>
          <p>{bestStreak || 0} days</p>
          <span style={{ color: '#82ca9d', fontSize: 12 }}>
            {bestStreak > 0 ? `Your record streak!` : 'No record yet'}
          </span>
        </div>
        <div className="stat-card">
          <h3>Last Training</h3>
          <p>{lastPlayedAt ? new Date(lastPlayedAt).toLocaleDateString() : 'Never'}</p>
          <span style={{ color: '#f39c12', fontSize: 12 }}>
            {lastPlayedAt ? `Last played: ${new Date(lastPlayedAt).toLocaleString()}` : 'No training yet'}
          </span>
        </div>
      </div>

      <div className="graphs-container">

        {/* Daily Success Rate Graph */}
        <div className="graph-card">
          <h3>Daily Success Rate</h3>
          <div style={{marginBottom: 8, color: '#82ca9d'}}>Overall average: {avgSuccessRate}%</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={successRateData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="successRate" fill="#82ca9d" name="Daily Success Rate">
                {successRateData.map((entry, index) => (
                  <text
                    key={`label-${index}`}
                    x={index * 60 + 30}
                    y={300 - (entry.successRate * 3)}
                    textAnchor="middle"
                    fill="#333"
                    fontSize={12}
                  >
                    {entry.successRate}%
                  </text>
                ))}
              </Bar>
              {/* קו ממוצע כללי */}
              <LineChart data={successRateData}>
                <Line type="linear" dataKey={() => avgSuccessRate} stroke="#ffb347" dot={false} name="Overall Avg" />
              </LineChart>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Days (Streak) Bar Chart */}
        <div className="graph-card">
          <h3>Active Days (Streak)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={streakDaysData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} label={{ value: 'Sessions', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value} sessions`} />
              <Legend />
              <Bar dataKey="count" fill="#f39c12" name="Sessions per Day" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Game Distribution Pie Chart */}
        <div className="graph-card">
          <h3>Game Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={gamesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {gamesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.name}: ${value} times`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* <div className="recent-results">
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
            {results.length > 0 && (
              <tr style={{ fontWeight: 'bold' }}>
                <td>Average</td>
                <td>{avgScore}</td>
                <td>{avgTimeSpent}s</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      {/* Feedback form for non-admin users */}
      {userData.role !== 1 && (
        <div className="feedback-section" style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
          <h3>השאר משוב על האתר</h3>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: 8 }}
            placeholder="כתוב כאן את המשוב שלך..."
          />
          <button
            onClick={handleFeedbackSubmit}
            disabled={feedbackLoading}
            style={{ marginBottom: 8 }}
          >
            {feedbackLoading ? 'שולח...' : 'שלח משוב'}
          </button>
          {feedbackStatus && (
            <div style={{ color: feedbackStatus.includes('שגיאה') ? 'red' : 'green' }}>
              {feedbackStatus}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Profile;
