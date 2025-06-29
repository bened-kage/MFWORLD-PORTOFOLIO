import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  endpoint: string;
  label?: string;
  className?: string;
}

export default function FileUpload({ 
  onUploadSuccess, 
  onUploadError, 
  endpoint, 
  label = "Upload Image",
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      onUploadError?.("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiRequest("POST", endpoint, formData, {
        headers: {
          // Don't set Content-Type, let the browser set it with boundary
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadSuccess(data.imageUrl);
      // Clear preview and file input
      setPreview(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="block mb-1 text-gray-300 font-medium text-xs tracking-wide">{label}</Label>
      <div className="flex w-full items-center gap-2">
        {/* Custom file input */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            tabIndex={-1}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-l-lg rounded-r-none bg-green-600 text-white font-semibold h-10 px-4 border border-gray-600 border-r-0 hover:bg-green-700"
          >
            Pilih File
          </Button>
          <span className="flex-1 bg-black border border-gray-600 border-l-0 rounded-r-lg h-10 flex items-center px-3 text-sm text-gray-300 truncate">
            {fileName || "Belum ada file dipilih"}
          </span>
        </div>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !fileInputRef.current?.files?.length}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 h-10 px-4 disabled:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
      {preview && (
        <div className="relative mt-3 w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border-2 border-green-500 shadow-lg"
            style={{ aspectRatio: '1/1' }}
          />
          <Button
            type="button"
            onClick={clearFile}
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full bg-red-500 hover:bg-red-600 shadow"
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 