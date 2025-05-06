
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagInput } from "@/components/ui/tag-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/context/database-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  owner: z.string().optional(),
  contactInfo: z.string().optional(),
  accessType: z.enum(["public", "private", "restricted"]).optional(),
  createdBy: z.string().optional(),
});

export type ResourceFormData = z.infer<typeof formSchema> & {
  identificationData?: Record<string, any>;
};

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ResourceFormData;
  onSave?: (data: ResourceFormData) => void;
  onClose?: () => void;
  isOpen?: boolean;
  categories?: any[];
}

export function AddResourceDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSave,
  onClose,
  isOpen,
  categories: providedCategories
}: AddResourceDialogProps) {
  const { categories: contextCategories, addResource } = useDatabase();
  const categories = providedCategories || contextCategories;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  
  // Use either open or isOpen prop to determine dialog state
  const dialogOpen = open || isOpen || false;
  const setDialogOpen = (value: boolean) => {
    if (onOpenChange) onOpenChange(value);
    if (onClose && !value) onClose();
  };

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      url: "",
      description: "",
      categoryId: "",
      tags: [],
      owner: "",
      contactInfo: "",
      accessType: "public",
      createdBy: "",
    },
  });

  const handleClose = () => {
    form.reset();
    setTags([]);
    setDialogOpen(false);
  };

  const onSubmit = async (values: ResourceFormData) => {
    try {
      setIsSubmitting(true);

      // Create identification data object
      const identificationData = {
        owner: values.owner || undefined,
        contactInfo: values.contactInfo || undefined,
        accessType: values.accessType || undefined,
        createdBy: values.createdBy || undefined
      };

      // Filter out undefined values
      const filteredIdentData = Object.fromEntries(
        Object.entries(identificationData).filter(([_, v]) => v !== undefined)
      );

      // Only include identificationData if it has values
      const hasIdentData = Object.keys(filteredIdentData).length > 0;
      
      const finalData: ResourceFormData = {
        ...values,
        tags,
        identificationData: hasIdentData ? filteredIdentData : undefined,
      };

      if (onSave) {
        onSave(finalData);
      } else {
        await addResource({
          title: values.title,
          url: values.url,
          description: values.description || "",
          categoryId: values.categoryId,
          tags: tags,
          identificationData: hasIdentData ? filteredIdentData : undefined,
        });

        toast.success("Resource added successfully");
        handleClose();
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          <DialogDescription>
            {initialData?.id ? "Edit your web resource" : "Add a new web resource to your collection"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the resource"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tags</FormLabel>
              <TagInput
                placeholder="Enter tags..."
                tags={tags}
                setTags={setTags}
                className="mt-2"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="identification">
                <AccordionTrigger>Resource Identification</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="owner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner</FormLabel>
                          <FormControl>
                            <Input placeholder="Resource owner" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Information</FormLabel>
                          <FormControl>
                            <Input placeholder="Email or phone" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select access type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="restricted">Restricted</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="createdBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Created By</FormLabel>
                          <FormControl>
                            <Input placeholder="Creator name" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData?.id ? "Save Changes" : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
