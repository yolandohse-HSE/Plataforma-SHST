"use client";

import { useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSize?: number; // em bytes
  allowedTypes?: string[];
  label?: string;
}

export default function FileUpload({
  onFileSelect,
  maxSize = 10 * 1024 * 1024, // 10 MB por padrão
  allowedTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  label = "Selecione um ficheiro",
}: FileUploadProps) {
  const [error, setError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validar tipo de ficheiro
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes
        .map((type) => {
          if (type === "application/pdf") return ".pdf";
          if (type === "image/jpeg") return ".jpg, .jpeg";
          if (type === "image/png") return ".png";
          if (type.includes("word")) return ".doc, .docx";
          return type;
        })
        .join(", ");

      setError(`Tipo de ficheiro não permitido. Tipos aceitos: ${allowedExtensions}`);
      setSelectedFile(null);
      return;
    }

    // Validar tamanho do ficheiro
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`Ficheiro muito grande. Tamanho máximo: ${maxSizeMB} MB`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return "📄";
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("word")) return "📝";
    return "📎";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para selecionar</span> ou arraste um ficheiro
            </p>
            <p className="text-xs text-gray-500">
              PDF, JPG, PNG, DOC, DOCX (máx. {(maxSize / (1024 * 1024)).toFixed(0)} MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
          <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-600">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null);
              setError("");
            }}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
