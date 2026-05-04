import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "spotify";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-none text-[11px] font-black uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px]",
          {
            "bg-[#1DB954] text-black hover:bg-white hover:text-black": variant === "spotify",
            "bg-white text-black hover:bg-[#1DB954] hover:text-black": variant === "default",
            "border border-white/20 bg-transparent hover:border-[#1DB954] hover:text-[#1DB954] text-white": variant === "outline",
            "hover:bg-white/5 text-white/40 hover:text-white": variant === "ghost",
            "text-white underline-offset-4 hover:underline": variant === "link",
            "h-12 px-8 py-3": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-10 text-xs": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
