import { cn } from "@/src/utlis/utils";

const Section = ({ children, className, ...props }) => {
  return (
    <section className={cn("py-8 md:py-12", className)} {...props}>
      {children}
    </section>
  );
};

export default Section;
