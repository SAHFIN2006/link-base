
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LucideIcon } from "lucide-react";
import { IconPicker } from "@/components/ui/icon-picker";

export interface CategoryFormData {
  id?: string;
  name: string;
  description: string;
  icon: string;
}

interface AddCategoryDialogProps {
  initialData?: CategoryFormData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
}

export function AddCategoryDialog({
  initialData,
  isOpen,
  onClose,
  onSave,
}: AddCategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      name: "",
      description: "",
      icon: "Folder", // Default icon
    }
  );

  const isEditing = !!initialData?.id;
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (iconName: string) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-panel border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your category details."
                : "Create a new category to organize your resources."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Web Development"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the category"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Icon</Label>
              <IconPicker 
                selectedIcon={formData.icon} 
                onSelectIcon={handleIconChange} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
