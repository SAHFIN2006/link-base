
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, User, X } from "lucide-react";

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLinks {
  github?: string;
  gitlab?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  discord?: string;
  reddit?: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  social_links?: SocialLinks;
}

export function ProfileForm({ isOpen, onClose }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    social_links: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user profile on mount
  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (profileData) {
        setProfile({
          id: profileData.id,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          email: profileData.email || user.email || '',
          avatar_url: profileData.avatar_url,
          social_links: profileData.social_links || {}
        });
        
        if (profileData.avatar_url) {
          setAvatarPreview(profileData.avatar_url);
        }
      } else {
        // Initialize with auth user data
        setProfile({
          id: user.id,
          first_name: '',
          last_name: '',
          email: user.email || '',
          social_links: {}
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_')) {
      const socialName = name.replace('social_', '');
      setProfile({
        ...profile,
        social_links: {
          ...profile.social_links,
          [socialName]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Upload avatar if changed
      let avatarUrl = profile.avatar_url;
      
      if (avatarFile) {
        const fileName = `${profile.id}-${Date.now()}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = urlData.publicUrl;
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          avatar_url: avatarUrl,
          social_links: profile.social_links,
          updated_at: new Date().toISOString()
        });
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. This will be used in analytics and contributor reports.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex gap-2">
                  <Label
                    htmlFor="avatarUpload"
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {avatarPreview ? "Change" : "Upload"}
                  </Label>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_github">GitHub</Label>
                    <Input
                      id="social_github"
                      name="social_github"
                      placeholder="username"
                      value={profile.social_links?.github || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_gitlab">GitLab</Label>
                    <Input
                      id="social_gitlab"
                      name="social_gitlab"
                      placeholder="username"
                      value={profile.social_links?.gitlab || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">Twitter</Label>
                    <Input
                      id="social_twitter"
                      name="social_twitter"
                      placeholder="username"
                      value={profile.social_links?.twitter || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin">LinkedIn</Label>
                    <Input
                      id="social_linkedin"
                      name="social_linkedin"
                      placeholder="username"
                      value={profile.social_links?.linkedin || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <Input
                      id="social_facebook"
                      name="social_facebook"
                      placeholder="username"
                      value={profile.social_links?.facebook || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <Input
                      id="social_instagram"
                      name="social_instagram"
                      placeholder="username"
                      value={profile.social_links?.instagram || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_discord">Discord</Label>
                    <Input
                      id="social_discord"
                      name="social_discord"
                      placeholder="username#0000"
                      value={profile.social_links?.discord || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social_reddit">Reddit</Label>
                    <Input
                      id="social_reddit"
                      name="social_reddit"
                      placeholder="u/username"
                      value={profile.social_links?.reddit || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
