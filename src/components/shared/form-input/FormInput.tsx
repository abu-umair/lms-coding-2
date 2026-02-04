import React from 'react'
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';


interface FormInputProps<T extends Record<string, any>> {
    label: string;
    type: "text" | "password" //? type nya bisa text atau password
    placeholder?: string //?tidak wajib, (bisa dibuat optional)
    register: UseFormRegister<T>;
    name: Path<T>;
    errors: FieldErrors<T>;
}

function FormInput<T extends Record<string, any>>({
    label,
    type,
    placeholder,
    name,
    register,
    errors
}: FormInputProps<T>) {

    // Ambil error spesifik untuk field ini
    const errorField = errors[name];


    return (
        <div className="mb-25px">
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border ${errorField ? 'border-secondaryColor dark:border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'}  placeholder:text-placeholder placeholder:opacity-80 font-medium rounded`}
                {...register(name)}// Menghubungkan ke React Hook Form
            />
            <div className={`text-sm border-secondaryColor text-secondaryColor h-2 ${errorField ? 'visible' : 'invisible '}`}>
                <small>{errorField?.message as string}</small>
            </div>

        </div>
    )
}

export default FormInput