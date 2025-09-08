import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin as IAdmin } from '@/types';

interface AdminDocument extends Omit<IAdmin, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<AdminDocument>(
    {
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
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema);
