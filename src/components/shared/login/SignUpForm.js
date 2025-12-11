// components/layout/main/SignUpForm.jsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Ganti dengan URL endpoint register Laravel Anda
const LARAVEL_REGISTER_URL = "http://127.0.0.1:8000/api/auth/register";

const SignUpForm = () => {
    // State untuk input
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("1"); // Default: 1 (Pria)
    const [isAccepted, setIsAccepted] = useState(false); // Untuk Terms & Policy

    // State untuk UI dan Error
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const fullName = `${firstName} ${lastName}`.trim();

        // --- Validasi di Frontend ---
        if (!isAccepted) {
            setError("Anda harus menerima Syarat dan Kebijakan Privasi.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Panggil Endpoint Registrasi Laravel
            const registerResponse = await fetch(LARAVEL_REGISTER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName, // Mengirim gabungan Nama Depan & Belakang
                    email,
                    password,
                    gender: parseInt(gender),
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                // Asumsi: Laravel mengembalikan detail error di registerData
                const message = registerData.message || registerData.error || "Registrasi gagal.";
                throw new Error(message);
            }

            // 2. Jika Registrasi Sukses, Lakukan Auto-Login
            const loginResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (loginResult?.error) {
                setError("Registrasi sukses, tetapi gagal auto-login. Silakan login manual.");
                router.push("/login"); // Arahkan ke login manual
            } else if (loginResult?.ok) {
                // Auto-Login sukses
                router.push("/"); // Arahkan ke dashboard/halaman utama
            }

        } catch (err) {
            console.error("Registrasi Error:", err);
            setError(err.message || "Terjadi kesalahan yang tidak diketahui saat registrasi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transition-opacity duration-150 ease-linear">
            {/* heading */}
            <div className="text-center">
                <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                    Sign Up
                </h3>
                <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                    Already have an account?
                    <a href="/login" className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full">
                        Log In
                    </a>
                </p>
            </div>

            {/* Pesan Error */}
            {error && (
                <div style={{ padding: '10px', backgroundColor: '#fdd', color: 'red', borderRadius: '5px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                    {/* First Name */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">First Name</label>
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required 
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Last Name</label>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                    {/* Email */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Email</label>
                        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                    </div>
                    {/* Gender (Tambahan) */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Jenis Kelamin</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        >
                            <option value="1">1 = Pria</option>
                            <option value="2">2 = Wanita</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                    {/* Password */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Password</label>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                    </div>
                    {/* Re-Enter Password */}
                    <div>
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Re-Enter Password</label>
                        <input type="password" placeholder="Re-Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                    </div>
                </div>

                {/* Accept Terms */}
                <div className="text-contentColor dark:text-contentColor-dark flex items-center">
                    <input type="checkbox" id="accept-pp" checked={isAccepted} onChange={(e) => setIsAccepted(e.target.checked)}
                        className="w-18px h-18px mr-2 block box-content"
                    />
                    <label htmlFor="accept-pp">Accept the Terms and Privacy Policy</label>
                </div>
                
                {/* Submit Button */}
                <div className="mt-25px text-center">
                    <button type="submit" disabled={isLoading}
                        className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                    >
                        {isLoading ? 'Mendaftarkan...' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;