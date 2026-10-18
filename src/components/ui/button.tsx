import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-lemon text-black font-semibold hover:bg-lemon-hover active:scale-[0.98] shadow-sm",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-border bg-transparent hover:bg-surface-elevated hover:border-lemon text-alabaster active:scale-[0.98]",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-muted hover:text-foreground",
                link: "text-lemon underline-offset-4 hover:underline",
                lemon: "bg-lemon hover:bg-lemon-hover text-black font-semibold shadow-sm active:scale-[0.98]",
                sand: "bg-lemon text-black font-semibold hover:bg-lemon-hover active:scale-[0.98]",
            },
            size: {
                default: "h-10 px-5 py-2 rounded-xl",
                sm: "h-8 rounded-xl px-3.5 text-xs",
                lg: "h-12 rounded-2xl px-8 text-sm font-semibold",
                icon: "h-10 w-10 rounded-full",
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

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
