Mivada School Portal: Project Overview
The Mivada School Portal is a dynamic and comprehensive web application designed to enhance the educational experience by providing a streamlined platform for school management and student interaction.
This robust portal offers essential functionalities such as secure user authentication, enabling seamless Login and Registration for all users. Upon successful authentication, users are directed to a dynamic dashboard that serves as a central hub for accessing various features.
A key innovation within the portal is its integrated AI Chatbot, powered by Google Gemini AI, which provides an intelligent support system capable of answering a wide array of school-related inquiries.
Furthermore, the system efficiently stores and retrieves chat history, ensuring a continuous and personalized conversation flow for each user.
The application is also designed with a responsive interface, ensuring optimal viewing and interaction across various devices.

Technical Architecture and Live Access
Built upon a robust MERN (MongoDB, Express.js, React.js, Node.js) stack, the Mivada School Portal leverages modern web technologies to deliver a fluid and powerful user experience.
The frontend, developed with React.js, handles the user interface and interactions, utilizing libraries like Axios for efficient HTTP requests to the backend. On the backend, Node.js with Express.js provides a fast and minimalist framework for handling API routes, user data, and business logic.
Data persistence is managed by MongoDB, accessed through Mongoose for object data modeling, where user details and the comprehensive chat history are securely stored.
The integration of Google Generative AI SDK empowers the chatbot, while Dotenv manages crucial environment variables and CORS facilitates secure cross-origin communication.
You can experience the live application at[https://mivada-school-portal-git-f4481c-ravichandras-projects-4a11d48e.vercel.app], which serves the user-facing portal. The backend API, which powers this application, is hosted independently at (https://mivada-school-portal-final-try.onrender.com)

Setting Up for Local Development
To get the Mivada School Portal running on your local machine for development and testing, you'll first need to ensure you have Node.js (LTS version recommended) and npm installed.
Additionally, access to a MongoDB Atlas account for your cloud database and a Google Cloud Project with the Gemini API enabled (along with a generated API Key) are prerequisites.
Begin by cloning the repository using git clone https://github.com/Ravichandrasrisailam/mivada-school-portal-final-try.git and then navigate into the mivada-school-portal-final-try directory.

For the Backend setup, change your directory to Backend, install dependencies with npm install, and create a .env file containing MONGO_URI (mongodb+srv://Ravichandrasrisailam:Chandu%40Rc1@cluster0.8mkd6dm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0), GEMINI_API_KEY (GEMINI_API_KEY="AIzaSyBNBqTuDKyJunXsRY1kE4DXi3LGF6_GIAs"
), and JWT_SECRET (JWT_SECRET="A_VERY_LONG_AND_COMPLEX_RANDOM_STRING_FOR_JWT_SIGNING"
).
Once configured, start the backend server by running npm start, which will make the API available at http://localhost:3001.

For the Frontend setup, move back to the front directory (cd ../front), install its dependencies using npm install, and then create a .env file with REACT_APP_BACKEND_URL=http://localhost:3001 to connect it to your local backend.
Finally, launch the frontend development server with npm start, which will open the application in your browser at http://localhost:3000.

Using the Portal and Deployment Information
Once the local setup is complete, access the portal via http://localhost:3000. You can either register a new user account or log in with existing credentials to explore the dashboard and interact with the AI chatbot.
For live deployment, the project leverages continuous deployment pipelines: the frontend automatically deploys to Vercel upon changes to the main branch, configured via a vercel.json file in the project root; similarly, the backend deploys to Render following pushes to the main branch.
It's crucial that all necessary environment variables are securely configured within your Render service settings for the backend to function correctly in a live environment.
Contributions to the project are highly encouraged, and interested developers are welcome to fork the repository, make enhancements, and submit pull requests.
This project is released under the MIT License, details of which can be found in the LICENSE.md file.
