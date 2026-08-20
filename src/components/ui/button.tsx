import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex min-h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-eucalypt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalypt disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
