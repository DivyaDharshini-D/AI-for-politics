// ─────────────────────────────────────────────────────────────────────────────
// PoliSight — Political Geography & Parties Dataset
// Countries → States/Provinces → Political Parties
// ─────────────────────────────────────────────────────────────────────────────

export const POLITICAL_DATA = {
  US: {
    name: "United States",
    flag: "🇺🇸",
    code: "us",
    newsCode: "us",
    states: [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
      "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
      "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
      "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
      "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
      "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
      "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
      "Wisconsin","Wyoming","Washington D.C."
    ],
    parties: [
      { name: "Democratic Party",     short: "DEM", color: "#2563eb", searchTerm: "Democratic Party USA" },
      { name: "Republican Party",     short: "GOP", color: "#dc2626", searchTerm: "Republican Party USA" },
      { name: "Green Party",          short: "GRN", color: "#16a34a", searchTerm: "Green Party USA" },
      { name: "Libertarian Party",    short: "LIB", color: "#ca8a04", searchTerm: "Libertarian Party USA" },
      { name: "Independent",          short: "IND", color: "#7c3aed", searchTerm: "Independent politicians USA" },
    ],
  },
  IN: {
    name: "India",
    flag: "🇮🇳",
    code: "in",
    newsCode: "in",
    states: [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
      "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
      "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
      "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
      "Uttar Pradesh","Uttarakhand","West Bengal",
      "Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
      "Dadra & Nagar Haveli","Lakshadweep","Andaman & Nicobar"
    ],
    parties: [
      { name: "Bharatiya Janata Party", short: "BJP", color: "#f97316", searchTerm: "BJP India news" },
      { name: "Indian National Congress", short: "INC", color: "#2563eb", searchTerm: "Congress party India" },
      { name: "Aam Aadmi Party",        short: "AAP", color: "#0ea5e9", searchTerm: "AAP Aam Aadmi Party India" },
      { name: "Shiv Sena",              short: "SS",  color: "#f59e0b", searchTerm: "Shiv Sena India" },
      { name: "Samajwadi Party",        short: "SP",  color: "#ef4444", searchTerm: "Samajwadi Party India" },
      { name: "Bahujan Samaj Party",    short: "BSP", color: "#3b82f6", searchTerm: "BSP Bahujan Samaj Party India" },
      { name: "Trinamool Congress",     short: "TMC", color: "#22c55e", searchTerm: "Trinamool Congress India" },
      { name: "Dravida Munnetra Kazhagam", short: "DMK", color: "#dc2626", searchTerm: "DMK Tamil Nadu India" },
      { name: "AIADMK",                 short: "ADMK",color: "#7c3aed", searchTerm: "AIADMK Tamil Nadu India" },
      { name: "NCP",                    short: "NCP", color: "#0891b2", searchTerm: "NCP Nationalist Congress Party India" },
    ],
  },
  GB: {
    name: "United Kingdom",
    flag: "🇬🇧",
    code: "gb",
    newsCode: "gb",
    states: [
      "England","Scotland","Wales","Northern Ireland",
      "London","South East","South West","East of England","East Midlands",
      "West Midlands","Yorkshire","North West","North East"
    ],
    parties: [
      { name: "Labour Party",          short: "LAB", color: "#dc2626", searchTerm: "Labour Party UK" },
      { name: "Conservative Party",    short: "CON", color: "#2563eb", searchTerm: "Conservative Party UK" },
      { name: "Liberal Democrats",     short: "LD",  color: "#f59e0b", searchTerm: "Liberal Democrats UK" },
      { name: "Scottish National Party", short: "SNP", color: "#f59e0b", searchTerm: "SNP Scotland UK" },
      { name: "Green Party",           short: "GRN", color: "#16a34a", searchTerm: "Green Party UK" },
      { name: "Reform UK",             short: "REF", color: "#06b6d4", searchTerm: "Reform UK party" },
      { name: "Plaid Cymru",           short: "PC",  color: "#16a34a", searchTerm: "Plaid Cymru Wales UK" },
    ],
  },
  DE: {
    name: "Germany",
    flag: "🇩🇪",
    code: "de",
    newsCode: "de",
    states: [
      "Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg",
      "Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia",
      "Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt",
      "Schleswig-Holstein","Thuringia"
    ],
    parties: [
      { name: "CDU/CSU",               short: "CDU", color: "#2563eb", searchTerm: "CDU CSU Germany" },
      { name: "SPD",                   short: "SPD", color: "#dc2626", searchTerm: "SPD Social Democrats Germany" },
      { name: "Greens (Grüne)",        short: "GRN", color: "#16a34a", searchTerm: "Greens Germany Grüne" },
      { name: "FDP",                   short: "FDP", color: "#f59e0b", searchTerm: "FDP Free Democrats Germany" },
      { name: "AfD",                   short: "AfD", color: "#06b6d4", searchTerm: "AfD Alternative Germany" },
      { name: "Die Linke",             short: "LNK", color: "#9333ea", searchTerm: "Die Linke Germany" },
    ],
  },
  FR: {
    name: "France",
    flag: "🇫🇷",
    code: "fr",
    newsCode: "fr",
    states: [
      "Île-de-France","Auvergne-Rhône-Alpes","Hauts-de-France","Nouvelle-Aquitaine",
      "Occitanie","Grand Est","Pays de la Loire","Normandie","Bretagne",
      "Provence-Alpes-Côte d'Azur","Bourgogne-Franche-Comté","Centre-Val de Loire",
      "Corse","Overseas Territories"
    ],
    parties: [
      { name: "Renaissance (En Marche)", short: "REN", color: "#f59e0b", searchTerm: "Macron Renaissance France" },
      { name: "Rassemblement National", short: "RN",  color: "#2563eb", searchTerm: "Rassemblement National Marine Le Pen France" },
      { name: "Les Républicains",       short: "LR",  color: "#0891b2", searchTerm: "Les Republicains France" },
      { name: "La France Insoumise",    short: "LFI", color: "#dc2626", searchTerm: "La France Insoumise Melenchon" },
      { name: "Parti Socialiste",       short: "PS",  color: "#f43f5e", searchTerm: "Parti Socialiste France" },
      { name: "Europe Écologie",        short: "EEV", color: "#16a34a", searchTerm: "Greens Europe Ecologie France" },
    ],
  },
  AU: {
    name: "Australia",
    flag: "🇦🇺",
    code: "au",
    newsCode: "au",
    states: [
      "New South Wales","Victoria","Queensland","Western Australia",
      "South Australia","Tasmania","Australian Capital Territory",
      "Northern Territory"
    ],
    parties: [
      { name: "Australian Labor Party", short: "ALP", color: "#dc2626", searchTerm: "Labor Party Australia" },
      { name: "Liberal Party",          short: "LIB", color: "#2563eb", searchTerm: "Liberal Party Australia" },
      { name: "National Party",         short: "NAT", color: "#16a34a", searchTerm: "National Party Australia" },
      { name: "The Greens",             short: "GRN", color: "#22c55e", searchTerm: "Greens Australia" },
      { name: "One Nation",             short: "ON",  color: "#f59e0b", searchTerm: "One Nation Australia" },
    ],
  },
  CA: {
    name: "Canada",
    flag: "🇨🇦",
    code: "ca",
    newsCode: "ca",
    states: [
      "Alberta","British Columbia","Manitoba","New Brunswick",
      "Newfoundland and Labrador","Nova Scotia","Ontario","Prince Edward Island",
      "Quebec","Saskatchewan","Northwest Territories","Nunavut","Yukon"
    ],
    parties: [
      { name: "Liberal Party",          short: "LPC", color: "#dc2626", searchTerm: "Liberal Party Canada Trudeau" },
      { name: "Conservative Party",     short: "CPC", color: "#2563eb", searchTerm: "Conservative Party Canada" },
      { name: "NDP",                    short: "NDP", color: "#f97316", searchTerm: "NDP New Democratic Party Canada" },
      { name: "Bloc Québécois",         short: "BQ",  color: "#3b82f6", searchTerm: "Bloc Québécois Canada" },
      { name: "Green Party",            short: "GPC", color: "#16a34a", searchTerm: "Green Party Canada" },
    ],
  },
  BR: {
    name: "Brazil",
    flag: "🇧🇷",
    code: "br",
    newsCode: "br",
    states: [
      "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Espírito Santo",
      "Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais",
      "Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro",
      "Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima",
      "Santa Catarina","São Paulo","Sergipe","Tocantins","Distrito Federal"
    ],
    parties: [
      { name: "PT (Workers' Party)",    short: "PT",  color: "#dc2626", searchTerm: "PT Workers Party Brazil Lula" },
      { name: "PL (Liberal Party)",     short: "PL",  color: "#2563eb", searchTerm: "PL Liberal Party Brazil Bolsonaro" },
      { name: "União Brasil",           short: "UB",  color: "#f59e0b", searchTerm: "União Brasil party" },
      { name: "MDB",                    short: "MDB", color: "#0891b2", searchTerm: "MDB Brazil party" },
      { name: "PSDB",                   short: "PSDB",color: "#06b6d4", searchTerm: "PSDB Brazil party" },
    ],
  },
  JP: {
    name: "Japan",
    flag: "🇯🇵",
    code: "jp",
    newsCode: "jp",
    states: [
      "Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima",
      "Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tokyo","Kanagawa",
      "Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano","Shizuoka",
      "Aichi","Mie","Shiga","Kyoto","Osaka","Hyogo","Nara","Wakayama",
      "Tottori","Shimane","Okayama","Hiroshima","Yamaguchi",
      "Tokushima","Kagawa","Ehime","Kochi",
      "Fukuoka","Saga","Nagasaki","Kumamoto","Oita","Miyazaki","Kagoshima","Okinawa"
    ],
    parties: [
      { name: "Liberal Democratic Party", short: "LDP", color: "#2563eb", searchTerm: "LDP Liberal Democratic Party Japan" },
      { name: "Constitutional Democratic Party", short: "CDP", color: "#dc2626", searchTerm: "CDP Japan opposition" },
      { name: "Komeito",                short: "KOM", color: "#16a34a", searchTerm: "Komeito party Japan" },
      { name: "Nippon Ishin",           short: "ISH", color: "#f59e0b", searchTerm: "Nippon Ishin Japan" },
      { name: "Japanese Communist Party",short: "JCP", color: "#ef4444", searchTerm: "JCP Communist Party Japan" },
    ],
  },
  ZA: {
    name: "South Africa",
    flag: "🇿🇦",
    code: "za",
    newsCode: "za",
    states: [
      "Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo",
      "Mpumalanga","Northern Cape","North West","Western Cape"
    ],
    parties: [
      { name: "African National Congress", short: "ANC", color: "#16a34a", searchTerm: "ANC African National Congress South Africa" },
      { name: "Democratic Alliance",    short: "DA",  color: "#2563eb", searchTerm: "Democratic Alliance South Africa" },
      { name: "Economic Freedom Fighters", short: "EFF", color: "#dc2626", searchTerm: "EFF Economic Freedom Fighters South Africa" },
      { name: "Inkatha Freedom Party",  short: "IFP", color: "#f59e0b", searchTerm: "IFP South Africa" },
      { name: "uMkhonto weSizwe",       short: "MK",  color: "#7c3aed", searchTerm: "MK party South Africa Zuma" },
    ],
  },
  NG: {
    name: "Nigeria",
    flag: "🇳🇬",
    code: "ng",
    newsCode: "ng",
    states: [
      "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
      "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo",
      "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
      "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
      "Sokoto","Taraba","Yobe","Zamfara","FCT Abuja"
    ],
    parties: [
      { name: "APC",                    short: "APC", color: "#16a34a", searchTerm: "APC All Progressives Congress Nigeria" },
      { name: "PDP",                    short: "PDP", color: "#dc2626", searchTerm: "PDP Peoples Democratic Party Nigeria" },
      { name: "Labour Party",           short: "LP",  color: "#f59e0b", searchTerm: "Labour Party Nigeria Obi" },
      { name: "NNPP",                   short: "NNPP",color: "#2563eb", searchTerm: "NNPP New Nigeria Peoples Party" },
    ],
  },
  MX: {
    name: "Mexico",
    flag: "🇲🇽",
    code: "mx",
    newsCode: "mx",
    states: [
      "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas",
      "Chihuahua","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo",
      "Jalisco","Estado de Mexico","Michoacán","Morelos","Nayarit","Nuevo León",
      "Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa",
      "Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas",
      "Mexico City"
    ],
    parties: [
      { name: "Morena",                 short: "MOR", color: "#dc2626", searchTerm: "Morena party Mexico AMLO" },
      { name: "PAN",                    short: "PAN", color: "#2563eb", searchTerm: "PAN National Action Party Mexico" },
      { name: "PRI",                    short: "PRI", color: "#16a34a", searchTerm: "PRI Institutional Revolutionary Party Mexico" },
      { name: "MC",                     short: "MC",  color: "#f97316", searchTerm: "Movimiento Ciudadano Mexico" },
      { name: "PRD",                    short: "PRD", color: "#f59e0b", searchTerm: "PRD Party of Democratic Revolution Mexico" },
    ],
  },
  PK: {
    name: "Pakistan",
    flag: "🇵🇰",
    code: "pk",
    newsCode: "pk",
    states: [
      "Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan",
      "Azad Kashmir","Gilgit-Baltistan","Islamabad Capital Territory"
    ],
    parties: [
      { name: "PTI",                    short: "PTI", color: "#16a34a", searchTerm: "PTI Imran Khan Pakistan" },
      { name: "PML-N",                  short: "PMLN",color: "#2563eb", searchTerm: "PML-N Nawaz Sharif Pakistan" },
      { name: "PPP",                    short: "PPP", color: "#dc2626", searchTerm: "PPP Pakistan Peoples Party Bhutto" },
      { name: "JUI-F",                  short: "JUI", color: "#7c3aed", searchTerm: "JUI-F Pakistan" },
      { name: "MQM",                    short: "MQM", color: "#06b6d4", searchTerm: "MQM Pakistan Karachi" },
    ],
  },
  ID: {
    name: "Indonesia",
    flag: "🇮🇩",
    code: "id",
    newsCode: "id",
    states: [
      "Aceh","North Sumatra","West Sumatra","Riau","Jambi","South Sumatra",
      "Bengkulu","Lampung","Bangka Belitung","Riau Islands","DKI Jakarta",
      "West Java","Central Java","DI Yogyakarta","East Java","Banten","Bali",
      "West Nusa Tenggara","East Nusa Tenggara","West Kalimantan","Central Kalimantan",
      "South Kalimantan","East Kalimantan","North Kalimantan","North Sulawesi",
      "Central Sulawesi","South Sulawesi","Southeast Sulawesi","Gorontalo",
      "West Sulawesi","Maluku","North Maluku","West Papua","Papua"
    ],
    parties: [
      { name: "Golkar",                 short: "GOL", color: "#f59e0b", searchTerm: "Golkar party Indonesia" },
      { name: "PDI-P",                  short: "PDIP",color: "#dc2626", searchTerm: "PDI-P Megawati Indonesia" },
      { name: "Gerindra",               short: "GER", color: "#dc2626", searchTerm: "Gerindra Prabowo Indonesia" },
      { name: "PKB",                    short: "PKB", color: "#16a34a", searchTerm: "PKB Indonesia party" },
      { name: "Nasdem",                 short: "NAS", color: "#0891b2", searchTerm: "Nasdem party Indonesia" },
    ],
  },
  KE: {
    name: "Kenya",
    flag: "🇰🇪",
    code: "ke",
    newsCode: "ke",
    states: [
      "Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa",
      "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
      "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
      "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
      "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
      "Samburu","Siaya","Taita Taveta","Tana River","Tharaka Nithi","Trans Nzoia",
      "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"
    ],
    parties: [
      { name: "UDA",                    short: "UDA", color: "#f59e0b", searchTerm: "UDA United Democratic Alliance Kenya Ruto" },
      { name: "ODM",                    short: "ODM", color: "#dc2626", searchTerm: "ODM Orange Democratic Movement Kenya Raila" },
      { name: "Jubilee Party",          short: "JUB", color: "#dc2626", searchTerm: "Jubilee Party Kenya" },
      { name: "Wiper",                  short: "WIP", color: "#16a34a", searchTerm: "Wiper party Kenya" },
      { name: "FORD-Kenya",             short: "FORD",color: "#2563eb", searchTerm: "FORD Kenya party" },
    ],
  },
  EG: {
    name: "Egypt",
    flag: "🇪🇬",
    code: "eg",
    newsCode: "eg",
    states: [
      "Alexandria","Assiut","Aswan","Beheira","Beni Suef","Cairo","Dakahlia",
      "Damietta","Faiyum","Gharbia","Giza","Ismailia","Kafr El Sheikh",
      "Luxor","Matruh","Minya","Monufia","New Valley","North Sinai",
      "Port Said","Qalyubia","Qena","Red Sea","Sharqia","Sohag",
      "South Sinai","Suez"
    ],
    parties: [
      { name: "Nation's Future Party",  short: "NF",  color: "#f59e0b", searchTerm: "Nation's Future Party Egypt Sisi" },
      { name: "Wafd Party",             short: "WAF", color: "#2563eb", searchTerm: "Wafd party Egypt" },
      { name: "Tagammu",                short: "TAG", color: "#dc2626", searchTerm: "Tagammu party Egypt" },
    ],
  },
  AR: {
    name: "Argentina",
    flag: "🇦🇷",
    code: "ar",
    newsCode: "ar",
    states: [
      "Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes",
      "Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza",
      "Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis",
      "Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán",
      "Ciudad de Buenos Aires"
    ],
    parties: [
      { name: "La Libertad Avanza",     short: "LLA", color: "#7c3aed", searchTerm: "La Libertad Avanza Milei Argentina" },
      { name: "Unión por la Patria",    short: "UXP", color: "#2563eb", searchTerm: "Unión por la Patria Argentina Kirchner" },
      { name: "Juntos por el Cambio",   short: "JxC", color: "#f59e0b", searchTerm: "Juntos por el Cambio Argentina Macri" },
      { name: "PRO",                    short: "PRO", color: "#f59e0b", searchTerm: "PRO party Argentina" },
    ],
  },
  IT: {
    name: "Italy",
    flag: "🇮🇹",
    code: "it",
    newsCode: "it",
    states: [
      "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
      "Friuli Venezia Giulia","Lazio","Liguria","Lombardy","Marche",
      "Molise","Piedmont","Apulia","Sardinia","Sicily","Tuscany",
      "Trentino-Alto Adige","Umbria","Aosta Valley","Veneto"
    ],
    parties: [
      { name: "Fratelli d'Italia",      short: "FdI", color: "#2563eb", searchTerm: "Fratelli d'Italia Meloni" },
      { name: "Lega",                   short: "LEG", color: "#16a34a", searchTerm: "Lega Salvini Italy" },
      { name: "Forza Italia",           short: "FI",  color: "#3b82f6", searchTerm: "Forza Italia Berlusconi" },
      { name: "Partito Democratico",    short: "PD",  color: "#dc2626", searchTerm: "Partito Democratico Italy" },
      { name: "Movimento 5 Stelle",     short: "M5S", color: "#f59e0b", searchTerm: "Movimento 5 Stelle Italy Grillo" },
    ],
  },
  ES: {
    name: "Spain",
    flag: "🇪🇸",
    code: "es",
    newsCode: "es",
    states: [
      "Andalusia","Aragon","Asturias","Balearic Islands","Basque Country",
      "Canary Islands","Cantabria","Castile-La Mancha","Castile and León",
      "Catalonia","Ceuta","Extremadura","Galicia","La Rioja","Madrid",
      "Melilla","Murcia","Navarre","Valencia"
    ],
    parties: [
      { name: "PSOE",                   short: "PSOE",color: "#dc2626", searchTerm: "PSOE Socialist Party Spain Sanchez" },
      { name: "Partido Popular",        short: "PP",  color: "#2563eb", searchTerm: "Partido Popular Spain" },
      { name: "Vox",                    short: "VOX", color: "#16a34a", searchTerm: "Vox party Spain Abascal" },
      { name: "Sumar",                  short: "SUM", color: "#7c3aed", searchTerm: "Sumar coalition Spain" },
      { name: "Junts",                  short: "JUN", color: "#f59e0b", searchTerm: "Junts Catalonia Spain" },
    ],
  },
  RU: {
    name: "Russia",
    flag: "🇷🇺",
    code: "ru",
    newsCode: "ru",
    states: [
      "Moscow","Saint Petersburg","Novosibirsk Oblast","Yekaterinburg Oblast",
      "Nizhny Novgorod Oblast","Kazan (Tatarstan)","Chelyabinsk Oblast",
      "Omsk Oblast","Samara Oblast","Rostov Oblast","Ufa (Bashkortostan)",
      "Krasnoyarsk Krai","Perm Krai","Voronezh Oblast","Volgograd Oblast",
      "Krasnodar Krai","Saratov Oblast","Tyumen Oblast","Tolyatti","Izhevsk"
    ],
    parties: [
      { name: "United Russia",          short: "UR",  color: "#2563eb", searchTerm: "United Russia party Putin" },
      { name: "LDPR",                   short: "LDPR",color: "#f59e0b", searchTerm: "LDPR Liberal Democratic Party Russia" },
      { name: "CPRF",                   short: "CPRF",color: "#dc2626", searchTerm: "CPRF Communist Party Russia" },
      { name: "A Just Russia",          short: "SR",  color: "#f97316", searchTerm: "A Just Russia party" },
      { name: "New People",             short: "NP",  color: "#06b6d4", searchTerm: "New People party Russia" },
    ],
  },
  CN: {
    name: "China",
    flag: "🇨🇳",
    code: "cn",
    newsCode: "cn",
    states: [
      "Beijing","Shanghai","Tianjin","Chongqing",
      "Guangdong","Shandong","Henan","Sichuan","Jiangsu","Hebei",
      "Hunan","Anhui","Hubei","Zhejiang","Guangxi","Yunnan","Jiangxi",
      "Liaoning","Fujian","Shaanxi","Heilongjiang","Shanxi","Guizhou",
      "Inner Mongolia","Xinjiang","Tibet","Gansu","Hainan","Ningxia",
      "Qinghai","Hong Kong","Macau","Taiwan"
    ],
    parties: [
      { name: "Chinese Communist Party", short: "CCP", color: "#dc2626", searchTerm: "Chinese Communist Party Xi Jinping" },
      { name: "China Democratic League", short: "CDL", color: "#2563eb", searchTerm: "China Democratic League" },
      { name: "KMT (Taiwan)",            short: "KMT", color: "#2563eb", searchTerm: "KMT Kuomintang Taiwan" },
      { name: "DPP (Taiwan)",            short: "DPP", color: "#16a34a", searchTerm: "DPP Democratic Progressive Party Taiwan" },
    ],
  },
};

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns sorted array of country objects */
export const getCountries = () =>
  Object.entries(POLITICAL_DATA)
    .map(([code, d]) => ({ code, name: d.name, flag: d.flag, newsCode: d.newsCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

/** Returns states for a given country code */
export const getStates = (countryCode) =>
  POLITICAL_DATA[countryCode]?.states || [];

/** Returns parties for a given country code */
export const getParties = (countryCode) =>
  POLITICAL_DATA[countryCode]?.parties || [];

/** Build a search query from selections */
export const buildSearchQuery = ({ countryCode, state, party }) => {
  const country = POLITICAL_DATA[countryCode];
  if (!country) return 'politics';
  const parts = [];
  if (party)   parts.push(party.searchTerm || party.name);
  else         parts.push(`${country.name} politics`);
  if (state)   parts.push(state);
  return parts.join(' ');
};

/** Get NewsData country code (2-letter) */
export const getNewsCountryCode = (countryCode) =>
  POLITICAL_DATA[countryCode]?.newsCode || 'us';
