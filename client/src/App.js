// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import GameContainer from './pages/GameContainer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CategoriesPage from './pages/CategoriesPage';
import GameList from './pages/GameList';
import Game from './pages/GameContainer';
import Result from './pages/Result';
import Forum from './pages/Forum';
import ReportDownload from './pages/ReportDownload';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatbotWidget from './components/ChatbotWidget';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const user = sessionStorage.getItem('user');
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Navbar />
                <ChatbotWidget />
                <Routes>
                    <Route path="/games/:domainId" element={<ProtectedRoute><GameContainer /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/games" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                    <Route path="/games/:category" element={<ProtectedRoute><GameList /></ProtectedRoute>} />
                    <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />
                    <Route path="/results/:userId/:gameId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                    <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute><ReportDownload /></ProtectedRoute>} />
                    <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
