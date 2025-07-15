// frontend/src/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Create a custom hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    // State to hold user information and authentication token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Get token from localStorage on initial load
    const [loading, setLoading] = useState(true); // To indicate if auth state is still loading

    // Effect to check for token in localStorage and set user if valid
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // In a real application, you would verify this token with your backend
            // For simplicity, we'll just assume it's valid if present
            // You might decode the token here to get user info if needed
            setToken(storedToken);
            // Example: Decode token (requires a JWT decode library, or send to backend for verification)
            // For now, we'll just set a placeholder user if token exists.
            // A more robust solution would involve a backend call to /api/auth/me to get user details.
            try {
                const decoded = JSON.parse(atob(storedToken.split('.')[1])); // Basic decode for payload
                setUser(decoded.user); // Assuming the payload has a 'user' object
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token'); // Remove invalid token
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false); // Auth loading complete
    }, []);

    // Function to handle user login
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken); // Store token in localStorage
    };

    // Function to handle user logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token'); // Remove token from localStorage
        // Optionally, redirect to login page
    };

    // Value provided by the context
    const authContextValue = {
        user,
        token,
        isAuthenticated: !!token, // True if token exists
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
