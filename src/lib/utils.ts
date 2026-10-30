import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "N/A"
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString
  return format(date, "MMM dd, yyyy HH:mm:ss")
}

export function formatTimeAgo(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "N/A"
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString
  return formatDistanceToNow(date, { addSuffix: true })
}

export function serializeCursor(
  cursorObj: Record<string, unknown> | null
): string | undefined {
  if (!cursorObj) return undefined
  return JSON.stringify(cursorObj)
}
