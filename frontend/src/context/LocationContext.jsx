import { createContext, useContext, useState } from 'react';

// ─── DATA ───
export const COUNTRIES = {
  global: { name: 'Global', flag: '🌐', states: [], parties: [] },
  india: {
    name: 'India', flag: '🇮🇳',
    states: [
      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
      'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
      'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
      'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
      'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
    ],
    parties: ['BJP','INC','AAP','TMC','SP','BSP','DMK','AIADMK','NCP','SS','TDP','YSR Congress','BRS','JD(U)','CPI(M)'],
  },
  us: {
    name: 'United States', flag: '🇺🇸',
    states: [
      'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
      'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
      'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
      'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
      'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
      'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
      'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
      'Wisconsin','Wyoming','Washington D.C.',
    ],
    parties: ['Republican Party','Democratic Party','Libertarian Party','Green Party','Independent'],
  },
  uk: {
    name: 'United Kingdom', flag: '🇬🇧',
    states: ['England','Scotland','Wales','Northern Ireland'],
    parties: ['Conservative Party','Labour Party','Liberal Democrats','SNP','Green Party','Reform UK','Plaid Cymru'],
  },
  germany: {
    name: 'Germany', flag: '🇩🇪',
    states: ['Bavaria','North Rhine-Westphalia','Baden-Württemberg','Lower Saxony','Hesse','Saxony','Berlin','Hamburg','Bremen','Brandenburg','Saxony-Anhalt','Thuringia','Rhineland-Palatinate','Saarland','Mecklenburg-Vorpommern','Schleswig-Holstein'],
    parties: ['CDU/CSU','SPD','Greens','FDP','AfD','Die Linke','BSW'],
  },
  france: {
    name: 'France', flag: '🇫🇷',
    states: ['Île-de-France','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine','Occitanie','Grand Est','Hauts-de-France','Provence-Alpes-Côte d\'Azur','Pays de la Loire','Normandie','Bretagne','Bourgogne-Franche-Comté','Centre-Val de Loire','Corse'],
    parties: ['Renaissance','Rassemblement National','La France Insoumise','Parti Socialiste','Les Républicains','Europe Écologie Les Verts'],
  },
  brazil: {
    name: 'Brazil', flag: '🇧🇷',
    states: ['São Paulo','Rio de Janeiro','Minas Gerais','Bahia','Paraná','Rio Grande do Sul','Pernambuco','Ceará','Pará','Maranhão','Amazonas','Goiás','Espírito Santo','Mato Grosso','Mato Grosso do Sul','Paraíba','Rio Grande do Norte','Piauí','Alagoas','Sergipe','Rondônia','Tocantins','Acre','Amapá','Roraima','Distrito Federal'],
    parties: ['PT','PL','União Brasil','PP','MDB','PSD','Republicanos','Podemos','PSDB'],
  },
  australia: {
    name: 'Australia', flag: '🇦🇺',
    states: ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','Australian Capital Territory','Northern Territory'],
    parties: ['Labor Party','Liberal Party','National Party','Greens','One Nation','United Australia Party'],
  },
  canada: {
    name: 'Canada', flag: '🇨🇦',
    states: ['Ontario','Quebec','British Columbia','Alberta','Manitoba','Saskatchewan','Nova Scotia','New Brunswick','Newfoundland and Labrador','Prince Edward Island','Northwest Territories','Yukon','Nunavut'],
    parties: ['Liberal Party','Conservative Party','NDP','Bloc Québécois','Green Party'],
  },
  pakistan: {
    name: 'Pakistan', flag: '🇵🇰',
    states: ['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Gilgit-Baltistan','Azad Kashmir','Islamabad Capital Territory'],
    parties: ['PTI','PML-N','PPP','MQM','JUI-F','ANP'],
  },
  china: {
    name: 'China', flag: '🇨🇳',
    states: ['Beijing','Shanghai','Guangdong','Sichuan','Zhejiang','Jiangsu','Hubei','Hunan','Shandong','Yunnan','Xinjiang','Tibet','Inner Mongolia','Heilongjiang','Liaoning'],
    parties: ['Chinese Communist Party'],
  },
  russia: {
    name: 'Russia', flag: '🇷🇺',
    states: ['Moscow','Saint Petersburg','Novosibirsk Oblast','Yekaterinburg Oblast','Tatarstan','Chechen Republic','Krasnodar Krai','Sverdlovsk Oblast','Rostov Oblast','Nizhny Novgorod Oblast'],
    parties: ['United Russia','LDPR','KPRF','Just Russia','New People'],
  },
  japan: {
    name: 'Japan', flag: '🇯🇵',
    states: ['Tokyo','Osaka','Kanagawa','Aichi','Saitama','Chiba','Hyogo','Hokkaido','Fukuoka','Shizuoka','Ibaraki','Hiroshima','Kyoto','Miyagi','Niigata'],
    parties: ['LDP','CDP','Komeito','Nippon Ishin','DPP','JCP','Reiwa Shinsengumi'],
  },
  southafrica: {
    name: 'South Africa', flag: '🇿🇦',
    states: ['Gauteng','KwaZulu-Natal','Western Cape','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'],
    parties: ['ANC','DA','EFF','MK Party','IFP','UDM','PAC'],
  },
  nigeria: {
    name: 'Nigeria', flag: '🇳🇬',
    states: ['Lagos','Kano','Rivers','Oyo','Katsina','Borno','Ogun','Kaduna','Anambra','Delta','Imo','Edo','Ondo','Enugu','Akwa Ibom','Benue','Niger','Plateau','Abia','Sokoto','FCT Abuja'],
    parties: ['APC','PDP','LP','NNPP','APGA'],
  },
  indonesia: {
    name: 'Indonesia', flag: '🇮🇩',
    states: ['Java','Sumatra','Kalimantan','Sulawesi','Papua','Bali','Nusa Tenggara','Maluku'],
    parties: ['Gerindra','PDIP','Golkar','PKB','Demokrat','PKS','Nasdem','PPP'],
  },
  eu: {
    name: 'European Union', flag: '🇪🇺',
    states: ['Germany','France','Italy','Spain','Poland','Netherlands','Belgium','Sweden','Austria','Denmark','Finland','Ireland','Portugal','Czech Republic','Romania','Hungary','Greece','Slovakia','Bulgaria','Croatia'],
    parties: ['EPP','S&D','ECR','Renew Europe','Greens/EFA','ID','The Left'],
  },
};

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [country, setCountry] = useState('india');
  const [state, setState] = useState('');
  const [party, setParty] = useState('');

  const countryData = COUNTRIES[country] || COUNTRIES.global;

  const setCountryAndReset = (c) => {
    setCountry(c);
    setState('');
    setParty('');
  };

  const setStateAndReset = (s) => {
    setState(s);
    setParty('');
  };

  // Build a context label for AI prompts
  const locationLabel = [
    countryData.name,
    state || null,
    party ? `(${party})` : null,
  ].filter(Boolean).join(' › ');

  return (
    <LocationContext.Provider value={{
      country, state, party,
      countryData,
      locationLabel,
      setCountry: setCountryAndReset,
      setState: setStateAndReset,
      setParty,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
