import React from "react";
import { cn } from "@/src/utlis/utils";

const Section = React.memo(({ children, className, ...props }) => {
  return (
    <section className={cn("py-8 md:py-12", className)} {...props}>
      {children}
    </section>
  );
});

Section.displayName = "Section";

export default Section;
