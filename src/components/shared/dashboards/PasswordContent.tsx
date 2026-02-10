import React from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormInput from "@/components/shared/form-input/FormInput";
import { getSession } from "next-auth/react";
import { getAuthClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema, PasswordFormData } from "@/libs/validationSchemaPassword";
import { useSession } from "next-auth/react";
import { RpcError } from "@protobuf-ts/runtime-rpc";


const PasswordContent = () => {
  const { data: session } = useSession();
  const router = useRouter();


  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      password_confirmation: "",
    }
  });


  const onSubmit = async (values: PasswordFormData) => {
    const loadingToast = toast.loading("sedang proses...");
    const accessToken = (session as any)?.accessToken;

    try {

      console.log(accessToken);


      const client = getAuthClient();
      const res = await client.changePassword({
        oldPassword: values.current_password,
        newPassword: values.new_password,
        newPasswordConfirmation: values.password_confirmation,
      });
      console.log(res.response.base?.isError);


      if (res.response.base?.isError) {
        // throw new Error(res.response.base.message || "Gagal mendaftar");
        toast.dismiss(loadingToast);

        toast.error(res.response.base.message || "Ganti password Gagal!");

      } else {
        toast.dismiss(loadingToast);

        toast.success("Ganti password Berhasil!");
        reset();
        // reset({ current_password: "" }) spesifik
      }


    } catch (e: any) {
      toast.dismiss(loadingToast);

      if (e instanceof RpcError) {
        // Menangani error spesifik dari gRPC
        console.log("gRPC Error Code:", e.code);

        if (e.code === 'UNAUTHENTICATED') {
          toast.error("Sesi telah berakhir, silakan login kembali.");
          router.push("/login");
          router.refresh();

        } else if (e.code === 'INTERNAL') {
          toast.error("Terjadi kesalahan.");
          router.push("/login");
          router.refresh();

        } else {
          toast.error(`Error: ${e.message}`);
        }
      } else {
        // Menangani error JavaScript umum (misal: network error, bug kode)
        toast.error(e.message || "Terjadi kesalahan sistem.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
      data-aos="fade-up"
    >
      <FormInput
        label="Current Password"
        name="current_password"
        type="password"
        placeholder="Password"
        register={register}
        errors={errors}
        disabled={isSubmitting}
      // className='lg:!mb-0'
      />
      <FormInput
        label="New Password"
        name="new_password"
        type="password"
        placeholder="Password"
        register={register}
        errors={errors}
        disabled={isSubmitting}
      // className='lg:!mb-0'
      />
      <FormInput
        label="Re-Type New Password"
        name="password_confirmation"
        type="password"
        placeholder="Password"
        register={register}
        errors={errors}
        disabled={isSubmitting}
      // className='!mb-0'

      />

      <div className="mt-15px">
        <ButtonPrimary
          type={"submit"}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sedang Memproses...' : 'Update Password'}
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default PasswordContent;
