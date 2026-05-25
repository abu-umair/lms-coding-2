import dynamic from 'next/dynamic';
import React, { useEffect, useState, ComponentProps } from 'react'
import { UseFormRegister, FieldErrors, Path, Control, Controller } from 'react-hook-form';
import "react-quill/dist/quill.snow.css"; // Import styles
import ImageInput from './ImageInput';
import FileInput from './FileInput';

// Ambil tipe props secara dinamis
type QuillProps = ComponentProps<typeof import('react-quill')>;

const DynamicReactQuill = dynamic<QuillProps>(
    async () => {
        const { default: RQ } = await import("react-quill");
        return RQ;
    },
    {
        ssr: false,
        loading: () => <div className="h-[210px] bg-gray-100 animate-pulse rounded-md" />
    }
);

// 1. Tentukan module toolbar
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Menambahkan 4, 5, 6
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

// 2. Tentukan formats yang diizinkan
const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
];


interface FormInputProps<T extends Record<string, any>> {
    label?: string;
    type: "text" | "file" | "password" | "checkbox" | "textarea" | "image" | "select" | 'hidden' | 'number' | 'editor'; //? type nya bisa text atau password
    placeholder?: string //?tidak wajib, (bisa dibuat optional)
    register: UseFormRegister<T>;
    name: Path<T>;
    errors: FieldErrors<T>;
    disabled?: boolean;
    className?: string;
    control?: Control<T>;
    isInputCourse?: boolean;
    lableRequired?: boolean;
    watchValueImg?: any;
    initialImageUrl?: string | null;
    options?: { value: string; label: string }[];
    watchValueFile?: any;
    initialFileUrl?: string | null;
    accept?: string;
}

function FormInput<T extends Record<string, any>>({
    label,
    type,
    placeholder,
    name,
    register,
    errors,
    disabled,
    className = "", // default string kosong
    control,
    isInputCourse,
    lableRequired,
    watchValueImg,
    initialImageUrl,
    options,
    watchValueFile,
    initialFileUrl,
    accept,
}: FormInputProps<T>) {

    // Ambil error spesifik untuk field ini
    const errorField = errors[name];
    // --- Fungsi Render Internal ---
    const RenderInput = () => {
        // 1. Tipe Checkbox (Label di samping)
        if (type === "checkbox" && isInputCourse === false) {
            return (
                <div className={` text-contentColor dark:text-contentColor-dark flex items-center ${className}`}>
                    <input
                        type="checkbox"
                        id={name as string}
                        disabled={disabled}
                        className="w-18px h-18px mr-2 block box-content cursor-pointer"
                        {...register(name)}
                    />
                    <label htmlFor={name as string} className="cursor-pointer">
                        <small>{label}</small>
                    </label>
                </div>
            )
        }

        // 2. Tipe Textarea
        if (type === "textarea" && isInputCourse) {
            return (
                <textarea
                    cols={30}
                    rows={10}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md
                        ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} 
                    `}
                    {...register(name)}
                />
            )
        }

        // 1. Tipe Editor (ReactQuill)
        if (type === "editor" && control) {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <DynamicReactQuill // Gunakan nama variabel yang baru
                            theme="snow"
                            modules={modules} // Masukkan modules
                            formats={formats} // Masukkan formats
                            value={field.value || ""}
                            onChange={(content) => field.onChange(content)} // Pastikan onChange menangkap konten
                            placeholder={placeholder}
                            readOnly={disabled}
                            className={`bg-white mb-6 pb-12  ${errorField ? 'border-red-500' : ''}`}
                            style={{ height: '200px' }}
                        />
                    )}
                />
            );
        }

        // FILE INPUT
        if (type === "file" && isInputCourse) {
            return (
                <FileInput
                    name={name}
                    register={register}
                    watchValueFile={watchValueFile}
                    initialFileUrl={initialFileUrl}
                    disabled={disabled}
                    errorField={errorField}
                    accept={accept}
                />
            );
        }

        // 3. Tipe Image/File
        if (type === "image" && isInputCourse) {
            return (
                <ImageInput
                    name={name}
                    register={register}
                    watchValueImg={watchValueImg}
                    initialImageUrl={initialImageUrl}
                    disabled={disabled}
                    errorField={errorField}
                />
            );
        }
        // 4. Tipe text khusus buat input course
        if (type === "text" && isInputCourse) {
            return (
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                    w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no
                    ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} 
                    `}
                    {...register(name)}
                />
            )
        }

        // 5. Tipe Select (Tambahkan di dalam renderInput)
        if (type === "select" && isInputCourse) {
            return (
                <select
                    disabled={disabled}
                    className={`
                w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 focus:outline-none leading-23px rounded-md appearance-none cursor-pointer
                ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} 
            `}
                    style={{
                        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em'
                    }}
                    {...register(name)}
                >
                    <option value="">{placeholder || "Pilih Opsi"}</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        // 4. Default (Text, Password, dll - Label di atas)
        return (
            <input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                    w-full leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border 
                    ${errorField ? 'border-secondaryColor' : 'border-borderColor dark:border-borderColor-dark'} placeholder:text-placeholder placeholder:opacity-80 font-medium rounded
                    `}
                {...register(name)}
            />
        )
    }

    return (
        <>
            {type !== "checkbox" && (
                <div className={`mb-25px ${className}`}>
                    {/* Label hanya muncul di atas jika BUKAN checkbox */}
                    {isInputCourse ?
                        <label className="mb-3 block font-semibold">
                            {label} {lableRequired && <span className="text-secondaryColor">*</span>}
                        </label> : <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            {label} {lableRequired && <span className="text-secondaryColor">*</span>}
                        </label>
                    }


                    {RenderInput()}

                    {/* Area Error yang Konsisten */}
                    <div className={`text-sm text-secondaryColor h-2 mt-1 ${errorField ? 'visible' : 'invisible'}`}>
                        <small>{errorField?.message as string}</small>
                    </div>
                </div>
            )}

            {type === "checkbox" && (
                <>
                    {RenderInput()}

                    <div className={`text-sm text-secondaryColor h-2 ${errorField ? 'visible' : 'invisible'}`}>
                        <small>{errorField?.message as string}</small>
                    </div>
                </>
            )}
        </>

    )
}

export default FormInput