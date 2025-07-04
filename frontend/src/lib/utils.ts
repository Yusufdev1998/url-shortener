import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function aliasToURL(alias: string) {
  return `${import.meta.env.VITE_BASE_URL}/${alias}`;
}
