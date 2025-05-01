
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileIcon, 
  Upload,
  File, 
  FileText, 
  Image as ImageIcon, 
  FileText as FileTextIcon, 
  Archive,
  Code,
  Table,
  Video,
  Music,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useDatabase } from "@/context/database-context";

interface FileUploadProps {
  categoryId: string;
}

export function FileUpload({ categoryId }: FileUploadProps) {
  const { 
    files, 
    getFilesByCategory, 
    addFile, 
    deleteFile 
  } = useDatabase();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFilesByCategory(categoryId);
  }, [categoryId, getFilesByCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleUpload(selectedFiles);
    }
  };

  const handleUpload = async (selectedFiles: File[]) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // Create the bucket if it doesn't exist (first time upload)
      const { data: bucketData } = await supabase.storage.getBucket('file_uploads');
      
      if (!bucketData) {
        await supabase.storage.createBucket('file_uploads', {
          public: true,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB
        });
      }

      // Set up public access for the bucket
      const { data: policyData } = await supabase.storage.from('file_uploads').getPublicUrl('test-policy');
      
      if (!policyData) {
        // Add policy to allow public access
        try {
          await supabase.rpc('create_or_update_storage_policy', { 
            bucket_name: 'file_uploads', 
            policy_name: 'public_access',
            policy_definition: {
              bucket_id: 'file_uploads',
              role: 'anon',
              operation: '*',
              permission: 'TRUE'
            }
          });
        } catch (e) {
          console.error("Policy creation error:", e);
        }
      }
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 9)}_${file.name}`;
        const filePath = `${categoryId}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('file_uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast({
            title: `Error uploading ${file.name}`,
            description: uploadError.message,
            variant: "destructive"
          });
          continue;
        }
        
        const { data: urlData } = supabase.storage
          .from('file_uploads')
          .getPublicUrl(filePath);
          
        await addFile({
          name: file.name, 
          path: filePath, 
          size: file.size, 
          type: file.type, 
          categoryId: categoryId,
          url: urlData.publicUrl
        });
        
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      toast({
        title: "Files uploaded successfully",
        description: `Uploaded ${selectedFiles.length} file(s)`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file(s). Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await supabase.storage
        .from('file_uploads')
        .remove([path]);
        
      await deleteFile(id, path);
      
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file",
        variant: "destructive"
      });
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    file.categoryId === categoryId
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('pdf')) return <FileTextIcon className="h-8 w-8 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-8 w-8 text-yellow-500" />;
    if (fileType.includes('text')) return <FileText className="h-8 w-8 text-gray-500" />;
    if (fileType.includes('code') || fileType.includes('json') || fileType.includes('html')) return <Code className="h-8 w-8 text-green-500" />;
    if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) return <Table className="h-8 w-8 text-green-500" />;
    if (fileType.includes('video')) return <Video className="h-8 w-8 text-purple-500" />;
    if (fileType.includes('audio')) return <Music className="h-8 w-8 text-pink-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Files & Resources</h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            <Upload size={16} />
            Upload Files
          </Button>
        </div>
      </div>
      
      {uploading && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Uploading: {progress}%</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="mb-6">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="space-y-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div key={file.id} className="flex items-center p-3 border rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              {getFileIcon(file.type)}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="truncate flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm"
                      className="gap-1"
                    >
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        Open
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id, file.path)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No files found</p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Upload your first file
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
