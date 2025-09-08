import UAParser from 'ua-parser-js';

export function parseUserAgent(userAgent: string) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        device: `${result.device.vendor || 'Unknown'} ${result.device.model || 'Device'}`.trim(),
        browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
        operatingSystem: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    };
}

export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getClientIP(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export const spinWheelPrizes = [
    {
        name: 'iPhone 16',
        icon: '📱',
        color: '#000000',
    },
    {
        name: 'Gold Watch',
        icon: '⌚',
        color: '#FFD700',
    },
    {
        name: '$500 Cash',
        icon: '💰',
        color: '#22C55E',
    },
    {
        name: '$1000 Cash',
        icon: '💰',
        color: '#10B981',
    },
    {
        name: 'Diamond Ring',
        icon: '💎',
        color: '#8B5CF6',
    },
    {
        name: 'Try Again',
        icon: '❌',
        color: '#EF4444',
    },
    {
        name: 'Teddy Bear',
        icon: '🧸',
        color: '#F59E0B',
    },
    {
        name: 'VIP Package',
        icon: ' 🚀',
        color: '#EC4899',
    },
];

export function getRandomPrize(): string {
    const randomPrize = spinWheelPrizes[Math.floor(Math.random() * spinWheelPrizes.length)];
    return `${randomPrize.icon} ${randomPrize.name}`;
}
