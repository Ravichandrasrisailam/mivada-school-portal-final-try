




// import React, { useState, useEffect, useRef } from 'react';
// import './Chatbot.css'; // Keep this line! It's essential for styling.

// // Chatbot component receives props from App.js.
// // It should NOT have its own internal faqData or internal fetch history logic.
// const Chatbot = ({ showChatbot, messages, setMessages, sendMessageToChatbot, userId, onClose, faqDataForDisplay }) => {
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'help'
//     const messagesEndRef = useRef(null);

//     // Scroll to the latest message whenever messages change
//     useEffect(() => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [messages]);

//     // Removed: Redundant useEffect for fetching chat history.
//     // App.js handles fetching and setting initial messages.

//     const handleSendMessage = async (e) => {
//         e.preventDefault(); // Prevent default form submission
//         if (input.trim() === '') return;

//         const userMessageText = input.trim();
//         setInput(''); // Clear input immediately
//         setIsLoading(true); // Start loading indicator

//         try {
//             // Delegate the message sending and response handling
//             // to the parent component's (App.js) sendMessageToChatbot function.
//             // App.js will decide if it's an FAQ or needs an API call.
//             await sendMessageToChatbot(userMessageText);
//         } catch (error) {
//             console.error('Error in handleSendMessage (Chatbot.js):', error);
//             // This catch block is for errors specifically from the `sendMessageToChatbot` prop call itself.
//             // Actual chatbot response errors (API failures) are handled in App.js.
//             setMessages(prevMessages => [...prevMessages, { role: 'model', text: "There was an issue sending your message." }]);
//         } finally {
//             setIsLoading(false); // End loading indicator
//         }
//     };

//     const handleFaqArticleClick = async (question) => {
//         setCurrentView('chat'); // Switch to chat view
//         setIsLoading(true); // Show loading indicator while waiting for response

//         try {
//             // Similar to handleSendMessage, delegate the FAQ question processing
//             // to the parent component (App.js).
//             // App.js's sendMessageToChatbot will then handle the local FAQ match or API call.
//             await sendMessageToChatbot(question);
//         } catch (error) {
//             console.error('Error sending FAQ article query (Chatbot.js):', error);
//             setMessages(prevMessages => [...prevMessages, { role: 'model', text: "Could not retrieve FAQ answer." }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className={`chatbot-container ${showChatbot ? 'open' : ''}`}>
//             <div className="chatbot-header">
//                 <div className="header-top">
//                     <h3 className="chatbot-title">Mivada Chatbot</h3>
//                     <button onClick={onClose} className="close-button" title='Close Chat'>
//                         &times;
//                     </button>
//                 </div>
//                 <div className="chatbot-tabs">
//                     <button
//                         className={`tab-button ${currentView === 'chat' ? 'active' : ''}`}
//                         onClick={() => setCurrentView('chat')}
//                     >
//                         Chat
//                     </button>
//                     <button
//                         className={`tab-button ${currentView === 'help' ? 'active' : ''}`}
//                         onClick={() => setCurrentView('help')}
//                     >
//                         Help
//                     </button>
//                 </div>
//             </div>

//             {currentView === 'chat' && (
//                 <>
//                     <div className="chatbot-messages">
//                         {messages.length === 0 && !isLoading && (
//                             <div className="welcome-message">
//                                 <p>Hello! How can I help you today?</p>
//                                 <p>Try asking about "Attendance module" or "Subscription plans".</p>
//                             </div>
//                         )}
//                         {messages.map((msg, index) => (
//                             <div key={index} className={`message-bubble ${msg.role}`}>
//                                 {/* This is where 'white-space: pre-wrap;' in Chatbot.css will help make paragraphs */}
//                                 {msg.text}
//                             </div>
//                         ))}
//                         {isLoading && (
//                             <div className="message-bubble model loading">
//                                 <div className="dot-pulse-dot"></div>
//                                 <div className="dot-pulse-dot"></div>
//                                 <div className="dot-pulse-dot"></div>
//                             </div>
//                         )}
//                         <div ref={messagesEndRef} /> {/* Scroll target */}
//                     </div>
//                     <form onSubmit={handleSendMessage} className="chatbot-input-form">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Type your message..."
//                             disabled={isLoading}
//                         />
//                         <button type="submit" disabled={isLoading}>Send</button>
//                     </form>
//                 </>
//             )}

//             {currentView === 'help' && (
//                 <div className="chatbot-help-section">
//                     <h4 className="help-section-title">Most Frequently Read Articles</h4>
//                     <div className="faq-articles-list">
//                         {/* Use faqDataForDisplay prop to render the FAQ questions for the Help tab */}
//                         {faqDataForDisplay.map((item, index) => (
//                             <div key={index} className="faq-article-card" onClick={() => handleFaqArticleClick(item.question)}>
//                                 <span className="faq-icon">📖</span>
//                                 <p className="faq-question">{item.question}</p>
//                                 <span className="faq-arrow">&gt;</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chatbot;


import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // <--- ADD THIS IMPORT
import './Chatbot.css'; // Keep this line! It's essential for styling.

// Chatbot component receives props from App.js.
// It should NOT have its own internal faqData or internal fetch history logic.
const Chatbot = ({ showChatbot, messages, setMessages, sendMessageToChatbot, userId, onClose, faqDataForDisplay }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'help'
    const messagesEndRef = useRef(null);

    // Scroll to the latest message whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (input.trim() === '') return;

        const userMessageText = input.trim();
        setInput(''); // Clear input immediately
        setIsLoading(true); // Start loading indicator

        try {
            // Delegate the message sending and response handling
            // to the parent component's (App.js) sendMessageToChatbot function.
            // App.js will decide if it's an FAQ or needs an API call.
            await sendMessageToChatbot(userMessageText);
        } catch (error) {
            console.error('Error in handleSendMessage (Chatbot.js):', error);
            // This catch block is for errors specifically from the `sendMessageToChatbot` prop call itself.
            // Actual chatbot response errors (API failures) are handled in App.js.
            setMessages(prevMessages => [...prevMessages, { role: 'model', text: "There was an issue sending your message." }]);
        } finally {
            setIsLoading(false); // End loading indicator
        }
    };

    const handleFaqArticleClick = async (question) => {
        setCurrentView('chat'); // Switch to chat view
        setIsLoading(true); // Show loading indicator while waiting for response

        try {
            // Similar to handleSendMessage, delegate the FAQ question processing
            // to the parent component (App.js).
            // App.js's sendMessageToChatbot will then handle the local FAQ match or API call.
            await sendMessageToChatbot(question);
        } catch (error) {
            console.error('Error sending FAQ article query (Chatbot.js):', error);
            setMessages(prevMessages => [...prevMessages, { role: 'model', text: "Could not retrieve FAQ answer." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chatbot-container ${showChatbot ? 'open' : ''}`}>
            <div className="chatbot-header">
                <div className="header-top">
                    <h3 className="chatbot-title">Mivada Chatbot</h3>
                    <button onClick={onClose} className="close-button" title='Close Chat'>
                        &times;
                    </button>
                </div>
                <div className="chatbot-tabs">
                    <button
                        className={`tab-button ${currentView === 'chat' ? 'active' : ''}`}
                        onClick={() => setCurrentView('chat')}
                    >
                        Chat
                    </button>
                    <button
                        className={`tab-button ${currentView === 'help' ? 'active' : ''}`}
                        onClick={() => setCurrentView('help')}
                    >
                        Help
                    </button>
                </div>
            </div>

            {currentView === 'chat' && (
                <>
                    <div className="chatbot-messages">
                        {messages.length === 0 && !isLoading && (
                            <div className="welcome-message">
                                <p>Hello! How can I help you today?</p>
                                <p>Try asking about "Attendance module" or "Subscription plans".</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.role}`}>
                                {/* Use ReactMarkdown for model responses, plain text for user messages */}
                                {msg.role === 'model' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text} {/* <--- MODIFIED LINE */}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-bubble model loading">
                                <div className="dot-pulse-dot"></div>
                                <div className="dot-pulse-dot"></div>
                                <div className="dot-pulse-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} /> {/* Scroll target */}
                    </div>
                    <form onSubmit={handleSendMessage} className="chatbot-input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>Send</button>
                    </form>
                </>
            )}

            {currentView === 'help' && (
                <div className="chatbot-help-section">
                    <h4 className="help-section-title">Most Frequently Read Articles</h4>
                    <div className="faq-articles-list">
                        {/* Use faqDataForDisplay prop to render the FAQ questions for the Help tab */}
                        {faqDataForDisplay.map((item, index) => (
                            <div key={index} className="faq-article-card" onClick={() => handleFaqArticleClick(item.question)}>
                                <span className="faq-icon">📖</span>
                                <p className="faq-question">{item.question}</p>
                                <span className="faq-arrow">&gt;</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;