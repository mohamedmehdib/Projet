"use client";

import { useRef, MouseEvent } from "react";

interface RippleButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
}

export default function RippleButton({
  href,
  onClick,
  className = "",
  children,
  type = "button",
  disabled,
  target,
  rel,
}: RippleButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleRipple = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      border-radius:50%;background:rgba(255,255,255,0.25);
      transform:scale(0);animation:rippleAnim 0.55s linear;
      pointer-events:none;
    `;
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  const combinedClick = (e: MouseEvent<HTMLElement>) => {
    handleRipple(e);
    onClick?.();
  };

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={combinedClick}
        className={className}
        target={target}
        rel={rel}
      >
        {children}
        <style>{`@keyframes rippleAnim{to{transform:scale(1);opacity:0}}`}</style>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={combinedClick}
      className={className}
      disabled={disabled}
    >
      {children}
      <style>{`@keyframes rippleAnim{to{transform:scale(1);opacity:0}}`}</style>
    </button>
  );
}

