/** Server-side scheme helpers (mirrors src/basket/utils/mfMetrics.js). */

const KNOWN_AMC_PREFIXES = [
  'Aditya Birla Sun Life',
  'Baroda BNP Paribas',
  'Canara Robeco',
  'Franklin Templeton',
  'ICICI Prudential',
  'Invesco India',
  'Kotak Mahindra',
  'Mahindra Manulife',
  'Mirae Asset',
  'Motilal Oswal',
  'Nippon India',
  'Parag Parikh',
  'PGIM India',
  'SBI',
  'Tata',
  'UTI',
  'Axis',
  'HDFC',
  'DSP',
  'Bandhan',
  'Edelweiss',
  'HSBC',
  'JM',
  'LIC',
  'Navi',
  'Quant',
  'Sundaram',
  'Union',
  'WhiteOak',
  '360 ONE',
  'BOI',
];

const MAJOR_AMCS = new Set([
  'SBI',
  'HDFC',
  'ICICI Prudential',
  'Nippon India',
  'Aditya Birla Sun Life',
  'Kotak Mahindra',
  'Axis',
  'UTI',
  'DSP',
  'Mirae Asset',
  'Tata',
  'Canara Robeco',
  'Franklin Templeton',
  'Motilal Oswal',
  'Bandhan',
  'Edelweiss',
  'Invesco India',
  'LIC',
  'Sundaram',
  'HSBC',
  'PGIM India',
  'Mahindra Manulife',
  'Navi',
  'Baroda BNP Paribas',
  'Union',
  'Quant',
  'Parag Parikh',
  'WhiteOak',
]);

export function inferFundHouse(schemeName = '') {
  const n = String(schemeName).trim();
  if (!n) return 'Other';

  const lc = n.toLowerCase();
  const known = KNOWN_AMC_PREFIXES.find((amc) => lc.startsWith(amc.toLowerCase()));
  if (known) return known;

  const fund = n.match(/^(.+?\s+Mutual Fund)/i);
  if (fund) return fund[1].trim();

  return n.split(' - ')[0].trim() || 'Other';
}

/** Schemes we show in explorer: Direct + Growth (investable). */
export function isExplorerScheme(schemeName = '') {
  const n = String(schemeName).toLowerCase();
  if (!n.includes('direct')) return false;
  if (n.includes('idcw') || n.includes('dividend')) return false;
  return n.includes('growth');
}

export function isMajorAmcScheme(schemeName = '') {
  return MAJOR_AMCS.has(inferFundHouse(schemeName));
}
