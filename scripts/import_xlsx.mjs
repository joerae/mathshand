/**
 * Spreadsheet → game data importer for Maths Handbuilder.
 *
 * The Excel workbook is the SOURCE OF TRUTH for all game content.
 * Can be fetched directly from published Google Docs or loaded from /data.
 * This script reads it and generates `data/game_data.js`, which the game imports.
 *
 * Usage:
 *   npm run import-data                      (fetches from Google Docs, fallbacks to /data)
 *   npm run import-data -- --local           (forces reading local .xlsx in /data)
 *   node scripts/import_xlsx.mjs path/to.xlsx
 *
 * It runs automatically before `npm start` and `npm test`.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_FILE = path.join(DATA_DIR, 'game_data.js');
const DEFAULT_ONLINE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1v9LG4Esug4y0zR4MHevX5sjpp5UDjhjgZWRI4PsKsiLeaItr-VTQeB40qEE5EviOuF34fnRv7zwC/pub?output=xlsx';

const warnings = [];
const warn = (msg) => warnings.push(msg);

// ---------------------------------------------------------------------------
// Locate or fetch workbook
// ---------------------------------------------------------------------------
function findLocalWorkbook() {
  const candidates = fs.readdirSync(DATA_DIR)
    .filter(f => f.toLowerCase().endsWith('.xlsx') && !f.startsWith('~$'))
    .map(f => ({ f, t: fs.statSync(path.join(DATA_DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!candidates.length) {
    throw new Error('No .xlsx workbook found in /data. Put the card content spreadsheet there.');
  }
  return path.join(DATA_DIR, candidates[0].f);
}

function fetchOnlineWorkbook(url, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http:') ? http : https;
    const req = client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchOnlineWorkbook(res.headers.location, timeoutMs));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Timeout after ${timeoutMs}ms connecting to ${url}`));
    });
  });
}

async function loadWorkbook() {
  const arg = process.argv[2];

  // Explicit local file argument
  if (arg && arg !== '--local' && arg !== '--remote' && !arg.startsWith('http')) {
    const filePath = path.resolve(arg);
    console.log(`Loading workbook from local argument: ${filePath}`);
    return {
      buffer: fs.readFileSync(filePath),
      source: path.basename(filePath)
    };
  }

  // Explicit --local flag
  if (arg === '--local') {
    const filePath = findLocalWorkbook();
    console.log(`Loading workbook from local /data: ${path.basename(filePath)}`);
    return {
      buffer: fs.readFileSync(filePath),
      source: path.basename(filePath)
    };
  }

  // Fetch online from Google Docs by default (or passed URL)
  const targetUrl = (arg && arg.startsWith('http')) ? arg : DEFAULT_ONLINE_URL;
  try {
    process.stdout.write(`Fetching latest spreadsheet from Google Docs... `);
    const buffer = await fetchOnlineWorkbook(targetUrl, 5000);
    console.log(`done (${Math.round(buffer.length / 1024)} KB).`);

    // Sync a local copy to data/ so offline builds remain functional
    try {
      const localFile = path.join(DATA_DIR, 'Maths_Handbuilder_Card_Content_v6(1).xlsx');
      fs.writeFileSync(localFile, buffer);
    } catch (e) { /* ignore write issues */ }

    return {
      buffer,
      source: 'Google Docs (online)'
    };
  } catch (err) {
    console.log(`\n⚠ Could not reach Google Docs online (${err.message}).`);
    console.log(`Falling back to local workbook in /data...`);
    const filePath = findLocalWorkbook();
    return {
      buffer: fs.readFileSync(filePath),
      source: path.basename(filePath)
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SEA_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function readSheet(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) throw new Error(`Workbook is missing the "${name}" sheet.`);
  return XLSX.utils.sheet_to_json(ws, { defval: '' })
    .map(row => {
      const clean = {};
      for (const [k, v] of Object.entries(row)) {
        clean[String(k).trim()] = typeof v === 'string' ? v.trim() : v;
      }
      return clean;
    })
    .filter(row => Object.values(row).some(v => v !== ''));
}

const str = (v) => (v === undefined || v === null ? '' : String(v).trim());
const num = (v, fallback = 0) => {
  if (v === '' || v === undefined || v === null) return fallback;
  const n = Number(String(v).replace(/[\u2212\u2013]/g, '-'));
  return Number.isFinite(n) ? n : fallback;
};
const seaLetter = (v) => str(v).toUpperCase().charAt(0);

/**
 * Parse an operation string like "+3", "−5", "×4", "x10", "×−2", "=1".
 * Returns { op, value, label, target } or null.
 */
function parseOperation(raw, context) {
  let s = str(raw).replace(/\s+/g, '');
  if (!s) return null;
  s = s.replace(/[\u2212\u2013\u2014]/g, '-'); // minus / dashes
  s = s.replace(/[xX*\u00D7]/g, '×');
  if (s.startsWith('=')) {
    // Typing "+1" into Excel often converts to "=1" (formula syntax); treat as "+" silently.
    s = '+' + s.slice(1);
  }
  const m = s.match(/^([+\-×])(-?\d+)/);
  if (!m) {
    warn(`${context}: could not parse operation "${raw}" — skipped.`);
    return null;
  }
  const op = m[1];
  let value = parseInt(m[2], 10);
  if (op === '-') value = Math.abs(value);
  const display = (op === '-' ? '−' : op) + String(value).replace('-', '−');
  return { op, value, label: display, target: Math.abs(value) };
}

function parseOperationList(raw, context) {
  return str(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => parseOperation(s, context))
    .filter(Boolean);
}

const WORD_NUMBERS = { a: 1, an: 1, one: 1, additional: 1, extra: 1, two: 2, three: 3, four: 4 };

// ---------------------------------------------------------------------------
// Ability parsers (keyword based – raw text is always kept for display)
// ---------------------------------------------------------------------------
function parseFishAbility(text, context) {
  const t = str(text);
  if (!t) return {};
  const lower = t.toLowerCase();
  const a = {};
  let recognised = false;

  if (/no (battery )?recharge/.test(lower)) {
    a.noRecharge = true; recognised = true;
  }
  const discard = lower.match(/discard (\w+) (number )?cards?/);
  if (discard) {
    a.discardOnEncounter = WORD_NUMBERS[discard[1]] ?? (parseInt(discard[1], 10) || 1);
    recognised = true;
  }
  if (/unclaimed treasures? (disappear|are destroyed|are removed)/.test(lower)) {
    a.destroyTreasureOnEncounter = true; recognised = true;
  }
  if (/two (separate )?targets|multiple targets|successful attacks/.test(lower)) {
    const paren = t.match(/\(([^)]*)\)/);
    const nums = (paren ? paren[1] : t).match(/-?\d+/g);
    if (nums && nums.length >= 2) {
      a.multiTargets = nums.map(n => parseInt(n, 10));
      recognised = true;
    }
  }
  if (!recognised) warn(`${context}: ability "${t}" not recognised — shown as text only.`);
  return a;
}

function parseScooterAbility(text, context) {
  const t = str(text);
  if (!t) return {};
  const lower = t.toLowerCase();
  const m = lower.match(/reveal (\w+)? ?(additional |extra )?treasure/);
  if (m) {
    const count = WORD_NUMBERS[m[1]] ?? (parseInt(m[1], 10) || 1);
    return { revealTreasuresAtStart: count };
  }
  warn(`${context}: ability "${t}" not recognised — shown as text only.`);
  return {};
}

function findFishInText(text, fishList) {
  if (!text || !fishList) return null;
  const t = text.toLowerCase();
  const sorted = [...fishList].filter(f => f.name).sort((a, b) => b.name.length - a.name.length);
  for (const f of sorted) {
    if (t.includes(f.name.toLowerCase())) return f;
  }
  return null;
}

/**
 * Turn a quest sentence into a machine-checkable rule (or null if unknown).
 */
function parseQuest(text, context, fishList = []) {
  const t = str(text);
  const lower = t.toLowerCase().replace(/[\u2212\u2013]/g, '-').replace(/[x\u00D7]/g, '×');
  const opsIn = (s) => (s.match(/[+\-×]-?\d+/g) || []).map(o => parseOperation(o, context)?.label).filter(Boolean);

  if (/defeat the first fish/.test(lower)) return { type: 'defeat_fish_count', count: 1 };
  if (/buy a number card/.test(lower)) return { type: 'buy_market', count: 1 };
  if (/^complete sea/.test(lower)) return { type: 'complete_sea' };
  if (/negative fish target/.test(lower)) return { type: 'defeat_negative_fish' };
  if (/negative multiplier/.test(lower)) return { type: 'success_with_card', action: 'attack', negativeMultiplier: true };

  // Defeating a fish with N cards: e.g. "Use 5 cards to defeat a fish"
  const cardsToDefeat = lower.match(/(?:use|using|with) (?:at least )?(\w+) cards? to defeat a (?:fish|monster)|defeat a (?:fish|monster) (?:using|with) (?:at least )?(\w+) cards?/);
  if (cardsToDefeat) {
    const rawVal = cardsToDefeat[1] || cardsToDefeat[2];
    const count = WORD_NUMBERS[rawVal] ?? (parseInt(rawVal, 10) || 1);
    return { type: 'defeat_fish_with_cards_count', count };
  }

  // Defeat specific named fish, e.g. "Defeat Swordfish with a Sword"
  if (/defeat /i.test(lower)) {
    const matchedFish = findFishInText(lower, fishList);
    if (matchedFish) {
      return { type: 'defeat_specific_fish', fishId: matchedFish.id, fishName: matchedFish.name };
    }
  }

  // Claim negative treasure
  const claimCountWord = lower.match(/claim (\w+) negative/);
  if (claimCountWord && WORD_NUMBERS[claimCountWord[1]] > 1) {
    return { type: 'claim_treasure', negative: true, count: WORD_NUMBERS[claimCountWord[1]] };
  }
  if (/claim (?:a |one )?negative/.test(lower) || /negative-target treasure/.test(lower)) {
    return { type: 'claim_treasure', negative: true, count: 1 };
  }

  // General treasure count: e.g. "Get at least 2 treasure cards", "Claim 2 treasures"
  const generalTreasure = lower.match(/(?:get|claim|collect|acquire|hold) (?:at least )?(\w+) treasure(?: card)?s?/);
  if (generalTreasure) {
    const count = WORD_NUMBERS[generalTreasure[1]] ?? (parseInt(generalTreasure[1], 10) || 1);
    return { type: 'claim_treasure', count };
  }

  const gemQ = lower.match(/claim a (?:treasure worth )?(\d+)[ -]gem/);
  if (gemQ) return { type: 'claim_treasure', gems: parseInt(gemQ[1], 10), count: 1 };
  if (/claim a .*multiplication treasure/.test(lower)) return { type: 'claim_treasure', usingOp: '×', count: 1 };

  const ops = opsIn(lower);
  if (ops.length) {
    const action = /\bwin\b/.test(lower) ? 'attack' : 'any';
    return { type: 'success_with_card', action, cards: ops };
  }
  warn(`${context}: quest "${t}" not recognised — will not be auto-tracked.`);
  return null;
}

// ---------------------------------------------------------------------------
// Main import
// ---------------------------------------------------------------------------
function importWorkbook(buffer, sourceLabel) {
  const wb = XLSX.read(buffer, { type: 'buffer' });

  // --- Fish ---
  const fish = readSheet(wb, 'Fish').filter(r => str(r['Card ID'])).map(r => {
    const id = str(r['Card ID']);
    const abilityText = str(r['Special Ability']);
    return {
      id,
      sea: seaLetter(r['Unlock Sea']),
      name: str(r['Fish Name']),
      copies: num(r['Copies'], 1),
      target: num(r['Target']),
      abilityText,
      abilities: parseFishAbility(abilityText, `Fish ${id}`),
      encounterStatus: str(r['Encounter Status']),
      notes: str(r['Notes'])
    };
  });

  // --- Seas ---
  const seas = readSheet(wb, 'Seas').filter(r => str(r['Card ID'])).map(r => {
    const id = str(r['Card ID']);
    const letter = seaLetter(r['Unlock Sea']);
    const rulesText = str(r['Encounter Selection Rules'] || r['Encounter Selection Inspiration']);
    const fishCount = num(r['Fish per Adventure'], 5);

    // Parse explicit columns: Fish 1 to Fish 5
    // - "(none)" means no fish for this slot (e.g. Sea A has 4 encounters, Fish 5 is (none)).
    // - empty/blank means use existing random selection rules for that slot.
    const hasFishCols = [1, 2, 3, 4, 5].some(i => r[`Fish ${i}`] !== undefined);
    const fishSlots = [];

    if (hasFishCols) {
      for (let i = 1; i <= 5; i++) {
        const rawSlot = str(r[`Fish ${i}`]);
        if (!rawSlot) {
          fishSlots.push(null);
        } else if (/^\(?(none|empty|-)\)?$/i.test(rawSlot)) {
          // Explicitly no fish for this slot
          continue;
        } else {
          const matched = fish.find(f => f.name.toLowerCase() === rawSlot.toLowerCase())
            || findFishInText(rawSlot, fish);
          if (matched) {
            fishSlots.push(matched.id);
          } else {
            warn(`Sea ${letter}: Fish slot ${i} "${rawSlot}" could not be matched to any fish.`);
            fishSlots.push(null);
          }
        }
      }
    }

    let startFishId = null;
    let finalFishId = null;
    let fixedFishIds = null;
    let randomised = false;

    if (hasFishCols && fishSlots.length > 0) {
      startFishId = fishSlots[0] || null;
      finalFishId = fishSlots[fishSlots.length - 1] || null;
      fixedFishIds = fishSlots.every(f => f !== null) ? [...fishSlots] : null;
      randomised = fishSlots.some(f => f === null);
    } else {
      // Legacy fallback for sheets without Fish 1-5 columns
      const fixedM = rulesText.match(/fixed (\d+) encounters?: sea ([a-g]) cards 1-(\d+) in order/i);
      if (fixedM) {
        const targetSea = fixedM[2].toUpperCase();
        const count = parseInt(fixedM[3], 10);
        fixedFishIds = fish.filter(f => f.sea === targetSea).slice(0, count).map(f => f.id);
      }

      for (const sentence of rulesText.split(/[;.]/)) {
        const s = sentence.trim();
        if (!s) continue;
        if (/start with|begins? with|first encounter/i.test(s)) {
          const hit = findFishInText(s, fish);
          if (hit) startFishId = hit.id;
        }
        if (/finish with|ends? with|final encounter/i.test(s)) {
          const hit = findFishInText(s, fish);
          if (hit) finalFishId = hit.id;
        }
      }
      randomised = /random/i.test(rulesText) || SEA_ORDER.indexOf(letter) >= SEA_ORDER.indexOf('C');
    }

    const effectiveFishCount = fishSlots.length || fishCount;

    return {
      id,
      letter,
      name: str(r['Sea Name']),
      description: str(r['What you are doing']),
      mathsFocus: str(r['Maths Focus']),
      encounterRulesText: rulesText,
      fishPerAdventure: effectiveFishCount,
      randomised,
      fishSlots: fishSlots.length ? fishSlots : null,
      startFishId,
      finalFishId,
      fixedFishIds,
      newNumberCardsText: str(r['Number Cards'])
    };
  });

  // --- Scooters ---
  const scooters = readSheet(wb, 'Scooters').filter(r => str(r['Card ID'])).map(r => {
    const id = str(r['Card ID']);
    const abilityText = str(r['Special Ability']);
    return {
      id,
      sea: seaLetter(r['Unlock Sea']),
      name: str(r['Scooter Name']),
      battery: num(r['Battery (bolts)'], 4),
      handCapacity: num(r['Hand Capacity'], 7),
      startingHand: parseOperationList(r['Starting Hand'], `Scooter ${id} starting hand`),
      abilityText,
      abilities: parseScooterAbility(abilityText, `Scooter ${id}`),
      concept: str(r['Concept']),
      status: str(r['Status']),
      notes: str(r['Notes'])
    };
  });

  // --- Number cards ---
  const numberCards = readSheet(wb, 'Number Cards').filter(r => str(r['Card ID'])).map(r => {
    const id = str(r['Card ID']);
    const parsed = parseOperation(r['Operation'], `Number card ${id}`);
    if (!parsed) return null;
    const status = str(r['Status']);
    return {
      id,
      sea: seaLetter(r['Unlock Sea']),
      ...parsed,
      copies: num(r['Copies'], 1),
      mathsType: str(r['Maths Type']),
      status,
      // "Idea" rows are optional concepts and are not shuffled into the market.
      enabled: status.toLowerCase() !== 'idea'
    };
  }).filter(Boolean);

  // --- Treasure ---
  const treasures = readSheet(wb, 'Treasure').filter(r => str(r['Card ID'])).map(r => ({
    id: str(r['Card ID']),
    sea: seaLetter(r['Unlock Sea']),
    name: str(r['Treasure Name']),
    copies: num(r['Copies'], 1),
    target: num(r['Target']),
    gems: num(r['Gem Reward'], 1),
    specialRule: str(r['Special Rule']),
    status: str(r['Status'])
  }));

  // --- Quests ---
  const quests = {};
  for (const r of readSheet(wb, 'Quests')) {
    const letter = seaLetter(r['Sea']);
    if (!letter) continue;
    quests[letter] = [1, 2, 3].map(n => {
      const text = str(r[`Quest ${n}`]);
      if (!text) return null;
      const gemsRaw = r[`Quest ${n} Gems`];
      return {
        id: `${letter}_Quest_${n}`,
        text,
        gems: num(gemsRaw, 0),
        gemsTbd: gemsRaw === '' || gemsRaw === undefined,
        rule: parseQuest(text, `Sea ${letter} quest ${n}`, fish)
      };
    }).filter(Boolean);
  }

  // --- Sanity checks ---
  for (const sea of seas) {
    const available = fish.filter(f => SEA_ORDER.indexOf(f.sea) <= SEA_ORDER.indexOf(sea.letter));
    if (available.length < sea.fishPerAdventure) {
      warn(`Sea ${sea.letter}: needs ${sea.fishPerAdventure} fish but only ${available.length} are unlocked by then.`);
    }
    if (!quests[sea.letter]) warn(`Sea ${sea.letter}: no quests defined.`);
  }

  return {
    source: sourceLabel,
    importedAt: new Date().toISOString(),
    seaOrder: SEA_ORDER,
    config: { marketSize: 5 },
    seas,
    scooters,
    numberCards,
    fish,
    treasures,
    quests
  };
}

// ---------------------------------------------------------------------------
// Main execution
// ---------------------------------------------------------------------------
async function main() {
  const { buffer, source } = await loadWorkbook();
  const data = importWorkbook(buffer, source);

  const banner = `/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Source: ${data.source}
 * Regenerate with: npm run import-data
 *
 * Edit the spreadsheet or Google Doc; it is the source of truth for all game content.
 */
`;
  fs.writeFileSync(OUT_FILE, `${banner}export const GAME_DATA = ${JSON.stringify(data, null, 2)};\n`, 'utf8');

  console.log(`Imported ${data.source} → data/game_data.js`);
  console.log(`  ${data.seas.length} seas, ${data.scooters.length} scooters, ${data.numberCards.length} number cards, ` +
    `${data.fish.length} fish, ${data.treasures.length} treasures, ${Object.keys(data.quests).length} quest sets`);
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
}

main().catch(err => {
  console.error(`\n❌ Import failed:`, err.message);
  process.exit(1);
});
