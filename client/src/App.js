// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import GameContainer from './pages/GameContainer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import CategoriesPage from './pages/CategoriesPage';
import GameList from './pages/GameList';
import Game from './pages/GameContainer';
import Result from './pages/Result';
import Forum from './pages/Forum';
import Chatbot from './pages/Chatbot';
import ReportDownload from './pages/ReportDownload';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;

    return (
        <BrowserRouter>
            <nav className="bg-gray-800 p-4 text-white">
                <Link to="/" className="mr-4">Home</Link>
                {userData ? (
                    <>
                        <Link to="/profile" className="mr-4">Profile</Link>
                        {userData.role === 1 && (
                            <Link to="/admin" className="mr-4">Admin Dashboard</Link>
                        )}
                        <button 
                            onClick={() => {
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                window.location.href = '/auth';
                            }}
                            className="mr-4"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/auth">Login</Link>
                )}
            </nav>
            <Routes>
                <Route path="/games/:domainId" element={<ProtectedRoute><GameContainer /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/games" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                <Route path="/games/:category" element={<ProtectedRoute><GameList /></ProtectedRoute>} />
                <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />
                <Route path="/results/:userId/:gameId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                <Route path="/forum/:gameId" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><ReportDownload /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
