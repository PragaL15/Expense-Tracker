import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export function Progress({ value, className }) {
  return (
    <ProgressPrimitive.Root
      className={`relative h-2 w-full overflow-hidden rounded-full bg-[#fefae0] ${className}`}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-[#3a5a40] transition-all"
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  )
}
 //text-[#fefae0]