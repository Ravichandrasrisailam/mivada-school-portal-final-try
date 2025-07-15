// // backend/server.js

// const express = require('express');

// const { MongoClient, ServerApiVersion } = require('mongodb');

// const cors = require('cors');

// const { GoogleGenerativeAI } = require('@google/generative-ai');

// require('dotenv').config();



// // Import Mongoose connection and auth routes

// const connectDB = require('./db'); // Your Mongoose connection

// const authRoutes = require('./routes/auth'); // Your new auth routes



// const app = express();

// const port = 3001;



// // Middleware

// app.use(cors());

// app.use(express.json());



// // Load environment variables

// const MONGO_URI = process.env.MONGO_URI;

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is also in your .env



// // Check if all necessary environment variables are loaded

// if (!MONGO_URI) {

//   console.error("Error: MONGO_URI not found in environment variables. Please set it in your .env file.");

//   process.exit(1);

// }

// if (!GEMINI_API_KEY) {

//   console.error("Error: GEMINI_API_KEY not found in environment variables. Please set it in your .env file.");

//   process.exit(1);

// }

// if (!JWT_SECRET) {

//     console.error("Error: JWT_SECRET not found in environment variables. Please set it in your .env file.");

//     process.exit(1);

// }



// // Connect to MongoDB using Mongoose

// connectDB();



// // Initialize Gemini AI

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);



// // --- MongoDB Client (if still needed for direct operations, otherwise remove) ---

// // If you plan to use Mongoose for ALL database operations, you can remove this MongoClient part.

// // For now, I'll keep it as your original server.js used it for chat messages.

// const client = new MongoClient(MONGO_URI, {

//   serverApi: {

//     version: ServerApiVersion.v1,

//     strict: true,

//     deprecationErrors: true,

//   }

// });



// async function runMongoDBClient() {

//   try {

//     await client.connect();

//     await client.db("admin").command({ ping: 1 });

//     console.log("Pinged your deployment. You successfully connected to MongoDB with MongoClient!");

//   } catch (error) {

//     console.error("Failed to connect to MongoDB with MongoClient:", error);

//     // Do not exit here if Mongoose is handling the primary connection

//   }

// }

// runMongoDBClient().catch(console.dir);

// // --- End MongoDB Client section ---





// // Define Auth Routes

// app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth



// // Route to handle chat messages (existing logic)

// app.post('/api/chat', async (req, res) => {

//     const { userId, message, chatHistory } = req.body;



//     if (!userId || !message) {

//         return res.status(400).json({ error: 'User ID and message are required.' });

//     }



//     try {

//         console.log("Backend: Received chat message:", message); // NEW LOG 1

//         console.log("Backend: User ID:", userId);  

//         const database = client.db("mivada_school_db"); // Your database name

//         const chatCollection = database.collection("chat_messages"); // Your collection name



//         // Save user message to MongoDB

//         await chatCollection.insertOne({

//             userId: userId,

//             role: 'user',

//             text: message,

//             timestamp: new Date()

//         });



//         // ======================= CORRECTED LOGIC =======================

//         // Ensure chatHistory is an array

//         const history = Array.isArray(chatHistory) ? chatHistory : [];



//         // The Gemini API requires the history to be in a specific format and order.

//         // It must start with a 'user' message. Let's find the first valid 'user' message index.

//         const firstUserIndex = history.findIndex(msg => msg.role === 'user');



//         let validHistory = [];

//         if (firstUserIndex !== -1) {

//             // If a 'user' message is found, slice the history from that point.

//             validHistory = history.slice(firstUserIndex);

//         }

//        

//         // Format the valid history for the Gemini API.

//         const formattedChatHistory = validHistory.map(msg => ({

//             role: msg.role,

//             parts: [{ text: msg.text }]

//         }));

//         // ===================== END OF CORRECTED LOGIC ====================



//         const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });



//         const chat = model.startChat({

//             history: formattedChatHistory, // Use the correctly formatted and validated history

//             generationConfig: {

//                 maxOutputTokens: 500,

//             },

//         });



//         const result = await chat.sendMessage(message);

//         const response = await result.response;

//         const botResponseText = response.text();



//         // Save bot response to MongoDB

//         await chatCollection.insertOne({

//             userId: userId,

//             role: 'model',

//             text: botResponseText,

//             timestamp: new Date()

//         });



//         res.json({ response: botResponseText });



//     } catch (error) {

//         console.error("Error processing chat message:", error);

//         // Provide more specific error messages for debugging

//         if (error.message.includes('GoogleGenerativeAI Error') || error.message.includes('Forbidden')) {

//             res.status(500).json({ error: 'Failed to get response from AI.', details: 'Please check your Gemini API key and project settings, or try a different model. Backend error: ' + error.message });

//         } else {

//             res.status(500).json({ error: 'Failed to get response from chatbot.', details: error.message });

//         }

//     }

// });



// // Route to fetch chat history for a user (existing logic)

// app.get('/api/chat/history/:userId', async (req, res) => {

//     const { userId } = req.params;



//     try {

//         const database = client.db("mivada_school_db");

//         const chatCollection = database.collection("chat_messages");



//         const history = await chatCollection.find({ userId: userId })

//                                             .sort({ timestamp: 1 })

//                                             .toArray();



//         res.json({ history: history });

//     } catch (error) {

//         console.error("Error fetching chat history:", error);

//         res.status(500).json({ error: 'Failed to fetch chat history.', details: error.message });

//     }

// });



// // Start the server

// app.listen(port, () => {

//     console.log(`Backend server listening at http://localhost:${port}`);

// });

// // // backend/server.js
// const express = require('express');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const cors = require('cors');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// // Import Mongoose connection and auth routes
// const connectDB = require('./db'); // Your Mongoose connection
// const authRoutes = require('./routes/auth'); // Your new auth routes

// const app = express();
// const port = 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Load environment variables
// const MONGO_URI = process.env.MONGO_URI;
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is also in your .env

// // Check if all necessary environment variables are loaded
// if (!MONGO_URI) {
//     console.error("Error: MONGO_URI not found in environment variables. Please set it in your .env file.");
//     process.exit(1);
// }
// if (!GEMINI_API_KEY) {
//     console.error("Error: GEMINI_API_KEY not found in environment variables. Please set it in your .env file.");
//     process.exit(1);
// }
// if (!JWT_SECRET) {
//     console.error("Error: JWT_SECRET not found in environment variables. Please set it in your .env file.");
//     process.exit(1);
// }

// // Connect to MongoDB using Mongoose
// connectDB();

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // --- MongoDB Client (if still needed for direct operations, otherwise remove) ---
// // If you plan to use Mongoose for ALL database operations, you can remove this MongoClient part.
// // For now, I'll keep it as your original server.js used it for chat messages.
// const client = new MongoClient(MONGO_URI, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function runMongoDBClient() {
//     try {
//         await client.connect();
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB with MongoClient!");
//     } catch (error) {
//         console.error("Failed to connect to MongoDB with MongoClient:", error);
//         // Do not exit here if Mongoose is handling the primary connection
//     }
// }
// runMongoDBClient().catch(console.dir);
// // --- End MongoDB Client section ---


// // Define Auth Routes
// app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth

// // Route to handle chat messages (existing logic)
// app.post('/api/chat', async (req, res) => {
//     const { userId, message, chatHistory } = req.body;

//     if (!userId || !message) {
//         return res.status(400).json({ error: 'User ID and message are required.' });
//     }

//     try {
//         console.log("Backend: Received chat message:", message);
//         console.log("Backend: User ID:", userId);
//         const database = client.db("mivada_school_db"); // Your database name
//         const chatCollection = database.collection("chat_messages"); // Your collection name

//         // Save user message to MongoDB
//         await chatCollection.insertOne({
//             userId: userId,
//             role: 'user',
//             text: message,
//             timestamp: new Date()
//         });

//         // Ensure chatHistory is an array and format it for Gemini
//         const history = Array.isArray(chatHistory) ? chatHistory : [];
//         const formattedChatHistory = history.map(msg => ({
//             role: msg.role,
//             parts: [{ text: msg.text }]
//         }));

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // --- PROMPT ENGINEERING FOR SCOPE AND STRUCTURE ---
//         const systemInstruction = `
//             You are a helpful and polite chatbot specifically designed to provide information ONLY about **Mivada School**.
//             Your primary goal is to answer questions related to Mivada School's modules, features, pricing, and general inquiries that are directly relevant to the school's operations.

//             **Instructions for your response:**
//             1.  **Strictly stay on topic:** Only answer questions about Mivada School.
//             2.  **If the question is about Mivada School:**
//                 * Provide a clear, concise, and helpful answer.
//                 * Use Markdown formatting for structure:
//                     * Use **bold text** for key terms or headings.
//                     * Use bullet points (`* ` or `- `) for lists.
//                     * Use double newlines (\\n\\n)) for paragraph breaks to ensure good spacing.
//                 * Keep responses direct and informative.
//             3.  **If the question is NOT about Mivada School (e.g., "how to apply to *any* school," general knowledge, personal questions, or questions about other schools):**
//                 * Politely state that you can only provide information about Mivada School.
//                 * Suggest they check the school's official website or contact their admissions office directly if they are asking about another school.
//                 * Do NOT try to answer generic questions or provide information outside Mivada School's context.
//                 * Example response for out-of-scope: "I am designed to provide information specifically about Mivada School. If you have questions related to Mivada School, I'd be happy to help! For information about other schools or general application processes, please check their official websites or contact their admissions teams directly."

            
//         `;
        

//         const chat = model.startChat({
//             history: formattedChatHistory, // Use the correctly formatted history
//             generationConfig: {
//                 maxOutputTokens: 500, // Limit response length
//                 temperature: 0.4, // Lower temperature for less creativity, more direct answers
//                 topP: 0.9,
//                 topK: 30, // Adjust topK for more focused sampling
//                 responseMimeType: "text/plain", // Ensure plain text output, Markdown will be interpreted by frontend
//             },
//             // Add system instructions if the model supports it directly, otherwise prepend to message
//             // For older models or simpler integration, prepending to the message is common.
//         });

//         // Prepend the system instruction to the current message for context
//         const fullPrompt = message;

//         const result = await chat.sendMessage(fullPrompt);
//         const response = await result.response;
//         const botResponseText = response.text();

//         // Save bot response to MongoDB
//         await chatCollection.insertOne({
//             userId: userId,
//             role: 'model',
//             text: botResponseText,
//             timestamp: new Date()
//         });

//         res.json({ response: botResponseText });

//     } catch (error) {
//         console.error("Error processing chat message:", error);
//         // Provide more specific error messages for debugging
//         if (error.message.includes('GoogleGenerativeAI Error') || error.message.includes('Forbidden')) {
//             res.status(500).json({ error: 'Failed to get response from AI.', details: 'Please check your Gemini API key and project settings, or try a different model. Backend error: ' + error.message });
//         } else {
//             res.status(500).json({ error: 'Failed to get response from chatbot.', details: error.message });
//         }
//     }
// });

// // Route to fetch chat history for a user (existing logic)
// app.get('/api/chat/history/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const database = client.db("mivada_school_db");
//         const chatCollection = database.collection("chat_messages");

//         const history = await chatCollection.find({ userId: userId })
//                                             .sort({ timestamp: 1 })
//                                             .toArray();

//         res.json({ history: history });
//     } catch (error) {
//         console.error("Error fetching chat history:", error);
//         res.status(500).json({ error: 'Failed to fetch chat history.', details: error.message });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Backend server listening at http://localhost:${port}`);
// });

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import Mongoose connection and auth routes
const connectDB = require('./db'); // Your Mongoose connection
const authRoutes = require('./routes/auth'); // Your new auth routes

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is also in your .env

// Check if all necessary environment variables are loaded
if (!MONGO_URI) {
    console.error("Error: MONGO_URI not found in environment variables. Please set it in your .env file.");
    process.exit(1);
}
if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY not found in environment variables. Please set it in your .env file.");
    process.exit(1);
}
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET not found in environment variables. Please set it in your .env file.");
    process.exit(1);
}

// Connect to MongoDB using Mongoose
connectDB();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define a general system instruction (Option A: General helpful AI)
const systemInstruction = `
    You are a helpful and polite AI assistant. Provide informative and concise answers to user queries.
    If you don't know the answer, politely state that you cannot provide it.
    Use Markdown formatting for structure: **bold text**, bullet points (* or - ), and double newlines (\\n\\n) for paragraph breaks.
`;


// --- MongoDB Client (if still needed for direct operations, otherwise remove) ---
// If you plan to use Mongoose for ALL database operations, you can remove this MongoClient part.
// For now, I'll keep it as your original server.js used it for chat messages.
const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function runMongoDBClient() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB with MongoClient!");
    } catch (error) {
        console.error("Failed to connect to MongoDB with MongoClient:", error);
        // Do not exit here if Mongoose is handling the primary connection
    }
}
runMongoDBClient().catch(console.dir);
// --- End MongoDB Client section ---


// Define Auth Routes
app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth

// Route to handle chat messages (existing logic)
app.post('/api/chat', async (req, res) => {
    const { userId, message, chatHistory } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ error: 'User ID and message are required.' });
    }

    try {
        console.log("Backend: Received chat message:", message);
        console.log("Backend: User ID:", userId);
        
        const database = client.db("mivada_school_db"); // Your database name
        const chatCollection = database.collection("chat_messages"); // Your collection name

        // Save user message to MongoDB
        await chatCollection.insertOne({
            userId: userId,
            role: 'user',
            text: message,
            timestamp: new Date()
        });

        // --- START OF REVISED HISTORY PREPARATION FOR GEMINI ---
        let historyForGemini = [];
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
            let tempHistory = [...chatHistory]; // Create a mutable copy

            // Critical: Ensure history starts with 'user' role.
            // If the first message in the actual history received from frontend (which is from DB)
            // is a 'model' role, we need to skip it or re-align the history.
            // This happens if the last message saved was from the bot and that's the first one fetched for history.
            while (tempHistory.length > 0 && tempHistory[0].role === 'model') {
                console.warn("Backend: Detected leading 'model' role in chat history. Removing it for Gemini API compatibility.");
                tempHistory.shift(); // Remove the first element
            }

            // After potentially removing leading 'model's, format the rest.
            historyForGemini = tempHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
        }

        console.log("Backend: Formatted history sent to Gemini:", JSON.stringify(historyForGemini, null, 2)); // For debugging
        // --- END OF REVISED HISTORY PREPARATION ---

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: historyForGemini,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.4,
                topP: 0.9,
                topK: 30,
                responseMimeType: "text/plain",
            },
            systemInstruction: {
                parts: [{ text: systemInstruction }], // Use the general system instruction
            },
        });

        const fullPrompt = message; // Your current message from the user

        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const botResponseText = response.text();

        // Save bot response to MongoDB
        await chatCollection.insertOne({
            userId: userId,
            role: 'model',
            text: botResponseText,
            timestamp: new Date()
        });

        res.json({ response: botResponseText });

    } catch (error) {
        console.error("Error processing chat message:", error);
        // Provide more specific error messages for debugging
        if (error.message.includes('GoogleGenerativeAI Error') || error.message.includes('Forbidden')) {
            res.status(500).json({ error: 'Failed to get response from AI.', details: 'Please check your Gemini API key and project settings, or try a different model. Backend error: ' + error.message });
        } else {
            res.status(500).json({ error: 'Failed to get response from chatbot.', details: error.message });
        }
    }
});

// Route to fetch chat history for a user (existing logic)
app.get('/api/chat/history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const database = client.db("mivada_school_db");
        // CORRECTED LINE: Only one declaration of chatCollection here
        const chatCollection = database.collection("chat_messages"); 

        const history = await chatCollection.find({ userId: userId })
                                        .sort({ timestamp: 1 })
                                        .toArray();

        res.json({ history: history });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ error: 'Failed to fetch chat history.', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
