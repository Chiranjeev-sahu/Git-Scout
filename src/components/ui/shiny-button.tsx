import React from "react"
import { motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"
import { Github } from "lucide-react"

const animationProps: MotionProps = {
  initial: { "--x": "100%", scale: 0.9 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.3,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 100,
      damping: 5,
      mass: 0.5,
    },
  },
}

interface ShinyButtonProps
  extends
  Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
  MotionProps {
  children: React.ReactNode
  className?: string
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative cursor-pointer rounded-sm border border-white/10 px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow bg-zinc-900 bg-[radial-gradient(circle_at_50%_0%,var(--primary)/20%,transparent_60%)]",
        className
      )}
      {...animationProps}
      {...props}
    >
      <span
        className="relative flex items-center justify-center gap-2 size-full text-md tracking-wide font-bold text-white/90 uppercase"
        style={{
          maskImage:
            "linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
        }}
      >
        {children}
        <Github className="font-bold text-white/90" size={18} />
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          WebkitMask:
            "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          backgroundImage:
            "linear-gradient(-75deg,var(--primary)/10% calc(var(--x)+20%),var(--primary)/50% calc(var(--x)+25%),var(--primary)/10% calc(var(--x)+100%))",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] p-px"
      />
    </motion.button>
  )
})

ShinyButton.displayName = "ShinyButton"
