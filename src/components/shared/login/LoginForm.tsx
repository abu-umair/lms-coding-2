// components/layout/main/LoginForm.jsx

"use client"; // <<< JADIKAN CLIENT COMPONENT

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router
import { LoginSchema, LoginFormSchema } from "@/libs/validationSchemaLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/shared/form-input/FormInput";
import toast from "react-hot-toast";
import Link from "next/link";



const LoginForm = ({ email, switchToSignUp }) => {
  // const isAuthenticated = status === 'authenticated';
  // const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    setError,//?dari useForm
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginSchema), // <--- Jembatan Zod & Hook Form
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormSchema) => {
    // Logika signIn kamu tetap sama
    // 1. Tampilkan loading toast
    const loadingToast = toast.loading("Waiting...");
    console.log("Data tervalidasi:", values);
    const result = await signIn("credentials", { ...values, redirect: false });

    // 2. Hapus loading toast
    toast.dismiss(loadingToast);

    if (result?.error) {
      console.log(result);

      // 3. Jika gagal
      toast.error("Login Gagal! Cek email atau password.");

      // Kita beri error ke field password agar input password jadi merah
      setError("email", {
        type: "manual", message: "Email salah"
      });
      setError("password", {
        type: "manual", message: "Password salah"
      });
    } else if (result?.ok) {
      // Ambil data session terbaru secara paksa (AWAIT)
      const currentSession = await getSession();
      const role = (currentSession?.user as any)?.role;
      const verifiedAt = (currentSession?.user as any)?.verifiedAt;

      // 4. Jika sukses
      toast.success("Berhasil Masuk!");

      // 2. Cek apakah user sudah memverifikasi emailnya
      if (!verifiedAt) {
        // Jika belum terverifikasi, baru arahkan ke halaman verifikasi
        router.push(`/auth/verify-email-required?email=${encodeURIComponent(values.email)}`);
      } else {
        // Jika SUDAH terverifikasi, langsung lempar ke rute induk /dashboards
        // Nanti file app/dashboards/page.tsx yang akan mengarahkan otomatis berdasarkan role
        router.push("/dashboards");
      }
      router.refresh(); // Opsional: Memastikan data session terbaru terambil
    }
  };

  // HANDLER LOGIN GOOGLE (GMAIL)
  const handleGoogleLogin = async () => {
    const loadingToast = toast.loading("Menghubungkan ke Google...");

    // Langsung redirect ke /dashboards karena Google otomatis terverifikasi (verifiedAt = true dari backend)
    const result = await signIn("google", {
      callbackUrl: "/dashboards",
      redirect: false
    });
    console.log(result);


    toast.dismiss(loadingToast);

    if (result?.error) {

      toast.error("Gagal login menggunakan akun Google.");
    } else if (result?.ok) {
      toast.success("Berhasil Masuk dengan Google!");
      router.push("/dashboards");
      router.refresh();
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
          Belum memiliki akun?&nbsp;
          <button
            type="button"
            onClick={switchToSignUp}
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Bergabung gratis sekarang
          </button>
        </p>
      </div>

      <div className="text-center flex gap-x-1 md:gap-x-15px lg:gap-x-25px gap-y-5 items-center justify-center flex-wrap mb-15px">
        {/* <button
          type="submit"
          className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
        >
          <i className="icofont-facebook"></i> Facebook
        </button> */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 text-sm md:text-base font-semibold text-slate-800 bg-slate-50/50 backdrop-blur-md border border-slate-200/60 hover:bg-slate-100/80 hover:border-slate-300 rounded-xl px-6 py-3 transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(33,158,188,0.12)] group dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span className="tracking-wide">Masuk menggunakan Google</span>
        </button>
      </div>

      {/* other login */}
      <div>
        <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
          or Log-in with
        </p>
      </div>

      {/* Ganti action dan tambahkan onSubmit handler */}
      <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email Address"
          name="email"  // Type-safe: akan error jika salah ketik
          type="text"
          placeholder="Enter your email"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Password"
          name="password"  // Type-safe: akan error jika salah ketik
          type="password"
          placeholder="Password"
          register={register}
          errors={errors}
        />

        {/* ... (Remember me & Forgot Password) ... */}
        <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-end">
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-18px h-18px mr-2 block box-content"
            />
            <label htmlFor="remember"> Remember me</label>
          </div> */}
          <div className="">
            <Link
              href="/forgot-password"
              className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
        </div>

        <div className="my-25px text-center">
          <button
            type="submit"
            disabled={isSubmitting} // Nonaktifkan tombol saat loading
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isSubmitting ? 'Processing...' : 'Masuk'}
          </button>
        </div>
      </form>



    </div>
  );
};

export default LoginForm;
