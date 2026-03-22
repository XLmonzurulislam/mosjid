import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'default' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50",
      ghost: "hover:bg-primary/10 text-primary",
      danger: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/90 hover:shadow-xl hover:-translate-y-0.5"
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      default: "h-12 px-6 py-2",
      lg: "h-14 px-8 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
