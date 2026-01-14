import { type ClassValue, clsx } from 'clsx'

// Simple cn utility without tailwind-merge for now
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Lerp function for smooth transitions
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

// Clamp function
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Map range function
export function mapRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin
}

// Ease out cubic
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Ease in out cubic
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
