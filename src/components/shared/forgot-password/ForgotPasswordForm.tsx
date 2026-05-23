
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router
import { ForgotSchema, ForgotFormSchema } from "@/libs/validationSchemaForgot";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/shared/form-input/FormInput";
import toast from "react-hot-toast";
import Link from "next/link";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getAuthClient } from "@/api/grpc/client";




const ForgotPasswordForm = ({ email }) => {
  const { callApi, isLoading } = useGrpcApi();

  // const isAuthenticated = status === 'authenticated';
  // const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    setError,//?dari useForm
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormSchema>({
    resolver: zodResolver(ForgotSchema), // <--- Jembatan Zod & Hook Form
    defaultValues: {
      email: email ?? "",
    },
  });

  const onSubmit = async (values: ForgotFormSchema) => {
    await callApi(
      getAuthClient().forgotPassword({
        email: values.email,
      }),
      {
        loadingMessage: "Sedang mengirim email...",
        successMessage: "Email berhasil dikirim!",
        useDefaultError: false,
        defaultError: async (res) => {
          console.log(res);
          toast.error(res.response.base?.message);
        }
        // onSuccess: () => {
        //   toast.success("Email berhasil dikirim!");
        //   router.push("/auth/login");
        // },
      }
    );
  };


  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      {/* ... heading & sign up link ... */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Lupa Password
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          {" Don't"} have an account yet?&nbsp;
          <Link
            href="/login"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign up for free
          </Link>
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





        <div className="my-25px text-center">
          <button
            type="submit"
            disabled={isSubmitting} // Nonaktifkan tombol saat loading
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isSubmitting ? 'Sedang Memproses...' : 'Reset password dengan link email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
