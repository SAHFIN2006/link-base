
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useDatabase } from "@/context/database-context";
import { Save, Trash } from "lucide-react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "katex/dist/katex.min.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteEditorProps {
  categoryId: string;
}

export function NoteEditor({ categoryId }: NoteEditorProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(true);

  // Load notes for this category
  useEffect(() => {
    loadNotes();
  }, [categoryId]);
  
  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false }) as { data: any[], error: any };
      
      if (error) throw error;
      
      const formattedNotes: Note[] = (data || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content || '',
        categoryId: note.category_id,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));
      
      setNotes(formattedNotes);
      
      // Set active note to the first one if available
      if (formattedNotes.length > 0 && !activeNote) {
        setActiveNote(formattedNotes[0]);
      }
    } catch (err) {
      console.error("Error loading notes:", err);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    }
  };

  // Create a new note
  const handleCreateNote = async () => {
    try {
      const newNoteData = {
        title: "New Note",
        content: "",
        category_id: categoryId
      };
      
      const { data, error } = await supabase
        .from('notes')
        .insert([newNoteData])
        .select() as { data: any[], error: any };
      
      if (error) throw error;
      
      const newNote: Note = {
        id: data[0].id,
        title: data[0].title,
        content: data[0].content || '',
        categoryId: data[0].category_id,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
      
      setNotes(prev => [newNote, ...prev]);
      setActiveNote(newNote);
      setEditMode(true);
    } catch (err) {
      console.error("Error creating note:", err);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive"
      });
    }
  };

  // Save the current note
  const handleSaveNote = async () => {
    if (!activeNote) return;
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: activeNote.title,
          content: activeNote.content
        })
        .eq('id', activeNote.id);
      
      if (error) throw error;
      
      // Update local notes array
      setNotes(notes.map(note => 
        note.id === activeNote.id ? activeNote : note
      ));
      
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    } catch (err) {
      console.error("Error saving note:", err);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive"
      });
    }
  };

  // Delete the current note
  const handleDeleteNote = async () => {
    if (!activeNote) return;
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', activeNote.id);
      
      if (error) throw error;
      
      // Update local notes array
      const updatedNotes = notes.filter(note => note.id !== activeNote.id);
      setNotes(updatedNotes);
      
      // Set active note to the first one if available
      if (updatedNotes.length > 0) {
        setActiveNote(updatedNotes[0]);
      } else {
        setActiveNote(null);
      }
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting note:", err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  // Templates for common formulas
  const templates = [
    { 
      name: "SWOT Analysis", 
      content: "# SWOT Analysis\n\n## Strengths\n- \n\n## Weaknesses\n- \n\n## Opportunities\n- \n\n## Threats\n- " 
    },
    { 
      name: "PESTEL Analysis", 
      content: "# PESTEL Analysis\n\n## Political\n- \n\n## Economic\n- \n\n## Social\n- \n\n## Technological\n- \n\n## Environmental\n- \n\n## Legal\n- " 
    },
    { 
      name: "Five Forces", 
      content: "# Porter's Five Forces\n\n## Competitive Rivalry\n- \n\n## Supplier Power\n- \n\n## Buyer Power\n- \n\n## Threat of Substitution\n- \n\n## Threat of New Entry\n- " 
    },
    { 
      name: "Math Example", 
      content: "# Math Formulas\n\nQuadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n\nEuler's Identity: $e^{i\\pi} + 1 = 0$\n\nPythagorean theorem: $a^2 + b^2 = c^2$\n\nMatrix multiplication:\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}$$" 
    }
  ];

  // Apply a template
  const applyTemplate = (templateContent: string) => {
    if (!activeNote) return;
    
    setActiveNote({
      ...activeNote,
      content: templateContent
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notes</h2>
        <div className="flex gap-2">
          <Button onClick={handleCreateNote} size="sm">
            New Note
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notes List Sidebar */}
        <div className="lg:col-span-1 border-r pr-4">
          <div className="space-y-1">
            {notes.length > 0 ? (
              notes.map(note => (
                <Button
                  key={note.id}
                  variant={activeNote?.id === note.id ? "secondary" : "ghost"}
                  className="w-full justify-start truncate"
                  onClick={() => {
                    setActiveNote(note);
                    setEditMode(false);
                  }}
                >
                  {note.title || "Untitled Note"}
                </Button>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No notes yet</p>
                <Button onClick={handleCreateNote} variant="outline" size="sm" className="mt-2">
                  Create your first note
                </Button>
              </div>
            )}
          </div>
          
          {notes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-2">Templates</h3>
              <div className="space-y-1">
                {templates.map((template, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start truncate"
                    onClick={() => applyTemplate(template.content)}
                    disabled={!activeNote}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Note Editor */}
        <div className="lg:col-span-3">
          {activeNote ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                  placeholder="Note title"
                  className="font-medium"
                />
                <Button variant="outline" size="icon" onClick={handleSaveNote} title="Save note">
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDeleteNote} title="Delete note">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="edit" onClick={() => setEditMode(true)}>Edit</TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => setEditMode(false)}>Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="min-h-[300px]">
                  <Textarea
                    value={activeNote.content}
                    onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                    placeholder="Write your note here. Supports Markdown and LaTeX math formulas using $...$"
                    className="min-h-[300px] font-mono"
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="min-h-[300px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md min-h-[300px] overflow-y-auto">
                    <MathJaxContext>
                      <MathJax>
                        <ReactMarkdown>
                          {activeNote.content}
                        </ReactMarkdown>
                      </MathJax>
                    </MathJaxContext>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  Tip: Use Markdown for formatting. For math formulas, use LaTeX syntax between $ symbols.
                  Example: $E = mc^2$ for inline math, or $$ ... $$ for block formulas.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Select a note or create a new one</p>
              <Button onClick={handleCreateNote}>Create Note</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
