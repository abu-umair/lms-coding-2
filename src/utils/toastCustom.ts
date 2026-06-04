import toast from "react-hot-toast";
import React from "react";
import PremiumToast from "@/components/shared/toasts/PremiumToast";

export const premiumToast = {
    success: (message: string, duration: number = 10000) => {
        toast.custom((t) => React.createElement(PremiumToast, { t, message, type: "success" }), {
            duration,
        });
    },
    error: (message: string, duration: number = 10000) => {
        toast.custom((t) => React.createElement(PremiumToast, { t, message, type: "error" }), {
            duration,
        });
    },
    info: (message: string, duration: number = 10000) => {
        toast.custom((t) => React.createElement(PremiumToast, { t, message, type: "info" }), {
            duration,
        });
    },
};