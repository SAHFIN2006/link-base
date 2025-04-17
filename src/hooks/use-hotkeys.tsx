
import { useEffect, useCallback } from 'react';

interface Shortcut {
  key: string;
  callback: () => void;
  description: string;
}

interface ShortcutsMap {
  [key: string]: {
    callback: () => void;
    description: string;
  }
}

// Global shortcuts registry
const globalShortcuts: ShortcutsMap = {};

/**
 * Custom hook for registering keyboard shortcuts
 * 
 * @param key Keyboard shortcut (e.g. "Ctrl+K", "Shift+/")
 * @param callback Function to execute when shortcut is triggered
 * @param description Description of what the shortcut does (for help modal)
 */
export function useHotkeys(key: string, callback: () => void, description: string) {
  // Register shortcut
  useEffect(() => {
    globalShortcuts[key] = { callback, description };
    
    return () => {
      delete globalShortcuts[key];
    };
  }, [key, callback, description]);
  
  // Key handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input elements
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement instanceof HTMLSelectElement
    ) {
      // The only exception is the global search shortcut
      if (!(event.key === '/' && event.shiftKey)) {
        return;
      }
    }
    
    // Check for keyboard combinations
    const isCtrl = event.ctrlKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;
    const key = event.key.toLowerCase();
    
    // Convert the event to our shortcut format
    let shortcutPressed = '';
    if (isCtrl) shortcutPressed += 'Ctrl+';
    if (isShift) shortcutPressed += 'Shift+';
    if (isAlt) shortcutPressed += 'Alt+';
    shortcutPressed += event.key;
    
    // Execute the callback if the shortcut is registered
    Object.keys(globalShortcuts).forEach(shortcut => {
      if (shortcut.toLowerCase() === shortcutPressed.toLowerCase()) {
        event.preventDefault();
        globalShortcuts[shortcut].callback();
      }
    });
  }, []);
  
  // Add and remove event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Function to get all registered shortcuts
export function getAllShortcuts(): Shortcut[] {
  return Object.keys(globalShortcuts).map(key => ({
    key,
    callback: globalShortcuts[key].callback,
    description: globalShortcuts[key].description,
  }));
}
