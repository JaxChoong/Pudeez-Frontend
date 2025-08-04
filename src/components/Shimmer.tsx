import type React from "react"
import { cn } from "@/lib/utils"

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Shimmer = ({ className, ...props }: ShimmerProps) => (
  <div className={cn("shimmer-loading", className)} {...props} />
)

export default Shimmer