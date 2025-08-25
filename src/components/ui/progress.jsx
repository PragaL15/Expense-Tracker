import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export function Progress({ value, className }) {
  return (
    <ProgressPrimitive.Root
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-yellow-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  )
}
