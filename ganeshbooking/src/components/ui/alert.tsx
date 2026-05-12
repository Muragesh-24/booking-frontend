import * as React from "react";

import { cn } from "@/lib/utils";

function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-amber-950/10 bg-white/80 px-4 py-3 text-stone-900 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-semibold text-stone-950", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-1 text-sm text-stone-600", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };