"use client";

import { useEffect, useState } from "react";

type UseExchangeRateOptions = {
  enabled?: boolean;
};

type ExchangeRateResult = {
  exchangeRate: number | null;
  exchangeRateDate: string | null;
  exchangeRateSource: string | null;
  isFallback: boolean;
  loading: boolean;
};

export function useExchangeRate({ enabled = true }: UseExchangeRateOptions = {}): ExchangeRateResult {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRateDate, setExchangeRateDate] = useState<string | null>(null);
  const [exchangeRateSource, setExchangeRateSource] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;
    setLoading(true);

    async function loadExchangeRate() {
      try {
        const response = await fetch("/api/exchange-rate", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Exchange rate unavailable");
        }

        const data = (await response.json()) as {
          rate: number | null;
          date: string | null;
          source: string | null;
          fallback?: boolean;
        };

        if (!ignore) {
          setExchangeRate(data.rate);
          setExchangeRateDate(data.date ?? null);
          setExchangeRateSource(data.source ?? null);
          setIsFallback(data.fallback ?? false);
        }
      } catch {
        if (!ignore) {
          setExchangeRate(null);
          setExchangeRateDate(null);
          setExchangeRateSource(null);
          setIsFallback(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadExchangeRate();

    return () => {
      ignore = true;
    };
  }, [enabled]);

  return { exchangeRate, exchangeRateDate, exchangeRateSource, isFallback, loading };
}
