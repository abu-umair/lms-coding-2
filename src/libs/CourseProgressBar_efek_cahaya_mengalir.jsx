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

            <div className="relative w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-primaryColor rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    style={{ originX: 0 }}
                >
                    {/* Layer Cahaya Mengalir */}
                    {stats.percentage > 0 && stats.percentage < 100 && (
                        <motion.div
                            className="absolute top-0 left-0 h-full w-full"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                width: "50%", // Lebar cahaya
                            }}
                            animate={{
                                x: ["-100%", "250%"], // Gerak dari luar kiri ke luar kanan
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    )}
                </motion.div>
            </div>

            {/* Animasi muncul pesan selamat jika sudah 100% */}
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