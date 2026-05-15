import { cn } from "@/src/utlis/utils";

const Container = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("container mx-auto px-4 md:px-6 py-5", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
