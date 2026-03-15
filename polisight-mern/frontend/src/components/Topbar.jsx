import { useState, useRef, useEffect } from 'react';
import { useTheme }     from '../context/ThemeContext';
import { usePolitical } from '../context/PoliticalContext';
import { getCountries, getStates, getParties, POLITICAL_DATA } from '../data/politicalData';
import './Topbar.css';

const PAGE_TITLES = {
  dashboard:'Dashboard', news:'News Feed', mastodon:'Mastodon',
  trends:'Trends & Analysis', timeline:'Timeline', settings:'Settings',
};

const countries = getCountries();

function PoliticalDropdown() {
  const {
    countryCode, state, party, hasSelection,
    selectCountry, selectState, selectParty,
    clearAll, resetState, resetParty,
  } = usePolitical();

  const [open,          setOpen]          = useState(false);
  const [step,          setStep]          = useState('country');
  const [countrySearch, setCountrySearch] = useState('');
  const dropRef = useRef(null);

  const currentCountry = countryCode ? POLITICAL_DATA[countryCode] : null;
  const states   = countryCode ? getStates(countryCode)  : [];
  const parties  = countryCode ? getParties(countryCode) : [];
  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openDrop = () => { setOpen(o => !o); setStep('country'); setCountrySearch(''); };

  const handleCountry = (code) => { selectCountry(code); setStep('state'); setCountrySearch(''); };
  const handleState   = (s)    => { selectState(s);      setStep('party'); };
  const handleParty   = (p)    => { selectParty(p);      setOpen(false); setStep('country'); };
  const handleSkipState = ()   => { resetState();        setStep('party'); };
  const handleSkipParty = ()   => { resetParty();        setOpen(false); setStep('country'); };
  const handleBack = () => { if (step==='party') setStep('state'); else if (step==='state') setStep('country'); };

  const handleClear = (e) => { e.stopPropagation(); clearAll(); setOpen(false); };

  // Build label
  let label = 'Select Country';
  if (currentCountry) {
    if (party)       label = `${currentCountry.flag} ${party.short}`;
    else if (state)  label = `${currentCountry.flag} ${state.length > 14 ? state.slice(0,13)+'…' : state}`;
    else             label = `${currentCountry.flag} ${currentCountry.name}`;
  }

  return (
    <div className="polidrop-wrap" ref={dropRef}>
      <button
        className={`polidrop-trigger${open?' open':''}${hasSelection?' filtered':''}`}
        onClick={openDrop}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
        <span className="polidrop-label">{label}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11" className={`polidrop-caret${open?' up':''}`}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
        {hasSelection && (
          <span className="polidrop-clear" onClick={handleClear} title="Clear filter">
            <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </span>
        )}
      </button>

      {open && (
        <div className="polidrop-panel animate-slideDown">
          {/* Steps header */}
          <div className="polidrop-header">
            <div className="polidrop-steps">
              {['country','state','party'].map((s,i) => (
                <span key={s} className={`polidrop-step${step===s?' active':i<['country','state','party'].indexOf(step)?' done':''}`}>
                  {i+1}. {s.charAt(0).toUpperCase()+s.slice(1)}
                </span>
              ))}
            </div>
            <div className="polidrop-header-actions">
              {step !== 'country' && <button className="polidrop-back" onClick={handleBack}>← Back</button>}
              {hasSelection && <button className="polidrop-clear-btn" onClick={handleClear}>Clear all</button>}
            </div>
          </div>

          {/* Country step */}
          {step === 'country' && (
            <div className="polidrop-body">
              <div className="polidrop-search-wrap">
                <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" className="polidrop-search-icon">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                <input
                  className="polidrop-search"
                  placeholder="Search country…"
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="polidrop-list">
                {filtered.map(c => (
                  <button
                    key={c.code}
                    className={`polidrop-item${countryCode===c.code?' selected':''}`}
                    onClick={() => handleCountry(c.code)}
                  >
                    <span className="polidrop-flag">{c.flag}</span>
                    <span className="polidrop-name">{c.name}</span>
                    {countryCode === c.code && <span className="polidrop-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* State step */}
          {step === 'state' && (
            <div className="polidrop-body">
              <div className="polidrop-context">
                <span>{currentCountry?.flag} {currentCountry?.name}</span>
              </div>
              <div className="polidrop-list">
                <button className="polidrop-item polidrop-skip" onClick={handleSkipState}>
                  <span>🌐</span><span>All states / national</span>
                  <span className="polidrop-skip-badge">Skip</span>
                </button>
                {states.map(s => (
                  <button key={s} className={`polidrop-item${state===s?' selected':''}`} onClick={() => handleState(s)}>
                    <span className="polidrop-state-icon">📍</span>
                    <span className="polidrop-name">{s}</span>
                    {state === s && <span className="polidrop-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Party step */}
          {step === 'party' && (
            <div className="polidrop-body">
              <div className="polidrop-context">
                <span>{currentCountry?.flag} {currentCountry?.name}</span>
                {state && <><span className="polidrop-context-sep">›</span><span>{state}</span></>}
              </div>
              <div className="polidrop-list">
                <button className="polidrop-item polidrop-skip" onClick={handleSkipParty}>
                  <span>🏛️</span><span>All parties</span>
                  <span className="polidrop-skip-badge">Skip</span>
                </button>
                {parties.map(p => (
                  <button key={p.short} className={`polidrop-item${party?.short===p.short?' selected':''}`} onClick={() => handleParty(p)}>
                    <span className="polidrop-party-dot" style={{ background:p.color }}/>
                    <span className="polidrop-name">{p.name}</span>
                    <span className="polidrop-short">{p.short}</span>
                    {party?.short === p.short && <span className="polidrop-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Topbar({ page, onRefresh, loading, onSearch, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => { e.preventDefault(); if (searchVal.trim()) onSearch(searchVal.trim()); };
  const clearSearch  = ()  => { setSearchVal(''); onSearch(''); };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{PAGE_TITLES[page] || 'PoliSight'}</h1>
        <div className="topbar-divider" />
        <PoliticalDropdown />
      </div>

      <div className="topbar-center">
        <form className="topbar-search" onSubmit={handleSearch}>
          <svg className="topbar-search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search politics: election, senate, BJP…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
          {searchVal && <button type="button" className="topbar-search-clear" onClick={clearSearch}>✕</button>}
        </form>
      </div>

      <div className="topbar-right">
        <button className={`btn-icon topbar-refresh${loading?' loading':''}`} onClick={onRefresh} disabled={loading} title="Refresh">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={loading?{animation:'spin 0.7s linear infinite'}:{}}>
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
        </button>
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark'
            ? <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>
            : <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
          }
        </button>
        <button className="btn-icon topbar-logout" onClick={onLogout} title="Sign out">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
