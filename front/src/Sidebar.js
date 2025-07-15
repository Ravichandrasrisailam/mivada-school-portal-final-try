// frontend/src/Sidebar.js
import React from 'react';
import './Sidebar.css'; // Dedicated CSS for Sidebar
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = ({ showSidebar, onClose, onModuleClick, isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        onClose(); // Close sidebar on logout
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Mivada Modules</h3>
                <button onClick={onClose} className="close-sidebar-button">
                    &times;
                </button>
            </div>
            <ul className="sidebar-nav">
                {isAuthenticated ? (
                    <>
                        <li className="sidebar-user-info">
                            <span className="user-icon">👤</span>
                            <span>Welcome, {user?.username || 'User'}!</span>
                            <span className="user-role">({user?.role || 'N/A'})</span>
                        </li>
                        <li onClick={() => onModuleClick('What is the Attendance module?')} className="sidebar-nav-item">
                            Attendance
                        </li>
                        <li onClick={() => onModuleClick('What is the Time Table module?')} className="sidebar-nav-item">
                            Time Table
                        </li>
                        <li onClick={() => onModuleClick('What is the Curriculum module?')} className="sidebar-nav-item">
                            Curriculum
                        </li>
                        <li onClick={() => onModuleClick('What is the Examination module?')} className="sidebar-nav-item">
                            Examinations
                        </li>
                        <li onClick={() => onModuleClick('How does the communication module work?')} className="sidebar-nav-item">
                            Communication
                        </li>
                        <li onClick={() => onModuleClick('Tell me about Mivada School plans')} className="sidebar-nav-item">
                            Plans & Pricing
                        </li>
                        <li className="sidebar-nav-item logout-item">
                            <button onClick={handleLogout} className="sidebar-logout-button">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="sidebar-nav-item">
                        <p className="text-gray-400 text-sm p-4">Please log in to access modules.</p>
                        <button onClick={() => { onClose(); navigate('/login'); }} className="sidebar-login-button">
                            Login
                        </button>
                        <button onClick={() => { onClose(); navigate('/register'); }} className="sidebar-register-button">
                            Register
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;



