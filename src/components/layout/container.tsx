import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      default: "max-w-6xl",
      narrow: "max-w-4xl",
      prose: "max-w-3xl",
      wide: "max-w-7xl",
      full: "max-w-full",
    },
    padding: {
      default: "px-4 sm:px-6 lg:px-8",
      compact: "px-4 sm:px-5",
      none: "px-0",
    },
    gutter: {
      none: "",
      page: "pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32",
      section: "py-12 sm:py-16 lg:py-20",
      compact: "py-6 sm:py-8",
    },
  },
  defaultVariants: {
    size: "default",
    padding: "default",
    gutter: "page",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

export function Container({
  as: Component = "div",
  size,
  padding,
  gutter,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      data-slot="container"
      className={cn(containerVariants({ size, padding, gutter }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
