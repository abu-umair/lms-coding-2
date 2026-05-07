"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckIcon, Clock, CheckCircle, TriangleAlert } from "lucide-react";
import { convertTimestampToTime } from "@/utils/date";
import { formatToIDR } from "@/utils/number";

type OrderStatus = "unpaid";

const OrdersPrimary = ({ orderData }) => {
    const router = useRouter();
    const { number, total, orderStatusCode, expiredAt, flipInvoiceUrl } = orderData;
    const expiredAtTime = convertTimestampToTime(expiredAt);
    const flipUrlFinal = `https://${flipInvoiceUrl}`;

    const status: OrderStatus = orderStatusCode;


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

    // useEffect(() => {
    //     if (!convertTimestampToTime(expiredAt)) return;

    //     const interval = setInterval(() => {
    //         const diff = convertTimestampToTime(expiredAt).getTime() - new Date().getTime();

    //         if (diff <= 0) {
    //             setTimeLeft("Waktu habis");
    //             clearInterval(interval);
    //             return;
    //         }

    //         const hours = Math.floor(diff / (1000 * 60 * 60));
    //         const minutes = Math.floor((diff / (1000 * 60)) % 60);
    //         const seconds = Math.floor((diff / 1000) % 60);

    //         setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);




    const config = {
        unpaid: {
            badge: "Menunggu Pembayaran",
            title: "Pesanan belum dibayar",
            description:
                "Silakan selesaikan pembayaran agar pesanan bisa diproses.",
            icon: <Clock className="w-6 h-6" />,
            accentText: "text-amber-600",
            softBg: "bg-amber-50",
            softRing: "ring-amber-100",
            primaryButton: "Cek Status",
            primaryAction: () => router.push("/orders"),
            secondaryButton: "Bayar Sekarang",
            secondaryAction: () => router.push(flipUrlFinal),
        },
    } as const;

    const ui = config[status];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f7f7f8]">
            {/* soft background */}
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
                    className={[
                        "bg-amber-200 absolute -top-32 -left-20 w-[400px] h-[400px] rounded-full blur-2xl opacity-40",
                    ].join(" ")}
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
                    className={[
                        "bg-amber-200 absolute -top-20 right-[-100px] w-[350px] h-[350px] rounded-full blur-2xl opacity-30",
                    ].join(" ")}
                />

                {/* blob 3 */}
                <motion.div
                    animate={{
                        x: [0, 20, -30, 0],
                        y: [0, -10, 30, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={[
                        "bg-amber-100 absolute bottom-[-120px] left-1/3 w-[400px] h-[400px] rounded-full blur-2xl opacity-30",
                    ].join(" ")}
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
                                <motion.div
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 160 }}
                                    className={[
                                        "bg-amber-50 ring-amber-100 mb-6 flex h-24 w-24 items-center justify-center rounded-full ring-8",
                                    ].join(" ")}
                                >
                                    <div
                                        className={[
                                            "bg-amber-100 text-amber-600 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-inner",
                                        ].join(" ")}
                                    >
                                        {ui.icon}
                                    </div>
                                </motion.div>

                                <span
                                    className={[
                                        "bg-amber-50 text-amber-700 mb-3 inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ring-1",
                                    ].join(" ")}
                                >
                                    {ui.badge}
                                </span>

                                <h1
                                    className={[
                                        "text-amber-600 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
                                    ].join(" ")}
                                >
                                    {ui.title}
                                </h1>

                                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                    {ui.description}
                                </p>

                                <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 sm:gap-4">
                                    <button
                                        onClick={ui.primaryAction}
                                        className={[
                                            "inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold transition",
                                            "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:shadow-md",
                                        ].join(" ")}
                                    >
                                        {ui.primaryButton}
                                    </button>

                                    <button
                                        onClick={ui.secondaryAction}
                                        className={[
                                            "bg-amber-500 hover:bg-amber-600 inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition",
                                            "shadow-md hover:shadow-lg",
                                        ].join(" ")}
                                    >
                                        {ui.secondaryButton}
                                    </button>
                                </div>

                                <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
                                    {/* CARD RINCIAN */}
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">

                                        <h3 className="text-sm font-semibold text-slate-700">
                                            Detail Pesanan
                                        </h3>

                                        <div className="space-y-3 text-sm">

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Nomor Pesanan</span>
                                                <span className="font-medium text-slate-800">{number}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Total Pembayaran
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {formatToIDR(total)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Batas Waktu</span>
                                                <span className="font-medium text-red-500">
                                                    {expiredAtTime}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                    {/* NEXT STEP */}
                                    <div className="rounded-2xl mt-4 border border-slate-200 bg-slate-50 p-4 text-sm">
                                        <div className="text-slate-600 text-xs flex items-center gap-1">

                                            <TriangleAlert className="inline w-4 text-amber-600" />
                                            <p>Segera lakukan pembayaran agar pesanan tidak dibatalkan otomatis.</p>
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

export default OrdersPrimary;