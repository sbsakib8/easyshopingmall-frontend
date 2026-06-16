import React from "react";
import { cn } from "@/src/utlis/utils";

const Container = React.memo(({ children, className, ...props }) => {
  return (
    <div
      className={cn("container mx-auto px-4 md:px-6 py-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = "Container";

export default Container;
