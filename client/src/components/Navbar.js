// client/src/components/Nav.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Left: menu items */}
        <ul className="flex space-x-8">
          {/* Personal Area */}
          <li className="relative">
            <span
              onClick={() => toggleMenu('personal')}
              className="cursor-pointer hover:text-blue-200 select-none"
            >
              Personal Area
            </span>
            {openMenu === 'personal' && (
              <ul className="absolute left-0 mt-4 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                <li className="px-6 py-3 hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="px-6 py-3 hover:bg-gray-100">
                  <span onClick={handleLogout} className="cursor-pointer">Logout</span>
                </li>
              </ul>
            )}
          </li>

          {/* Brain Training */}
          <li className="relative">
            <span
              onClick={() => toggleMenu('training')}
              className="cursor-pointer hover:text-blue-200 select-none"
            >
              Brain Training
            </span>
            {openMenu === 'training' && (
              <ul className="absolute left-0 mt-4 w-52 max-h-60 overflow-auto bg-white text-gray-800 rounded shadow-lg z-10">
                {categories.map(cat => (
                  <li key={cat.id} className="px-6 py-3 hover:bg-gray-100">
                    <Link to={`/games/${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Articles */}
          <li className="relative">
            <span
              onClick={() => toggleMenu('articles')}
              className="cursor-pointer hover:text-blue-200 select-none"
            >
              Articles
            </span>
            {openMenu === 'articles' && (
              <ul className="absolute left-0 mt-4 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                <li className="px-6 py-3 text-gray-500">Coming soon…</li>
              </ul>
            )}
          </li>

          {/* Forums */}
          <li className="relative">
            <span
              onClick={() => toggleMenu('forums')}
              className="cursor-pointer hover:text-blue-200 select-none"
            >
              Forums
            </span>
            {openMenu === 'forums' && (
              <ul className="absolute left-0 mt-4 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                <li className="px-6 py-3 text-gray-500">Coming soon…</li>
              </ul>
            )}
          </li>
        </ul>

        {/* Right: brain icon */}
        <Link to="/" className="text-3xl hover:text-blue-200">
          🧠
        </Link>
      </div>
    </nav>
  );
}
