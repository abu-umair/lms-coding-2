"use client";

import { AnimatePresence, motion } from "framer-motion";

const CourseProgressBar = ({ stats }) => {
    return (
        <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md shadow-sm p-5 mb-6 transition-all duration-300">
            <div className="flex justify-between items-end mb-3">
                <div>
                    <h4 className="text-size-16 font-bold text-darkColor dark:text-white">
                        Progress Kursus
                    </h4>
                    <p className="text-size-13 text-contentColor dark:text-contentColor-dark">
                        {stats.completed} dari {stats.total} materi selesai
                    </p>
                </div>
                <span className="text-size-22 font-black text-primaryColor">
                    {stats.percentage}%
                </span>
            </div>

            {/* Container Track */}
            <div className="relative w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">

                {/* PROGRESS FILL UTAMA */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-primaryColor rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{
                        width: `${stats.percentage}%`,
                        // EFEK 1: PULSE (Nafas/Berdenyut halus pada terang-gelap)
                        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                    }}
                    transition={{
                        width: { type: "spring", stiffness: 50, damping: 15 },
                        filter: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                    style={{
                        originX: 0,
                        // EFEK 2: STRIPES (Garis diagonal statis sebagai base)
                        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
                        backgroundSize: '1rem 1rem'
                    }}
                >
                    {/* EFEK 3: SHIMMER (Cahaya Putih Mengalir di atas stripes) */}
                    {stats.percentage > 0 && stats.percentage < 100 && (
                        <motion.div
                            className="absolute top-0 left-0 h-full w-full"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                            }}
                            animate={{
                                x: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    )}

                    {/* EFEK 4: ANIMASI STRIPES BERJALAN (Overlay tambahan) */}
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)`,
                            backgroundSize: '1rem 1rem'
                        }}
                        animate={{ backgroundPosition: ["0 0", "1rem 0"] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </motion.div>
            </div>

            <AnimatePresence>
                {stats.percentage === 100 && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-size-12 text-green-500 font-medium mt-2 flex items-center gap-1 overflow-hidden"
                    >
                        <i className="icofont-check-circled"></i> Selamat! Anda telah menyelesaikan semua materi.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseProgressBar;