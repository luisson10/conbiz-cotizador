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

export function formatMoney(value: number, currency: CurrencyCode, exchangeRate: number | null) {
  const converted = currency === "MXN" && exchangeRate ? value * exchangeRate : value;
  const displayCurrency = currency === "MXN" && exchangeRate ? "MXN" : "USD";
  return new Intl.NumberFormat(displayCurrency === "MXN" ? "es-MX" : "en-US", {
    style: "currency",
    currency: displayCurrency,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function toDisplayValue(value: number, currency: CurrencyCode, exchangeRate: number | null) {
  if (!Number.isFinite(value)) return "";
  if (currency === "MXN" && exchangeRate) return (value * exchangeRate).toFixed(4);
  return value.toString();
}
