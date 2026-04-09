/**
 * Button bileşeni
 * Birincil (altın gradyan), outline ve ghost varyantlarını destekler.
 * Yükleme durumu, boyut seçenekleri ve href ile Link desteği içerir.
 * Premium: glow shadow, scale hover, focus ring.
 */
"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

interface ButtonAsLink
  extends BaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-glow-secondary)] hover:scale-[1.02] disabled:from-secondary-300 disabled:to-secondary-300 focus-visible:ring-secondary-500",
  outline:
    "border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02] disabled:border-primary-100 disabled:text-primary-300 focus-visible:ring-secondary-500",
  ghost:
    "text-primary-600 hover:bg-primary-50 hover:scale-[1.02] disabled:text-primary-300 focus-visible:ring-secondary-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100 select-none";

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading ? "scale-100 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
        />
      )}
      {children}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(linkRest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
      >
        {content}
      </Link>
    );
  }

  const { ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      disabled={
        (buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled ||
        loading
      }
      className={classes}
      {...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
