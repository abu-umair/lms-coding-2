import React from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { useForm } from "react-hook-form";
import FormInput from "@/components/shared/form-input/FormInput";
import { getAuthClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema, PasswordFormData } from "@/libs/validationSchemaPassword";
import useGrpcApi from "@/components/shared/others/useGrpcApi";


const PasswordContent = () => {

  const { callApi, isLoading } = useGrpcApi();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      password_confirmation: "",
    }
  });


  const onSubmit = async (values: PasswordFormData) => {
    await callApi(
      getAuthClient().changePassword({
        oldPassword: values.current_password,
        newPassword: values.new_password,
        newPasswordConfirmation: values.password_confirmation,
      }),
      {
        loadingMessage: "Memperbarui kata sandi...",
        successMessage: "Kata sandi berhasil diperbarui!", // Otomatis muncul toast success
        onSuccess: () => reset(),
        useDefaultError: false,
        defaultError: (res) => {
          if (res.response.base?.message === "Old password is not matched") {
            toast.error("Kata sandi lama salah!");
          } else {
            toast.error("Gagal memperbarui password.");
          }
        }
      }
    );
  };

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
        disabled={isLoading}
      // className='lg:!mb-0'
      />
      <FormInput
        label="New Password"
        name="new_password"
        type="password"
        placeholder="Password"
        register={register}
        errors={errors}
        disabled={isLoading}
      // className='lg:!mb-0'
      />
      <FormInput
        label="Re-Type New Password"
        name="password_confirmation"
        type="password"
        placeholder="Password"
        register={register}
        errors={errors}
        disabled={isLoading}
      // className='!mb-0'

      />

      <div className="mt-15px">
        <ButtonPrimary
          type={"submit"}
          disabled={isLoading}
        >
          {isLoading ? 'Sedang Memproses..' : 'Update Password'}
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default PasswordContent;
