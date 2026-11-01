/**
 * Spreadsheet → game data importer for Maths Handbuilder.
 *
 * The Excel workbook in /data is the SOURCE OF TRUTH for all game content.
 * This script reads it and generates `data/game_data.js`, which the game imports.
 *
 * Usage:
 *   npm run import-data                      (uses the newest .xlsx in /data)
 *   node scripts/import_xlsx.mjs path/to.xlsx
 *
 * It runs automatically before `npm start` and `npm test`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_FILE = path.join(DATA_DIR, 'game_data.js');

const warnings = [];
const warn = (msg) => warnings.push(msg);

// ---------------------------------------------------------------------------
// Locate workbook
// ---------------------------------------------------------------------------
function findWorkbook() {
  if (process.argv[2]) return path.resolve(process.argv[2]);
  const candidates = fs.readdirSync(DATA_DIR)
    .filter(f => f.toLowerCase().endsWith('.xlsx') && !f.startsWith('~$'))
    .map(f => ({ f, t: fs.statSync(path.join(DATA_DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!candidates.length) {
    throw new Error('No .xlsx workbook found in /data. Put the card content spreadsheet there.');
  }
  return path.join(DATA_DIR, candidates[0].f);
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
    warn(`${context}: "${raw}" starts with "=", treated as "+" (probable typo).`);
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

/**
 * Turn a quest sentence into a machine-checkable rule (or null if unknown).
 */
function parseQuest(text, context) {
  const t = str(text);
  const lower = t.toLowerCase().replace(/[\u2212\u2013]/g, '-').replace(/[x\u00D7]/g, '×');
  const opsIn = (s) => (s.match(/[+\-×]-?\d+/g) || []).map(o => parseOperation(o, context)?.label).filter(Boolean);

  if (/defeat the first fish/.test(lower)) return { type: 'defeat_fish_count', count: 1 };
  if (/buy a number card/.test(lower)) return { type: 'buy_market', count: 1 };
  if (/^complete sea/.test(lower)) return { type: 'complete_sea' };
  if (/negative fish target/.test(lower)) return { type: 'defeat_negative_fish' };
  if (/negative multiplier/.test(lower)) return { type: 'success_with_card', action: 'attack', negativeMultiplier: true };

  const claimCountWord = lower.match(/claim (\w+) negative/);
  if (claimCountWord && WORD_NUMBERS[claimCountWord[1]] > 1) {
    return { type: 'claim_treasure', negative: true, count: WORD_NUMBERS[claimCountWord[1]] };
  }
  if (/claim a negative/.test(lower)) return { type: 'claim_treasure', negative: true, count: 1 };
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
function importWorkbook(file) {
  const wb = XLSX.read(fs.readFileSync(file), { type: 'buffer' });

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
    const rulesText = str(r['Encounter Selection Rules']);
    const fishCount = num(r['Fish per Adventure'], 5);

    // Fixed final fish: a fish name appearing in a sentence that mentions "final"
    let finalFishId = null;
    for (const sentence of rulesText.split(/[;.]/)) {
      if (!/final/i.test(sentence)) continue;
      const hit = fish.find(f => f.name && sentence.toLowerCase().includes(f.name.toLowerCase()));
      if (hit) finalFishId = hit.id;
    }
    const randomised = SEA_ORDER.indexOf(letter) >= SEA_ORDER.indexOf('C');

    return {
      id,
      letter,
      name: str(r['Sea Name']),
      description: str(r['What you are doing']),
      mathsFocus: str(r['Maths Focus']),
      encounterRulesText: rulesText,
      fishPerAdventure: fishCount,
      randomised,
      finalFishId,
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
        rule: parseQuest(text, `Sea ${letter} quest ${n}`)
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
    source: path.basename(file),
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
const file = findWorkbook();
const data = importWorkbook(file);

const banner = `/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Generated from: data/${data.source}
 * Regenerate with: npm run import-data
 *
 * Edit the spreadsheet instead; it is the source of truth for all game content.
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
