import { useState, useEffect, useCallback, useRef } from 'react';

const BASE     = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const memCache = new Map(); // in-memory stale-while-revalidate cache

/** Get the stored JWT (reads fresh each call so it's always current) */
const getToken = () => localStorage.getItem('ps-token');

export function useApi(endpoint, params = {}, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const key = endpoint + JSON.stringify(params);

  const fetchData = useCallback(async (force = false) => {
    // Serve stale data immediately from memory cache
    if (!force && memCache.has(key)) {
      setData(memCache.get(key));
      setLoading(false);
    } else {
      setLoading(true);
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
      ).toString();

      const url     = `${BASE}${endpoint}${qs ? '?' + qs : ''}`;
      const token   = getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { headers, signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      memCache.set(key, json);
      setData(json);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]); // eslint-disable-line

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [endpoint, ...deps]); // eslint-disable-line

  return { data, loading, error, refetch: () => fetchData(true) };
}

/** One-shot authenticated fetch helper */
export async function apiFetch(endpoint, options = {}) {
  const token   = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}
