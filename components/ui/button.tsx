import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-rose-700 to-violet-600 text-white shadow-lg shadow-rose-700/25 hover:shadow-xl hover:shadow-rose-700/35 hover:-translate-y-0.5",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-2 border-rose-700 bg-white text-rose-700 hover:bg-pink-50",
        secondary: "bg-white border-2 border-rose-700 text-rose-700 hover:bg-pink-50",
        ghost: "hover:bg-pink-50 text-rose-700",
        link: "text-violet-600 underline-offset-4 hover:underline hover:text-rose-700 font-semibold",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
