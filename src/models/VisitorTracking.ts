import mongoose, { Schema, Document } from 'mongoose';
import { VisitorTracking as IVisitorTracking } from '@/types';

interface VisitorTrackingDocument extends Omit<IVisitorTracking, '_id'>, Document { }

const VisitorTrackingSchema = new Schema<VisitorTrackingDocument>(
    {
        ipAddress: {
            type: String,
            required: true,
            index: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            required: true,
        },
        browser: {
            type: String,
            required: true,
        },
        operatingSystem: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
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
        pageViews: [
            {
                page: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                duration: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const VisitorTracking = mongoose.models.VisitorTracking ||
    mongoose.model<VisitorTrackingDocument>('VisitorTracking', VisitorTrackingSchema);
