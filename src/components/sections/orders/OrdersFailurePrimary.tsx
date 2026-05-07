"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarX, ArrowLeft, RotateCcw } from "lucide-react";
import { convertTimestampToTime } from "@/utils/date";
import { formatToIDR } from "@/utils/number";

type OrderStatus = "expired";

const OrdersFailurePrimary = ({ orderData }) => {
    const router = useRouter();
    const { number, total, orderStatusCode, expiredAt } = orderData;
    const expiredAtTime = convertTimestampToTime(expiredAt);

    // Memastikan status komponen ini terkunci pada "expired"
    const status: OrderStatus = "expired";

    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    //* responsive 
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Konfigurasi khusus untuk status EXPIRED
    const config = {
        expired: {
            badge: "Sesi Pembayaran Berakhir",
            title: "Pesanan Telah Kedaluwarsa",
            description:
                "Batas waktu pembayaran pesanan ini telah habis. Silakan buat pesanan baru untuk melanjutkan pembelian.",
            icon: <CalendarX className="w-6 h-6" />,
            accentText: "text-rose-600",
            softBg: "bg-rose-50",
            softRing: "ring-rose-100",
            primaryButton: "Kembali ke Pesanan",
            primaryAction: () => router.push("/orders"),
            secondaryButton: "Beli Ulang Kursus",
            secondaryAction: () => router.push("/"), // Diarahkan ke katalog untuk checkout ulang
        },
    } as const;

    const ui = config[status];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f7f7f8]">
            {/* soft background blobs (diubah menjadi merah/rose untuk tema expired) */}
            <div className="pointer-events-none absolute inset-0">
                {/* blob 1 */}
                <motion.div
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -30, 20, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="bg-rose-100 absolute -top-32 -left-20 w-[400px] h-[400px] rounded-full blur-2xl opacity-40"
                />

                {/* blob 2 */}
                <motion.div
                    animate={{
                        x: [0, -30, 30, 0],
                        y: [0, 20, -20, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="bg-slate-200 absolute -top-20 right-[-100px] w-[350px] h-[350px] rounded-full blur-2xl opacity-30"
                />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="w-full max-w-2xl"
                >
                    <div className="rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6">
                        <div className="rounded-[28px] border border-slate-200/70 bg-white px-6 py-8 sm:px-10 sm:py-10">
                            <div className="flex flex-col items-center text-center">

                                {/* Icon Container */}
                                <motion.div
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 160 }}
                                    className={`${ui.softBg} ${ui.softRing} mb-6 flex h-24 w-24 items-center justify-center rounded-full ring-8`}
                                >
                                    <div className={`bg-rose-100 ${ui.accentText} flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-inner`}>
                                        {ui.icon}
                                    </div>
                                </motion.div>

                                {/* Badge */}
                                <span className={`${ui.softBg} ${ui.accentText} mb-3 inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ring-1 ring-rose-200`}>
                                    {ui.badge}
                                </span>

                                {/* Title */}
                                <h1 className={`${ui.accentText} max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl`}>
                                    {ui.title}
                                </h1>

                                {/* Description */}
                                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                    {ui.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 sm:gap-4">
                                    <button
                                        onClick={ui.primaryAction}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:shadow-md"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        {ui.primaryButton}
                                    </button>

                                    <button
                                        onClick={ui.secondaryAction}
                                        className="bg-slate-900 hover:bg-slate-800 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition shadow-md hover:shadow-lg"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {ui.secondaryButton}
                                    </button>
                                </div>

                                {/* Order Detail Card */}
                                <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-700">
                                            Detail Riwayat Pesanan
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Nomor Pesanan</span>
                                                <span className="font-medium text-slate-800">{number}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Total Pembayaran</span>
                                                <span className="font-semibold text-slate-900">
                                                    {formatToIDR(total)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Waktu Kedaluwarsa</span>
                                                <span className="font-medium text-slate-500 line-through decoration-rose-500">
                                                    {expiredAtTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning Info */}
                                    <div className="rounded-2xl mt-4 border border-rose-100 bg-rose-50/50 p-4 text-sm">
                                        <div className="text-rose-700 text-xs flex items-start gap-2">
                                            <CalendarX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                            <p>Sistem otomatis membatalkan pesanan ini karena melewati batas waktu. Invoice pada payment gateway sudah tidak dapat digunakan kembali.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrdersFailurePrimary;