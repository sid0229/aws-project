import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';

export interface FileUploadDropzoneProps {
  onFileSelect: (file: File, sizeStr: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg',
  maxSizeMB = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return;
    }
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          const sizeStr = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
          onFileSelect(selectedFile, sizeStr);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleChange}
      />
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-navy-600 bg-navy-50/50'
              : 'border-border bg-white hover:border-navy-300 hover:bg-navy-50/20'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-600">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink">
            Drag & drop file here, or <span className="text-navy-600 hover:underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Supports PDF, Word, PowerPoint, Excel up to {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              <File className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            {!uploading ? (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-navy-50 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-navy-600">{progress}%</span>
            )}
          </div>

          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress === 100 ? 'bg-success' : 'bg-navy-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-success font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              File ready for upload
            </div>
          )}
        </div>
      )}
    </div>
  );
};
