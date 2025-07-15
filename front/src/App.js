// import React, { useState, useCallback, useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import LandingPage from './LandingPage.js';
// import Chatbot from './Chatbot.js';
// import Sidebar from './Sidebar.js';
// import LoginPage from './LoginPage.js';
// import RegisterPage from './RegisterPage.js';
// import { useAuth } from './AuthContext.js';
// import './App.css';
// import axios from 'axios'; // Import axios for API calls

// function App() {
//     const [showChatbot, setShowChatbot] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(false);
//     const [chatMessages, setChatMessages] = useState([]);
//     const { isAuthenticated, user, loading, logout } = useAuth();
//     const navigate = useNavigate();

//     const handleChatToggle = useCallback(() => {
//         console.log("Chat toggle button clicked! Current showChatbot state:", showChatbot);
//         setShowChatbot(prev => !prev);
//         if (!showChatbot) setShowSidebar(false);
//     }, [showChatbot]);

//     const handleSidebarToggle = useCallback(() => {
//         setShowSidebar(prev => !prev);
//         if (!showSidebar) setShowChatbot(false);
//     }, [showSidebar]);

//     // Function to send a message to the chatbot (used by Sidebar for module clicks AND by Chatbot for manual input)
//     const sendMessageToChatbot = useCallback(async (messageText) => {
//         if (!messageText.trim()) return; // Don't send empty messages

//         const newMessage = { role: 'user', text: messageText };
//         // Optimistically add user message to display immediately
//         setChatMessages(prevMessages => [...prevMessages, newMessage]);
//         // Ensure chatbot is open to show the message and response
//         setShowChatbot(true);

//         try {
//             // Construct chat history for the API call
//             // IMPORTANT: The chatHistory sent to the backend should represent the conversation so far.
//             // When sending a new message, it should include the existing messages *before* the new user message.
//             const historyForBackend = chatMessages.map(msg => ({
//                 role: msg.role,
//                 text: msg.text
//             }));

//             // Make the API call to your backend
//             const response = await axios.post('http://localhost:3001/api/chat', {
//                 userId: user ? user.id : 'anonymous', // Ensure a userId is always sent
//                 message: messageText,
//                 chatHistory: historyForBackend
//             });

//             const botResponse = response.data.response;
//             // Add bot's response to chat messages
//             setChatMessages(prevMessages => [...prevMessages, { role: 'model', text: botResponse }]);

//         } catch (error) {
//             console.error("Error sending message to chatbot:", error);
//             // Add an error message to the chat if the API call fails
//             setChatMessages(prevMessages => [...prevMessages, { role: 'model', text: "Sorry, I couldn't get a response from the AI. Please try again." }]);
//         }
//     }, [user, chatMessages]); // Depend on user and chatMessages to ensure correct history is sent


//     // Effect to fetch initial chat history
//     useEffect(() => {
//         const fetchChatHistory = async () => {
//             if (isAuthenticated && user?.id) {
//                 try {
//                     const response = await axios.get(`http://localhost:3001/api/chat/history/${user.id}`);
//                     setChatMessages(response.data.history);
//                 } catch (error) {
//                     console.error("Error fetching chat history:", error);
//                 }
//             }
//         };
//         fetchChatHistory();
//     }, [isAuthenticated, user?.id]); // Re-run if auth status or user ID changes

//     // Effect to redirect to login if not authenticated and not already on login/register page
//     useEffect(() => {
//         if (!loading && !isAuthenticated && (window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
//             navigate('/login');
//         }
//     }, [isAuthenticated, loading, navigate]);

//     // Effect to toggle 'sidebar-open' class on the body element for content shifting
//     useEffect(() => {
//         if (showSidebar) {
//             document.body.classList.add('sidebar-open');
//         } else {
//             document.body.classList.remove('sidebar-open');
//         }
//         return () => {
//             document.body.classList.remove('sidebar-open');
//         };
//     }, [showSidebar]);

//     if (loading) {
//         return (
//             <div className="loading-spinner">
//                 <div className="loading-spinner-circle"></div>
//                 <p className="ml-4 text-lg text-gray-400">Loading authentication...</p>
//             </div>
//         );
//     }

//     return (
//         <div className={`app-container`}>
//             <Routes>
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />

//                 <Route
//                     path="/"
//                     element={
//                         isAuthenticated ? (
//                             <>
//                                 <LandingPage
//                                     onChatToggle={handleChatToggle}
//                                     onSidebarToggle={handleSidebarToggle}
//                                     showSidebar={showSidebar}
//                                     isAuthenticated={isAuthenticated}
//                                     user={user}
//                                     onLogout={logout}
//                                 />
//                                 <Chatbot
//                                     showChatbot={showChatbot}
//                                     onClose={handleChatToggle}
//                                     messages={chatMessages}
//                                     setMessages={setChatMessages} // Keep this for direct message manipulation if needed
//                                     sendMessageToChatbot={sendMessageToChatbot} // This is the core send function
//                                     userId={user ? user.id : 'anonymous'}
//                                 />
//                                 <Sidebar
//                                     showSidebar={showSidebar}
//                                     onClose={handleSidebarToggle}
//                                     onModuleClick={sendMessageToChatbot} // This is correctly wired up!
//                                     isAuthenticated={isAuthenticated}
//                                     user={user}
//                                     onLogout={logout}
//                                 />
//                             </>
//                         ) : (
//                             <></>
//                         )
//                     }
//                 />
//             </Routes>
//         </div>
//     );
// }

// export default App;

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage.js';
import Chatbot from './Chatbot.js';
import Sidebar from './Sidebar.js';
import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import { useAuth } from './AuthContext.js';
import './App.css';
import axios from 'axios';

// The definitive FAQ data array - ONLY IN APP.JS
const faqData = [
    {
        question: "What is the Attendance module?",
        patterns: ["attendance module", "mark attendance", "attendance records", "attendance"],
        answer: "The Attendance module allows teachers to mark student attendance, track attendance records, and generate reports. Students can also view their attendance history."
    },
    {
        question: "How does the Attendance module work?",
        patterns: ["how attendance module works", "attendance process"],
        answer: "Teachers log in and select their class/subject. They can then mark students as present, absent, or late. The system automatically updates records and can send notifications for excessive absences."
    },
    {
        question: "What is the Time Table module?",
        patterns: ["time table module", "schedule", "class schedule", "time table"],
        answer: "The Time Table module displays the daily and weekly class schedules for students and teachers. It helps in organizing academic activities efficiently."
    },
    {
        question: "How does the Time Table module work?",
        patterns: ["how time table works", "view timetable"],
        answer: "The Time Table module provides a clear, interactive schedule. Users can view their personalized timetable, and administrators can manage and update the overall school timetable."
    },
    {
        question: "What is the Curriculum module?",
        patterns: ["curriculum module", "syllabus", "learning objectives", "curriculum"],
        answer: "The Curriculum module provides details about the subjects, topics, and learning objectives for each grade level. It outlines the academic plan for students."
    },
    {
        question: "How does the Curriculum module work?",
        patterns: ["how curriculum module works", "access materials"],
        answer: "The Curriculum module allows teachers to upload lesson plans, assignments, and resources. Students can access these materials, track their progress, and submit assignments online."
    },
    {
        question: "What is the Examination module?",
        patterns: ["examination module", "exams", "grading", "report card", "examinations"],
        answer: "The Examination module manages all aspects of school examinations, including scheduling, grading, and report card generation. It supports various exam formats and assessment types."
    },
    {
        question: "How does the Examination module work?",
        patterns: ["how examination module works", "exam results"],
        answer: "Teachers can schedule exams, input grades, and generate detailed performance reports. Students and parents can view exam schedules, results, and academic progress reports."
    },
    {
        question: "How does the communication module work?",
        patterns: ["communication module", "announcements", "messaging", "communication"],
        answer: "The communication module facilitates seamless interaction between students, parents, teachers, and administration. It includes features like announcements, messaging, and forums."
    },
    {
        question: "Can I send reminders to parents?",
        patterns: ["send reminders", "reminders to parents"],
        answer: "Yes. From Principal’s panel → Reminders → Choose time & recipient group → Enter message → Schedule."
    },
    {
        question: "What are the features of Plan A and Plan B?",
        patterns: ["subscription plans", "plan a", "plan b", "mivada school plans", "pricing"],
        answer: "Plan A (₹49,000/year): Unlimited teachers, 1000 students, 1 Principal, 1 AO, 1 MD. Up to 96 hours downtime per year. Plan B (₹1.99 L/year): Unlimited students, multi-branch support, shared logins for Principal/AO, and dedicated support. <12 hours downtime/year."
    }
];

function App() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const { isAuthenticated, user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleChatToggle = useCallback(() => {
        setShowChatbot(prev => !prev);
        if (!showChatbot) setShowSidebar(false);
    }, [showChatbot]);

    const handleSidebarToggle = useCallback(() => {
        setShowSidebar(prev => !prev);
        if (!showSidebar) setShowChatbot(false);
    }, [showSidebar]);

    // This is the core function for sending any message, whether from user input or sidebar/FAQ clicks.
    const sendMessageToChatbot = useCallback(async (messageText) => {
        if (!messageText.trim()) return;

        // 1. Optimistically add user's message to display immediately
        const newUserMessage = { role: 'user', text: messageText };
        setChatMessages(prevMessages => [...prevMessages, newUserMessage]);
        setShowChatbot(true); // Ensure chatbot is open

        try {
            // 2. First, try to match against local FAQ data
            const lowerCaseUserMessage = messageText.toLowerCase();
            const matchedFaq = faqData.find(faq => {
                return (
                    faq.question.toLowerCase().includes(lowerCaseUserMessage) || // Check if question contains the message
                    (faq.patterns && Array.isArray(faq.patterns) && // Check if any pattern contains the message
                     faq.patterns.some(pattern => lowerCaseUserMessage.includes(pattern.toLowerCase())))
                );
            });

            if (matchedFaq) {
                // If a local FAQ matches, use its answer directly
                setChatMessages(prevMessages => [
                    ...prevMessages,
                    { role: 'model', text: matchedFaq.answer }
                ]);
            } else {
                // If no local FAQ match, proceed to send the message to the backend for AI processing
                // It's crucial to send the *current* state of messages including the latest user message
                // for the AI to maintain context.
                const historyForBackend = [...chatMessages, newUserMessage].map(msg => ({ // Includes the new user message
                    role: msg.role,
                    text: msg.text
                }));

                const response = await axios.post('http://localhost:3001/api/chat', {
                    userId: user ? user.id : 'anonymous', // Ensure a userId is always sent
                    message: messageText,
                    chatHistory: historyForBackend
                });

                const botResponse = response.data.response;
                setChatMessages(prevMessages => [...prevMessages, { role: 'model', text: botResponse }]);
            }

        } catch (error) {
            console.error("Error sending message to chatbot:", error);
            // Add an error message to the chat if the API call fails
            setChatMessages(prevMessages => [...prevMessages, { role: 'model', text: "Sorry, I couldn't get a response from the AI. Please try again." }]);
        }
    }, [user, chatMessages]);


    // Effect to fetch initial chat history
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (isAuthenticated && user?.id) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/chat/history/${user.id}`);
                    setChatMessages(response.data.history.map(msg => ({ role: msg.role, text: msg.text })));
                } catch (error) {
                    console.error("Error fetching chat history:", error);
                    setChatMessages([{ role: 'model', text: 'Failed to load chat history. Hello! How can I help you today?' }]);
                }
            } else if (!isAuthenticated && !loading) {
                 if (chatMessages.length === 0) {
                     setChatMessages([{ role: 'model', text: 'Hello! How can I help you today?' }]);
                 }
            }
        };

        if (isAuthenticated && user?.id && chatMessages.length === 0) {
            fetchChatHistory();
        } else if (!isAuthenticated && !loading && chatMessages.length === 0) {
            setChatMessages([{ role: 'model', text: 'Hello! How can I help you today?' }]);
        }
    }, [isAuthenticated, user?.id, loading, chatMessages.length]);

    // Effect to redirect to login if not authenticated and not already on login/register page
    useEffect(() => {
        if (!loading && !isAuthenticated && (window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    // Effect to toggle 'sidebar-open' class on the body element for content shifting
    useEffect(() => {
        if (showSidebar) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [showSidebar]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="loading-spinner-circle"></div>
                <p className="ml-4 text-lg text-gray-400">Loading authentication...</p>
            </div>
        );
    }

    return (
        <div className={`app-container`}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <>
                                <LandingPage
                                    onChatToggle={handleChatToggle}
                                    onSidebarToggle={handleSidebarToggle}
                                    showSidebar={showSidebar}
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                    onLogout={logout}
                                />
                                <Chatbot
                                    showChatbot={showChatbot}
                                    onClose={handleChatToggle}
                                    messages={chatMessages}
                                    setMessages={setChatMessages}
                                    sendMessageToChatbot={sendMessageToChatbot}
                                    userId={user ? user.id : 'anonymous'}
                                    faqDataForDisplay={faqData} // Corrected: Removed the problematic comment
                                />
                                <Sidebar
                                    showSidebar={showSidebar}
                                    onClose={handleSidebarToggle}
                                    onModuleClick={sendMessageToChatbot}
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                    onLogout={logout}
                                />
                            </>
                        ) : (
                            <></>
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;