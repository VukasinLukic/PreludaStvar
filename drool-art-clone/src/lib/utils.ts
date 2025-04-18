import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a filename or slug to a more readable name
 * Example: "bangBang" -> "Bang Bang", "IDEPETAK" -> "Idepetak"
 */
export function formatName(filename: string): string {
  // Convert to lowercase, except keep uppercase words
  const name = filename
    .replace(/([A-Z])/g, ' $1')
    .replace(/([0-9])/g, ' $1')
    .trim();
    
  // Capitalize first letter of each word
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

/**
 * Helper utility functions for the application
 */

/**
 * Ensure alt text is always present for images.
 * Falls back to a default if empty.
 */
export function ensureAltText(alt: string | undefined, fallback: string): string {
  if (!alt || alt.trim() === '') {
    return fallback;
  }
  return alt;
}

/**
 * Format string as title case (capitalize first letter of each word)
 * @param str Input string
 * @returns String in title case format
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * Format a price number as currency string
 * @param price Price value
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()} RSD`;
}
