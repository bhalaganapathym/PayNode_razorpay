---
name: react-tailwind-components
description: Building high-performance, accessible, and responsive React 18+ components styled with Tailwind CSS.
---

# React & Tailwind CSS Component Architecture Skill

Guidelines for developing modular, composable, and accessible React 18+ components using Tailwind CSS and TypeScript.

## Core Principles
1. **TypeScript First**: Strict prop types, generic component definitions, and exhaustive discriminant unions.
2. **Tailwind Design System**: Consistent spacing scale, semantic color tokens, and responsive utility modifiers (`sm:`, `md:`, `lg:`).
3. **Compound Components**: Build flexible compound components with shared context (`Card`, `CardHeader`, `CardContent`, `CardFooter`).
4. **State & Effects**: Leverage React hooks (`useMemo`, `useCallback`, `useReducer`) to avoid unnecessary re-renders.

## Component Pattern Example

```tsx
import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isGlass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, isGlass = true, className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        isGlass ? "bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-xl" : "bg-slate-900 border border-slate-800",
        "hover:border-violet-500/40 hover:shadow-violet-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```
