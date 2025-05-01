
import { useEffect, useCallback, useRef } from 'react';

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

// Global shortcuts registry - use window to ensure it's globally available
if (typeof window !== 'undefined') {
  if (!window.globalShortcuts) {
    window.globalShortcuts = {};
  }
}

/**
 * Custom hook for registering keyboard shortcuts
 * 
 * @param key Keyboard shortcut (e.g. "Ctrl+K", "Shift+/")
 * @param callback Function to execute when shortcut is triggered
 * @param description Description of what the shortcut does (for help modal)
 */
export function useHotkeys(key: string, callback: () => void, description: string) {
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Register shortcut in the global registry
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.globalShortcuts[key] = { 
        callback: () => callbackRef.current(), 
        description 
      };
      
      return () => {
        delete window.globalShortcuts[key];
      };
    }
  }, [key, description]);
}

// Key handler defined outside of hook to avoid recreating on each render
const handleKeyDown = (event: KeyboardEvent) => {
  if (typeof window === 'undefined') return;
  
  // Skip if any modal is open (indicated by a dialog element)
  const isModalOpen = document.querySelector('[role="dialog"]') !== null;
  
  // Don't trigger shortcuts when typing in input elements
  // except for explicitly allowed ones like "?" or "Shift+/"
  if (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLSelectElement
  ) {
    // The only exceptions are global shortcuts like "?" or "Shift+/"
    if (!(event.key === '?' || (event.key === '/' && event.shiftKey))) {
      return;
    }
  }
  
  // Check for keyboard combinations
  const isCtrl = event.ctrlKey;
  const isShift = event.shiftKey;
  const isAlt = event.altKey;
  
  // Convert the event to our shortcut format
  let shortcutPressed = '';
  if (isCtrl) shortcutPressed += 'Ctrl+';
  if (isShift) shortcutPressed += 'Shift+';
  if (isAlt) shortcutPressed += 'Alt+';
  shortcutPressed += event.key;
  
  // Execute the callback if the shortcut is registered
  Object.keys(window.globalShortcuts || {}).forEach(shortcut => {
    if (shortcut.toLowerCase() === shortcutPressed.toLowerCase()) {
      event.preventDefault();
      
      // If we're in a modal, only allow the ? shortcut
      if (isModalOpen && shortcut !== '?' && shortcut !== 'Shift+?') {
        return;
      }
      
      window.globalShortcuts[shortcut].callback();
    }
  });
};

// Add a global event listener for all keyboard shortcuts
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', handleKeyDown);
}

// Function to get all registered shortcuts
export function getAllShortcuts(): Shortcut[] {
  if (typeof window === 'undefined') return [];
  
  return Object.keys(window.globalShortcuts || {}).map(key => ({
    key,
    callback: window.globalShortcuts[key].callback,
    description: window.globalShortcuts[key].description,
  }));
}

// Add the global shortcut registry to the window object
declare global {
  interface Window {
    globalShortcuts: ShortcutsMap;
  }
}
