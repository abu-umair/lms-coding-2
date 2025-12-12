// components/layout/main/SignUpForm.jsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/libs/validationSchema"; // <-- Import Schema Zod


const LARAVEL_REGISTER_URL = "http://127.0.0.1:8000/api/auth/register";

const SignUpForm = () => {
  // State untuk input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("1");
  const [isAccepted, setIsAccepted] = useState(false);

  // State untuk Error VALIDASI (menggunakan objek untuk error per field)
  const [fieldErrors, setFieldErrors] = useState({});
  // State untuk Error API (kesalahan server/network)
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});
    setIsLoading(true);

    const formData = {
      name,
      email,
      password,
      confirmPassword,
      gender,
      isAccepted,
    };

    // --- 1. Validasi Schema dengan Zod ---
    const result = SignUpSchema.safeParse(formData);

    if (!result.success) {
      // Jika validasi gagal, format error Zod untuk ditampilkan
      const newErrors = {};
      result.error.issues.forEach(issue => {
        // issue.path[0] adalah nama field ('firstName', 'email', dll.)
        newErrors[issue.path[0]] = issue.message;
      });
      setFieldErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // --- 2. Jika Validasi Zod Sukses, Lanjutkan ke API Call ---
    const dataValidated = result.data;

    try {
      // Panggil Endpoint Registrasi Laravel
      const registerResponse = await fetch(LARAVEL_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dataValidated.name,
          email: result.data.email,
          password: result.data.password,
          gender: parseInt(result.data.gender),
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        const message = registerData.message || registerData.error || "Registrasi gagal, periksa data yang Anda masukkan.";
        throw new Error(message);
      }

      // --- 3. Auto-Login ---
      const loginResult = await signIn("credentials", { redirect: false, email: result.data.email, password: result.data.password });

      if (loginResult?.error) {
        setApiError("Registrasi sukses, tetapi gagal auto-login. Silakan login manual.");
      } else if (loginResult?.ok) {
        router.push("/");
      }
    } catch (err) {
      setApiError(err.message || "Terjadi kesalahan saat registrasi atau komunikasi server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi helper untuk mendapatkan pesan error (jika ada)
  const getError = (fieldName) => fieldErrors[fieldName] || null;

  return (
    <div className="transition-opacity duration-150 ease-linear">
      {/* ... Heading ... */}

      {/* Pesan Error API Global */}
      {apiError && (
        <div style={{ padding: '10px', backgroundColor: '#fdd', color: 'red', borderRadius: '5px', marginBottom: '15px' }}>
          {apiError}
        </div>
      )}

      <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          {/* Name */}
          <div className="mb-25px">
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap Anda"
              value={name} // Menggunakan state 'name'
              onChange={(e) => setName(e.target.value)} // Mengubah state 'name'
              className={`w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border ${getError('name') ? 'border-red-500' : 'border-borderColor'} dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded`}
            />
            {getError('name') && <p className="text-red-500 text-sm mt-1">{getError('name')}</p>}
          </div>
        </div>

        {/* Email dan Gender */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          {/* Email */}
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Email</label>
            <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-52px ... rounded ${getError('email') ? 'border-red-500' : 'border-borderColor'}`}
            />
            {getError('email') && <p className="text-red-500 text-sm mt-1">{getError('email')}</p>}
          </div>
          {/* Gender */}
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Jenis Kelamin</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}
              className={`w-full h-52px ... rounded ${getError('gender') ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value="1">1 = Pria</option>
              <option value="2">2 = Wanita</option>
            </select>
            {getError('gender') && <p className="text-red-500 text-sm mt-1">{getError('gender')}</p>}
          </div>
        </div>

        {/* Password dan Konfirmasi Password */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          {/* Password */}
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-52px ... rounded ${getError('password') ? 'border-red-500' : 'border-borderColor'}`}
            />
            {getError('password') && <p className="text-red-500 text-sm mt-1">{getError('password')}</p>}
          </div>
          {/* Re-Enter Password */}
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">Re-Enter Password</label>
            <input type="password" placeholder="Re-Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full h-52px ... rounded ${getError('confirmPassword') ? 'border-red-500' : 'border-borderColor'}`}
            />
            {getError('confirmPassword') && <p className="text-red-500 text-sm mt-1">{getError('confirmPassword')}</p>}
          </div>
        </div>

        {/* Accept Terms */}
        <div className="text-contentColor dark:text-contentColor-dark flex items-center">
          <input type="checkbox" id="accept-pp" checked={isAccepted} onChange={(e) => setIsAccepted(e.target.checked)}
            className={`w-18px h-18px mr-2 block box-content ${getError('isAccepted') ? 'border-red-500' : ''}`}
          />
          <label htmlFor="accept-pp">Accept the Terms and Privacy Policy</label>
          {getError('isAccepted') && <p className="text-red-500 text-sm ml-2">{getError('isAccepted')}</p>}
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