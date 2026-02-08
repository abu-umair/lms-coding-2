import React from 'react'
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';


interface FormInputProps<T extends Record<string, any>> {
    label: string;
    type: "text" | "password" | "checkbox" | "textarea" | "image" //? type nya bisa text atau password
    placeholder?: string //?tidak wajib, (bisa dibuat optional)
    register: UseFormRegister<T>;
    name: Path<T>;
    errors: FieldErrors<T>;
    disabled?: boolean;
    className?: string;
}

function FormInput<T extends Record<string, any>>({
    label,
    type,
    placeholder,
    name,
    register,
    errors,
    disabled,
    className = "" // default string kosong
}: FormInputProps<T>) {

    // Ambil error spesifik untuk field ini
    const errorField = errors[name];
    // --- Fungsi Render Internal ---
    const renderInput = () => {
        // 1. Tipe Checkbox (Label di samping)
        if (type === "checkbox") {
            return (
                <div className={`text-contentColor dark:text-contentColor-dark ${className}`}>
                    <input
                        type="checkbox"
                        id={name as string}
                        disabled={disabled}
                        className="w-18px h-18px mr-2 block box-content cursor-pointer"
                        {...register(name)}
                    />
                    <label htmlFor={name as string} className="text-contentColor dark:text-contentColor-dark cursor-pointer">
                        {label}
                    </label>
                </div>
            )
        }

        // 2. Tipe Textarea
        if (type === "textarea") {
            return (
                <textarea
                    rows={4}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full p-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} font-medium rounded`}
                    {...register(name)}
                />
            )
        }

        // 3. Tipe Image/File
        if (type === "image") {
            return (
                <input
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    className="w-full text-sm text-contentColor"
                    {...register(name)}
                />
            )
        }

        // 4. Default (Text, Password, dll - Label di atas)
        return (
            <input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} placeholder:text-placeholder placeholder:opacity-80 font-medium rounded`}
                {...register(name)}
            />
        )
    }

    return (
        <>
            {type !== "checkbox" && (
                <div className={`mb-25px ${className}`}>
                    {/* Label hanya muncul di atas jika BUKAN checkbox */}
                    <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                        {label}
                    </label>

                    {renderInput()}

                    {/* Area Error yang Konsisten */}
                    <div className={`text-sm text-secondaryColor h-2 mt-1 ${errorField ? 'visible' : 'invisible'}`}>
                        <small>{errorField?.message as string}</small>
                    </div>
                </div>
            )}

            {type === "checkbox" && (
                <>
                    {renderInput()}

                    <div className={`text-sm text-secondaryColor h-2 ${errorField ? 'visible' : 'invisible'}`}>
                        <small>{errorField?.message as string}</small>
                    </div>
                </>
            )}
        </>

    )
}

export default FormInput