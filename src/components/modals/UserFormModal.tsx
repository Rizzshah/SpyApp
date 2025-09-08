'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { X, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { userFormSchema, type UserFormData } from '@/validators';
import { submitUserData } from '@/services/api';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    prize: string;
    sessionId: string;
}

export function UserFormModal({ isOpen, onClose, onSubmit, prize, sessionId }: UserFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
    });

    const onFormSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);

        try {
            // Get location if available
            let coordinates = null;
            if ('geolocation' in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 10000,
                            enableHighAccuracy: true,
                        });
                    });
                    coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                } catch (error) {
                    console.log('Could not get location:', error);
                }
            }

            await submitUserData({
                ...data,
                coordinates,
                sessionId,
                prize,
            });

            toast.success('Congratulations! Your information has been submitted successfully!');
            onSubmit();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center">
                        <div className="text-4xl mb-2">🎉</div>
                        <h2 className="text-2xl font-bold mb-1">Congratulations!</h2>
                        <p className="text-purple-100">You won: {prize}</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <p className="text-gray-600 text-center mb-6">
                        Please provide your contact information so we can deliver your prize!
                    </p>

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                {...register('phone')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Location (City, State/Country)
                            </label>
                            <input
                                type="text"
                                {...register('location')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="New York, NY"
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                'Claim My Prize! 🎁'
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        We respect your privacy. Your information is secure and will only be used to contact you about your prize.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
