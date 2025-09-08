import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/utils/db';
import { VisitorTracking } from '@/models/VisitorTracking';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        // Check authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authorization required' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get query parameters for pagination and filtering
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Fetch tracking data with pagination
        const trackingData = await VisitorTracking.find({})
            .select('-__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await VisitorTracking.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        // Calculate some statistics
        const stats = await VisitorTracking.aggregate([
            {
                $group: {
                    _id: null,
                    totalVisitors: { $sum: 1 },
                    uniqueIPs: { $addToSet: '$ipAddress' },
                    totalPageViews: { $sum: { $size: '$pageViews' } },
                    deviceTypes: { $push: '$device' },
                    browsers: { $push: '$browser' },
                    operatingSystems: { $push: '$operatingSystem' },
                },
            },
            {
                $project: {
                    totalVisitors: 1,
                    uniqueIPs: { $size: '$uniqueIPs' },
                    totalPageViews: 1,
                    deviceTypes: 1,
                    browsers: 1,
                    operatingSystems: 1,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            trackingData,
            stats: stats[0] || {
                totalVisitors: 0,
                uniqueIPs: 0,
                totalPageViews: 0,
                deviceTypes: [],
                browsers: [],
                operatingSystems: [],
            },
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
