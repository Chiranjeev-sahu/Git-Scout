import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react"

import { cn } from "@/lib/utils"
import { MoveRight } from "lucide-react"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 200,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "group inline-flex items-center justify-center px-4 py-1 m-2.5 max-w-md rounded-lg bg-slate-500 border text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text text-transparent bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        "bg-linear-to-r from-transparent via-black/90 via-50% to-transparent dark:via-white/80",

        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1 ">
        {children}
        <MoveRight size={14} className="transition-transform duration-300 ease-in-out text-slate-500 group-hover:translate-x-1.5" />
      </span>
    </span>
  )
}
