

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import Mongoose connection and auth routes
const connectDB = require('./db'); // Your Mongoose connection
const authRoutes = require('./routes/auth'); // Your new auth routes

const app = express();
//const port = 3001;
const port = process.env.PORT || 3001;

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
