// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import ChatbotWidget from './components/ChatbotWidget';
import PlayPage from './pages/PlayPage';
// דפי האפליקציה
import Home from './pages/Home';
import CategoriesPage from './pages/CategoriesPage';
import GameList from './pages/GameList';
import Game from './pages/Game';              // עמוד משחק יחיד (אם קיים)
import Profile from './pages/Profile';
import Result from './pages/Result';
import Forum from './pages/Forum';
import ReportDownload from './pages/ReportDownload';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const user = sessionStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <ChatbotWidget />
        <Routes>
          {/* דף הבית */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* קטגוריות */}
          <Route path="/games" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />

          {/* רשימת משחקים לפי קטגוריה */}
          <Route path="/games/:category" element={<ProtectedRoute><GameList /></ProtectedRoute>} />

          {/* עמוד משחק יחיד (GameList => Start Game) */}
          <Route path="/play/:id" element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />

          {/* עמוד משחק יחיד אם יש לך גם /game/:id */}
          <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />

          {/* פרופיל ותוצאות */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/results/:userId/:gameId" element={<ProtectedRoute><Result /></ProtectedRoute>} />

          {/* פורום ודוחות */}
          <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportDownload /></ProtectedRoute>} />

          {/* דאשבורד מנהל */}
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* כניסה והרשמה */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* כל כתובת אחרת */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
