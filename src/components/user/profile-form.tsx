
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    twitter: '',
    github: '',
    linkedin: '',
    website: '',
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      avatarUrl: '',
      bio: '',
      twitter: '',
      github: '',
      linkedin: '',
      website: '',
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('No user logged in');
        }
        
        // Get profile information
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            await supabase.from('profiles').insert({
              id: user.id,
              first_name: '',
              last_name: '',
              email: user.email,
            });
          } else {
            throw error;
          }
        }
        
        if (data) {
          form.reset({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || user.email || '',
            avatarUrl: data.avatar_url || '',
            bio: '',
          });
          
          if (data.social_links) {
            const links = data.social_links as Record<string, string>;
            setSocialLinks({
              twitter: links.twitter || '',
              github: links.github || '',
              linkedin: links.linkedin || '',
              website: links.website || '',
            });
            
            form.setValue('twitter', links.twitter || '');
            form.setValue('github', links.github || '');
            form.setValue('linkedin', links.linkedin || '');
            form.setValue('website', links.website || '');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const socialLinksData = {
        twitter: values.twitter,
        github: values.github,
        linkedin: values.linkedin,
        website: values.website,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          avatar_url: values.avatarUrl,
          social_links: socialLinksData,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={form.getValues().avatarUrl} />
                <AvatarFallback>
                  {form.getValues().firstName?.charAt(0) || ''}
                  {form.getValues().lastName?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <h3 className="text-lg font-medium">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
