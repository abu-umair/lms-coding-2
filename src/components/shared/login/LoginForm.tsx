// components/layout/main/LoginForm.jsx

"use client"; // <<< JADIKAN CLIENT COMPONENT

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router
import { LoginSchema, LoginFormSchema } from "@/libs/validationSchemaLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/shared/form-input/FormInput";
import toast from "react-hot-toast";



const LoginForm = () => {
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
      email: "",
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
      // 4. Jika sukses
      toast.success("Berhasil Masuk!");

      // Login sukses, redirect ke halaman utama atau dashboard
      router.push("/");
      router.refresh(); // Opsional: Memastikan data session terbaru terambil
    }
  };

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false); // State untuk loading
  // const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Mencegah refresh halaman
  //   setError(null);
  //   setIsLoading(true);

  //   // Panggil fungsi signIn dengan provider 'credentials'
  //   const result = await signIn("credentials", {
  //     redirect: false, // Penting: Tangani redirect secara manual
  //     email,
  //     password,
  //   });

  //   setIsLoading(false);

  //   if (result?.error) {
  //     // Jika authorize() di NextAuth mengembalikan null, error ini akan muncul
  //     setError("Login gagal. Periksa kembali email atau kata sandi Anda.");
  //   } else if (result?.ok) {
  //     // Login sukses, redirect ke halaman utama atau dashboard
  //     router.push("/");
  //   }
  // };

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
            disabled={isSubmitting} // Nonaktifkan tombol saat loading
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isSubmitting ? 'Sedang Memproses...' : 'Log in'}
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
