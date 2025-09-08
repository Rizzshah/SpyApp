'use client';

import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    prize: string;
}

export function SuccessModal({ isOpen, onClose, prize }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-block"
                        >
                            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2">Success! 🎉</h2>
                        <p className="text-green-100">Your prize claim has been submitted</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Your Prize:</h3>
                        <p className="text-lg font-bold text-purple-600">{prize}</p>
                    </div>

                    <div className="space-y-3 text-gray-600 mb-6">
                        <p className="flex items-center justify-center gap-2">
                            <span className="text-green-500">✓</span>
                            Information submitted successfully
                        </p>
                        <p className="flex items-center justify-center gap-2">
                            <span className="text-green-500">✓</span>
                            Our team will contact you soon
                        </p>
                        <p className="flex items-center justify-center gap-2">
                            <span className="text-green-500">✓</span>
                            Prize delivery within 2-3 business days
                        </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>What's next?</strong> We'll reach out via the contact information you provided.
                            Keep an eye on your email and phone for updates about your prize!
                        </p>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold"
                    >
                        Awesome! 🚀
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
