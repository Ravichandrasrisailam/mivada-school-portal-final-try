// frontend/src/LandingPage.js
import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

// IMPORTANT: Removed the direct import of the image from public folder.
// Instead, we will use process.env.PUBLIC_URL for images in the public folder.

// Importing the MessageSquare icon directly as SVG for simplicity
const MessageSquare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const LandingPage = ({ onChatToggle, onSidebarToggle, showSidebar, isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the logout function from AuthContext
        navigate('/login'); // Redirect to login page
    };

    // Construct the public URL for the image using process.env.PUBLIC_URL
    // This is the most reliable way to reference assets from the public folder in Create React App.
    const heroBackgroundImageUrl = process.env.PUBLIC_URL + '/image_7e48a9.jpg';

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar">
                {/* Sidebar Toggle Button (Hamburger Icon) */}
                <button
                    className={`sidebar-toggle-button ${showSidebar ? 'open' : ''}`}
                    onClick={onSidebarToggle}
                    aria-label="Toggle Sidebar"
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>
                <div className="navbar-brand">Mivada School</div>
                <ul className="navbar-nav">
                    <li><a href="#home" className="nav-link">Home</a></li>
                    <li><a href="#about" className="nav-link">About Us</a></li>
                    <li><a href="#academics" className="nav-link">Academics</a></li>
                    <li><a href="#admissions" className="nav-link">Admissions</a></li>
                   
                    {isAuthenticated ? (
                        <>
                            <li className="user-info">
                                <span>Welcome, {user?.username || 'User'}</span> {/* Display username */}
                            </li>
                            <li>
                                <button onClick={handleLogout} className="nav-button logout-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button onClick={() => navigate('/login')} className="nav-button">
                                    Login
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/register')} className="nav-button register-button">
                                    Register
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-section" style={{ backgroundImage: `url(${heroBackgroundImageUrl})` }}>
                {/* The background image is set directly on the section for simplicity */}
                <div className="hero-content">
                    <h1>Welcome to Mivada School</h1>
                    <p>Fostering academic excellence and holistic development.</p>
                    <button className="hero-button" onClick={() => navigate('/register')}>Join Us Today</button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="about-content">
                    <h2>About Mivada School</h2>
                    <p>Mivada School is dedicated to providing a nurturing and stimulating environment where students can achieve their full potential. Our curriculum emphasizes critical thinking, creativity, and character development, preparing students for success in a rapidly changing world.</p>
                    <div className="about-features">
                        <div className="feature-item">
                            <h3>Experienced Faculty</h3>
                            <p>Our teachers are highly qualified and passionate about education.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Modern Facilities</h3>
                            <p>State-of-the-art classrooms, labs, and sports facilities.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Holistic Development</h3>
                            <p>Focus on academic, social, emotional, and physical growth.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academics Section */}
            <section id="academics" className="academics-section">
                <h2>Our Academic Programs</h2>
                <div className="program-grid">
                    <div className="program-card">
                        <h3>Primary Education</h3>
                        <p>Building strong foundational skills in a fun and interactive way.</p>
                    </div>
                    <div className="program-card">
                        <h3>Secondary Education</h3>
                        <p>Challenging curriculum designed for advanced learning and critical thinking.</p>
                    </div>
                    <div className="program-card">
                        <h3>Higher Secondary</h3>
                        <p>Specialized streams and career guidance for future success.</p>
                    </div>
                </div>
            </section>

            {/* Admissions Section */}
            <section id="admissions" className="admissions-section">
                <h2>Admissions</h2>
                <div className="admissions-content">
                    <p>We welcome applications from enthusiastic learners. Our admission process is designed to be straightforward and transparent.</p>
                    <ul className="admissions-list">
                        <li>Fill out the online application form.</li>
                        <li>Submit required documents (previous academic records, birth certificate).</li>
                        <li>Schedule an entrance exam and interview.</li>
                        <li>Receive admission decision and complete enrollment.</li>
                    </ul>
                    <button className="admissions-button" onClick={() => navigate('/register')}>Apply Now</button>
                </div>
            </section>

            {/* Alumni Testimonials Section */}
            <section id="alumni" className="alumni-section">
                <h2>What Our Alumni Say</h2>
                <div className="alumni-testimonials">
                    <div className="alumni-card">
                        <img src="https://placehold.co/100x100/ADD8E6/000000?text=Alumni+1" alt="Alumni 1" className="alumni-img" />
                        <h3 className="alumni-name">Mr. Rahul Sharma</h3>
                        <p className="alumni-title">Software Engineer at Google</p>
                        <p className="alumni-quote">"Mivada School provided me with the strong academic foundation and problem-solving skills essential for my career."</p>
                    </div>
                    <div className="alumni-card">
                        <img src="https://placehold.co/100x100/ADD8E6/000000?text=Alumni+2" alt="Alumni 2" className="alumni-img" />
                        <h3 className="alumni-name">Dr. Aisha Khan</h3>
                        <p className="alumni-title">Lead Researcher at BioTech Corp</p>
                        <p className="alumni-quote">"The supportive environment at Mivada School encouraged my passion for science and research."</p>
                    </div>
                    <div className="alumni-card">
                        <img src="https://placehold.co/100x100/ADD8E6/000000?text=Alumni+3" alt="Alumni 3" className="alumni-img" />
                        <h3 className="alumni-name">Ms. Priya Singh</h3>
                        <p className="alumni-title">Award-winning Author</p>
                        <p className="alumni-quote">"Encouraged my creative spirit and critical thinking."</p>
                    </div>
                </div>
            </section>

            {/* Chat Toggle Icon */}
            {isAuthenticated && ( // Only show chatbot toggle if authenticated
                <button
                   
                    className="chat-toggle-button"
                     onClick={onChatToggle}
                     title="chat with us"
                    aria-label="Toggle Chatbot"
                >
                    <MessageSquare />
                </button>
            )}

            {/* Footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Mivada School. All rights reserved.</p>
                <div className="footer-links">
                    <span onClick={() => console.log('Privacy Policy clicked')} className="footer-link" role="link" tabIndex="0">Privacy Policy</span>
                    <span onClick={() => console.log('Terms of Service clicked')} className="footer-link" role="link" tabIndex="0">Terms of Service</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;



