const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            // These options are deprecated in Mongoose 6.0+, but good to be aware of for older versions.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        // Log any connection errors
        console.error(err.message);
        // Exit process with failure if connection fails
        process.exit(1);
    }
};

module.exports = connectDB; // Export the connection function