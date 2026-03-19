"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const CourseProgressBar = ({ stats }) => {
    const { width, height } = useWindowSize();
    const [displayValue, setDisplayValue] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- 1. LOGIKA COUNTER ANGKA (SPRING PHYSICS) ---
    const springValue = useSpring(0, { stiffness: 40, damping: 15 });
    const rounded = useTransform(springValue, (latest) => Math.round(latest));

    useEffect(() => {
        const targetPercentage = stats.percentage || 0;
        springValue.set(targetPercentage);

        // Trigger Confetti saat 100%
        if (targetPercentage === 100) {
            setShowConfetti(true);
            // Confetti berhenti recycle setelah 15 detik agar tidak membebani browser
            const timer = setTimeout(() => setShowConfetti(false), 15000);
            return () => clearTimeout(timer);
        } else {
            setShowConfetti(false);
        }
    }, [stats.percentage, springValue]);

    // Listener untuk update teks angka
    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });
        return () => unsubscribe();
    }, [rounded]);

    return (
        <>
            {/* --- 2. ANIMASI CONFETTI (HUJAN DARI ATAS) --- */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 9999,
                            pointerEvents: 'none'
                        }}
                    >
                        <ReactConfetti
                            width={width}
                            height={height}
                            numberOfPieces={300} // Jumlah partikel hujan
                            gravity={0.1}        // Kecepatan jatuh (lambat & elegan)
                            recycle={true}       // Membuat partikel jatuh terus dari atas
                            colors={['#3b82f6', '#a78bfa', '#22c55e', '#eab308', '#ffffff']}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- 3. UI PROGRESS BAR --- */}
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 mb-6 transition-all">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h4 className="text-size-16 font-extrabold text-darkColor dark:text-white transition-colors">
                            Course Progress
                        </h4>
                        <p className="text-size-13 text-contentColor dark:text-contentColor-dark transition-colors mt-1">
                            {stats.completed} dari {stats.total} materi selesai
                        </p>
                    </div>
                    <span className="text-size-26 font-black text-primaryColor leading-none">
                        {displayValue}%
                    </span>
                </div>

                {/* Track Background */}
                <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">

                    {/* Fill Utama (Warna Dasar & Pulse) */}
                    <motion.div
                        className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
                        style={{
                            originX: 0,
                            backgroundColor: 'var(--primary-color, #3b82f6)',
                            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{
                            width: `${stats.percentage}%`,
                            filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"]
                        }}
                        transition={{
                            width: { type: "spring", stiffness: 40, damping: 12 },
                            filter: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                        }}
                    >
                        {/* LAYER A: Garis Diagonal Berjalan (Stripes) */}
                        <motion.div
                            className="absolute inset-0 w-full h-full opacity-30"
                            style={{
                                backgroundImage: `linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent)`,
                                backgroundSize: '1rem 1rem',
                            }}
                            animate={{ backgroundPosition: ["0px 0px", "1rem 0px"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />

                        {/* LAYER B: Efek Shimmer (Kilatan Cahaya Mengalir) */}
                        {stats.percentage > 0 && stats.percentage < 100 && (
                            <motion.div
                                className="absolute top-0 left-0 h-full"
                                style={{
                                    width: "150px",
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                }}
                                animate={{ x: ["-100%", "900%"] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatDelay: 1
                                }}
                            />
                        )}
                    </motion.div>
                </div>

                {/* --- 4. PESAN SELESAI (MESSAGE) --- */}
                <AnimatePresence>
                    {stats.percentage === 100 && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-size-12 text-primaryColor font-medium mt-3 flex items-center gap-1.5 bg-green-500/10 p-2 rounded-md transition-all"
                        >
                            <i className="icofont-award text-size-18"></i>
                            Selamat! Kamu telah menyelesaikan semua materi.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default CourseProgressBar;