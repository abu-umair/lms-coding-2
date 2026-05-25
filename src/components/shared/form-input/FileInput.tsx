import { useEffect, useState } from "react";

export default function FileInput({
    name,
    register,
    watchValueFile,
    initialFileUrl,
    disabled,
    errorField,
    accept = ".pdf,.doc,.docx",
}: any) {

    const [fileName, setFileName] = useState<string | null>(null);

    const file =
        watchValueFile && watchValueFile[0] instanceof File
            ? watchValueFile[0]
            : null;

    useEffect(() => {
        if (file) {
            setFileName(file.name);
        } else if (initialFileUrl) {
            const split = initialFileUrl.split("/");
            setFileName(split[split.length - 1]);
        } else {
            setFileName(null);
        }
    }, [file, initialFileUrl]);

    return (
        <div className="w-full">

            <label
                htmlFor={`file-upload-${name}`}
                className={`
                    flex flex-col items-center justify-center
                    w-full
                    min-h-[220px]
                    border-2 border-dashed
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    bg-gray-50 hover:bg-blue-50
                    px-6 py-10
                    text-center

                    ${errorField
                        ? "border-red-400"
                        : "border-gray-300"}
                `}
            >

                {/* ICON */}
                <div className="text-5xl mb-4">
                    📄
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-700">
                    Upload Document
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500 mt-2">
                    Drag & drop file atau klik untuk upload
                </p>

                <p className="text-xs text-gray-400 mt-2">
                    PDF, DOCX, PPTX, ZIP
                </p>

                {/* FILE NAME */}
                {fileName && (
                    <div className="
                        mt-5
                        px-4 py-2
                        rounded-xl
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-medium
                        break-all
                    ">
                        {fileName}
                    </div>
                )}

                <input
                    id={`file-upload-${name}`}
                    type="file"
                    accept={accept}
                    className="hidden"
                    {...register(name)}
                    disabled={disabled}
                />
            </label>

        </div>
    );
}