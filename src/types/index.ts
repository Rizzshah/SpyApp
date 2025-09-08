export interface User {
    _id?: string;
    email: string;
    phone: string;
    location: string;
    ipAddress?: string;
    userAgent?: string;
    device?: string;
    browser?: string;
    operatingSystem?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Admin {
    _id?: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'super-admin';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VisitorTracking {
    _id?: string;
    ipAddress: string;
    userAgent: string;
    device: string;
    browser: string;
    operatingSystem: string;
    country?: string;
    city?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    pageViews: Array<{
        page: string;
        timestamp: Date;
        duration?: number;
    }>;
    sessionId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SpinResult {
    _id?: string;
    userId?: string;
    prize: string;
    timestamp: Date;
    sessionId: string;
}
