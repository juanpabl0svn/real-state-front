"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

type Props = {
  files: Array<File | string>;
  setFiles: (files: Array<File | string>) => void;
};

export default function ImageUploaderProfile({ files, setFiles }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [acceptedFiles[0]];
      setFiles(newFiles);
    },
    [files, setFiles]
  );

  const removeImage = (index: number) => {
    const newList = [...files];

    newList.splice(index, 1);
    setFiles(newList);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="rounded-lg h-20 w-20">
      {/* Zona de arrastre */}
      <div
        {...getRootProps()}
        className={`outline-1 outline-gray-500 outline-dotted w-full h-full rounded-lg text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive && <p>Suelta la imagen aquí...</p>}

        {/* Vista previa */}
        <div>
          {files.map((file, index) => {
            if (!file) return null;
            const src =
              typeof file === "string" ? file : URL.createObjectURL(file);
            return (
              <div key={index} className={"relative "}>
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover rounded-md aspect-square"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
