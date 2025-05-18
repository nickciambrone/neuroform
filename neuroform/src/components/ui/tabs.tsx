"use client";
// Tabs.tsx - Core tabs components
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useId } from 'react';
import { cn } from "@/lib/utils";

// Context value for Tabs
interface TabsContextType {
  selected: string;
  onSelect: (value: string) => void;
  register: (value: string, ref: React.RefObject<HTMLElement>) => void;
  idPrefix: string;
  // store triggers for keyboard navigation
  triggers: React.MutableRefObject<{ value: string; ref: React.RefObject<HTMLElement> }[]>;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

/**
 * <Tabs> holds the state of the selected tab and provides context to triggers and panels.
 */
export const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  value,
  onValueChange,
  children,
}) => {
  const isControlled = value !== undefined;
  const [selected, setSelected] = useState(defaultValue);
  const triggersRef = useRef<{ value: string; ref: React.RefObject<HTMLElement> }[]>([]);
  // Unique prefix for ARIA IDs
  const idPrefix = useId();

  // Sync controlled value
  useEffect(() => {
    if (isControlled && value !== undefined) {
      setSelected(value);
    }
  }, [value, isControlled]);

  const onSelect = (val: string) => {
    if (!isControlled) {
      setSelected(val);
    }
    onValueChange?.(val);
  };

  // Register a trigger for keyboard nav
  const register = (value: string, ref: React.RefObject<HTMLElement>) => {
    triggersRef.current.push({ value, ref });
  };

  return (
    <TabsContext.Provider value={{ selected, onSelect, register, idPrefix, triggers: triggersRef }}>
      {children}
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

/**
 * <TabsList> is the container for tab buttons.
 * We use role="tablist" for ARIA and flex layout with spacing.
 */
export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div role="tablist" className={cn("flex space-x-2", className)}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

/**
 * <TabsTrigger> is the clickable/tabbable element for each tab.
 * It sets ARIA attributes and handles clicks/keys.
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("<TabsTrigger> must be inside <Tabs>");

  const { selected, onSelect, register, idPrefix, triggers } = context;
  const isSelected = selected === value;
  const ref = useRef<HTMLButtonElement>(null);

  // Register on mount
  useEffect(() => {
    register(value, ref);
  }, [value, register]);

  // Handle arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tabs = triggers.current;
    const currentIndex = tabs.findIndex(tab => tab.value === value);
    const lastIndex = tabs.length - 1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      }
      const nextTab = tabs[nextIndex];
      nextTab?.ref.current?.focus();
      onSelect(nextTab?.value || value);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      tabs[0]?.ref.current?.focus();
      onSelect(tabs[0]?.value);
    }
    if (e.key === 'End') {
      e.preventDefault();
      tabs[lastIndex]?.ref.current?.focus();
      onSelect(tabs[lastIndex]?.value);
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={`tabs-${idPrefix}-tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`tabs-${idPrefix}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles: padding, rounded pill, text size, and transition
        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
        // Active vs inactive styles
        isSelected
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

/**
 * <TabsContent> renders its children only if active.
 * It has role="tabpanel" and is linked via aria-labelledby.
 */
export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("<TabsContent> must be inside <Tabs>");

  const { selected, idPrefix } = context;
  if (selected !== value) return null;

  return (
    <div
      id={`tabs-${idPrefix}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tabs-${idPrefix}-tab-${value}`}
      tabIndex={0}
      className={cn("mt-4 transition-opacity duration-300 ease-in-out", className)}
    >
      {children}
    </div>
  );
};
