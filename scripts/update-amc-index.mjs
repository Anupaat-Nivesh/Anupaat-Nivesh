import fs from 'node:fs';
import { getAmcIndexPath, replaceAmcIndex } from '../api/services/amcDocumentIndexStore.mjs';

const DEFAULT_AMC_PAGES = {
  'aditya birla sun life': 'https://mutualfund.adityabirlacapital.com/downloads',
  'nippon india': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Factsheet.aspx',
  hdfc: 'https://www.hdfcfund.com/downloads/factsheet',
  'icici prudential': 'https://www.icicipruamc.com/downloads',
  sbi: 'https://www.sbimf.com/en-us/downloads',
  axis: 'https://www.axismf.com/downloads',
  kotak: 'https://www.kotakmf.com/Information/downloads',
  uti: 'https://www.utimf.com/forms-and-downloads/factsheet/',
  dsp: 'https://www.dspim.com/downloads',
  'mirae asset': 'https://www.miraeassetmf.co.in/downloads',
  'franklin templeton': 'https://www.franklintempletonindia.com/downloads',
  tata: 'https://www.tatamutualfund.com/downloads',
  quant: 'https://www.quantmutual.com/downloads',
  'motilal oswal': 'https://www.motilaloswalmf.com/downloads',
  edelweiss: 'https://www.edelweissmf.com/Downloads',
  bandhan: 'https://bandhanmutual.com/downloads',
  'mahindra manulife': 'https://www.mahindramanulife.com/download-center',
  whiteoak: 'https://mf.whiteoakamc.com/downloads',
};

function loadExistingSchemes(indexPath) {
  try {
    const raw = fs.readFileSync(indexPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed?.schemes || {};
  } catch {
    return {};
  }
}

const indexPath = getAmcIndexPath();
const schemes = loadExistingSchemes(indexPath);

replaceAmcIndex({
  generatedAt: new Date().toISOString(),
  amcDocumentPages: DEFAULT_AMC_PAGES,
  schemes,
});

// eslint-disable-next-line no-console
console.log(`AMC index updated: ${indexPath}`);
