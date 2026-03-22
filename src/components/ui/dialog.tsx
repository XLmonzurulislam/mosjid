import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg scale-100 p-6 opacity-100 transition-all">
        <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export function DialogContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 sm:p-8", className)}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-6", className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-2xl font-bold font-display text-foreground", className)}>
      {children}
    </h2>
  )
}
