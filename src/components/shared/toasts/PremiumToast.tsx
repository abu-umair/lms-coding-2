"use client";

import React, { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

interface PremiumToastProps {
    t: Toast;
    message: string;
    type: "success" | "error" | "info";
}

const PremiumToast: React.FC<PremiumToastProps> = ({ t, message, type }) => {
    // Durasi default disinkronkan dengan durasi global react-hot-toast jika ada
    const duration = t.duration || 4000;
    const [startAnim, setStartAnim] = useState(false);

    // Menggunakan dobel requestAnimationFrame untuk menjamin transisi CSS scaleX dimulai tepat dari 100% ke 0%
    useEffect(() => {
        if (t.visible) {
            let frameId1: number;
            let frameId2: number;

            frameId1 = requestAnimationFrame(() => {
                frameId2 = requestAnimationFrame(() => {
                    setStartAnim(true);
                });
            });

            return () => {
                cancelAnimationFrame(frameId1);
                cancelAnimationFrame(frameId2);
            };
        } else {
            // Reset state ketika toast di-dismiss atau hilang
            setStartAnim(false);
        }
    }, [t.visible]);

    // Konfigurasi Desain Ultra-Clean & Premium Cool dengan Aksen Efek Neon Glow Komplementer
    const config = {
        success: {
            icon: "icofont-check text-[#219ebc]", // Sesuai warna identitas Nusavia
            iconBg: "bg-[#219ebc]/10 dark:bg-[#219ebc]/15",
            border: "border-[#219ebc]/20 dark:border-[#219ebc]/25",
            barColor: "bg-gradient-to-r from-[#8ecae6] via-[#219ebc] to-[#023047]",
            // Gradient Shadow Glow: Menggabungkan warna cyan utama ke warna transparan
            gradientGlow: "after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:shadow-[0_8px_32px_rgba(33,158,188,0.18)] dark:after:shadow-[0_12px_40px_rgba(33,158,188,0.25)]",
        },
        error: {
            icon: "icofont-close text-rose-500",
            iconBg: "bg-rose-500/10 dark:bg-rose-500/15",
            border: "border-rose-500/20 dark:border-rose-500/25",
            barColor: "bg-gradient-to-r from-rose-400 via-rose-500 to-rose-700",
            gradientGlow: "after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:shadow-[0_8px_32px_rgba(244,63,94,0.18)] dark:after:shadow-[0_12px_40px_rgba(244,63,94,0.25)]",
        },
        info: {
            icon: "icofont-info text-[#fb8500]", // Warna aksen hangat Nusavia
            iconBg: "bg-[#fb8500]/10 dark:bg-[#fb8500]/15",
            border: "border-[#fb8500]/20 dark:border-[#fb8500]/25",
            barColor: "bg-gradient-to-r from-[#ffb703] via-[#fb8500] to-[#023047]",
            gradientGlow: "after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:shadow-[0_8px_32px_rgba(251,133,0,0.15)] dark:after:shadow-[0_12px_40px_rgba(251,133,0,0.22)]",
        },
    };

    const currentTheme = config[type];

    return (
        <div
            className={`
        relative flex flex-col overflow-hidden pointer-events-auto w-full max-w-sm
        bg-white/70 dark:bg-[#023047]/65 backdrop-blur-xl
        border ${currentTheme.border}
        text-slate-900 dark:text-slate-100 rounded-2xl
        
        /* 1. LAYERED STRUCTURAL SHADOWS: Menjamin kedalaman elemen yang realistis */
        shadow-[0_4px_12px_rgba(2,48,71,0.02),0_16px_32px_rgba(2,48,71,0.04),0_40px_80px_rgba(2,48,71,0.08)]
        dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),0_24px_48px_rgba(0,0,0,0.5),0_60px_120px_rgba(0,0,0,0.6)]
        
        /* 2. GRADIENT GLOW EFFECT: Mengaktifkan layer shadow berwarna premium */
        ${currentTheme.gradientGlow}
        
        /* 3. TRANSISI ANIMASI MASUK/KELUAR TOAST */
        ${t.visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                }
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
      `}
            style={{ minWidth: "350px" }}
        >
            {/* Container Utama Konten */}
            <div className="pl-4 pr-3.5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    {/* Wadah Ikon Bulat Minimalis dan Cool */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full ${currentTheme.iconBg} flex items-center justify-center border border-white/20 dark:border-white/5 shadow-inner`}>
                        <i className={`${currentTheme.icon} text-sm font-black`}></i>
                    </div>

                    {/* Tipografi Rapi, Bersih, dan Berbobot Medium */}
                    <p className="text-[13.5px] font-semibold tracking-wide text-slate-800/90 dark:text-slate-200/95 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Tombol Silang Interaktif dengan Lingkaran Hover Halus */}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                    <i className="icofont-close-line text-sm"></i>
                </button>
            </div>

            {/* Bar Indikator Durasi Gradasi Premium */}
            <div className="w-full h-[2.5px] bg-slate-200/20 dark:bg-white/5 mt-auto overflow-hidden">
                <div
                    className={`h-full ${currentTheme.barColor} origin-left rounded-r-full shadow-[0_0_8px_rgba(33,158,188,0.5)]`}
                    style={{
                        transform: startAnim ? "scaleX(0)" : "scaleX(1)",
                        transitionProperty: "transform",
                        transitionDuration: startAnim ? `${duration}ms` : "0ms",
                        transitionTimingFunction: "linear"
                    }}
                />
            </div>
        </div>
    );
};

export default PremiumToast;