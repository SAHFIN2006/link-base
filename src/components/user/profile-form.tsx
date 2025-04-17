
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define Profile Interface
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  social_links: Record<string, string>;
  bio: string;
}

export function ProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    github: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    discord: "",
    reddit: ""
  });
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Create profile table helper function - this is a workaround until a profiles table exists
  const initProfileTable = async () => {
    try {
      // This is a workaround - in a production app, we would have the profiles table created via SQL
      // Since we can't create tables from the client code easily, we're adding this check
      const { data, error } = await supabase.from('profiles').select('count');
      
      // If there's an error (table doesn't exist), we'll catch it and show a toast
      if (error && error.code === '42P01') {
        console.error("Profiles table doesn't exist yet");
        toast({
          title: "Database Setup Required",
          description: "The profiles table needs to be created. Please contact the administrator.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking profiles table:", error);
      return false;
    }
  };

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      // Check if profiles table exists first
      const tableExists = await initProfileTable();
      if (!tableExists) return;
      
      try {
        setIsLoading(true);
        
        // In a real app with auth, we would get the user ID from the auth context
        // For now, we'll try to load any profile if it exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
          setAvatarUrl(data.avatar_url || "");
          setSocialLinks(data.social_links || {
            github: "",
            twitter: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            discord: "",
            reddit: ""
          });
          setBio(data.bio || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [toast]);
  
  // Save profile data
  const handleSave = async () => {
    // Check if profiles table exists first
    const tableExists = await initProfileTable();
    if (!tableExists) return;
    
    try {
      setIsLoading(true);
      
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar_url: avatarUrl,
        social_links: socialLinks,
        bio: bio
      };
      
      // In a real app with auth, we'd use upsert with the actual user ID
      // For now, we'll just insert a new record or update if one exists
      const { error } = await supabase
        .from('profiles')
        .upsert([profileData as any])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social link changes
  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Manage your personal information and how others see you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <Label htmlFor="avatar" className="block mb-2">Profile Picture URL</Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="text-center"
              />
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={socialLinks.github}
                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                value={socialLinks.discord}
                onChange={(e) => handleSocialLinkChange("discord", e.target.value)}
                placeholder="username#0000"
              />
            </div>
            <div>
              <Label htmlFor="reddit">Reddit</Label>
              <Input
                id="reddit"
                value={socialLinks.reddit}
                onChange={(e) => handleSocialLinkChange("reddit", e.target.value)}
                placeholder="u/username"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
