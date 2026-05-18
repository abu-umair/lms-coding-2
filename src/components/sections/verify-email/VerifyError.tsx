"use client";

import { useEffect } from "react";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { useForm } from "react-hook-form";
import { VerifySchema, VerifyFormData } from "@/libs/validationSchemaVerify";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthClient } from "@/api/grpc/client";
import { motion } from "framer-motion";
import { MailWarning, Link2Off, ArrowLeft, SendHorizontal, ShieldAlert, CheckCircle2, ServerCrash, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyError({ searchParams }: { searchParams: { type?: string; email?: string } }) {
    const { type = "invalid", email } = searchParams;
    const { callApi, isLoading } = useGrpcApi();
    const router = useRouter();

    // Menggunakan useEffect agar toast hanya muncul 1x saat halaman dimuat
    useEffect(() => {
        switch (type) {
            case "verified":
                toast.success("Email berhasil diverifikasi. Silakan login.");
                // Otomatis pindah ke login setelah 3 detik jika sukses
                const timer = setTimeout(() => router.push("/auth/login"), 3000);
                return () => clearTimeout(timer);
            case "already_verified":
                toast("Email Anda sudah terverifikasi.");
                break;
            case "expired":
                toast.error("Link verifikasi sudah kadaluarsa. Silakan minta link baru.");
                break;
            case "wrong_code":
                toast.error("Kode verifikasi tidak valid. Silakan periksa kembali.");
                break;
            case "invalid":
                toast.error("Link verifikasi tidak valid atau telah digunakan.");
                break;
            case "server_error":
                toast.error("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
                break;
            default:
                break;
        }
    }, [type, router]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<VerifyFormData>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            email: email,
        }
    });

    const onSubmit = async (values: VerifyFormData) => {
        await callApi(
            getAuthClient().requestVerify({
                email: values.email,
            }),
            {
                loadingMessage: "Resend Email...",
                successMessage: "Resend email berhasil dikirim!",
                onSuccess: () => reset(),
                useDefaultError: true,
            }
        );
    };

    // Konfigurasi UI berdasarkan status type data yang diterima
    const config = {
        verified: {
            badge: "Sukses",
            title: "Verifikasi Berhasil",
            description: "Email Anda telah berhasil dikonfirmasi. Anda akan diarahkan ke halaman login dalam beberapa detik, atau klik tombol di bawah.",
            icon: <CheckCircle2 className="w-6 h-6" />,
            accentColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            ringColor: "ring-emerald-100",
            blobColor: "bg-emerald-200",
            showForm: false, // Tidak butuh kirim ulang email jika sudah sukses
        },
        already_verified: {
            badge: "Terverifikasi",
            title: "Akun Sudah Aktif",
            description: "Email ini sudah pernah diverifikasi sebelumnya. Anda bisa langsung masuk ke dashboard menggunakan akun Anda.",
            icon: <CheckCircle2 className="w-6 h-6" />,
            accentColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            ringColor: "ring-indigo-100",
            blobColor: "bg-indigo-200",
            showForm: false,
        },
        expired: {
            badge: "Link Kedaluwarsa",
            title: "Waktu Verifikasi Habis",
            description: "Demi keamanan akun Anda, link verifikasi ini hanya berlaku selama 24 jam. Jangan khawatir, Anda bisa meminta link baru.",
            icon: <Link2Off className="w-6 h-6" />,
            accentColor: "text-rose-600",
            bgColor: "bg-rose-50",
            ringColor: "ring-rose-100",
            blobColor: "bg-rose-200",
            showForm: true,
        },
        wrong_code: {
            badge: "Kode Salah",
            title: "Kode Tidak Cocok",
            description: "Token atau kode enkripsi pengenal verifikasi tidak sesuai dengan data sistem kami. Silakan periksa kembali tautan Anda.",
            icon: <KeyRound className="w-6 h-6" />,
            accentColor: "text-purple-600",
            bgColor: "bg-purple-50",
            ringColor: "ring-purple-100",
            blobColor: "bg-purple-200",
            showForm: true,
        },
        invalid: {
            badge: "Verifikasi Gagal",
            title: "Link Tidak Valid",
            description: "Link yang Anda gunakan rusak, tidak valid, atau mungkin sudah pernah digunakan sebelumnya untuk verifikasi akun.",
            icon: <ShieldAlert className="w-6 h-6" />,
            accentColor: "text-amber-600",
            bgColor: "bg-amber-50",
            ringColor: "ring-amber-100",
            blobColor: "bg-amber-200",
            showForm: true,
        },
        server_error: {
            badge: "Gangguan Sistem",
            title: "Masalah Koneksi Server",
            description: "Kami mengalami masalah saat menghubungkan ke pusat data. Silakan coba klik kirim ulang beberapa saat lagi.",
            icon: <ServerCrash className="w-6 h-6" />,
            accentColor: "text-red-600",
            bgColor: "bg-red-50",
            ringColor: "ring-red-100",
            blobColor: "bg-red-200",
            showForm: true,
        },
    } as const;

    // Ambil UI config, jika type tidak dikenal, gunakan fallback 'invalid'
    const ui = config[type as keyof typeof config] || config.invalid;

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f7f7f8] flex items-center justify-center px-4">
            {/* Animated Background Blobs */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className={`${ui.blobColor} absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full blur-3xl opacity-30`}
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-slate-200 absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full blur-3xl opacity-30"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl z-10"
            >
                {/* Glassmorphism Card Wrapper */}
                <div className="rounded-[32px] border border-white/70 bg-white/60 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                    <div className="rounded-[24px] border border-slate-200/50 bg-white px-6 py-10 sm:px-10">
                        <div className="flex flex-col items-center text-center">

                            {/* Animated Icon Container */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                className={`${ui.bgColor} ${ui.ringColor} mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-8`}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ${ui.accentColor}`}>
                                    {ui.icon}
                                </div>
                            </motion.div>

                            {/* Status Badge */}
                            <span className={`${ui.bgColor} ${ui.accentColor} mb-4 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ring-1 ${ui.ringColor}`}>
                                {ui.badge}
                            </span>

                            {/* Typography */}
                            <h1 className="text-slate-900 text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                {ui.title}
                            </h1>
                            <p className="max-w-md text-slate-500 leading-relaxed mb-8">
                                {ui.description}
                            </p>

                            {/* Action Form & Buttons */}
                            <div className="w-full space-y-3">
                                {ui.showForm ? (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    Mengirim...
                                                </span>
                                            ) : (
                                                <>
                                                    <SendHorizontal className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    Kirim Ulang Link ke {email || "Email Anda"}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => router.push("/auth/login")}
                                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                    >
                                        Masuk ke Akun Anda
                                    </button>
                                )}

                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Beranda
                                </button>
                            </div>

                            {/* Footer Info */}
                            {ui.showForm && (
                                <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                                        <MailWarning className="w-4 h-4" />
                                        <span>Cek folder Spam jika email tidak ditemukan</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}