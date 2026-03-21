import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrencyCode = "USD" | "MXN";

export function formatCurrency(value: number, currency: CurrencyCode = "USD") {
  const locale = currency === "MXN" ? "es-MX" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}
