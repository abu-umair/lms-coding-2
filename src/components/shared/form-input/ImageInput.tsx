import { useEffect, useState } from "react";
import Image from "next/image";

export default function ImageInput<T>({
    name,
    register,
    watchValueImg,
    initialImageUrl,
    disabled,
    errorField,
}: any) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const file =
        watchValueImg && watchValueImg[0] instanceof File
            ? watchValueImg[0]
            : null;

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (initialImageUrl) {
            setPreviewUrl(initialImageUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [file, initialImageUrl]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label
                htmlFor={`file-upload-${name}`}
                className={`relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer`}
            >
                {previewUrl ? (
                    <img alt="" src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                    <p>Upload image</p>
                )}

                <input
                    id={`file-upload-${name}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register(name)}
                    disabled={disabled}
                />
            </label>
        </div>
    );
}