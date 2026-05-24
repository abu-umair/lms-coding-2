// src/components/shared/popup/PopupPdfPreview.tsx
"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import DocumentViewer from "@/components/shared/lessons/DocumentViewer";


interface PopupPdfPreviewProps {
    fileUrl: string;
}

export default function PopupPdfPreview({ fileUrl }: PopupPdfPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* Tombol pemicu modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-emerald-600 hover:bg-secondaryColor text-white text-xs rounded py-1 px-3 transition-colors flex items-center gap-1 font-medium"
            >
                <Eye size={12} /> Preview
            </button>

            {/* Backdrop Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    {/* Box Container Modal */}
                    <div className="relative w-full max-w-5xl bg-[#141417] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col h-[85vh]">

                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 bg-[#0e0e11] border-b border-neutral-800">
                            <h3 className="text-sm font-semibold text-neutral-200 tracking-wide">
                                Pratinjau Dokumen Pembelajaran (Mode Aman)
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Isi Modal (Menampilkan DocumentViewer Aman) */}
                        <div className="flex-1 min-h-0 bg-neutral-900">
                            <DocumentViewer url={fileUrl} onComplete={() => console.log("PDF Berhasil Dilihat")} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}