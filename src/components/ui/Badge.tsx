/**
 * Badge bileşeni
 * Renk ve boyut varyantları ile haber/kategori etiketleri için kullanılır.
 * Premium: yumuşak arka plan tonları, font-medium, rounded-full.
 */

import React from "react";

export type BadgeColor = "blue" | "green" | "amber" | "purple" | "red";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
}

const colorClasses: Record<BadgeColor, string> = {
  blue:   "bg-blue-50   text-blue-700   ring-1 ring-blue-100",
  green:  "bg-green-50  text-green-700  ring-1 ring-green-100",
  amber:  "bg-amber-50  text-amber-700  ring-1 ring-amber-100",
  purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-100",
  red:    "bg-red-50    text-red-700    ring-1 ring-red-100",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
};

export default function Badge({
  color = "blue",
  size = "md",
  className = "",
  children,
}: BadgeProps) {
  const classes = [
    "inline-flex items-center font-medium rounded-full",
    colorClasses[color],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
