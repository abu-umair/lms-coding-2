// components/layout/main/LoginForm.jsx

"use client"; // <<< JADIKAN CLIENT COMPONENT

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setError(null);
    setIsLoading(true);

    // Panggil fungsi signIn dengan provider 'credentials'
    const result = await signIn("credentials", {
      redirect: false, // Penting: Tangani redirect secara manual
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      // Jika authorize() di NextAuth mengembalikan null, error ini akan muncul
      setError("Login gagal. Periksa kembali email atau kata sandi Anda.");
    } else if (result?.ok) {
      // Login sukses, redirect ke halaman utama atau dashboard
      router.push("/");
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      {/* ... heading & sign up link ... */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Login
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          {" Don't"} have an account yet?
          <a
            href="login.html"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign up for free
          </a>
        </p>
      </div>

      {/* Tampilkan Pesan Error */}
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fdd', color: 'red', borderRadius: '5px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {/* Ganti action dan tambahkan onSubmit handler */}
      <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Email
          </label>
          <input
            type="email" // Ganti type ke 'email' untuk validasi browser
            placeholder="Your email address"
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Tambahkan onChange handler
            required
          />
        </div>

        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Tambahkan onChange handler
            required
          />
        </div>

        {/* ... (Remember me & Forgot Password) ... */}
        <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-18px h-18px mr-2 block box-content"
            />
            <label htmlFor="remember"> Remember me</label>
          </div>
          <div>
            <a
              href="#"
              className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="my-25px text-center">
          <button
            type="submit"
            disabled={isLoading} // Nonaktifkan tombol saat loading
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isLoading ? 'Sedang Memproses...' : 'Log in'}
          </button>
        </div>
        {/* other login */}
        <div>
          <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
            or Log-in with
          </p>
        </div>
        <div className="text-center flex gap-x-1 md:gap-x-15px lg:gap-x-25px gap-y-5 items-center justify-center flex-wrap">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-facebook"></i> Facebook
          </button>
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-google-plus"></i> Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
