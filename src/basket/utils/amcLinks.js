function normalizeFundHouse(name = '') {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(mutual fund|asset management|amc|limited|ltd|company)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const AMC_DOCUMENT_LINKS = [
  { key: 'aditya birla sun life', url: 'https://mutualfund.adityabirlacapital.com/downloads' },
  { key: 'nippon india', url: 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Factsheet.aspx' },
  { key: 'hdfc', url: 'https://www.hdfcfund.com/downloads/factsheet' },
  { key: 'icici prudential', url: 'https://www.icicipruamc.com/downloads' },
  { key: 'sbi', url: 'https://www.sbimf.com/en-us/downloads' },
  { key: 'axis', url: 'https://www.axismf.com/downloads' },
  { key: 'kotak', url: 'https://www.kotakmf.com/Information/downloads' },
  { key: 'uti', url: 'https://www.utimf.com/forms-and-downloads/factsheet/' },
  { key: 'dsp', url: 'https://www.dspim.com/downloads' },
  { key: 'mirae asset', url: 'https://www.miraeassetmf.co.in/downloads' },
  { key: 'franklin templeton', url: 'https://www.franklintempletonindia.com/downloads' },
  { key: 'tata', url: 'https://www.tatamutualfund.com/downloads' },
  { key: 'quant', url: 'https://www.quantmutual.com/downloads' },
  { key: 'motilal oswal', url: 'https://www.motilaloswalmf.com/downloads' },
  { key: 'edelweiss', url: 'https://www.edelweissmf.com/Downloads' },
  { key: 'bandhan', url: 'https://bandhanmutual.com/downloads' },
  { key: 'mahindra manulife', url: 'https://www.mahindramanulife.com/download-center' },
  { key: 'whiteoak', url: 'https://mf.whiteoakamc.com/downloads' },
];

export function resolveAmcDocumentLink(fundHouse) {
  const normalized = normalizeFundHouse(fundHouse);
  if (!normalized) return null;
  const match = AMC_DOCUMENT_LINKS.find((row) => normalized.includes(row.key) || row.key.includes(normalized));
  return match?.url || null;
}

export function resolveSchemeDocumentLink({ factsheetUrl, fundHouse } = {}) {
  if (factsheetUrl) {
    return { url: factsheetUrl, source: 'factsheet' };
  }
  const amcLink = resolveAmcDocumentLink(fundHouse);
  if (amcLink) {
    return { url: amcLink, source: 'amc' };
  }
  return { url: 'https://www.amfiindia.com/', source: 'amfi' };
}
