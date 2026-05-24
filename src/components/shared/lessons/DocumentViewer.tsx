// src/components/shared/lessons/DocumentViewer.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Maximize2, Minimize2, ShieldAlert } from "lucide-react";

interface DocumentViewerProps {
    url: string;
    onComplete: () => void;
}

export default function DocumentViewer({ url, onComplete }: DocumentViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const ext = url.split(".").pop()?.toLowerCase() || "";

    // Memicu otomatis selesai setelah dokumen berhasil dimuat
    useEffect(() => {
        if (url) {
            onComplete();
        }
    }, [url]);

    // Fitur Fullscreen menggunakan HTML5 Fullscreen API
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen()
                .then(() => setIsFullscreen(true))
                .catch((err) => console.error("Gagal aktivasi Fullscreen:", err));
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Sinkronisasi state saat user keluar fullscreen lewat tombol ESC bawaan keyboard
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Proteksi Keamanan: Memblokir tombol kombinasi keyboard (Ctrl+P, Ctrl+S, Cmd+P, Cmd+S)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isControl = e.ctrlKey || e.metaKey;
            if (isControl && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
                e.preventDefault();
                alert("Aksi ini dilarang demi melindungi hak cipta materi.");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const isOfficeDoc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);

    const finalUrl = isOfficeDoc
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
        : `${url}#toolbar=0&navpanes=0&scrollbar=1`;

    return (
        <div
            ref={containerRef}
            onContextMenu={handleContextMenu}
            className={`relative bg-[#1a1a1e] flex flex-col transition-all overflow-hidden border border-neutral-800 shadow-xl ${isFullscreen ? "w-screen h-screen rounded-none border-none" : "w-full h-[75vh] rounded-xl"
                }`}
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
        >
            {/* CSS Injection: Menghancurkan tampilan cetak */}
            <style jsx global>{`
                @media print {
                    body { display: none !important; }
                    iframe { display: none !important; }
                }
            `}</style>

            {/* ─── HEADER BAR (SUDAH DIRAPIKAN) ─── */}
            <div className="z-20 flex items-center justify-between px-5 py-3.5 bg-primaryColor border-b border-black/10 shadow-sm">
                {/* Sisi Kiri: Status Proteksi */}
                <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                        <ShieldAlert size={14} className="opacity-90" />
                        <span className="text-xs font-semibold tracking-wide uppercase">
                            Protected Content
                        </span>
                    </div>
                </div>

                {/* Sisi Kanan: Tombol Kontrol */}
                <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 active:scale-95 shadow-sm transition-all duration-200"
                >
                    {isFullscreen ? (
                        <>
                            <Minimize2 size={14} className="stroke-[2.5]" />
                            <span>Layar Normal</span>
                        </>
                    ) : (
                        <>
                            <Maximize2 size={14} className="stroke-[2.5]" />
                            <span>Layar Penuh</span>
                        </>
                    )}
                </button>
            </div>

            {/* AREA IFRAME DENGAN CLIPPING SECURITY */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-neutral-900">
                <iframe
                    src={finalUrl}
                    className={`w-full border-0 transition-all ${isOfficeDoc ? "h-full" : "h-[105%] -mt-12"
                        }`}
                    title="Protected Document Viewer"
                />
                <div className="absolute inset-0 bg-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}