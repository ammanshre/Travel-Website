import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";  // Importing format from date-fns

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function convertEuroToMUR(euro: number) {
  return euro * 50;
}


export { format }; 