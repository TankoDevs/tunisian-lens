import * as React from "react"

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export const Tooltip = ({ children, content }: { children: React.ReactNode, content: React.ReactNode }) => {
    return (
        <div className="group relative inline-flex justify-center items-center">
            {children}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-50">
                <div className="bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border px-3 py-1.5 whitespace-nowrap animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    {content}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-4 border-transparent border-t-border" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-solid border-[3px] border-transparent border-t-popover" />
                </div>
            </div>
        </div>
    )
}
