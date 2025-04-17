
import { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAllShortcuts } from '@/hooks/use-hotkeys';
import { useHotkeys } from '@/hooks/use-hotkeys';

export function KeyboardShortcutsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState<Array<{ key: string, description: string }>>([]);
  
  // Register '?' shortcut to open the shortcuts dialog
  useHotkeys('?', () => setIsOpen(true), "Show keyboard shortcuts");
  
  // Get all registered shortcuts
  useEffect(() => {
    const registeredShortcuts = getAllShortcuts();
    setShortcuts(registeredShortcuts.map(s => ({ key: s.key, description: s.description })));
  }, [isOpen]);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Keyboard Shortcuts (Press ? to open)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {shortcuts.length > 0 ? (
                shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="px-2.5 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center">
                  No keyboard shortcuts registered
                </div>
              )}
            </div>
            
            <div className="mt-6 text-xs text-muted-foreground text-center">
              Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">?</kbd> anytime to show this dialog
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
