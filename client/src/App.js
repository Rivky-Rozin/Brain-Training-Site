// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    return (
        <BrowserRouter>
            {/* הקומפּוננטה Nav מצויה פה במקום nav אינליין */}
            <Navbar />
            <div className="pt-16">

                <Routes>
                    <Route
                        path="/games/:domainId"
                        element={
                            <ProtectedRoute>
                                <GameContainer />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    {/* שלב 1: בחירת קטגוריה */}
                    <Route
                        path="/games"
                        element={
                            <ProtectedRoute>
                                <CategoriesPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* שלב 2: רשימת משחקים לפי קטגוריה */}
                    <Route
                        path="/games/:category"
                        element={
                            <ProtectedRoute>
                                <GameList />
                            </ProtectedRoute>
                        }
                    />
                    {/* משחק בודד */}
                    <Route
                        path="/game/:id"
                        element={
                            <ProtectedRoute>
                                <Game />
                            </ProtectedRoute>
                        }
                    />
                    {/* תוצאות משחק */}
                    <Route
                        path="/results/:userId/:gameId"
                        element={
                            <ProtectedRoute>
                                <Result />
                            </ProtectedRoute>
                        }
                    />
                    {/* פורום */}
                    <Route
                        path="/forum/:gameId"
                        element={
                            <ProtectedRoute>
                                <Forum />
                            </ProtectedRoute>
                        }
                    />
                    {/* צ׳טבוט */}
                    <Route
                        path="/chatbot"
                        element={
                            <ProtectedRoute>
                                <Chatbot />
                            </ProtectedRoute>
                        }
                    />
                    {/* הורדת דוח */}
                    <Route
                        path="/report"
                        element={
                            <ProtectedRoute>
                                <ReportDownload />
                            </ProtectedRoute>
                        }
                    />
                    {/* לוח ניהול */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* מסכי כניסה והרשמה */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
