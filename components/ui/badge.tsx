import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-50 to-amber-50 text-rose-700 border border-rose-200/50",
        genre: "bg-gradient-to-r from-pink-50 to-amber-50 text-rose-700 border border-rose-200/50",
        sweet: "bg-emerald-500 text-white",
        warm: "bg-amber-500 text-white",
        hot: "bg-red-500 text-white",
        scorching: "bg-rose-700 text-white",
        premium: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300",
        outline: "border-2 border-rose-700 text-rose-700 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
