
import { supabase } from "@/integrations/supabase/client";

export type FileType = "image" | "video";

export interface UploadedFile {
  url: string;
  type: FileType;
  fileName: string;
}

/**
 * Validates file size and type before upload
 */
export const validateFile = (file: File, type: FileType): string | null => {
  // Check file size (max 10MB for images, 100MB for videos)
  const maxSize = type === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return `File size exceeds maximum limit (${type === "image" ? "10MB" : "100MB"})`;
  }

  // Check file types
  if (type === "image" && !file.type.startsWith("image/")) {
    return "Only image files are allowed";
  }
  
  if (type === "video" && !file.type.startsWith("video/")) {
    return "Only video files are allowed";
  }

  return null;
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFile = async (file: File, type: FileType): Promise<UploadedFile | null> => {
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from("news_media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("news_media")
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      type,
      fileName: data.path,
    };
  } catch (error) {
    console.error("Error in file upload:", error);
    return null;
  }
};
