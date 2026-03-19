"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import JSConfetti from 'js-confetti';

const CourseProgressBar = ({ stats }) => {
    // --- 1. LOGIKA COUNTER ANGKA (Fix Deprecated onChange) ---
    const [displayValue, setDisplayValue] = useState(0);

    // stiffness & damping rendah agar pergerakan angka terlihat natural
    const springValue = useSpring(0, { stiffness: 40, damping: 15 });
    const rounded = useTransform(springValue, (latest) => Math.round(latest));

    // Simpan instance confetti agar tidak dibuat ulang terus menerus
    const jsConfettiRef = useRef(null);

    // Variabel untuk melacak apakah confetti sudah pernah ditembakkan
    const hasLaunchedRef = useRef(false);

    // --- 3. MEMBUAT INSTANCE CONFETTI SAAT KOMPONEN DIMUAT ---
    useEffect(() => {
        // Pastikan kita hanya membuat instance di sisi klien
        if (typeof window !== 'undefined' && !jsConfettiRef.current) {
            jsConfettiRef.current = new JSConfetti();
        }

        // Cleanup saat komponen dibongkar (optional tapi baik)
        return () => {
            jsConfettiRef.current = null;
        }
    }, []);

    useEffect(() => {
        // Update nilai spring setiap kali stats.percentage berubah
        const targetPercentage = stats.percentage || 0;
        springValue.set(targetPercentage);

        // Periksa apakah sudah mencapai 100% dan confetti belum ditembakkan
        if (targetPercentage === 100 && jsConfettiRef.current && !hasLaunchedRef.current) {

            // Tembakkan Confetti!
            jsConfettiRef.current.addConfetti({
                confettiColors: [
                    '#3b82f6', // Biru primary (ganti sesuai tema Anda)
                    '#a78bfa', // Ungu secondary
                    '#22c55e', // Hijau success
                    '#eab308', // Kuning warning
                ],
                confettiRadius: 5,
                confettiNumber: 500, // Jumlah confetti (sesuaikan)
            });

            // Tandai bahwa confetti sudah ditembakkan
            hasLaunchedRef.current = true;
            console.log("Confetti launched!");
        }

        // Reset tanda jika persentase turun dari 100% (opsional)
        if (targetPercentage < 100) {
            hasLaunchedRef.current = false;
        }
    }, [stats.percentage, springValue]);

    // Cara terbaru membaca perubahan nilai spring di Framer Motion v10+
    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });
        return () => unsubscribe();
    }, [rounded]);

    return (
        <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 mb-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="text-size-16 font-extrabold text-darkColor dark:text-white transition-colors">
                        Course Progress
                    </h4>
                    <p className="text-size-13 text-contentColor dark:text-contentColor-dark transition-colors mt-1">
                        {stats.completed} dari {stats.total} materi selesai
                    </p>
                </div>

                {/* Angka yang menghitung otomatis */}
                <span className="text-size-26 font-black text-primaryColor leading-none">
                    {displayValue}%
                </span>
            </div>

            {/* Track Background */}
            <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">

                {/* Fill Utama */}
                <motion.div
                    className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
                    style={{
                        originX: 0,
                        // Menggunakan gradien linear dengan asumsi warna primary (biru/ungu)
                        // Jika ada variabel CSS --primary-color, silakan ganti
                        backgroundColor: 'var(--primary-color, #3b82f6)',
                        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{
                        width: `${stats.percentage}%`,
                        // Animasi Pulse (Nafas)
                        filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"]
                    }}
                    transition={{
                        width: { type: "spring", stiffness: 40, damping: 12 },
                        filter: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                >
                    {/* Layer 1: Garis Diagonal Berjalan */}
                    <motion.div
                        className="absolute inset-0 w-full h-full opacity-30"
                        style={{
                            backgroundImage: `linear-gradient(
                                            45deg, 
                                            #ffffff 25%, 
                                            transparent 25%, 
                                            transparent 50%, 
                                            #ffffff 50%, 
                                            #ffffff 75%, 
                                            transparent 75%, 
                                            transparent
                            )`,
                            backgroundSize: '1rem 1rem',
                        }}
                        animate={{ backgroundPosition: ["0px 0px", "1rem 0px"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />

                    {/* Layer 2: Kilatan Shimmer Modern */}
                    <motion.div
                        className="absolute top-0 left-0 h-full"
                        style={{
                            width: "40%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        }}
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }}
                    />
                </motion.div>
            </div>

            <AnimatePresence>
                {stats.percentage === 100 && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-size-12  text-primaryColor font-medium mt-3 flex items-center gap-1.5 bg-green-500/10 p-2 rounded-md"
                    >
                        <i className="icofont-award"></i>&nbsp; Selamat! Kamu telah menyelesaikan semua materi.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseProgressBar;