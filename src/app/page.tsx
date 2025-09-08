'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpinWheel } from '@/components/SpinWheel';
import { UserFormModal } from '@/components/modals/UserFormModal';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { trackVisitor } from '@/services/api';
import { generateSessionId } from '@/utils/helpers';

export default function HomePage() {
    const [showUserForm, setShowUserForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState('');
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Initialize session and track visitor
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);

        // Track the visitor
        trackVisitor(newSessionId, '/');

        // Request location permission
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Location granted, will be saved when user submits form
                    console.log('Location access granted');
                },
                (error) => {
                    console.log('Location access denied');
                }
            );
        }
    }, []);

    const handleSpinComplete = (prize: string) => {
        setSelectedPrize(prize);
        setShowUserForm(true);
    };

    const handleUserFormSubmit = () => {
        setShowUserForm(false);
        setShowSuccess(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                        🎯 SPIN & WIN! 🎯
                    </h1>
                    {/* <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
                        Amazing prizes are waiting for you!
                    </p> */}
                    <p className="text-lg text-white/80">
                        Spin the wheel and discover your reward
                    </p>
                </motion.div>

                {/* Spin Wheel Component */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-8"
                >
                    <SpinWheel onSpinComplete={handleSpinComplete} />
                </motion.div>

                {/* Call to action */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center"
                >
                    <p className="text-white/90 text-lg mb-4">
                        🎁 Premium rewards • 💰 Cash prizes • 🏆 Exclusive offers
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
                        <span>✅ 100% Free to play</span>
                        <span>✅ Instant results</span>
                        <span>✅ Real prizes</span>
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showUserForm && (
                    <UserFormModal
                        isOpen={showUserForm}
                        onClose={() => setShowUserForm(false)}
                        onSubmit={handleUserFormSubmit}
                        prize={selectedPrize}
                        sessionId={sessionId}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSuccess && (
                    <SuccessModal
                        isOpen={showSuccess}
                        onClose={() => setShowSuccess(false)}
                        prize={selectedPrize}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
