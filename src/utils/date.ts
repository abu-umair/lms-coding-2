import React from 'react'
import { Timestamp } from '../../pb/google/protobuf/timestamp'

export const convertTimestampToDate = (seconds) => {
    if (!seconds) return "-";

    // 1. Ubah BigInt ke Number
    // 2. Kalikan 1000 untuk mengubah detik ke milidetik
    const date = new Date(Number(seconds) * 1000);

    // 3. Format agar manusiawi (Contoh: 18 January 2026)
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

//?Secara mekanisme sama tetapi dengan penambahan waktu 
export const convertTimestampToTime = (timestamp: Timestamp | undefined) => {
    if (!timestamp) {
        return
    }
    const date = new Date(Number(timestamp.seconds) * 1000);

    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, //?karena indonesia menggunakan 24 jam
    })

    return `${formattedDate} ${formattedTime}`
}
