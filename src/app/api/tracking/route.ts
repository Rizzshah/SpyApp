import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { VisitorTracking } from '@/models/VisitorTracking';
import { parseUserAgent, getClientIP, generateSessionId } from '@/utils/helpers';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { sessionId, page, timestamp } = body;

        // Get visitor info
        const userAgent = request.headers.get('user-agent') || '';
        const ipAddress = getClientIP(request);
        const deviceInfo = parseUserAgent(userAgent);

        // Check if visitor tracking already exists for this session
        let visitorTracking = await VisitorTracking.findOne({ sessionId });

        if (visitorTracking) {
            // Update existing tracking with new page view
            visitorTracking.pageViews.push({
                page,
                timestamp: new Date(timestamp),
            });
            await visitorTracking.save();
        } else {
            // Create new visitor tracking
            visitorTracking = new VisitorTracking({
                sessionId,
                ipAddress,
                userAgent,
                ...deviceInfo,
                pageViews: [
                    {
                        page,
                        timestamp: new Date(timestamp),
                    },
                ],
            });
            await visitorTracking.save();
        }

        return NextResponse.json({
            success: true,
            message: 'Visitor tracked successfully',
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
