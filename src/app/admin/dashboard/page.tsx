'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    Activity,
    TrendingUp,
    Monitor,
    Smartphone,
    Globe,
    LogOut,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Eye,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fetchUsers, fetchVisitorTracking } from '@/services/api';
import { formatDate } from '@/utils/helpers';

interface AdminData {
    id: string;
    username: string;
    email: string;
    role: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [tracking, setTracking] = useState([]);
    const [stats, setStats] = useState<any>({});
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if admin is logged in
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('adminData');

        if (!token || !admin) {
            router.push('/admin/login');
            return;
        }

        setAdminData(JSON.parse(admin));
        loadData(token);
    }, [router]);

    const loadData = async (token: string) => {
        setIsLoading(true);
        try {
            const [usersResponse, trackingResponse] = await Promise.all([
                fetchUsers(token),
                fetchVisitorTracking(token),
            ]);

            setUsers(usersResponse.users);
            setTracking(trackingResponse.trackingData);
            setStats(trackingResponse.stats);
        } catch (error) {
            console.error('Error loading data:', error);
            // If unauthorized, redirect to login
            if (error instanceof Error && error.message.includes('401')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminData');
                router.push('/admin/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        router.push('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {adminData?.username}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalVisitors || 0}</p>
                            </div>
                            <Activity className="w-8 h-8 text-green-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Page Views</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews || 0}</p>
                            </div>
                            <Eye className="w-8 h-8 text-purple-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique IPs</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.uniqueIPs || 0}</p>
                            </div>
                            <Globe className="w-8 h-8 text-orange-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'users', label: 'Users', icon: Users },
                                { id: 'tracking', label: 'Visitor Tracking', icon: Activity },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600">Total users registered: {users.length}</p>
                                            <p className="text-sm text-gray-600">Total visitors tracked: {stats.totalVisitors || 0}</p>
                                            <p className="text-sm text-gray-600">Page views generated: {stats.totalPageViews || 0}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">System Status</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-gray-600">Database: Connected</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-gray-600">API: Online</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-gray-600">Tracking: Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Registered Users</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contact Info
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Device Info
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user: any) => (
                                                <tr key={user._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Mail className="w-4 h-4 mr-1" />
                                                                {user.email}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Phone className="w-4 h-4 mr-1" />
                                                                {user.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {user.location}
                                                        </div>
                                                        {user.coordinates && (
                                                            <div className="text-xs text-gray-500">
                                                                {user.coordinates.latitude.toFixed(4)}, {user.coordinates.longitude.toFixed(4)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>{user.device}</div>
                                                        <div>{user.browser}</div>
                                                        <div>{user.operatingSystem}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(new Date(user.createdAt))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tracking' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Visitor Tracking</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Session Info
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Device & Browser
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Page Views
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    First Visit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tracking.map((visitor: any) => (
                                                <tr key={visitor._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">IP: {visitor.ipAddress}</div>
                                                        <div className="text-sm text-gray-500">Session: {visitor.sessionId.slice(0, 16)}...</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            {visitor.device.includes('Mobile') ?
                                                                <Smartphone className="w-4 h-4 mr-1" /> :
                                                                <Monitor className="w-4 h-4 mr-1" />
                                                            }
                                                            {visitor.device}
                                                        </div>
                                                        <div>{visitor.browser}</div>
                                                        <div>{visitor.operatingSystem}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            {visitor.pageViews.length} views
                                                        </div>
                                                        <div className="text-xs">
                                                            {visitor.pageViews.slice(0, 3).map((pv: any, idx: number) => (
                                                                <div key={idx}>{pv.page}</div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(new Date(visitor.createdAt))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
