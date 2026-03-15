import { createContext, useContext, useState, useCallback } from 'react';
import { buildSearchQuery, getNewsCountryCode } from '../data/politicalData';

const PoliticalContext = createContext();

export function PoliticalProvider({ children }) {
  // Start with null — user must explicitly pick a country
  const [countryCode, setCountryCode] = useState(null);
  const [state,       setState]       = useState(null);
  const [party,       setParty]       = useState(null);

  const clearAll     = useCallback(() => { setCountryCode(null); setState(null); setParty(null); }, []);
  const resetState   = useCallback(() => { setState(null); setParty(null); }, []);
  const resetParty   = useCallback(() => setParty(null), []);

  const selectCountry = useCallback((code) => {
    setCountryCode(code); setState(null); setParty(null);
  }, []);
  const selectState = useCallback((s) => { setState(s); setParty(null); }, []);
  const selectParty = useCallback((p) => setParty(p), []);

  // Derived values — fall back to 'us'/'politics' when nothing selected
  const activeCountry  = countryCode || 'US';
  const searchQuery    = buildSearchQuery({ countryCode: activeCountry, state, party });
  const newsCountry    = getNewsCountryCode(activeCountry);
  const hasSelection   = !!(countryCode || state || party);

  return (
    <PoliticalContext.Provider value={{
      countryCode, state, party, hasSelection,
      activeCountry, searchQuery, newsCountry,
      selectCountry, selectState, selectParty,
      clearAll, resetState, resetParty,
    }}>
      {children}
    </PoliticalContext.Provider>
  );
}

export const usePolitical = () => useContext(PoliticalContext);
