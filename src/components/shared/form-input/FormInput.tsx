import React, { useEffect, useState } from 'react'
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
    isInputCourse?: boolean;
    lableRequired?: boolean;
    watchValueImg?: any;
    initialImageUrl?: string | null;
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
    isInputCourse,
    lableRequired,
    watchValueImg,
    initialImageUrl
}: FormInputProps<T>) {

    // Ambil error spesifik untuk field ini
    const errorField = errors[name];
    // --- Fungsi Render Internal ---
    const renderInput = () => {
        // 1. Tipe Checkbox (Label di samping)
        if (type === "checkbox" && isInputCourse === false) {
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

        // 3. Tipe Image/File
        if (type === "image" && isInputCourse) {
            const [previewUrl, setPreviewUrl] = useState<string | null>(null);
            // imageFile biasanya berupa FileList, jadi kita ambil index ke-0
            const file = watchValueImg && watchValueImg[0] instanceof File ? watchValueImg[0] : null;
            useEffect(() => {
                if (file) {
                    // Jika user memilih file baru, buat preview dari local file
                    const objectUrl = URL.createObjectURL(file);
                    setPreviewUrl(objectUrl);
                    return () => URL.revokeObjectURL(objectUrl);
                } else if (initialImageUrl) {
                    // Jika tidak ada file baru tapi ada URL dari server (saat edit)
                    setPreviewUrl(initialImageUrl);
                } else {
                    setPreviewUrl(null);
                }
            }, [file, initialImageUrl]);
            // Gunakan useMemo atau pastikan previewUrl tidak menyebabkan memory leak jika ini komponen besar
            // Tapi untuk penggunaan standar, cara ini sudah cukup:
            // const previewUrl = file ? URL.createObjectURL(file) : null;

            return (
                <div className="flex flex-col items-center justify-center w-full">
                    <label
                        htmlFor={`file-upload-${name}`}
                        className={`
                    relative flex flex-col items-center justify-center w-full h-52 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-300 overflow-hidden
                    ${errorField
                                ? 'border-secondaryColor bg-secondaryColor/5'
                                : 'border-borderColor dark:border-borderColor-dark bg-whiteColor dark:bg-whiteColor-dark hover:bg-gray-100 dark:hover:bg-dark-3'}
                `}
                    >
                        {previewUrl ? (
                            /* --- TAMPILAN PREVIEW GAMBAR --- */
                            <div className="relative w-full h-full group">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay saat hover untuk memberi tahu user bisa ganti gambar */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white bg-primaryColor px-3 py-1.5 rounded-md text-sm">
                                        Change Image
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* --- TAMPILAN PLACEHOLDER (KOSONG) --- */
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <svg
                                    className={`w-10 h-10 mb-3 ${errorField ? 'text-secondaryColor' : 'text-gray-400'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>

                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    PNG, JPG, JPEG, or WEBP (MAX. 5MB)
                                </p>
                            </div>
                        )}

                        <input
                            id={`file-upload-${name}`}
                            type="file"
                            accept="image/*"
                            disabled={disabled}
                            className="hidden"
                            {...register(name)}
                        />
                    </label>

                    {/* Menampilkan nama file di bawah kotak jika sudah terpilih */}
                    {file && (
                        <p className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                            File: <span className="font-medium">{file.name}</span>
                        </p>
                    )}
                </div>
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