import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/User';
import { VisitorTracking } from '@/models/VisitorTracking';
import { parseUserAgent, getClientIP } from '@/utils/helpers';
import { userFormSchema } from '@/validators';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, phone, location, coordinates, sessionId, prize } = body;

        // Validate the form data
        const validationResult = userFormSchema.safeParse({ email, phone, location });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid form data', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Get user info
        const userAgent = request.headers.get('user-agent') || '';
        const ipAddress = getClientIP(request);
        const deviceInfo = parseUserAgent(userAgent);

        // Create user record
        const user = new User({
            email,
            phone,
            location,
            ipAddress,
            userAgent,
            ...deviceInfo,
            coordinates: coordinates || undefined,
        });

        await user.save();

        // Update visitor tracking with user association
        await VisitorTracking.findOneAndUpdate(
            { sessionId },
            {
                $set: {
                    userId: user._id,
                },
                $push: {
                    pageViews: {
                        page: '/form-submission',
                        timestamp: new Date(),
                    },
                },
            }
        );

        // TODO: Here you could integrate with email services, CRM, etc.
        // For example: send notification email, add to marketing lists, etc.

        return NextResponse.json({
            success: true,
            message: 'User data submitted successfully',
            userId: user._id,
        });
    } catch (error: any) {
        console.error('Error submitting user data:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
