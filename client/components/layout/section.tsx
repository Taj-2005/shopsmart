import type { HTMLAttributes } from "react";
import { Container } from "./container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "aside" | "div";
  containerClassName?: string;
}

export function Section({
  as: Tag = "section",
  className = "",
  containerClassName = "",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={`py-16 sm:py-24 lg:py-28 ${className}`} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  );
}
