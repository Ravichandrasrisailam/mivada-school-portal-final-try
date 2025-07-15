// frontend/src/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // For navigation (install react-router-dom)
import './Auth.css'; // Create this CSS file for styling auth forms

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Get login function from AuthContext
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user); // Update auth context
                navigate('/'); // Redirect to home page after successful login
            } else {
                setError(data.msg || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error or server is down.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login to Mivada School</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <button type="submit" disabled={loading} className="auth-button">
                    {loading ? 'Logging In...' : 'Login'}
                </button>
                <p className="auth-switch-link">
                    Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
