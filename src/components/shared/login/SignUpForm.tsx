import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SignUpSchema, SignUpFormData } from "@/libs/validationSchemaSingUp";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";
import { getSession, signIn } from "next-auth/react";
import FormInput from "@/components/shared/form-input/FormInput";
import useGrpcApi from "@/components/shared/others/useGrpcApi";




const SignUpForm = () => {
  const router = useRouter();
  const { callApi, isLoading } = useGrpcApi();

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
    // Kita panggil callApi. Hook akan otomatis mengurus toast.loading("Mendaftarkan akun...")
    await callApi(
      getAuthClient().register({
        fullName: values.name,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.password_confirmation,
      }),
      {
        loadingMessage: "Mendaftarkan akun...",
        // Kita tidak perlu successMessage di sini karena kita ingin melakukan 
        // proses tambahan (Auto Login) sebelum menunjukkan toast sukses final.
        onSuccess: async (res) => {
          toast.success("Pendaftaran Berhasil! Menyiapkan sesi...");

          // 2. AUTO LOGIN
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (result?.ok) {
            const currentSession = await getSession();
            const role = (currentSession?.user as any)?.role;

            // Logika Pengalihan Role
            if (role === "admin") {
              toast.success("Selamat datang, Admin!");
              router.push("/dashboards/admin-dashboard");
            } else {
              router.push("/");
            }

            router.refresh();
          } else {
            // Jika auto-login gagal (jarang terjadi tapi mungkin), arahkan ke login manual
            toast.error("Gagal masuk otomatis. Silakan login manual.");
            router.push("/login");
          }
        },
        // Jika ada error spesifik dari gRPC backend (misal email duplikat)
        useDefaultError: true,
      }
    );
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
            disabled={isLoading}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="text"
            placeholder="Enter your email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
          // className='lg:!mb-0'
          />
          <FormInput
            label="Password Confirmation"
            name="password_confirmation"
            type="password"
            placeholder="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
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
          disabled={isLoading}
          className='flex items-center'
        />


        <div className="mt-25px text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {isLoading ? 'Sedang Memproses...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
