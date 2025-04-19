"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

type Props = {
  files: (File | string)[];
  setFiles: (files: (File | string)[]) => void;
  multiple?: boolean;
};

export default function ImageUploader({ files, setFiles, multiple = true }: Props) {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = multiple ? [...files, ...acceptedFiles] : [acceptedFiles[0]];
      setFiles(newFiles);
    },
    [files, multiple, setFiles]
  );

  const removeImage = (index: number) => {
    const newList = [...files];
    
    newList.splice(index, 1);
    setFiles(newList);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  return (
    <div className="space-y-3">
      {/* Zona de arrastre */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta la imagen aquí...</p>
        ) : (
          <p>
            {multiple
              ? "Haz clic o arrastra imágenes para subir"
              : files.length > 0
              ? "Haz clic para cambiar la imagen"
              : "Haz clic o arrastra una imagen para subir"}
          </p>
        )}
      </div>


      {/* Vista previa */}
      <div className={multiple ? "flex flex-wrap gap-4" : ""}>
        {files.map((file, index) => {
          const src = typeof file === "string" ? file : URL.createObjectURL(file);
          return (
            <div
              key={index}
              className={
                multiple
                  ? "relative w-24 h-24"
                  : "relative w-full max-w-2xl h-64 mx-auto"
              }
            >
              <img
                src={src}
                alt={`preview-${index}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
