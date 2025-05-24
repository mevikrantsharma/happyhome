const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // First clear any existing admins (optional - keeps admin table clean)
    await Admin.deleteMany({});

    // Create new admin
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@happyhome.com',
      password: 'admin123456' // This will be hashed by the model pre-save hook
    });

    console.log('Admin user created:');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123456 (save this before it's hashed!)`);
    console.log('\nPlease change the password after first login for security.');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error creating admin: ${error.message}`);
    process.exit(1);
  }
};

// Connect and create admin
connectDB().then(() => {
  createAdmin();
});
