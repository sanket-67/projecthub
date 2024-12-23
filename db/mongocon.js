import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const mongoCon = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MURL, {
      useNewUrlParser: true, // Ensures URL parsing is supported
      useUnifiedTopology: true, // Enables the new connection management engine
    });
    console.log("The database connected successfully");
  } catch (error) {
    console.error("There is a problem connecting to MongoDB!!!!!", error.message);
  }
};

export { mongoCon };
