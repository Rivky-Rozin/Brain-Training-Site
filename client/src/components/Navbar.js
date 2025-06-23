// client/src/components/Nav.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logoImg from '../assets/styles/logo.png';
import './Navbar.css';

const categories = [
  { id: 1, name: 'Analytical Thinking' },
  { id: 2, name: 'Concentration' },
  { id: 3, name: 'Processing Speed' },
  { id: 4, name: 'Memory' },
  { id: 5, name: 'Creativity' },
  { id: 6, name: 'Adaptive Thinking' },
];

export default function Nav() {
  const [openMenu, setOpenMenu] = useState(null);
  const { user, setUser } = useUser();
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // שינוי לניווט לעמוד הלוגין
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="nav-brain fixed top-0 left-0 w-full text-white shadow-md z-50"
      >
        <div className="container flex flex-row-reverse justify-between items-center mx-auto">
          <Link to="/" className="logo-brain">
            <img src={logoImg} alt="logo" className="logo-brain-img" />
          </Link>
          <ul className="nav-brain-menu flex flex-row gap-12 items-center">
            <li className="relative">
              <span
                onClick={() => toggleMenu('personal')}
                className={`cursor-pointer hover:text-blue-200 select-none w-full block text-right ${location.pathname.startsWith('/profile') ? 'font-bold' : ''}`}
              >
                Personal Area
              </span>
              {openMenu === 'personal' && (
                <ul className="dropdown-menu absolute right-0 mt-4 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                  <li className="w-full"><Link to="/profile" className={location.pathname.startsWith('/profile') ? 'font-bold' : ''}>Profile</Link></li>
                  <li className="w-full"><span onClick={handleLogout} className="cursor-pointer">Logout</span></li>
                </ul>
              )}
            </li>
            <li className="relative">
              <span
                onClick={() => toggleMenu('training')}
                className={`cursor-pointer hover:text-blue-200 select-none w-full block text-right ${location.pathname.startsWith('/games') ? 'font-bold' : ''}`}
              >
                Brain Training
              </span>
              {openMenu === 'training' && (
                <ul className="dropdown-menu absolute right-0 mt-4 w-52 max-h-60 overflow-auto bg-white text-gray-800 rounded shadow-lg z-10">
                  {categories.map(cat => (
                    <li key={cat.id} className="w-full"><Link to={`/games/${cat.id}`} className={location.pathname === `/games/${cat.id}` ? 'font-bold' : ''}>{cat.name}</Link></li>
                  ))}
                </ul>
              )}
            </li>
            <li className="relative">
              <Link to="/forum" className={`hover:text-blue-200 select-none w-full block text-right ${location.pathname.startsWith('/forum') ? 'font-bold' : ''}`}>
                Game Forum
              </Link>
            </li>
            {user?.role === 1 && (
              <li className="relative">
                <Link to="/admin" className={`hover:text-blue-200 select-none w-full block text-right ${location.pathname.startsWith('/admin') ? 'font-bold' : ''}`}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      {/* Spacer so content below isn’t hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
}
