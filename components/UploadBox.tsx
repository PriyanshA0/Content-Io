"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, ImagePlus } from "lucide-react";

interface UploadBoxProps {
  imageUrl: string | null;
  onImageSelected: (imageUrl: string) => void;
}

export function UploadBox({ imageUrl, onImageSelected }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`rounded-[24px] border border-dashed p-4 transition ${dragActive ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        const file = event.dataTransfer.files[0];
        if (file) {
          readFile(file);
        }
      }}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-slate-950/60 px-6 py-10 text-center transition hover:border-cyan-300/40 hover:bg-slate-950/80"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="Uploaded preview" width={960} height={640} unoptimized className="max-h-52 w-full rounded-2xl object-cover shadow-[0_20px_70px_rgba(0,0,0,0.35)]" />
        ) : (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-cyan-200">
              <CloudUpload className="h-6 w-6" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Drag & drop your image here</div>
              <div className="mt-1 text-sm text-slate-400">or click to browse PNG, JPG, and WebP files.</div>
            </div>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            readFile(file);
          }
        }}
      />

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <ImagePlus className="h-4 w-4 text-fuchsia-300" />
        Add screenshots, charts, or social posts to restyle them instantly.
      </div>
    </div>
  );
}
