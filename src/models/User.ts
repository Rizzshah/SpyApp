import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '@/types';

interface UserDocument extends Omit<IUser, '_id'>, Document { }

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        ipAddress: {
            type: String,
            default: 'unknown',
        },
        userAgent: {
            type: String,
            default: '',
        },
        device: {
            type: String,
            default: 'Unknown Device',
        },
        browser: {
            type: String,
            default: 'Unknown Browser',
        },
        operatingSystem: {
            type: String,
            default: 'Unknown OS',
        },
        coordinates: {
            latitude: {
                type: Number,
                min: -90,
                max: 90,
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180,
            },
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
