const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spinwheel-app';

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'super-admin'],
        default: 'admin',
    },
}, {
    timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists');
            console.log('Username: admin');
            console.log('Use existing password or reset if needed');
            process.exit(0);
        }

        // Create default admin user
        const admin = new Admin({
            username: 'admin',
            email: 'admin@spinwheel.com',
            password: 'Admn_1!@#',
            role: 'super-admin',
        });

        await admin.save();
        console.log('✅ Default admin user created successfully!');
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('');
        console.log('⚠️  IMPORTANT: Please change the default password after first login!');
        console.log('🌐 Access admin panel at: http://localhost:3000/admin/login');
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdminUser();
