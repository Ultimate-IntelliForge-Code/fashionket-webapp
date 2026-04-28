import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-mmp-primary text-white hover:bg-mmp-primary/90 shadow-sm transition-all hover:shadow-md",
        destructive: "bg-mmp-accent text-white hover:bg-mmp-accent/90 focus-visible:ring-mmp-accent/20 dark:focus-visible:ring-mmp-accent/40 shadow-sm",
        outline: "border-2 border-mmp-primary2 bg-transparent text-mmp-primary hover:bg-mmp-primary2/10 hover:text-mmp-primary dark:border-mmp-primary2/50 dark:hover:bg-mmp-primary2/20",
        secondary: "bg-mmp-secondary text-white hover:bg-mmp-secondary/80 shadow-sm",
        ghost: "border border-transparent text-mmp-primary hover:bg-mmp-primary2/10 hover:text-mmp-primary dark:hover:bg-mmp-primary2/20",
        link: "text-mmp-primary underline-offset-4 hover:underline hover:text-mmp-primary/80",
        accent: "bg-mmp-neutral text-white hover:bg-mmp-neutral/90 shadow-sm transition-all hover:shadow-md",
        muted: "bg-mmp-primary2/20 text-mmp-primary hover:bg-mmp-primary2/30 dark:bg-mmp-primary2/10",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }