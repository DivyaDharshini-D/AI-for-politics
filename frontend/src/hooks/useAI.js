import { useState } from 'react';
import api from '../services/api';

export function useAI(endpoint = '/intelligence/run') {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (module, input, extra = {}) => {
    const trimmed = input?.trim();
    if (!trimmed) {
      setError('Please enter some text first.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await api.post(`${endpoint}/${module}`, {
        input: trimmed,
        ...extra,
      });
      setOutput(res.data.output || '');
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'Request failed';

      if (status === 503) {
        setError(msg);
      } else if (status === 400) {
        setError(`Configuration error: ${msg} - restart the backend server.`);
      } else if (status === 404) {
        setError('API route not found (404) - restart the backend server: cd backend && npm run dev');
      } else if (status === 500) {
        if (/status code 404|http 404|model unavailable|endpoint\/model unavailable/i.test(msg)) {
          setError('AI model endpoint unavailable. Restart backend to load model fallbacks, then try again.');
        } else {
          setError(`Server error: ${msg}`);
        }
      } else if (status === 429) {
        setError('Rate limit reached. Please wait 60 seconds before trying again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setOutput('');
    setError('');
  };

  return { output, loading, error, run, clear };
}
