'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { spinWheelPrizes } from '@/utils/helpers';

interface SpinWheelProps {
    onSpinComplete: (prize: string) => void;
}

export function SpinWheel({ onSpinComplete }: SpinWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);

        // Calculate random rotation (5-8 full rotations + random angle)
        const randomRotation = 1800 + Math.random() * 1080; // 5-8 rotations
        const finalRotation = rotation + randomRotation;

        setRotation(finalRotation);

        // Calculate which prize was selected
        const normalizedRotation = (finalRotation % 360);
        const segmentAngle = 360 / spinWheelPrizes.length;
        const selectedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % spinWheelPrizes.length;

        // Complete spin after animation
        setTimeout(() => {
            setIsSpinning(false);
            const selectedPrize = spinWheelPrizes[selectedIndex];
            onSpinComplete(`${selectedPrize.icon} ${selectedPrize.name}`);
        }, 4000);
    };

    const getSegmentColor = (index: number) => {
        return spinWheelPrizes[index]?.color || '#6366f1';
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* Spin button - moved to top */}
            <motion.div
                className="mb-8 z-30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white"
                >
                    {isSpinning ? (
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Spinning...
                        </span>
                    ) : (
                        '🎯 SPIN TO WIN! 🎯'
                    )}
                </Button>
            </motion.div>

            {/* Wheel container */}
            <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 translate-y-2 z-20">
                    <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-white drop-shadow-2xl"></div>
                </div>

                {/* Wheel */}
                <motion.div
                    className="relative w-full h-full rounded-full shadow-2xl border-8 border-white"
                    animate={{ rotate: rotation }}
                    transition={{
                        duration: isSpinning ? 4 : 0,
                        ease: isSpinning ? "easeOut" : "linear",
                    }}
                >
                    {/* Wheel segments */}
                    {spinWheelPrizes.map((prize, index) => {
                        const segmentAngle = 360 / spinWheelPrizes.length;
                        const startAngle = index * segmentAngle;
                        const endAngle = (index + 1) * segmentAngle;

                        // Calculate the path for each segment
                        const centerX = 50;
                        const centerY = 50;
                        const radius = 50;

                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;

                        const x1 = centerX + radius * Math.cos(startAngleRad);
                        const y1 = centerY + radius * Math.sin(startAngleRad);
                        const x2 = centerX + radius * Math.cos(endAngleRad);
                        const y2 = centerY + radius * Math.sin(endAngleRad);

                        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                        // Calculate icon and text positions
                        const textAngle = startAngle + segmentAngle / 2;
                        const textAngleRad = (textAngle * Math.PI) / 180;

                        // Icon position (closer to center)
                        const iconRadius = radius * 0.5;
                        const iconX = centerX + iconRadius * Math.cos(textAngleRad);
                        const iconY = centerY + iconRadius * Math.sin(textAngleRad);

                        // Text position (farther from center)
                        const textRadius = radius * 0.75;
                        const textX = centerX + textRadius * Math.cos(textAngleRad);
                        const textY = centerY + textRadius * Math.sin(textAngleRad);

                        return (
                            <svg
                                key={index}
                                className="absolute inset-0 w-full h-full"
                                viewBox="0 0 100 100"
                            >
                                {/* Segment */}
                                <path
                                    d={pathData}
                                    fill={getSegmentColor(index)}
                                    stroke="#ffffff"
                                    strokeWidth="1"
                                />

                                {/* Icon */}
                                <text
                                    x={iconX}
                                    y={iconY}
                                    fill="#ffffff"
                                    fontSize="8"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${iconX}, ${iconY})`}
                                >
                                    {prize.icon}
                                </text>

                                {/* Text */}
                                <text
                                    x={textX}
                                    y={textY}
                                    fill="#ffffff"
                                    fontSize="2.8"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                                >
                                    {prize.name}
                                </text>
                            </svg>
                        );
                    })}

                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg z-10 flex items-center justify-center border-4 border-white">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Instructions */}
            <p className="mt-6 text-white/80 text-center max-w-md text-lg">
                Click the button above to spin the wheel and discover your amazing prize!
            </p>
        </div>
    );
}
