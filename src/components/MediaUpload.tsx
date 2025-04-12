
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileType, validateFile, uploadFile } from "@/utils/fileUpload";
import { useToast } from "@/components/ui/use-toast";
import { UploadIcon, X, Loader2 } from "lucide-react";

interface MediaUploadProps {
  type: FileType;
  onUploadComplete: (url: string) => void;
  value?: string;
  className?: string;
}

const MediaUpload = ({ type, onUploadComplete, value, className }: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validate file
    const validationError = validateFile(file, type);
    if (validationError) {
      setError(validationError);
      toast({
        variant: "destructive",
        title: "File validation error",
        description: validationError,
      });
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      
      // Upload to Supabase
      const result = await uploadFile(file, type);
      
      if (result) {
        onUploadComplete(result.url);
        toast({
          title: "Upload successful",
          description: `${type === "image" ? "Image" : "Video"} has been uploaded successfully.`,
        });
      } else {
        setError(`Failed to upload ${type}. Please try again.`);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Could not upload ${type}. Please check your connection and try again.`,
        });
        setPreview(null);
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Error uploading ${type}`);
      toast({
        variant: "destructive",
        title: "Upload error",
        description: `An unexpected error occurred while uploading the ${type}.`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearMedia = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {!preview && (
        <div className="border-2 border-dashed rounded-md p-4 text-center">
          <Input
            type="file"
            className="hidden"
            id={`${type}-upload`}
            accept={type === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor={`${type}-upload`}
            className="flex flex-col items-center cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 mb-2 text-gray-500 animate-spin" />
            ) : (
              <UploadIcon className="h-6 w-6 mb-2 text-gray-500" />
            )}
            <p className="text-sm font-medium mb-1">
              {isUploading
                ? `${type === "image" ? "படம்" : "வீடியோ"} பதிவேற்றுகிறது...`
                : `${type === "image" ? "படம்" : "வீடியோ"} பதிவேற்ற இங்கே கிளிக் செய்யவும்`}
            </p>
            <p className="text-xs text-gray-500">
              {type === "image" ? "JPG, PNG, GIF" : "MP4, WebM, MOV"}
            </p>
          </label>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <div className="relative border rounded-md overflow-hidden">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 bg-black/70 hover:bg-black/90"
            onClick={clearMedia}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {type === "image" ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto object-cover max-h-60"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-60"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
