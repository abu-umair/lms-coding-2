"use client";

import { motion } from "framer-motion";
import { MailCheck, ArrowRight, SendHorizontal, ChevronLeft, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getAuthClient } from "@/api/grpc/client";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";


export default function VerifyEmailRequired({ searchParams }) {
    const { email } = searchParams;
    const { callApi, isLoading } = useGrpcApi();
    const router = useRouter();

    const { data: session, status } = useSession();

    if (status === "loading") return; //? return null jika loading

    const onResendEmail = async () => {
        await callApi(getAuthClient().requestVerify({
            email: email,
        }), {
            loadingMessage: "Mengirim ulang link...",
            successMessage: "Link verifikasi baru telah dikirim!",
            useDefaultError: false,
            defaultError: async (res) => {
                toast.error(res.response.base?.message);
                // await signOut({ redirect: false });
                // router.push("/login");
            }
        });
    };

    const handleLogout = async () => {
        await callApi(getAuthClient().logout({
        }),
            {
                loadingMessage: "Waiting logout...",
                successMessage: "Masukkan email lain!",
                onSuccess: async () => {
                    await signOut({ redirect: false });
                    router.push("/login");
                    router.refresh();
                },
                useDefaultError: false,
                defaultError: async (res) => {
                    toast.error("Gagal logout!");
                    await signOut({ redirect: false });
                    router.push("/login");
                }
            }
        );
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f7f7f8] flex items-center justify-center px-4">
            {/* Background Blobs - Menggunakan warna Biru/Indigo untuk kesan "Informasi/Tindakan Diperlukan" */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-indigo-100 absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-blue-50 absolute bottom-[-50px] left-[-100px] w-[450px] h-[450px] rounded-full blur-3xl opacity-40"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl z-10"
            >
                <div className="rounded-[40px] border border-white/80 bg-white/40 p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
                    <div className="rounded-[32px] bg-white p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center text-center">

                            {/* Hero Icon */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mb-8 relative"
                            >
                                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full"></div>
                                <div className="relative bg-blue-600 rounded-3xl p-5 shadow-xl shadow-blue-200">
                                    <Inbox className="w-10 h-10 text-slate-700 dark:text-white" />
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-2 -right-2 bg-amber-400 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center"
                                >
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </motion.div>
                            </motion.div>

                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ring-1 ring-blue-100">
                                Verifikasi Diperlukan
                            </span>

                            <h1 className="text-slate-900 text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                                Satu langkah lagi...
                            </h1>

                            <p className="text-slate-500 text-lg mb-8 max-w-md">
                                Kami telah mengirimkan email verifikasi ke <span className="font-semibold text-slate-800">{email || "email Anda"}</span>. Silakan klik link di dalamnya untuk mengaktifkan akun.
                            </p>

                            {/* Card Detail / Instructions */}
                            <div className="w-full bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 text-left">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <MailCheck className="w-4 h-4 text-blue-600" />
                                    Apa yang harus dilakukan?
                                </h3>
                                <ul className="space-y-3">
                                    {["Buka inbox email Anda", "Cari email dari 'no-reply@nusavia.id'", "Klik tombol 'Verifikasi Akun'"].map((step, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                {i + 1}
                                            </div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onResendEmail}
                                    disabled={isLoading}
                                    className="flex-1 group relative flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isLoading ? "Mengirim..." : (
                                        <>
                                            <SendHorizontal className="w-4 h-4" />
                                            Kirim Ulang Link
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Gunakan Email Lain
                                </button>
                            </div>

                            <p className="mt-8 text-xs text-slate-400">
                                Tidak menerima email? Periksa folder <strong>Spam</strong> atau <strong>Sampah</strong> Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}