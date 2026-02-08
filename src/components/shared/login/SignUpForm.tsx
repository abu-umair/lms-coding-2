import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SignUpSchema, SignUpFormData } from "@/libs/validationSchemaSingUp";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";
import { getSession, signIn } from "next-auth/react";
import FormInput from "@/components/shared/form-input/FormInput";



const SignUpForm = () => {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      isAccepted: false, // WAJIB ADA
    }
  });

  const onSubmit = async (values: SignUpFormData) => {
    const loadingToast = toast.loading("Mendaftarkan akun...");

    try {
      // 1. Panggil gRPC Register
      const client = getAuthClient();
      const res = await client.register({
        fullName: values.name,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.password_confirmation,
      });

      if (res.response.base?.isError) {
        // throw new Error(res.response.base.message || "Gagal mendaftar");
        toast.error(res.response.base.message || "Sign Up Gagal!");
      }

      toast.success("Pendaftaran Berhasil! Mengalihkan...");

      // 2. AUTO LOGIN (Agar user tidak perlu ketik email/pass lagi)
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      toast.dismiss(loadingToast);

      if (result?.ok) {
        const currentSession = await getSession();
        const role = (currentSession?.user as any)?.role;
        router.push("/"); // Jika auto-login gagal, lempar ke login


        if (role === "admin") {
          toast.success("Admin Masuk!");
          toast.success(role);

          router.push("/dashboards/admin-dashboard");
        }

      } else {
        router.push("/"); // Jika auto-login gagal, lempar ke login
      }
      router.refresh();


    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="transition-opacity duration-150 ease-linear">
      {/* heading   */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Sing Up
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          Already have an account?
          <a
            href="login.html"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Log In
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-25px" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <FormInput
            label="Username"
            name="name"  // Type-safe: akan error jika salah ketik
            type="text"
            placeholder="Enter your name"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="text"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            errors={errors}
          // className='lg:!mb-0'
          />
          <FormInput
            label="Password Confirmation"
            name="password_confirmation"
            type="password"
            placeholder="Password"
            register={register}
            errors={errors}
          // className='!mb-0'

          />
          {/* <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Email
            </label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Re-Enter Password
            </label>
            <input
              type="password"
              placeholder="Re-Enter Password"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div> */}
        </div>

        <FormInput
          label="Accept the Terms and Privacy Policy"
          name="isAccepted"
          type="checkbox"
          register={register}
          errors={errors}
          className='flex items-center'
        />


        <div className="mt-25px text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isSubmitting ? 'Sedang Memproses...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
