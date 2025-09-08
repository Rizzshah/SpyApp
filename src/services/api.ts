import { UserFormData, CoordinatesData } from '@/validators';

const API_BASE = '/api';

interface SubmitUserDataParams extends UserFormData {
    coordinates?: CoordinatesData | null;
    sessionId: string;
    prize: string;
}

export async function submitUserData(data: SubmitUserDataParams) {
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to submit user data');
    }

    return response.json();
}

export async function trackVisitor(sessionId: string, page: string) {
    try {
        const response = await fetch(`${API_BASE}/tracking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                page,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.error('Failed to track visitor');
        }

        return response.json();
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

export async function loginAdmin(username: string, password: string) {
    const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return response.json();
}

export async function fetchUsers(token: string) {
    const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}

export async function fetchVisitorTracking(token: string) {
    const response = await fetch(`${API_BASE}/admin/tracking`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
    }

    return response.json();
}
