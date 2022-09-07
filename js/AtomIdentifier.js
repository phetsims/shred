// Copyright 2014-2022, University of Colorado Boulder

/**
 * AtomIdentifier is an object that can be used to identify various things about an atom given its configuration, such
 * as its name, chemical symbols, and stable isotopes.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 * @author Luisa Vargas
 */

import Utils from '../../dot/js/Utils.js';
import shred from './shred.js';
import ShredStrings from './ShredStrings.js';

// An arbitrary value used to signify a 'trace' abundance, meaning that a very small amount of this isotope is
// present on Earth.
const TRACE_ABUNDANCE = 0.000000000001;

const hydrogenString = ShredStrings.hydrogen;
const heliumString = ShredStrings.helium;
const lithiumString = ShredStrings.lithium;
const berylliumString = ShredStrings.beryllium;
const boronString = ShredStrings.boron;
const carbonString = ShredStrings.carbon;
const nitrogenString = ShredStrings.nitrogen;
const oxygenString = ShredStrings.oxygen;
const fluorineString = ShredStrings.fluorine;
const neonString = ShredStrings.neon;
const sodiumString = ShredStrings.sodium;
const magnesiumString = ShredStrings.magnesium;
const aluminumString = ShredStrings.aluminum;
const siliconString = ShredStrings.silicon;
const phosphorusString = ShredStrings.phosphorus;
const sulfurString = ShredStrings.sulfur;
const chlorineString = ShredStrings.chlorine;
const argonString = ShredStrings.argon;
const potassiumString = ShredStrings.potassium;
const calciumString = ShredStrings.calcium;
const scandiumString = ShredStrings.scandium;
const titaniumString = ShredStrings.titanium;
const vanadiumString = ShredStrings.vanadium;
const chromiumString = ShredStrings.chromium;
const manganeseString = ShredStrings.manganese;
const ironString = ShredStrings.iron;
const cobaltString = ShredStrings.cobalt;
const nickelString = ShredStrings.nickel;
const copperString = ShredStrings.copper;
const zincString = ShredStrings.zinc;
const galliumString = ShredStrings.gallium;
const germaniumString = ShredStrings.germanium;
const arsenicString = ShredStrings.arsenic;
const seleniumString = ShredStrings.selenium;
const bromineString = ShredStrings.bromine;
const kryptonString = ShredStrings.krypton;
const rubidiumString = ShredStrings.rubidium;
const strontiumString = ShredStrings.strontium;
const yttriumString = ShredStrings.yttrium;
const zirconiumString = ShredStrings.zirconium;
const niobiumString = ShredStrings.niobium;
const molybdenumString = ShredStrings.molybdenum;
const technetiumString = ShredStrings.technetium;
const rutheniumString = ShredStrings.ruthenium;
const rhodiumString = ShredStrings.rhodium;
const palladiumString = ShredStrings.palladium;
const silverString = ShredStrings.silver;
const cadmiumString = ShredStrings.cadmium;
const indiumString = ShredStrings.indium;
const tinString = ShredStrings.tin;
const antimonyString = ShredStrings.antimony;
const telluriumString = ShredStrings.tellurium;
const iodineString = ShredStrings.iodine;
const xenonString = ShredStrings.xenon;
const cesiumString = ShredStrings.cesium;
const bariumString = ShredStrings.barium;
const lanthanumString = ShredStrings.lanthanum;
const ceriumString = ShredStrings.cerium;
const praseodymiumString = ShredStrings.praseodymium;
const neodymiumString = ShredStrings.neodymium;
const promethiumString = ShredStrings.promethium;
const samariumString = ShredStrings.samarium;
const europiumString = ShredStrings.europium;
const gadoliniumString = ShredStrings.gadolinium;
const terbiumString = ShredStrings.terbium;
const dysprosiumString = ShredStrings.dysprosium;
const holmiumString = ShredStrings.holmium;
const erbiumString = ShredStrings.erbium;
const thuliumString = ShredStrings.thulium;
const ytterbiumString = ShredStrings.ytterbium;
const lutetiumString = ShredStrings.lutetium;
const hafniumString = ShredStrings.hafnium;
const tantalumString = ShredStrings.tantalum;
const tungstenString = ShredStrings.tungsten;
const rheniumString = ShredStrings.rhenium;
const osmiumString = ShredStrings.osmium;
const iridiumString = ShredStrings.iridium;
const platinumString = ShredStrings.platinum;
const goldString = ShredStrings.gold;
const mercuryString = ShredStrings.mercury;
const thalliumString = ShredStrings.thallium;
const leadString = ShredStrings.lead;
const bismuthString = ShredStrings.bismuth;
const poloniumString = ShredStrings.polonium;
const astatineString = ShredStrings.astatine;
const radonString = ShredStrings.radon;
const franciumString = ShredStrings.francium;
const radiumString = ShredStrings.radium;
const actiniumString = ShredStrings.actinium;
const thoriumString = ShredStrings.thorium;
const protactiniumString = ShredStrings.protactinium;
const uraniumString = ShredStrings.uranium;
const neptuniumString = ShredStrings.neptunium;
const plutoniumString = ShredStrings.plutonium;
const americiumString = ShredStrings.americium;
const curiumString = ShredStrings.curium;
const berkeliumString = ShredStrings.berkelium;
const californiumString = ShredStrings.californium;
const einsteiniumString = ShredStrings.einsteinium;
const fermiumString = ShredStrings.fermium;
const mendeleviumString = ShredStrings.mendelevium;
const nobeliumString = ShredStrings.nobelium;
const lawrenciumString = ShredStrings.lawrencium;
const rutherfordiumString = ShredStrings.rutherfordium;
const dubniumString = ShredStrings.dubnium;
const seaborgiumString = ShredStrings.seaborgium;
const bohriumString = ShredStrings.bohrium;
const hassiumString = ShredStrings.hassium;
const meitneriumString = ShredStrings.meitnerium;
const darmstadtiumString = ShredStrings.darmstadtium;
const roentgeniumString = ShredStrings.roentgenium;
const coperniciumString = ShredStrings.copernicium;
const nihoniumString = ShredStrings.nihonium;
const fleroviumString = ShredStrings.flerovium;
const moscoviumString = ShredStrings.moscovium;
const livermoriumString = ShredStrings.livermorium;
const tennessineString = ShredStrings.tennessine;
const oganessonString = ShredStrings.oganesson;

const nameTable = [
  '', // No element
  hydrogenString,
  heliumString,
  lithiumString,
  berylliumString,
  boronString,
  carbonString,
  nitrogenString,
  oxygenString,
  fluorineString,
  neonString,
  sodiumString,
  magnesiumString,
  aluminumString,
  siliconString,
  phosphorusString,
  sulfurString,
  chlorineString,
  argonString,
  potassiumString,
  calciumString,
  scandiumString,
  titaniumString,
  vanadiumString,
  chromiumString,
  manganeseString,
  ironString,
  cobaltString,
  nickelString,
  copperString,
  zincString,
  galliumString,
  germaniumString,
  arsenicString,
  seleniumString,
  bromineString,
  kryptonString,
  rubidiumString,
  strontiumString,
  yttriumString,
  zirconiumString,
  niobiumString,
  molybdenumString,
  technetiumString,
  rutheniumString,
  rhodiumString,
  palladiumString,
  silverString,
  cadmiumString,
  indiumString,
  tinString,
  antimonyString,
  telluriumString,
  iodineString,
  xenonString,
  cesiumString,
  bariumString,
  lanthanumString,
  ceriumString,
  praseodymiumString,
  neodymiumString,
  promethiumString,
  samariumString,
  europiumString,
  gadoliniumString,
  terbiumString,
  dysprosiumString,
  holmiumString,
  erbiumString,
  thuliumString,
  ytterbiumString,
  lutetiumString,
  hafniumString,
  tantalumString,
  tungstenString,
  rheniumString,
  osmiumString,
  iridiumString,
  platinumString,
  goldString,
  mercuryString,
  thalliumString,
  leadString,
  bismuthString,
  poloniumString,
  astatineString,
  radonString,
  franciumString,
  radiumString,
  actiniumString,
  thoriumString,
  protactiniumString,
  uraniumString,
  neptuniumString,
  plutoniumString,
  americiumString,
  curiumString,
  berkeliumString,
  californiumString,
  einsteiniumString,
  fermiumString,
  mendeleviumString,
  nobeliumString,
  lawrenciumString,
  rutherfordiumString,
  dubniumString,
  seaborgiumString,
  bohriumString,
  hassiumString,
  meitneriumString,
  darmstadtiumString,
  roentgeniumString,
  coperniciumString,
  nihoniumString,
  fleroviumString,
  moscoviumString,
  livermoriumString,
  tennessineString,
  oganessonString
];

// Used in PhET-iO data streams
const englishNameTable = [
  '', // No element
  'hydrogen',
  'helium',
  'lithium',
  'beryllium',
  'boron',
  'carbon',
  'nitrogen',
  'oxygen',
  'fluorine',
  'neon',
  'sodium',
  'magnesium',
  'aluminum',
  'silicon',
  'phosphorus',
  'sulfur',
  'chlorine',
  'argon',
  'potassium',
  'calcium',
  'scandium',
  'titanium',
  'vanadium',
  'chromium',
  'manganese',
  'iron',
  'cobalt',
  'nickel',
  'copper',
  'zinc',
  'gallium',
  'germanium',
  'arsenic',
  'selenium',
  'bromine',
  'krypton',
  'rubidium',
  'strontium',
  'yttrium',
  'zirconium',
  'niobium',
  'molybdenum',
  'technetium',
  'ruthenium',
  'rhodium',
  'palladium',
  'silver',
  'cadmium',
  'indium',
  'tin',
  'antimony',
  'tellurium',
  'iodine',
  'xenon',
  'cesium',
  'barium',
  'lanthanum',
  'cerium',
  'praseodymium',
  'neodymium',
  'promethium',
  'samarium',
  'europium',
  'gadolinium',
  'terbium',
  'dysprosium',
  'holmium',
  'erbium',
  'thulium',
  'ytterbium',
  'lutetium',
  'hafnium',
  'tantalum',
  'tungsten',
  'rhenium',
  'osmium',
  'iridium',
  'platinum',
  'gold',
  'mercury',
  'thallium',
  'lead',
  'bismuth',
  'polonium',
  'astatine',
  'radon',
  'francium',
  'radium',
  'actinium',
  'thorium',
  'protactinium',
  'uranium',
  'neptunium',
  'plutonium',
  'americium',
  'curium',
  'berkelium',
  'californium',
  'einsteinium',
  'fermium',
  'mendelevium',
  'nobelium',
  'lawrencium',
  'rutherfordium',
  'dubnium',
  'seaborgium',
  'bohrium',
  'hassium',
  'meitnerium',
  'darmstadtium',
  'roentgenium',
  'copernicum',
  'nihonium',
  'flerovium',
  'moscovium',
  'livermorium',
  'tennessine',
  'oganesson'
];

const symbolTable = [
  '-', // 0, NO ELEMENT
  'H', // 1, HYDROGEN
  'He', // 2, HELIUM
  'Li', // 3, LITHIUM
  'Be', // 4, BERYLLIUM
  'B', // 5, BORON
  'C', // 6, CARBON
  'N', // 7, NITROGEN
  'O', // 8, OXYGEN
  'F', // 9, FLUORINE
  'Ne', // 10, NEON
  'Na', // 11, SODIUM
  'Mg', // 12, MAGNESIUM
  'Al', // 13, ALUMINUM
  'Si', // 14, SILICON
  'P', // 15, PHOSPHORUS
  'S', // 16, SULFUR
  'Cl', // 17, CHLORINE
  'Ar', // 18, ARGON
  'K', // 19, POTASSIUM
  'Ca', // 20, CALCIUM
  'Sc', // 21, SCANDIUM
  'Ti', // 22, TITANIUM
  'V', // 23, VANADIUM
  'Cr', // 24, CHROMIUM
  'Mn', // 25, MANGANESE
  'Fe', // 26, IRON
  'Co', // 27, COBALT
  'Ni', // 28, NICKEL
  'Cu', // 29, COPPER
  'Zn', // 30, ZINC
  'Ga', // 31, GALLIUM
  'Ge', // 32, GERMANIUM
  'As', // 33, ARSENIC
  'Se', // 34, SELENIUM
  'Br', // 35, BROMINE
  'Kr', // 36, KRYPTON
  'Rb', // 37, RUBIDIUM
  'Sr', // 38, STRONTIUM
  'Y', // 39, YTTRIUM
  'Zr', // 40, ZIRCONIUM
  'Nb', // 41, NIOBIUM
  'Mo', // 42, MOLYBDENUM
  'Tc', // 43, TECHNETIUM
  'Ru', // 44, RUTHENIUM
  'Rh', // 45, RHODIUM
  'Pd', // 46, PALLADIUM
  'Ag', // 47, SILVER
  'Cd', // 48, CADMIUM
  'In', // 49, INDIUM
  'Sn', // 50, TIN
  'Sb', // 51, ANTIMONY
  'Te', // 52, TELLURIUM
  'I', // 53, IODINE
  'Xe', // 54, XENON
  'Cs', // 55, CAESIUM
  'Ba', // 56, BARIUM
  'La', // 57, LANTHANUM
  'Ce', // 58, CERIUM
  'Pr', // 59, PRASEODYMIUM
  'Nd', // 60, NEODYMIUM
  'Pm', // 61, PROMETHIUM
  'Sm', // 62, SAMARIUM
  'Eu', // 63, EUROPIUM
  'Gd', // 64, GADOLINIUM
  'Tb', // 65, TERBIUM
  'Dy', // 66, DYSPROSIUM
  'Ho', // 67, HOLMIUM
  'Er', // 68, ERBIUM
  'Tm', // 69, THULIUM
  'Yb', // 70, YTTERBIUM
  'Lu', // 71, LUTETIUM
  'Hf', // 72, HAFNIUM
  'Ta', // 73, TANTALUM
  'W', // 74, TUNGSTEN
  'Re', // 75, RHENIUM
  'Os', // 76, OSMIUM
  'Ir', // 77, IRIDIUM
  'Pt', // 78, PLATINUM
  'Au', // 79, GOLD
  'Hg', // 80, MERCURY
  'Tl', // 81, THALLIUM
  'Pb', // 82, LEAD
  'Bi', // 83, BISMUTH
  'Po', // 84, POLONIUM
  'At', // 85, ASTATINE
  'Rn', // 86, RADON
  'Fr', // 87, FRANCIUM
  'Ra', // 88, RADIUM
  'Ac', // 89, ACTINIUM
  'Th', // 90, THORIUM
  'Pa', // 91, PROTACTINIUM
  'U', // 92, URANIUM
  'Np', // 93, NEPTUNIUM
  'Pu', // 94, PLUTONIUM
  'Am', // 95, AMERICIUM
  'Cm', // 96, CURIUM
  'Bk', // 97, BERKELIUM
  'Cf', // 98, CALIFORNIUM
  'Es', // 99, EINSTEINIUM
  'Fm', // 100, FERMIUM
  'Md', // 101, MENDELEVIUM
  'No', // 102, NOBELIUM
  'Lr', // 103, LAWRENCIUM
  'Rf', // 104, RUTHERFORDIUM
  'Db', // 105, DUBNIUM
  'Sg', // 106, SEABORGIUM
  'Bh', // 107, BOHRIUM
  'Hs', // 108, HASSIUM
  'Mt', // 109, MEITNERIUM
  'Ds', // 110, DARMSTADTIUM
  'Rg', // 111, ROENTGENIUM
  'Cn', // 112, COPERNICIUM
  'Nh', // 113, NIHONIUM
  'Fl', // 114, FLEROVIUM
  'Mc', // 115, MOSCOVIUM
  'Lv', // 116, LIVERMORIUM
  'Ts', // 117, TENNESSINE
  'Og'  // 118, OGANESSON

];

// Table of stable elements, indexed by atomic number to a list of viable numbers of neutrons.
const stableElementTable = [
  // No element
  [],
  // Hydrogen
  [ 0, 1 ],
  // Helium
  [ 1, 2 ],
  // Lithium
  [ 3, 4 ],
  // Beryllium
  [ 5 ],
  // Boron
  [ 5, 6 ],
  // Carbon
  [ 6, 7 ],
  // Nitrogen
  [ 7, 8 ],
  // Oxygen
  [ 8, 9, 10 ],
  // Fluorine
  [ 10 ],
  // Neon
  [ 10, 11, 12 ],
  // Sodium
  [ 12 ],
  // Magnesium
  [ 12, 13, 14 ],
  //Aluminum
  [ 14 ],
  // Silicon
  [ 14, 15, 16 ],
  // Phosphorous
  [ 16 ],
  // Sulfur
  [ 16, 17, 18, 20 ],
  // Chlorine
  [ 18, 20 ],
  // Argon
  [ 18, 20, 22 ],
  [ 20, 22 ],
  [ 20, 22, 23, 24, 26 ],
  [ 24 ],
  [ 24, 25, 26, 27, 28 ],
  [ 28 ],
  [ 28, 29, 30 ],
  [ 30 ],
  [ 28, 30, 31, 32 ],
  [ 32 ],
  [ 30, 32, 33, 34, 36 ],
  [ 34, 36 ],
  [ 34, 36, 37, 38 ],
  [ 38, 40 ],
  [ 38, 40, 41, 42, 44 ],
  [ 42 ],
  [ 40, 42, 43, 44, 46 ],
  [ 44, 46 ],
  [ 42, 44, 46, 47, 48, 50 ],
  [ 48 ],
  [ 46, 48, 49, 50 ],
  [ 50 ],
  [ 50, 51, 52, 54 ],
  [ 52 ],
  [ 50, 52, 53, 54, 55, 56 ],
  [],
  [ 52, 54, 55, 56, 57, 58, 60 ],
  [ 58 ],
  [ 56, 58, 59, 60, 62, 64 ],
  [ 60, 62 ],
  [ 58, 60, 62, 63, 64, 66 ],
  [ 64 ],
  [ 62, 64, 65, 66, 67, 68, 69, 70, 72, 74 ],
  [ 70, 72 ],
  [ 68, 70, 72, 73, 74 ],
  [ 74 ],
  [ 72, 74, 75, 76, 77, 78 ],
  [ 78 ],
  [ 74, 78, 79, 80, 81, 82 ],
  [ 82 ],
  [ 78, 82 ],
  [ 82 ],
  [ 82, 83, 85, 86, 88 ],
  [],
  [ 82, 87, 88, 90, 92 ],
  [ 90 ],
  [ 90, 91, 92, 93, 94, 96 ],
  [ 94 ],
  [ 90, 92, 94, 95, 96, 97, 98 ],
  [ 98 ],
  [ 94, 96, 98, 99, 100, 102 ],
  [ 100 ],
  [ 98, 100, 101, 102, 103, 104, 106 ],
  [ 104 ],
  [ 104, 105, 106, 107, 108 ],
  [ 108 ],
  [ 108, 110, 112 ],
  [ 110 ],
  [ 111, 112, 113, 114, 116 ],
  [ 114, 116 ],
  [ 114, 116, 117, 118, 120 ],
  [ 118 ],
  [ 116, 118, 119, 120, 121, 122, 124 ],
  [ 122, 124 ],
  [ 124, 125, 126 ]
];

const numNeutronsInMostStableIsotope = [
  // No element
  0,
  // Hydrogen
  0,
  // Helium
  2,
  // Lithium
  4,
  // Beryllium
  5,
  // Boron
  6,
  // Carbon
  6,
  // Nitrogen
  7,
  // Oxygen
  8,
  // Fluorine
  10,
  // Neon
  10,
  12,
  12,
  14,
  14,
  16,
  16,
  18,
  22,
  20,
  20,
  24,
  26,
  28,
  28,
  30,
  30,
  32,
  31,
  35,
  35,
  39,
  41,
  42,
  45,
  45,
  48,
  48,
  50,
  50,
  51,
  52,
  54,
  55,
  57,
  58,
  60,
  61,
  64,
  66,
  69,
  71,
  76,
  74,
  77,
  78,
  81,
  82,
  82,
  82,
  84,
  84,
  88,
  89,
  93,
  94,
  97,
  98,
  99,
  100,
  103,
  104,
  106,
  108,
  110,
  111,
  114,
  115,
  117,
  118,
  121,
  123,
  125,
  126,
  125,
  125,
  136,
  136,
  138,
  138,
  142,
  140,
  146,
  144,
  150,
  148,
  151,
  150,
  153,
  153,
  157,
  157,
  157,
  159,
  157,
  157,
  160,
  157,
  161
];

// This data structure maps the number of electrons to a radius for an atom.  It assumes a stable, neutral atom.
// The basic values are the covalent radii, and were taken from a Wikipedia entry entitled "Atomic radii of the
// elements" which, at the time of this writing, can be found here:
// https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page).
// The values are in picometers.
const mapElectronCountToRadius = {
  1: 53,
  2: 31,
  3: 167,
  4: 112,
  5: 87,
  6: 67,
  7: 56,
  8: 48,
  9: 42,
  10: 38,
  11: 190,
  12: 145,
  13: 118,
  14: 111,
  15: 98,
  16: 88,
  17: 79,
  18: 71,
  19: 243,
  20: 194,
  21: 184,
  22: 176,
  23: 171,
  24: 166,
  25: 161,
  26: 156,
  27: 152,
  28: 149,
  29: 145,
  30: 142,
  31: 136,
  32: 125,
  33: 114,
  34: 103,
  35: 94,
  36: 88,
  37: 265,
  38: 219,
  39: 212,
  40: 206,
  41: 198,
  42: 190,
  43: 183,
  44: 178,
  45: 173,
  46: 169,
  47: 165,
  48: 161,
  49: 156,
  50: 145,
  51: 133,
  52: 123,
  53: 115,
  54: 108,
  55: 298,
  56: 253,
  57: 226,
  58: 210,
  59: 247,
  60: 206,
  61: 205,
  62: 238,
  63: 231,
  64: 233,
  65: 225,
  66: 228,
  67: 226,
  68: 226,
  69: 222,
  70: 222,
  71: 217,
  72: 208,
  73: 200,
  74: 193,
  75: 188,
  76: 185,
  77: 180,
  78: 177,
  79: 174,
  80: 171,
  81: 156,
  82: 154,
  83: 143,
  84: 135,
  85: 127,
  86: 120,
  87: 348,
  88: 215,
  89: 195,
  90: 180,
  91: 180,
  92: 175
};

// Table which contains information about the all the possible decays an unstable nuclide can undergo and the percentage
// likelihood that the nuclide will undergo each type of decay. If the decay(s) are unknown or if the percentage
// likelihood is unknown, null is used as a placeholder. The data was obtained from the Nuclear Data Services (NDS) of
// the International Atomic Energy Agency (IAEA) at the url https://www-nds.iaea.org/relnsd/NdsEnsdf/QueryForm.html.
//
// The object is first indexed by the proton number, and then by the neutron number. For example, a nuclide with 1 proton
// and 4 neutrons ( HalfLifeConstants[ 1 ][ 4 ] ) would undergo a decay of type "2N" 100% of the time that it decays.
//
// 'quote-props' lint rule is disabled in order to have consistent styling.
/* eslint-disable quote-props */
const DECAYS_INFO_TABLE = {
  0: {
    1: {
      'B-': 100
    },
    4: null,
    6: null
  },
  1: {
    2: {
      'B-': 100
    },
    3: {
      'N': 100
    },
    4: {
      '2N': 100
    },
    5: null,
    6: null
  },
  2: {
    3: {
      'N': null
    },
    4: {
      'B-': 100
    },
    5: {
      'N': null
    },
    6: {
      'B-': 100,
      'B-N': 16
    },
    7: {
      'N': 100
    },
    8: {
      'N': 100
    }
  },
  3: {
    1: {
      'P': 100
    },
    2: {
      'P': null
    },
    5: {
      'B-A': 100,
      'B-': 100
    },
    6: {
      'B-': 100,
      'B-N': 50.8
    },
    7: {
      'N': 100
    },
    8: {
      'B-': 100,
      'B-5N': null
    },
    9: {
      'N': 100
    }
  },
  4: {
    2: {
      '2P': 100,
      'A': 100
    },
    3: {
      'EC': 100
    },
    4: {
      'A': 100
    },
    6: {
      'B-': 100
    },
    7: {
      'B-': 100,
      'B-A': 3.1,
      'B-P': 0.00083
    },
    8: {
      'B-': 100,
      'B-N': 0.5
    },
    9: {
      'N': null
    },
    10: {
      'B-': 100,
      'B-N': 81,
      'B-2N': 5
    },
    11: {
      'N': 100
    },
    12: {
      'N': 100
    }
  },
  5: {
    2: {
      'P': 100
    },
    3: {
      'B+A': 100,
      'EC+B+': 100
    },
    4: {
      'P': 100
    },
    7: {
      'B-': 100,
      'B-A': 0.6
    },
    8: {
      'B-': 100,
      'B-5N': 0.286
    },
    9: {
      'B-': 100,
      'B-5N': 6.1
    },
    10: {
      'B-': 100,
      'B-5N': 99.68
    },
    11: {
      'N': 100
    },
    12: {
      'B-': 100,
      'B-N': 63,
      'B-2N': 11
    },
    13: {
      'N': 100
    },
    14: {
      'B-': 100,
      'B-N': 71.8,
      'B-2N': 16
    },
    15: {
      'N': 100
    },
    16: {
      '2N': 100
    }
  },
  6: {
    2: {
      '2P': 100
    },
    3: {
      'EC+B+': 100,
      'B+P': 62,
      'B+A': 37.9
    },
    4: {
      'EC+B+': 100
    },
    5: {
      'EC+B+': 100
    },
    8: {
      'B-': 100
    },
    9: {
      'B-': 100
    },
    10: {
      'B-': 100,
      'B-N': 99
    },
    11: {
      'B-': 100,
      'B-N': 26
    },
    12: {
      'B-': 100,
      'B-N': 31.5
    },
    13: {
      'B-': 100,
      'B-N': 47,
      'B-2N': 7
    },
    14: {
      'B-': 100,
      'B-N': 65,
      'B-2N': 18.6
    },
    16: {
      'B-': 100,
      'B-N': 61,
      'B-2N': 37
    }
  },
  7: {
    3: {
      'P': 100
    },
    4: {
      'P': 100
    },
    5: {
      'EC+B+': 100,
      'B+A': 1.93
    },
    6: {
      'EC+B+': 100
    },
    9: {
      'B-': 100,
      'B-A': 0.0012
    },
    10: {
      'B-': 100,
      'B-N': 95.1,
      'B-A': 0.0025
    },
    11: {
      'B-': 100,
      'B-A': 12.2,
      'B-N': 12
    },
    12: {
      'B-': 100,
      'B-N': 41.8
    },
    13: {
      'B-': 100,
      'B-N': 42.9
    },
    14: {
      'B-': 100,
      'B-N': 86
    },
    15: {
      'B-': 100,
      'B-N': 34,
      'B-2N': 12
    },
    16: {
      'B-': 100,
      'B-N': 42,
      'B-2N': 8
    },
    17: {
      'N': null
    }
  },
  8: {
    3: {
      '2P': 100
    },
    4: {
      '2P': 100
    },
    5: {
      'B+P': 100,
      'EC+B+': 100
    },
    6: {
      'EC+B+': 100
    },
    7: {
      'EC+B+': 100
    },
    11: {
      'B-': 100
    },
    12: {
      'B-': 100
    },
    13: {
      'B-': 100
    },
    14: {
      'B-': 100,
      'B-N': 22
    },
    15: {
      'B-': 100,
      'B-N': 7
    },
    16: {
      'B-': 100,
      'B-N': 58
    },
    18: {
      '2N': 100
    }
  },
  9: {
    4: null,
    5: null,
    6: {
      'P': 100
    },
    7: {
      'P': 100
    },
    8: {
      'EC+B+': 100
    },
    9: {
      'EC+B+': 100
    },
    11: {
      'B-': 100
    },
    12: {
      'B-': 100
    },
    13: {
      'B-': 100,
      'B-N': 11
    },
    14: {
      'B-': 100,
      'B-N': 14
    },
    15: {
      'B-': 100,
      'B-N': 5.9
    },
    16: {
      'B-': 100,
      'B-N': 23.1
    },
    17: {
      'B-': 100,
      'B-N': 13.5
    },
    18: {
      'B-': 100,
      'B-N': 77
    },
    19: {
      'N': 100
    },
    20: {
      'B-N': 100,
      'B-': 100
    },
    21: {
      'N': null
    },
    22: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  10: {
    5: {
      '2P': 100
    },
    6: {
      '2P': 100
    },
    7: {
      'EC+B+': 100,
      'ECP': 95.2,
      'ECA': 2.77
    },
    8: {
      'EC+B+': 100
    },
    9: {
      'EC+B+': 100
    },
    13: {
      'B-': 100
    },
    14: {
      'B-': 100
    },
    15: {
      'B-': 100
    },
    16: {
      'B-': 100,
      'B-N': 0.13
    },
    17: {
      'B-': 100,
      'B-N': 2
    },
    18: {
      'B-': 100,
      'B-N': 12,
      'B-2N': 3.7
    },
    19: {
      'B-': 100,
      'B-N': 28,
      'B-2N': 4
    },
    20: {
      'B-': 100,
      'B-N': 13,
      'B-2N': 8.9
    },
    21: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    22: {
      'B-': 100,
      'B-N': null
    },
    23: {
      'N': null
    },
    24: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  11: {
    6: null,
    7: {
      'P': 100
    },
    8: {
      'P': 100
    },
    9: {
      'EC': 100,
      'ECA': 20.05
    },
    10: {
      'EC+B+': 100
    },
    11: {
      'EC+B+': 100
    },
    13: {
      'B-': 100
    },
    14: {
      'B-': 100
    },
    15: {
      'B-': 100
    },
    16: {
      'B-': 100,
      'B-N': 0.13
    },
    17: {
      'B-': 100,
      'B-N': 0.58
    },
    18: {
      'B-': 100,
      'B-N': 21.5
    },
    19: {
      'B-': 100,
      'B-N': 30,
      'B-2N': 1.15
    },
    20: {
      'B-': 100,
      'B-N': 37.3,
      'B-2N': 0.87
    },
    21: {
      'B-': 100,
      'B-N': 24,
      'B-2N': 8.3
    },
    22: {
      'B-': 100,
      'B-N': 47,
      'B-2N': 13
    },
    23: {
      'B-': 100,
      'B-2N': 50,
      'B-N': 15
    },
    24: {
      'B-': 100,
      'B-N': 0,
      'B-4N': null
    },
    25: {
      'N': null
    },
    26: {
      'B-N': null,
      'B-': null
    }
  },
  12: {
    7: {
      '2P': 100
    },
    8: {
      'B+': 100,
      'B+P': 30.3
    },
    9: {
      'EC+B+': 100,
      'B+P': 32.6,
      'B+A': 0.5
    },
    10: {
      'EC+B+': 100
    },
    11: {
      'EC+B+': 100
    },
    15: {
      'B-': 100
    },
    16: {
      'B-': 100
    },
    17: {
      'B-': 100
    },
    18: {
      'B-': 100
    },
    19: {
      'B-': 100,
      'B-N': 6.2
    },
    20: {
      'B-': 100,
      'B-N': 5.5
    },
    21: {
      'B-': 100,
      'B-N': 14
    },
    22: {
      'B-': 100,
      'B-N': null
    },
    23: {
      'B-': 100,
      'B-N': 52,
      'B-3N': null
    },
    24: {
      'B-': 100,
      'B-N': null
    },
    25: {
      'N': null,
      'B-N': null,
      'B-': null
    },
    26: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    27: {
      'N': null
    },
    28: {
      'B-': 100,
      'B-6N': null,
      'B-5N': null
    }
  },
  13: {
    8: {
      'P': null
    },
    9: {
      'EC+B+': 100,
      'B+P': 55,
      'B+2P': 1.1
    },
    10: {
      'EC+B+': 100,
      'ECP': 1.04
    },
    11: {
      'EC+B+': 100,
      'B+A': 0.035,
      'B+P': 0.0016
    },
    12: {
      'EC+B+': 100
    },
    13: {
      'EC+B+': 100
    },
    15: {
      'B-': 100
    },
    16: {
      'B-': 100
    },
    17: {
      'B-': 100
    },
    18: {
      'B-': 100,
      'B-N': 1.6
    },
    19: {
      'B-': 100,
      'B-N': 0.7
    },
    20: {
      'B-': 100,
      'B-N': 8.5
    },
    21: {
      'B-': 100,
      'B-N': 26
    },
    22: {
      'B-': 100,
      'B-N': 38,
      'B-2N': 0
    },
    23: {
      'B-': 100,
      'B-N': 31
    },
    24: {
      'B-': 100,
      'B-N': null
    },
    25: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    26: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    27: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    28: {
      'B-': 100,
      'B-N': null
    },
    29: {
      'B-N': null,
      'B-2N': null,
      'B-': null
    },
    30: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    }
  },
  14: {
    8: {
      'EC+B+': 100,
      'B+P': 32
    },
    9: {
      'EC+B+': 100,
      'ECP': 88,
      'EC2P': 3.6
    },
    10: {
      'EC+B+': 100,
      'B+P': 38
    },
    11: {
      'EC+B+': 100,
      'B+P': 35
    },
    12: {
      'EC+B+': 100
    },
    13: {
      'EC+B+': 100
    },
    17: {
      'B-': 100
    },
    18: {
      'B-': 100
    },
    19: {
      'B-': 100
    },
    20: {
      'B-': 100
    },
    21: {
      'B-': 100,
      'B-N': 5
    },
    22: {
      'B-': 100,
      'B-N': 10
    },
    23: {
      'B-': 100,
      'B-N': 17,
      'B-2N': null
    },
    24: {
      'B-': 100,
      'B-N': 25
    },
    25: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    26: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    27: {
      'B-': 100,
      'B-N': 0
    },
    28: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    29: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    30: {
      'B-': 100,
      'B-N': null
    }
  },
  15: {
    10: {
      'P': 100
    },
    11: {
      'EC+B+': 100,
      'ECP': 36.8,
      'EC2P': 2.16
    },
    12: {
      'EC+B+': 100,
      'B+P': 0.07
    },
    13: {
      'EC+B+': 100,
      'ECP': 0.0013,
      'ECA': 0.00086
    },
    14: {
      'EC+B+': 100
    },
    15: {
      'EC+B+': 100
    },
    17: {
      'B-': 100
    },
    18: {
      'B-': 100
    },
    19: {
      'B-': 100
    },
    20: {
      'B-': 100
    },
    21: {
      'B-': 100
    },
    22: {
      'B-': 100
    },
    23: {
      'B-': 100,
      'B-N': 12
    },
    24: {
      'B-': 100,
      'B-N': 26
    },
    25: {
      'B-': 100,
      'B-N': 15.8,
      'B-2N': null
    },
    26: {
      'B-': 100,
      'B-N': 30
    },
    27: {
      'B-': 100,
      'B-N': 50,
      'B-2N': null
    },
    28: {
      'B-N': 100,
      'B-': 100,
      'B-2N': null
    },
    29: {
      'B-N': null,
      'B-': null
    },
    30: {
      'B-': null
    },
    31: {
      'B-': 100
    }
  },
  16: {
    10: {
      'P': null
    },
    11: {
      'EC+B+': 100,
      'B+P': 2.3,
      'B+2P': 1.1
    },
    12: {
      'EC+B+': 100,
      'ECP': 20.7
    },
    13: {
      'EC+B+': 100,
      'ECP': 47
    },
    14: {
      'EC+B+': 100
    },
    15: {
      'EC+B+': 100
    },
    19: {
      'B-': 100
    },
    21: {
      'B-': 100
    },
    22: {
      'B-': 100
    },
    23: {
      'B-': 100
    },
    24: {
      'B-': 100
    },
    25: {
      'B-': 100,
      'B-N': null
    },
    26: {
      'B-': 100,
      'B-N': 4
    },
    27: {
      'B-': 100,
      'B-N': 40
    },
    28: {
      'B-': 100,
      'B-N': 18
    },
    29: {
      'B-': 100,
      'B-N': 54
    },
    30: {
      'B-': 100
    },
    32: {
      'B-': null
    }
  },
  17: {
    12: {
      'P': 100
    },
    13: {
      'P': null
    },
    14: {
      'EC+B+': 100,
      'ECP': 2.4
    },
    15: {
      'EC+B+': 100,
      'ECA': 0.054,
      'ECP': 0.026
    },
    16: {
      'EC+B+': 100
    },
    17: {
      'EC+B+': 100
    },
    19: {
      'B-': 98.1,
      'EC+B+': 1.9
    },
    21: {
      'B-': 100
    },
    22: {
      'B-': 100
    },
    23: {
      'B-': 100
    },
    24: {
      'B-': 100
    },
    25: {
      'B-': 100
    },
    26: {
      'B-': 100
    },
    27: {
      'B-': 100,
      'B-N': 8
    },
    28: {
      'B-': 100,
      'B-N': 24
    },
    29: {
      'B-': 100,
      'B-N': 60
    },
    30: {
      'B-': 100,
      'B-N': 3
    },
    31: {
      'B-': null
    },
    32: {
      'B-': null
    },
    33: {
      'B-': 100,
      'B-3N': null,
      'B-N': null
    },
    34: {
      'B-': 100
    },
    35: {
      'B-': 100,
      'B-6N': null,
      'B-5N': null
    }
  },
  18: {
    12: {
      '2P': 100
    },
    13: {
      'EC': 100,
      'B+P': 63,
      'B+2P': 7.2
    },
    14: {
      'EC+B+': 100,
      'ECP': 35.58
    },
    15: {
      'EC+B+': 100,
      'ECP': 38.7
    },
    16: {
      'EC+B+': 100
    },
    17: {
      'EC+B+': 100
    },
    19: {
      'EC': 100
    },
    21: {
      'B-': 100
    },
    23: {
      'B-': 100
    },
    24: {
      'B-': 100
    },
    25: {
      'B-': 100
    },
    26: {
      'B-': 100
    },
    27: {
      'B-': 100
    },
    28: {
      'B-': 100
    },
    29: {
      'B-': 100,
      'B-N': 0.2
    },
    30: {
      'B-': 100
    },
    31: {
      'B-': 100,
      'B-N': 65
    },
    32: {
      'B-': 100,
      'B-N': 37,
      'B-2N': null
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    },
    35: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  19: {
    14: {
      'P': null
    },
    15: {
      'P': null
    },
    16: {
      'EC+B+': 100,
      'ECP': 0.37
    },
    17: {
      'EC+B+': 100,
      'ECP': 0.048,
      'ECA': 0.0034
    },
    18: {
      'EC+B+': 100
    },
    19: {
      'EC+B+': 100
    },
    21: {
      'B-': 89.28,
      'EC+B+': 10.72
    },
    23: {
      'B-': 100
    },
    24: {
      'B-': 100
    },
    25: {
      'B-': 100
    },
    26: {
      'B-': 100
    },
    27: {
      'B-': 100
    },
    28: {
      'B-': 100
    },
    29: {
      'B-': 100,
      'B-N': 1.14
    },
    30: {
      'B-': 100,
      'B-N': 86
    },
    31: {
      'B-': 100,
      'B-N': 29,
      'B-2N': null
    },
    32: {
      'B-': 100,
      'B-N': 65
    },
    33: {
      'B-': 100,
      'B-N': 74,
      'B-2N': 2.3
    },
    34: {
      'B-': 100,
      'B-N': 67,
      'B-2N': 17
    },
    35: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    36: {
      'B-N': null,
      'B-': null
    },
    37: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  20: {
    14: {
      '2P': null,
      'P': null
    },
    15: {
      'EC+B+': 100,
      'ECP': 95.9,
      'EC2P': 4.1
    },
    16: {
      'EC+B+': 100,
      'ECP': 51.2
    },
    17: {
      'EC+B+': 100,
      'ECP': 82.1
    },
    18: {
      'EC+B+': 100
    },
    19: {
      'EC+B+': 100
    },
    21: {
      'EC': 100
    },
    25: {
      'B-': 100
    },
    27: {
      'B-': 100
    },
    28: {
      '2B-': 75,
      // '2B-': 69, // TODO: how to handle two of the same decay?
      'B-': 25
    },
    29: {
      'B-': 100
    },
    30: {
      'B-': 100
    },
    31: {
      'B-': 100,
      'B-N': null
    },
    32: {
      'B-': 100,
      'B-N': null
    },
    33: {
      'B-': 100,
      'B-N': 40
    },
    34: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    35: {
      'B-': 100,
      'B-N': null
    },
    36: {
      'B-': 100,
      'B-N': null
    },
    37: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    38: {
      'B-N': null,
      'B-': null
    }
  },
  21: {
    17: {
      'P': null
    },
    18: {
      'P': 100
    },
    19: {
      'EC+B+': 100,
      'ECP': 0.44,
      'ECA': 0.017
    },
    20: {
      'EC+B+': 100
    },
    21: {
      'EC+B+': 100
    },
    22: {
      'EC+B+': 100
    },
    23: {
      'EC+B+': 100
    },
    25: {
      'B-': 100
    },
    26: {
      'B-': 100
    },
    27: {
      'B-': 100
    },
    28: {
      'B-': 100
    },
    29: {
      'B-': 100
    },
    30: {
      'B-': 100,
      'B-N': null
    },
    31: {
      'B-': 100
    },
    32: {
      'B-': 100,
      'B-N': null
    },
    33: {
      'B-': 100,
      'B-N': 16
    },
    34: {
      'B-': 100,
      'B-N': null
    },
    35: {
      'B-': 100,
      'B-N': null
    },
    36: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    37: {
      'B-': 100,
      'B-N': null
    },
    38: {
      'B-': 100,
      'B-N': null
    },
    40: {
      'B-': 100,
      'B-4N': null,
      'B-3N': null
    }
  },
  22: {
    16: {
      '2P': null
    },
    17: {
      'ECP+EC2P': 100,
      'EC+B+': 100,
      'ECP': 93.7
    },
    18: {
      'ECP': 100,
      'EC+B+': 100
    },
    19: {
      'EC+B+': 100,
      'ECP': 100
    },
    20: {
      'EC+B+': 100
    },
    21: {
      'EC+B+': 100,
      'ECP': null
    },
    22: {
      'EC': 100
    },
    23: {
      'EC+B+': 100
    },
    29: {
      'B-': 100
    },
    30: {
      'B-': 100
    },
    31: {
      'B-': 100
    },
    32: {
      'B-': 100
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100,
      'B-N': null
    },
    35: {
      'B-': 100,
      'B-N': null
    },
    36: {
      'B-': 100,
      'B-N': null
    },
    37: {
      'B-': 100
    },
    38: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    39: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    40: {
      'B-N': null,
      'B-': null
    },
    41: {
      'B-N': null,
      'B-': null
    },
    42: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  23: {
    19: {
      'P': null
    },
    20: {
      'EC+B+': 100,
      'ECP': null
    },
    21: {
      'EC+B+': 100,
      'ECA': null
    },
    22: {
      'EC+B+': 100
    },
    23: {
      'EC+B+': 100
    },
    24: {
      'EC+B+': 100
    },
    25: {
      'EC+B+': 100
    },
    26: {
      'EC': 100
    },
    27: {
      'EC+B+': 99.3,
      'B-': 0.7
    },
    29: {
      'B-': 100
    },
    30: {
      'B-': 100
    },
    31: {
      'B-': 100
    },
    32: {
      'B-': 100
    },
    33: {
      'B-': 100,
      'B-N': null
    },
    34: {
      'B-': 100,
      'B-N': null
    },
    35: {
      'B-': 100,
      'B-N': null
    },
    36: {
      'B-': 100,
      'B-N': 0.03
    },
    37: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    38: {
      'B-': 100,
      'B-N': 10,
      'B-2N': null
    },
    39: {
      'B-': 100,
      'B-N': null
    },
    40: {
      'B-': 100,
      'B-N': 35
    },
    41: {
      'B-': 100,
      'B-N': null
    },
    42: {
      'B-': 100,
      'B-N': null
    },
    43: {
      'B-N': null,
      'B-': null
    },
    44: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  24: {
    18: {
      'EC+B+': 100,
      'ECP': 94.4
    },
    19: {
      'EC+B+': 100,
      'ECP': 79.3,
      'EC2P': 11.6
    },
    20: {
      'EC+B+': 100,
      'ECP': 7
    },
    21: {
      'B+': 100,
      'B+P': 34.4
    },
    22: {
      'EC+B+': 100
    },
    23: {
      'EC+B+': 100
    },
    24: {
      'EC+B+': 100
    },
    25: {
      'EC+B+': 100
    },
    26: {
      '2EC': null
    },
    27: {
      'EC': 100
    },
    31: {
      'B-': 100
    },
    32: {
      'B-': 100
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100
    },
    35: {
      'B-': 100
    },
    36: {
      'B-': 100,
      'B-N': null
    },
    37: {
      'B-': 100,
      'B-N': null
    },
    38: {
      'B-': 100,
      'B-N': null
    },
    39: {
      'B-': 100,
      'B-N': null
    },
    40: {
      'B-': 100,
      'B-N': null
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100
    },
    44: {
      'B-': 100,
      'B-N': 0
    },
    45: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    46: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    }
  },
  25: {
    19: {
      'P': null,
      'EC': null
    },
    20: null,
    21: {
      'EC+B+': 100,
      'ECP': 57
    },
    22: {
      'EC+B+': 100,
      'ECP': 3.4
    },
    23: {
      'EC+B+': 100,
      'B+P': 0.28,
      'B+A': 0.0006
    },
    24: {
      'EC+B+': 100
    },
    25: {
      'EC+B+': 100
    },
    26: {
      'EC+B+': 100
    },
    27: {
      'EC+B+': 100
    },
    28: {
      'EC': 100
    },
    29: {
      'EC+B+': 100,
      'B-': 0.000093
    },
    31: {
      'B-': 100
    },
    32: {
      'B-': 100
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100
    },
    35: {
      'IT': 100,
      'B-': 100
    },
    36: {
      'B-': 100,
      'B-N': 0.2
    },
    37: {
      'B-': 100,
      'B-N': null
    },
    38: {
      'B-': 100,
      'B-N': null
    },
    39: {
      'B-': 100,
      'B-N': 33
    },
    40: {
      'B-': 100,
      'B-5N': 21
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100,
      'B-N': null
    },
    43: {
      'B-': 100,
      'B-N': 0
    },
    44: {
      'B-': 100
    },
    45: {
      'B-': 100,
      'B-N': 50
    },
    46: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    },
    47: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    48: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    }
  },
  26: {
    19: {
      '2P': 57,
      'EC+B+': 43,
      'B+P': 43
    },
    20: {
      'EC+B+': 100,
      'ECP': 78.7
    },
    21: {
      'EC+B+': 100,
      'ECP': 0,
      'EC2P': null
    },
    22: {
      'EC+B+': 100,
      'ECP': 3.6
    },
    23: {
      'EC+B+': 100,
      'B+P': 56.7
    },
    24: {
      'EC+B+': 100,
      'ECP': 0
    },
    25: {
      'EC+B+': 100
    },
    26: {
      'EC+B+': 100
    },
    27: {
      'EC+B+': 100
    },
    29: {
      'EC': 100
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100
    },
    35: {
      'B-': 100
    },
    36: {
      'B-': 100
    },
    37: {
      'B-': 100
    },
    38: {
      'B-': 100
    },
    39: {
      'B-': 100
    },
    40: {
      'B-': 100
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100,
      'B-N': 0
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100,
      'B-N': null
    },
    45: {
      'B-': 100,
      'B-N': null
    },
    46: {
      'B-': 100,
      'B-N': 27.6
    },
    47: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    48: {
      'B-N': null,
      'B-2N': null,
      'B-': null
    },
    49: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    }
  },
  27: {
    23: {
      'EC+B+': 100,
      'ECP': 70.5,
      'EC2P': null
    },
    24: {
      'EC+B+': 100,
      'ECP': 3.8
    },
    25: {
      'EC+B+': 100,
      'B+P': null
    },
    26: {
      'EC+B+': 100
    },
    27: {
      'EC+B+': 100
    },
    28: {
      'EC+B+': 100
    },
    29: {
      'EC+B+': 100
    },
    30: {
      'EC': 100
    },
    31: {
      'EC+B+': 100
    },
    33: {
      'B-': 100
    },
    34: {
      'B-': 100
    },
    35: {
      'B-': 100
    },
    36: {
      'B-': 100
    },
    37: {
      'B-': 100
    },
    38: {
      'B-': 100
    },
    39: {
      'B-': 100
    },
    40: {
      'B-': 100
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100
    },
    43: {
      'B-': 100,
      'B-N': null
    },
    44: {
      'B-': 100,
      'B-N': 6
    },
    45: {
      'B-': 100,
      'B-N': 6
    },
    46: {
      'B-': 100,
      'B-N': 22,
      'B-2N': null
    },
    47: {
      'B-': 100,
      'B-N': 18,
      'B-2N': null
    },
    48: {
      'B-': 100,
      'B-N': 16,
      'B-2N': null
    },
    49: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    50: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  28: {
    20: {
      '2P': null,
      'EC+B+': null
    },
    21: {
      'EC+B+': 100,
      'B+P': 83
    },
    22: {
      'EC+B+': 100,
      'ECP': 73,
      'EC2P': 14
    },
    23: {
      'EC+B+': 100,
      'ECP': 87.2,
      'EC2P': 0.5
    },
    24: {
      'EC+B+': 100,
      'B+P': 31.4
    },
    25: {
      'EC+B+': 100,
      'ECP': 23.4
    },
    26: {
      'EC+B+': 100
    },
    27: {
      'EC+B+': 100
    },
    28: {
      'EC+B+': 100
    },
    29: {
      'EC+B+': 100
    },
    31: {
      'EC+B+': 100
    },
    35: {
      'B-': 100
    },
    37: {
      'B-': 100
    },
    38: {
      'B-': 100
    },
    39: {
      'B-': 100
    },
    40: {
      'B-': 100
    },
    41: {
      'B-': 100,
      'B-N': null
    },
    42: {
      'B-': 100
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100
    },
    45: {
      'B-': 100,
      'B-N': null
    },
    46: {
      'B-': 100,
      'B-N': null
    },
    47: {
      'B-': 100,
      'B-N': 10
    },
    48: {
      'B-': 100,
      'B-N': null
    },
    49: {
      'B-': 100,
      'B-N': 26,
      'B-2N': null
    },
    50: {
      'B-': 100,
      'B-N': null
    },
    51: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    52: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    54: null
  },
  29: {
    24: {
      'P': null
    },
    25: {
      'P': null
    },
    26: {
      'ECP': 15,
      'B+': null,
      'P': null
    },
    27: {
      'B+': 100,
      'B+P': 0.4
    },
    28: {
      'EC+B+': 100
    },
    29: {
      'EC+B+': 100
    },
    30: {
      'EC+B+': 100
    },
    31: {
      'EC+B+': 100
    },
    32: {
      'EC+B+': 100
    },
    33: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 61.5,
      'B-': 38.5
    },
    37: {
      'B-': 100
    },
    38: {
      'B-': 100
    },
    39: {
      'B-': 100
    },
    40: {
      'B-': 100
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100,
      'B-N': null
    },
    45: {
      'B-': 100,
      'B-N': 0
    },
    46: {
      'B-': 100,
      'B-N': 3.5
    },
    47: {
      'B-': 100,
      'B-N': 3
    },
    48: {
      'B-': 100,
      'B-N': 30.1
    },
    49: {
      'B-': 100,
      'B-N': 65
    },
    50: {
      'B-': 100,
      'B-N': 66,
      'B-2N': null
    },
    51: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    52: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    53: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  30: {
    24: {
      '2P': 92
    },
    25: {
      'ECP': 91,
      'B+': null
    },
    26: {
      'ECP': 86,
      'B+P': null,
      'B+': null
    },
    27: {
      'EC+B+': 100,
      'B+P': 65
    },
    28: {
      'EC+B+': 100,
      'ECP': 3
    },
    29: {
      'EC+B+': 100,
      'ECP': 0.1
    },
    30: {
      'EC+B+': 100
    },
    31: {
      'EC+B+': 100
    },
    32: {
      'EC+B+': 100
    },
    33: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 100
    },
    39: {
      'B-': 100
    },
    40: {
      '2B-': 100
      // '2B-': null // TODO: how to handle two of the same decay?
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100
    },
    45: {
      'B-': 100
    },
    46: {
      'B-': 100
    },
    47: {
      'B-': 100
    },
    48: {
      'B-': 100
    },
    49: {
      'B-': 100,
      'B-N': 1.7
    },
    50: {
      'B-': 100,
      'B-N': 1
    },
    51: {
      'B-': 100,
      'B-N': 7.5
    },
    52: {
      'B-': 100,
      'B-N': 69
    },
    53: {
      'B-': 100,
      'B-N': null
    },
    54: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    },
    55: {
      'B-N': null,
      'B-2N': null,
      'B-': null
    }
  },
  31: {
    28: {
      'P': null
    },
    29: {
      'EC+B+': 100,
      'B+P': 1.6,
      'B+A': 0.023
    },
    30: {
      'EC+B+': 100,
      'ECP': 0.25
    },
    31: {
      'EC+B+': 100,
      'ECP': null
    },
    32: {
      'EC+B+': 100
    },
    33: {
      'EC+B+': 100
    },
    34: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 100
    },
    36: {
      'EC': 100
    },
    37: {
      'EC+B+': 100
    },
    39: {
      'B-': 99.59,
      'EC': 0.41
    },
    41: {
      'B-': 100
    },
    42: {
      'B-': 100
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100
    },
    45: {
      'B-': 100
    },
    46: {
      'B-': 100
    },
    47: {
      'B-': 100
    },
    48: {
      'B-': 100,
      'B-N': 0.089
    },
    49: {
      'B-': 100,
      'B-N': 0.86
    },
    50: {
      'B-': 100,
      'B-N': 11.9
    },
    51: {
      'B-': 100,
      'B-N': 22.2
    },
    52: {
      'B-': 100,
      'B-N': 62.8
    },
    53: {
      'B-': 100,
      'B-N': 70
    },
    54: {
      'B-': 100,
      'B-N': 35
    },
    55: {
      'B-': 100,
      'B-N': 60,
      'B-2N': 20
    },
    56: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    }
  },
  32: {
    27: {
      '2P': 0.2,
      'EC+B+': null
    },
    28: {
      'ECP': null,
      'EC+B+': null
    },
    29: {
      'EC+B+': 100,
      'ECP': 62
    },
    30: {
      'EC+B+': 100,
      'ECP': null
    },
    31: {
      'EC+B+': 100
    },
    32: {
      'EC+B+': 100
    },
    33: {
      'EC+B+': 100,
      'ECP': 0.011
    },
    34: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 100
    },
    36: {
      'EC': 100
    },
    37: {
      'EC+B+': 100
    },
    39: {
      'EC': 100
    },
    43: {
      'B-': 100
    },
    45: {
      'B-': 100
    },
    46: {
      'B-': 100
    },
    47: {
      'B-': 100
    },
    48: {
      'B-': 100
    },
    49: {
      'B-': 100
    },
    50: {
      'B-': 100
    },
    51: {
      'B-': 100,
      'B-N': null
    },
    52: {
      'B-': 100,
      'B-N': 10.2
    },
    53: {
      'B-': 100,
      'B-N': 16.5,
      'B-2N': null
    },
    54: {
      'B-': 100,
      'B-N': 45
    },
    55: {
      'B-': 100,
      'B-N': null
    },
    56: {
      'B-': null,
      'B-N': null
    },
    57: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    58: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  33: {
    30: {
      'P': null
    },
    31: {
      'EC+B+': 100
    },
    32: {
      'EC+B+': 100
    },
    33: {
      'EC+B+': 100
    },
    34: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 100
    },
    36: {
      'EC+B+': 100
    },
    37: {
      'EC+B+': 100
    },
    38: {
      'EC+B+': 100
    },
    39: {
      'EC+B+': 100
    },
    40: {
      'EC': 100
    },
    41: {
      'EC+B+': 66,
      'B-': 34
    },
    43: {
      'B-': 100
    },
    44: {
      'B-': 100
    },
    45: {
      'B-': 100
    },
    46: {
      'B-': 100
    },
    47: {
      'B-': 100
    },
    48: {
      'B-': 100
    },
    49: {
      'B-': 100
    },
    50: {
      'B-': 100
    },
    51: {
      'B-': 100,
      'B-N': 0.18
    },
    52: {
      'B-': 100,
      'B-N': 62.9
    },
    53: {
      'B-': 100,
      'B-N': 35.5,
      'B-2N': null
    },
    54: {
      'B-': 100,
      'B-N': 15.4
    },
    55: {
      'B-': 100,
      'B-N': null
    },
    56: {
      'B-N': null,
      'B-2N': null,
      'B-': null
    },
    57: {
      'B-': 100,
      'B-N': null
    },
    58: {
      'B-': 100,
      'B-N': null
    },
    59: {
      'B-': 100
    }
  },
  34: {
    30: {
      'EC+B+': 100
    },
    31: {
      'ECP': 100,
      'EC+B+': 100
    },
    32: {
      'EC': 100
    },
    33: {
      'EC+B+': 100,
      'B+P': 0.5
    },
    34: {
      'EC+B+': 100
    },
    35: {
      'EC+B+': 100,
      'ECP': 0.052
    },
    36: {
      'EC+B+': 100
    },
    37: {
      'EC+B+': 100
    },
    38: {
      'EC': 100
    },
    39: {
      'EC+B+': 100
    },
    41: {
      'EC': 100
    },
    45: {
      'B-': 100
    },
    47: {
      'B-': 100
    },
    48: {
      '2B-': 100
    },
    49: {
      'B-': 100
    },
    50: {
      'B-': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100
    },
    53: {
      'B-': 100,
      'B-N': 0.36
    },
    54: {
      'B-': 100,
      'B-N': 0.99
    },
    55: {
      'B-': 100,
      'B-N': 7.8
    },
    56: {
      'B-': 100,
      'B-N': null
    },
    57: {
      'B-': 100,
      'B-N': 21
    },
    58: {
      'B-': 100
    },
    59: {
      'B-': 100
    },
    60: {
      'B-': 100
    },
    61: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    }
  },
  35: {
    34: {
      'P': 100
    },
    35: {
      'EC+B+': 100
    },
    36: {
      'EC+B+': 100
    },
    37: {
      'EC+B+': 100
    },
    38: {
      'EC+B+': 100
    },
    39: {
      'EC+B+': 100
    },
    40: {
      'EC+B+': 100
    },
    41: {
      'EC+B+': 100
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 99.99,
      'B-': 0.01
    },
    45: {
      'B-': 91.7,
      'EC+B+': 8.3
    },
    47: {
      'B-': 100
    },
    48: {
      'B-': 100
    },
    49: {
      'B-': 100
    },
    50: {
      'B-': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100,
      'B-N': 2.6
    },
    53: {
      'B-': 100,
      'B-N': 6.58
    },
    54: {
      'B-': 100,
      'B-N': 13.8
    },
    55: {
      'B-': 100,
      'B-N': 25.3
    },
    56: {
      'B-': 100,
      'B-N': 19.5
    },
    57: {
      'B-': 100,
      'B-N': 33.1
    },
    58: {
      'B-': 100,
      'B-N': 68
    },
    59: {
      'B-': 100,
      'B-N': 68
    },
    60: {
      'B-': 100,
      'B-N': 34
    },
    61: {
      'B-': 100,
      'B-N': 27.6
    },
    62: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    63: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    },
    66: {
      'B-': 100,
      'B-3N': null,
      'B-N': null
    }
  },
  36: {
    33: {
      'EC+B+': 100,
      'B+P': 99
    },
    34: {
      'EC+B+': 100,
      'ECP': 1.3
    },
    35: {
      'EC+B+': 100,
      'ECP': 2.1
    },
    36: {
      'EC+B+': 100,
      'ECP': 0.000001
    },
    37: {
      'EC+B+': 100,
      'ECP': 0.25
    },
    38: {
      'EC+B+': 100
    },
    39: {
      'EC+B+': 100
    },
    40: {
      'EC+B+': 100
    },
    41: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100
    },
    45: {
      'EC': 100
    },
    49: {
      'B-': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100
    },
    53: {
      'B-': 100
    },
    54: {
      'B-': 100
    },
    55: {
      'B-': 100
    },
    56: {
      'B-': 100,
      'B-N': 0.0332
    },
    57: {
      'B-': 100,
      'B-N': 1.95
    },
    58: {
      'B-': 100,
      'B-N': 1.11
    },
    59: {
      'B-': 100,
      'B-N': 2.87
    },
    60: {
      'B-': 100,
      'B-N': 3.7
    },
    61: {
      'B-': 100,
      'B-N': 6.7
    },
    62: {
      'B-': 100,
      'B-N': 7,
      'B-2N': null
    },
    63: {
      'B-': 100,
      'B-N': 11
    },
    64: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    65: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    66: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  37: {
    35: {
      'P': null,
      'EC+B+': null
    },
    36: {
      'EC+B+': null,
      'P': null
    },
    37: {
      'EC+B+': 100
    },
    38: {
      'EC+B+': 100
    },
    39: {
      'EC+B+': 100,
      'ECA': 0.00000038
    },
    40: {
      'EC+B+': 100
    },
    41: {
      'EC+B+': 100
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100
    },
    46: {
      'EC': 100
    },
    47: {
      'EC+B+': 96.1,
      'B-': 3.9
    },
    49: {
      'B-': 99.9948,
      'EC': 0.0052
    },
    50: {
      'B-': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100
    },
    53: {
      'B-': 100
    },
    54: {
      'B-': 100
    },
    55: {
      'B-': 100,
      'B-N': 0.0107
    },
    56: {
      'B-': 100,
      'B-N': 1.39
    },
    57: {
      'B-': 100,
      'B-N': 10.5
    },
    58: {
      'B-': 100,
      'B-N': 8.7
    },
    59: {
      'B-': 100,
      'B-N': 13.3
    },
    60: {
      'B-': 100,
      'B-N': 25.5,
      'B-2N': null
    },
    61: {
      'B-': 100,
      'B-N': 14.3,
      'B-2N': 0.054
    },
    62: {
      'B-': 100,
      'B-N': 19.8,
      'B-2N': null
    },
    63: {
      'B-': 100,
      'B-N': 5.6,
      'B-2N': 0.15
    },
    64: {
      'B-': 100,
      'B-N': 28
    },
    65: {
      'B-': 100,
      'B-N': 18
    },
    66: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    67: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    68: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    },
    69: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    }
  },
  38: {
    35: {
      'EC+B+': 100,
      'ECP': null
    },
    36: {
      'EC+B+': 100,
      'ECP': null
    },
    37: {
      'EC+B+': 100,
      'ECP': 5.2
    },
    38: {
      'EC+B+': 100,
      'ECP': 0.000034
    },
    39: {
      'EC+B+': 100,
      'ECP': 0.08
    },
    40: {
      'EC+B+': 100
    },
    41: {
      'EC+B+': 100
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100
    },
    44: {
      'EC': 100
    },
    45: {
      'EC+B+': 100
    },
    47: {
      'EC': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100
    },
    53: {
      'B-': 100
    },
    54: {
      'B-': 100
    },
    55: {
      'B-': 100
    },
    56: {
      'B-': 100
    },
    57: {
      'B-': 100
    },
    58: {
      'B-': 100
    },
    59: {
      'B-': 100,
      'B-N': 0.05
    },
    60: {
      'B-': 100,
      'B-N': 0.23
    },
    61: {
      'B-': 100,
      'B-N': 0.1
    },
    62: {
      'B-': 100,
      'B-N': 1.11
    },
    63: {
      'B-': 100,
      'B-N': 2.37
    },
    64: {
      'B-': 100,
      'B-N': 5.5
    },
    65: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    66: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    67: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    68: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    69: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    70: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    }
  },
  39: {
    37: {
      'P': null,
      'EC+B+': null
    },
    38: {
      'EC+B+': 100,
      'P': null,
      'ECP': null
    },
    39: {
      'EC+B+': 100,
      'ECP': null
    },
    40: {
      'EC+B+': 100,
      'ECP': null
    },
    41: {
      'EC+B+': 100,
      'ECP': null
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    51: {
      'B-': 100
    },
    52: {
      'B-': 100
    },
    53: {
      'B-': 100
    },
    54: {
      'B-': 100
    },
    55: {
      'B-': 100
    },
    56: {
      'B-': 100
    },
    57: {
      'B-': 100
    },
    58: {
      'B-': 100,
      'B-N': 0.055
    },
    59: {
      'B-': 100,
      'B-N': 0.33
    },
    60: {
      'B-': 100,
      'B-N': 1.77
    },
    61: {
      'B-': 100,
      'B-N': 1.02
    },
    62: {
      'B-': 100,
      'B-N': 1.94
    },
    63: {
      'B-': 100,
      'B-N': 4.9
    },
    64: {
      'B-': 100,
      'B-N': 8
    },
    65: {
      'B-': 100,
      'B-N': 34,
      'B-2N': null
    },
    66: {
      'B-': 100,
      'B-N': 82
    },
    67: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    68: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    69: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    72: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    }
  },
  40: {
    37: {
      '2P': null,
      'ECP': null,
      'EC+B+': null
    },
    38: {
      'EC+B+': null
    },
    39: {
      'EC+B+': 100,
      'ECP': null
    },
    40: {
      'EC+B+': 100,
      'ECP': null
    },
    41: {
      'EC+B+': 100,
      'ECP': 0.12
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100,
      'ECP': null
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100
    },
    48: {
      'EC': 100
    },
    49: {
      'EC+B+': 100
    },
    53: {
      'B-': 100
    },
    55: {
      'B-': 100
    },
    56: null,
    57: {
      'B-': 100
    },
    58: {
      'B-': 100
    },
    59: {
      'B-': 100
    },
    60: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100,
      'B-N': 2
    },
    66: {
      'B-': 100,
      'B-N': 7
    },
    67: {
      'B-': 100,
      'B-N': 23
    },
    68: {
      'B-': 100,
      'B-N': null
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    71: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    72: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    73: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    74: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  41: {
    40: {
      'EC+B+': null
    },
    41: {
      'EC+B+': 100,
      'ECP': null
    },
    42: {
      'EC+B+': 100
    },
    43: {
      'EC+B+': 100,
      'ECP': null
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    50: {
      'EC+B+': 100
    },
    51: {
      'EC+B+': 100
    },
    53: {
      'B-': 100
    },
    54: {
      'B-': 100
    },
    55: {
      'B-': 100
    },
    56: {
      'B-': 100
    },
    57: {
      'B-': 100
    },
    58: {
      'B-': 100
    },
    59: {
      'B-': 100
    },
    60: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100,
      'B-N': 0.06
    },
    64: {
      'B-': 100,
      'B-N': 1.7
    },
    65: {
      'B-': 100,
      'B-N': 4.5
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100,
      'B-N': 6.3,
      'B-2N': null
    },
    68: {
      'B-': 100,
      'B-N': 15
    },
    69: {
      'B-': 100,
      'B-N': 40
    },
    70: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    73: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    74: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    75: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    },
    76: {
      'B-': 100,
      'B-2N': null,
      'B-3N': null
    }
  },
  42: {
    39: {
      'EC+B+': null,
      'ECP': null
    },
    40: {
      'EC+B+': 100,
      'ECP': null
    },
    41: {
      'EC+B+': 100
    },
    42: {
      'EC+B+': 100,
      'ECP': null
    },
    43: {
      'EC+B+': 100,
      'ECP': 0.14
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100,
      'B+P': 15
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    51: {
      'EC': 100
    },
    57: {
      'B-': 100
    },
    58: {
      '2B-': 100
      // '2B-': 100 // TODO: how to handle two of the same decay?
    },
    59: {
      'B-': 100
    },
    60: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100,
      'B-N': 1.3
    },
    68: {
      'B-': 100,
      'B-N': 2
    },
    69: {
      'B-': 100,
      'B-N': 12
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100,
      'B-N': null
    },
    72: {
      'B-': 100,
      'B-N': null
    },
    73: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    74: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    75: {
      'B-2N': null,
      'B-N': null,
      'B-': null
    },
    76: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    77: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  43: {
    42: {
      'P': null
    },
    43: {
      'EC+B+': 100,
      'ECP': null
    },
    44: {
      'EC+B+': 100
    },
    45: {
      'EC+B+': 100,
      'ECP': null
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC': 100
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    50: {
      'EC+B+': 100
    },
    51: {
      'EC+B+': 100
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    54: {
      'EC': 100
    },
    55: {
      'B-': 100
    },
    56: {
      'B-': 100
    },
    57: {
      'B-': 99.9974,
      'EC': 0.0026
    },
    58: {
      'B-': 100
    },
    59: {
      'B-': 100
    },
    60: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100,
      'B-N': 0.08
    },
    67: {
      'B-': 100,
      'B-N': 0.04
    },
    68: {
      'B-': 100,
      'B-N': 0.85
    },
    69: {
      'B-': 100,
      'B-N': 1.5
    },
    70: {
      'B-': 100,
      'B-N': 2.1
    },
    71: {
      'B-': 100,
      'B-N': null
    },
    72: {
      'B-': 100,
      'B-N': null
    },
    73: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    74: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    75: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    76: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    77: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    78: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    79: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  44: {
    41: {
      'P': null,
      'ECP': null,
      'EC+B+': null
    },
    42: {
      'ECP': null,
      'EC+B+': null
    },
    44: {
      'EC+B+': 100,
      'ECP': null
    },
    45: {
      'EC+B+': 100,
      'ECP': 3
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    50: {
      'EC': 100,
      'B++EC': 100
    },
    51: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    59: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100
    },
    68: {
      'B-': 100
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100,
      'B-N': null
    },
    72: {
      'B-': 100,
      'B-N': null
    },
    73: {
      'B-': 100,
      'B-N': null
    },
    74: {
      'B-': 100,
      'B-N': null
    },
    75: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    76: {
      'B-': 100,
      'B-N': null
    },
    77: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    78: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    79: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    80: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    81: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    }
  },
  45: {
    44: {
      'EC+B+': null,
      'ECP': null,
      'P': null
    },
    45: {
      'EC+B+': 100,
      'ECP': 0.7
    },
    46: {
      'EC+B+': 100,
      'B+P': 1.3
    },
    47: {
      'EC+B+': 100,
      'B+P': 1.9
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100,
      'ECP': 1.8
    },
    50: {
      'EC+B+': 100
    },
    51: {
      'EC+B+': 100
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    54: {
      'EC+B+': 100
    },
    55: {
      'EC+B+': 100
    },
    56: {
      'EC': 100
    },
    57: {
      'EC+B+': 78,
      'B-': 22
    },
    59: {
      'B-': 99.55,
      'EC+B+': 0.45
    },
    60: {
      'B-': 100
    },
    61: {
      'B-': 100
    },
    62: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100
    },
    68: {
      'B-': 100
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100
    },
    73: {
      'B-': 100,
      'B-N': 3.1
    },
    74: {
      'B-': 100,
      'B-N': 6.4
    },
    75: {
      'B-': 100,
      'B-N': 5.4,
      'B-2N': null
    },
    76: {
      'B-': 100,
      'B-N': null
    },
    77: {
      'B-2N': null,
      'B-': null,
      'B-N': null
    },
    78: {
      'B-': 100,
      'B-N': 24.2,
      'B-2N': null
    },
    79: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    80: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    81: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    82: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    83: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  46: {
    44: {
      'EC+B+': 100,
      '2P': null,
      'ECP': null
    },
    45: {
      'EC+B+': 100
    },
    46: {
      'EC+B+': 100
    },
    47: {
      'EC+B+': 100,
      'ECP': null
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC+B+': 100
    },
    50: {
      'EC+B+': 100
    },
    51: {
      'EC+B+': 100
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    54: {
      'EC': 100
    },
    55: {
      'EC+B+': 100
    },
    57: {
      'EC': 100
    },
    61: {
      'B-': 100
    },
    63: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100
    },
    68: {
      'B-': 100
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100
    },
    73: {
      'B-': 100
    },
    74: {
      'B-': 100,
      'B-N': 0.7
    },
    75: {
      'B-': 100,
      'B-N': 0.8
    },
    76: {
      'B-': 100,
      'B-N': 2.5
    },
    77: {
      'B-': 100,
      'B-N': 1.4
    },
    78: {
      'B-': 100,
      'B-N': null
    },
    79: {
      'B-': 100,
      'B-N': null
    },
    80: {
      'B-': null,
      'B-N': null
    },
    81: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    82: {
      'B-': 100,
      'B-N': null
    },
    83: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    84: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    85: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    }
  },
  47: {
    45: {
      'EC+B+': null,
      'ECP': null,
      'P': null
    },
    46: {
      'ECP': null,
      'EC+B+': null,
      'P': null
    },
    47: {
      'EC+B+': 100,
      'ECP': null
    },
    48: {
      'EC+B+': 100,
      'ECP': null
    },
    49: {
      'EC+B+': 100,
      'ECP': 8.5
    },
    50: {
      'EC': 100
    },
    51: {
      'EC+B+': 100,
      'ECP': 0.0011
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    54: {
      'EC+B+': 100
    },
    55: {
      'EC+B+': 100
    },
    56: {
      'EC+B+': 100
    },
    57: {
      'EC+B+': 100
    },
    58: {
      'EC+B+': 100
    },
    59: {
      'EC+B+': 99.5,
      'B-': 1
    },
    61: {
      'B-': 97.15,
      'EC+B+': 2.85
    },
    63: {
      'B-': 99.7,
      'EC': 0.3
    },
    64: {
      'B-': 100
    },
    65: {
      'B-': 100
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 100
    },
    68: {
      'B-': 100
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100
    },
    73: {
      'B-': 100,
      'B-N': 0.003
    },
    74: {
      'B-': 100,
      'B-N': 0.08
    },
    75: {
      'B-': 99.8,
      'B-N': 0.186
    },
    76: {
      'B-': 100,
      'B-N': 0.62
    },
    77: {
      'B-': 100,
      'B-N': 1.3
    },
    78: {
      'B-': 100,
      'B-N': null
    },
    79: {
      'B-': 100,
      'B-N': null
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100,
      'B-N': null
    },
    82: {
      'B-': 100,
      'B-N': 0
    },
    83: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    84: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    85: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    }
  },
  48: {
    46: {
      'ECP': null,
      'EC+B+': null
    },
    47: {
      'B+': 100,
      'B+P': 4.5
    },
    48: {
      'EC+B+': 100
    },
    49: {
      'EC': 100,
      'ECP': null
    },
    50: {
      'EC+B+': 100,
      'ECP': 0.029
    },
    51: {
      'EC+B+': 100,
      'B+P': 0.17,
      'B+A': 0.0001
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100
    },
    54: {
      'EC+B+': 100
    },
    55: {
      'EC+B+': 100
    },
    56: {
      'EC+B+': 100
    },
    57: {
      'EC+B+': 100
    },
    59: {
      'EC+B+': 100
    },
    61: {
      'EC': 100
    },
    65: {
      'B-': 100
    },
    67: {
      'B-': 100
    },
    68: {
      '2B-': null
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100
    },
    73: {
      'B-': 100
    },
    74: {
      'B-': 100
    },
    75: {
      'B-': 100
    },
    76: {
      'B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      'B-': 100
    },
    79: {
      'B-': 100
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100,
      'B-N': 0
    },
    82: {
      'B-': 100,
      'B-N': 3.5
    },
    83: {
      'B-': 100,
      'B-N': 3.5
    },
    84: {
      'B-': 100,
      'B-N': 60,
      'B-2N': null
    },
    85: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    86: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    }
  },
  49: {
    47: {
      'ECP': null,
      'EC+B+': null,
      'P': null
    },
    48: {
      'B+': 100,
      'B+P': 1.7
    },
    49: {
      'EC+B+': 100,
      'ECP': 0.13
    },
    50: {
      'B+P': 0.9
    },
    51: {
      'EC+B+': 100,
      'ECP': 1.66
    },
    52: {
      'EC+B+': 100,
      'B+P': null
    },
    53: {
      'EC+B+': 100,
      'B+P': 0.0093
    },
    54: {
      'EC+B+': 100
    },
    55: {
      'EC+B+': 100
    },
    56: {
      'EC+B+': 100
    },
    57: {
      'EC+B+': 100
    },
    58: {
      'EC+B+': 100
    },
    59: {
      'EC+B+': 100
    },
    60: {
      'EC+B+': 100
    },
    61: {
      'EC+B+': 100
    },
    62: {
      'EC': 100
    },
    63: {
      'EC+B+': 62,
      'B-': 38
    },
    65: {
      'B-': 99.5,
      'EC+B+': 0.5
    },
    66: {
      'B-': 100
    },
    67: {
      'B-': 99.977,
      'EC': 0.023
    },
    68: {
      'B-': 100
    },
    69: {
      'B-': 100
    },
    70: {
      'B-': 100
    },
    71: {
      'B-': 100
    },
    72: {
      'B-': 100
    },
    73: {
      'B-': 100
    },
    74: {
      'B-': 100
    },
    75: {
      'B-': 100
    },
    76: {
      'B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      'B-': 100,
      'B-N': 0.03
    },
    79: {
      'B-': 100,
      'B-N': 0.046
    },
    80: {
      'B-': 100,
      'B-N': 0.23
    },
    81: {
      'B-': 100,
      'B-N': 0.93
    },
    82: {
      'B-': 100,
      'B-N': 2
    },
    83: {
      'B-': 100,
      'B-N': 7.4,
      'B-2N': null
    },
    84: {
      'B-': 100,
      'B-N': 85
    },
    85: {
      'B-': 100,
      'B-N': 65
    },
    86: {
      'B-': 100,
      'B-N': 0,
      'B-2N': null
    },
    87: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    88: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  50: {
    49: {
      'ECP': null,
      'EC+B+': null
    },
    50: {
      'EC+B+': 100,
      'ECP': 17
    },
    51: {
      'EC+B+': 100,
      'ECP': 26
    },
    52: {
      'EC+B+': 100
    },
    53: {
      'EC+B+': 100,
      'ECP': 1.2
    },
    54: {
      'EC+B+': 100
    },
    55: {
      'EC+B+': 100,
      'B+P': 0.011
    },
    56: {
      'EC+B+': 100
    },
    57: {
      'EC+B+': 100
    },
    58: {
      'EC+B+': 100
    },
    59: {
      'EC+B+': 100
    },
    60: {
      'EC': 100
    },
    61: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100
    },
    71: {
      'B-': 100
    },
    73: {
      'B-': 100
    },
    75: {
      'B-': 100
    },
    76: {
      'B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      'B-': 100
    },
    79: {
      'B-': 100
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100
    },
    82: {
      'B-': 100
    },
    83: {
      'B-': 100,
      'B-N': 0.0294
    },
    84: {
      'B-': 100,
      'B-N': 17
    },
    85: {
      'B-': 100,
      'B-N': 21,
      'B-2N': null
    },
    86: {
      'B-': 100,
      'B-N': 27
    },
    87: {
      'B-': 100,
      'B-N': 58
    },
    88: {
      'B-': 100,
      'B-N': 36,
      'B-2N': null
    },
    89: {
      'B-': 100,
      'B-3N': null,
      'B-2N': null
    },
    90: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  51: {
    52: {
      'P': null
    },
    53: {
      'EC+B+': 100,
      'ECP': 7,
      'P': 1
    },
    54: {
      'EC+B+': 100,
      'P': null
    },
    55: {
      'EC+B+': null
    },
    56: {
      'EC+B+': 100
    },
    57: {
      'EC+B+': 100
    },
    58: {
      'EC+B+': 100
    },
    59: {
      'EC+B+': 100
    },
    60: {
      'EC+B+': 100
    },
    61: {
      'EC+B+': 100
    },
    62: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100
    },
    66: {
      'EC+B+': 100,
      'B+': 1.7
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC': 100
    },
    69: {
      'EC+B+': 100
    },
    71: {
      'B-': 97.59,
      'EC+B+': 2.41
    },
    73: {
      'B-': 100
    },
    74: {
      'B-': 100
    },
    75: {
      'B-': 100
    },
    76: {
      'B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      'B-': 100
    },
    79: {
      'B-': 100
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100
    },
    82: {
      'B-': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100,
      'B-N': 22
    },
    85: {
      'B-': 100,
      'B-N': 18.5,
      'B-2N': 1
    },
    86: {
      'B-': 100,
      'B-N': 49
    },
    87: {
      'B-N': 72,
      'B-2N': null,
      'B-': null
    },
    88: {
      'B-': 100,
      'B-N': 90,
      'B-2N': null
    },
    89: {
      'B-': 100,
      'B-N': 23,
      'B-2N': 7.6
    },
    90: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    91: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  52: {
    52: {
      'A': 100,
      '2P': null
    },
    53: {
      'A': 100
    },
    54: {
      'A': 100
    },
    55: {
      'A': 70,
      'EC+B+': 30
    },
    56: {
      'EC+B+': 51,
      'A': 49,
      'B+P': 2.4
    },
    57: {
      'EC+B+': 96.1,
      'B+P': 9.4,
      'A': 3.9
    },
    58: {
      'EC+B+': 100,
      'A': 0.00067
    },
    59: {
      'EC+B+': 100,
      'B+P': null
    },
    60: {
      'EC+B+': 100
    },
    61: {
      'EC+B+': 100
    },
    62: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100,
      'B+': 25
    },
    66: {
      'EC': 100
    },
    67: {
      'EC+B+': 100,
      'B+': 2.06
    },
    69: {
      'EC+B+': 100
    },
    71: {
      'EC': 100
    },
    75: {
      'B-': 100
    },
    76: {
      '2B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      '2B-': 100
    },
    79: {
      'B-': 100
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100
    },
    82: {
      'B-': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100,
      'B-N': 1.31
    },
    85: {
      'B-': 100,
      'B-N': 2.99
    },
    86: {
      'B-': 100,
      'B-N': 6.3
    },
    87: {
      'B-': 100,
      'B-N': null
    },
    88: {
      'B-': 100,
      'B-N': null
    },
    90: null,
    91: {
      'B-': null,
      'B-N': null,
      'B-2N': null
    },
    92: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    },
    93: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  53: {
    55: {
      'A': 91,
      'EC+B+': 9,
      'P': 1
    },
    56: {
      'P': 99.986,
      'A': 0.014
    },
    57: {
      'EC+B+': 83,
      'A': 17,
      'ECP': 11
    },
    58: {
      'EC+B+': 99.9,
      'A': 0.1
    },
    59: {
      'EC+B+': 100,
      'ECP': 0.88,
      'ECA': 0.104
    },
    60: {
      'EC+B+': 100,
      'A': 0.000000331
    },
    61: {
      'EC+B+': 100,
      'B+P': null
    },
    62: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100
    },
    64: {
      'EC+B+': 100,
      'B+': 77
    },
    65: {
      'EC+B+': 100
    },
    66: {
      'EC+B+': 100,
      'B+': 51,
      'EC': 49
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100
    },
    72: {
      'EC': 100
    },
    73: {
      'EC+B+': 52.7,
      'B-': 47.3
    },
    75: {
      'B-': 93.1,
      'EC+B+': 6.9
    },
    76: {
      'B-': 100
    },
    77: {
      'B-': 100
    },
    78: {
      'B-': 100
    },
    79: {
      'B-': 100
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100
    },
    82: {
      'B-': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100,
      'B-N': 7.14
    },
    85: {
      'B-': 100,
      'B-N': 5.44
    },
    86: {
      'B-': 100,
      'B-N': 10
    },
    87: {
      'B-': 100,
      'B-N': 7.6
    },
    88: {
      'B-': 100,
      'B-N': 21.2
    },
    89: null,
    90: {
      'B-': null
    },
    91: null,
    92: {
      'B-N': null,
      'B-': null
    },
    93: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    94: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  54: {
    54: {
      'A': 100,
      '2P': null
    },
    55: {
      'A': 100
    },
    56: {
      'A': 64,
      'EC+B+': 36,
      'ECP': null
    },
    57: {
      'A': 8,
      'EC+B+': null
    },
    58: {
      'EC+B+': 98.8,
      'A': 1.2
    },
    59: {
      'EC+B+': 100,
      'ECP': 7,
      'A': 0.011
    },
    60: {
      'EC+B+': 100
    },
    61: {
      'EC+B+': 100,
      'B+P': 0.34,
      'A': 0.0003
    },
    62: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100,
      'B+P': 0.0029
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100
    },
    66: {
      'EC+B+': 100
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      '2B+': null
    },
    71: {
      'EC+B+': 100
    },
    73: {
      'EC': 100
    },
    79: {
      'B-': 100
    },
    80: {
      '2B-': 0
    },
    81: {
      'B-': 100
    },
    82: {
      '2B-': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100
    },
    85: {
      'B-': 100
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100,
      'B-N': 0.044
    },
    88: {
      'B-': 100,
      'B-N': 0.21
    },
    89: {
      'B-': 100,
      'B-N': 0
    },
    90: {
      'B-': 100
    },
    91: {
      'B-': 100,
      'B-N': 5
    },
    92: {
      'B-': 100,
      'B-N': 6.9
    },
    93: {
      'B-N': 8,
      'B-': null
    },
    94: {
      'B-N': null,
      'B-': null
    },
    95: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    },
    96: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  55: {
    57: {
      'P': 100,
      'A': 0.26
    },
    58: {
      'P': 100
    },
    59: {
      'EC+B+': 99.982,
      'ECP': 8.7,
      'ECA': 0.19
    },
    60: {
      'EC+B+': 100,
      'B+P': 0.07
    },
    61: {
      'EC+B+': 100,
      'ECP': 2.8,
      'ECA': 0.049
    },
    62: {
      'EC+B+': 100
    },
    63: {
      'EC+B+': 100,
      'ECP': 0.042,
      'ECA': 0.0024
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100,
      'B+A': 0.00002,
      'B+P': 0.000007
    },
    66: {
      'EC+B+': 100
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 98.4,
      'B-': 1.6
    },
    76: {
      'EC': 100
    },
    77: {
      'EC+B+': 98.13,
      'B-': 1.87
    },
    79: {
      'B-': 99.9997,
      'EC': 0.0003
    },
    80: {
      'B-': 100
    },
    81: {
      'B-': 100
    },
    82: {
      'B-': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100
    },
    85: {
      'B-': 100
    },
    86: {
      'B-': 100,
      'B-N': 0.035
    },
    87: {
      'B-': 100,
      'B-N': 0.09
    },
    88: {
      'B-': 100,
      'B-N': 1.64
    },
    89: {
      'B-': 100,
      'B-N': 3.03
    },
    90: {
      'B-': 100,
      'B-N': 14.7
    },
    91: {
      'B-': 100,
      'B-N': 14.2
    },
    92: {
      'B-': 100,
      'B-N': 28.5
    },
    93: {
      'B-': 100,
      'B-N': 25.1
    },
    94: {
      'B-': 100,
      'B-N': null
    },
    95: {
      'B-': 100,
      'B-N': 20
    },
    96: {
      'B-': 100,
      'B-N': null
    },
    97: {
      'B-': 100,
      'B-2N': null,
      'B-N': null
    }
  },
  56: {
    58: {
      'EC+B+': 99.1,
      'ECP': 20,
      'A': 0.9
    },
    59: {
      'EC+B+': 100,
      'B+P': 15
    },
    60: {
      'EC+B+': 100,
      'B+P': 3
    },
    61: {
      'EC+B+': 100,
      'B+P': 0,
      'B+A': 0
    },
    62: {
      'EC+B+': 100,
      'ECP': null
    },
    63: {
      'EC+B+': 100,
      'ECP': 25
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100
    },
    66: {
      'EC+B+': 100
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100
    },
    72: {
      'EC': 100
    },
    73: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      '2B+': null
    },
    77: {
      'EC': 100
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100
    },
    85: {
      'B-': 100
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100
    },
    88: {
      'B-': 100
    },
    89: {
      'B-': 100
    },
    90: {
      'B-': 100
    },
    91: {
      'B-': 100,
      'B-N': 0.06
    },
    92: {
      'B-': 100,
      'B-N': 0.4
    },
    93: {
      'B-': 100,
      'B-N': 0.43
    },
    94: {
      'B-': 100,
      'B-N': null
    },
    95: {
      'B-': 100,
      'B-N': null
    },
    96: {
      'B-': 100,
      'B-N': null
    },
    97: {
      'B-': 100,
      'B-N': null
    },
    98: {
      'B-': 100,
      'B-N': null
    }
  },
  57: {
    60: {
      'P': 93.9,
      'EC+B+': 6.1
    },
    63: {
      'EC+B+': 100,
      'ECP': 0
    },
    64: {
      'EC+B+': 100
    },
    65: {
      'EC+B+': 100,
      'ECP': null
    },
    66: {
      'EC+B+': 100
    },
    67: {
      'EC+B+': 100
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 0
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC': 100
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC': 100
    },
    81: {
      'EC+B+': 65.5,
      'B-': 34.5
    },
    83: {
      'B-': 100
    },
    84: {
      'B-': 100
    },
    85: {
      'B-': 100
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100
    },
    88: {
      'B-': 100
    },
    89: {
      'B-': 100,
      'B-N': 0.007
    },
    90: {
      'B-': 100,
      'B-N': 0.041
    },
    91: {
      'B-': 100,
      'B-N': 0.15
    },
    92: {
      'B-': 100,
      'B-N': 1.43
    },
    93: {
      'B-': 100,
      'B-N': 2.7
    },
    94: {
      'B-': 100,
      'B-N': null
    },
    95: {
      'B-': 100,
      'B-N': null
    },
    96: {
      'B-': 100,
      'B-N': null
    },
    97: {
      'B-': 100,
      'B-N': null
    },
    98: {
      'B-': 100,
      'B-N': null
    },
    99: {
      'B-': 100,
      'B-N': null
    },
    100: {
      'B-': 100,
      'B-N': null,
      'B-2N': null
    }
  },
  58: {
    63: {
      'EC+B+': 100,
      'ECP': 1
    },
    64: {
      'EC+B+': null,
      'ECP': null
    },
    65: {
      'EC+B+': 100,
      'ECP': 0
    },
    66: {
      'EC+B+': 100
    },
    67: {
      'EC+B+': 100,
      'B+P': null
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100,
      'B+': 11
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC': 100
    },
    77: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      '2EC': 100
    },
    81: {
      'EC': 100
    },
    83: {
      'B-': 100
    },
    84: null,
    85: {
      'B-': 100
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100
    },
    88: {
      'B-': 100
    },
    89: {
      'B-': 100
    },
    90: {
      'B-': 100
    },
    91: {
      'B-': 100
    },
    92: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100
    },
    95: {
      'B-': 100,
      'B-N': null
    },
    96: {
      'B-': 100,
      'B-N': null
    },
    97: {
      'B-': 100,
      'B-N': null
    },
    98: {
      'B-': 100,
      'B-N': null
    },
    99: {
      'B-': 100,
      'B-N': null
    },
    100: {
      'B-': 100,
      'B-N': null
    }
  },
  59: {
    62: {
      'P': 100
    },
    65: {
      'EC+B+': 100,
      'ECP': 0
    },
    66: {
      'EC+B+': 100,
      'B+P': null
    },
    67: {
      'EC+B+': 100,
      'ECP': null
    },
    68: {
      'EC+B+': 100
    },
    69: {
      'EC+B+': 100
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    83: {
      'B-': 99.9836,
      'EC': 0.0164
    },
    84: {
      'B-': 100
    },
    85: {
      'B-': 100
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100
    },
    88: {
      'B-': 100
    },
    89: {
      'B-': 100
    },
    90: {
      'B-': 100
    },
    91: {
      'B-': 100
    },
    92: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100,
      'B-N': null
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100,
      'B-N': null
    },
    97: {
      'B-': 100,
      'B-N': null
    },
    98: {
      'B-': 100,
      'B-N': null
    },
    99: {
      'B-': 100,
      'B-N': null
    },
    100: {
      'B-': 100,
      'B-N': null
    },
    101: {
      'B-': 100,
      'B-N': null
    },
    102: {
      'B-': 100,
      'B-N': null
    }
  },
  60: {
    65: {
      'EC+B+': 100,
      'ECP': 0
    },
    66: {
      'ECP': null,
      'EC+B+': null
    },
    67: {
      'EC+B+': 100,
      'ECP': null
    },
    68: {
      'EC+B+': 100,
      'ECP': null
    },
    69: {
      'EC+B+': 100,
      'ECP': 0
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100,
      'ECP': 0
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC': 100
    },
    81: {
      'EC+B+': 100
    },
    84: {
      'A': 100
    },
    87: {
      'B-': 100
    },
    89: {
      'B-': 100
    },
    90: {
      '2B-': 100
    },
    91: {
      'B-': 100
    },
    92: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100,
      'B-N': null
    },
    99: {
      'B-': 100,
      'B-N': null
    },
    100: {
      'B-': 100,
      'B-N': null
    },
    101: {
      'B-': 100,
      'B-N': null
    },
    102: {
      'B-': 100,
      'B-N': null
    },
    103: {
      'B-': 100,
      'B-N': null
    }
  },
  61: {
    67: {
      'EC': 100,
      'A': null,
      'ECP': null
    },
    68: {
      'EC+B+': 100,
      'P': null,
      'ECP': null
    },
    69: {
      'EC+B+': 100,
      'ECP': null
    },
    70: {
      'EC+B+': 100
    },
    71: {
      'EC+B+': 100,
      'ECP': 0.00005
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    82: {
      'EC+B+': 100,
      'B+': 0.0000057
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'EC': 100,
      'A': 0.00000028
    },
    85: {
      'EC': 65.7,
      'B-': 34.3
    },
    86: {
      'B-': 100
    },
    87: {
      'B-': 100
    },
    88: {
      'B-': 100
    },
    89: {
      'B-': 100
    },
    90: {
      'B-': 100
    },
    91: {
      'B-': 100
    },
    92: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100
    },
    99: {
      'B-': 100,
      'B-N': null
    },
    100: {
      'B-': 100,
      'B-N': null
    },
    101: {
      'B-': 100,
      'B-N': null
    },
    102: {
      'B-': 100,
      'B-N': null
    },
    103: {
      'B-': 100,
      'B-N': null
    },
    104: {
      'B-': 100,
      'B-N': null
    }
  },
  62: {
    67: {
      'EC+B+': 100,
      'ECP': 0
    },
    68: {
      'EC+B+': null
    },
    69: {
      'EC+B+': 100,
      'ECP': 0
    },
    70: {
      'EC+B+': 100,
      'ECP': null
    },
    71: {
      'EC+B+': 100,
      'ECP': 0
    },
    72: {
      'EC+B+': 100
    },
    73: {
      'EC+B+': 100,
      'ECP': 0.02
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    83: {
      'EC': 100
    },
    84: {
      'A': 100
    },
    85: {
      'A': 100
    },
    86: {
      'A': 100
    },
    89: {
      'B-': 100
    },
    91: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100,
      'B-N': null
    },
    102: {
      'B-': 100,
      'B-N': null
    },
    103: {
      'B-': 100,
      'B-N': null
    },
    104: {
      'B-': 100,
      'B-N': null
    },
    105: {
      'B-': 100,
      'B-N': null
    },
    106: {
      'B-': 100,
      'B-N': null
    }
  },
  63: {
    67: {
      'P': 100
    },
    68: {
      'P': 89,
      'EC+B+': 11
    },
    69: {
      'P': 0,
      'EC+B+': null
    },
    71: {
      'EC+B+': 100,
      'ECP': 0
    },
    72: {
      'EC+B+': 100,
      'ECP': null
    },
    73: {
      'EC+B+': 100,
      'B+P': 0.09
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'EC': 99.9978,
      'A': 0.0022
    },
    85: {
      'EC+B+': 100,
      'A': 0.00000094
    },
    86: {
      'EC': 100
    },
    87: {
      'EC+B+': 100
    },
    88: {
      'A': null
    },
    89: {
      'EC+B+': 72.08,
      'B-': 27.92
    },
    91: {
      'B-': 99.982,
      'EC+B+': 0.018
    },
    92: {
      'B-': 100
    },
    93: {
      'B-': 100
    },
    94: {
      'B-': 100
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100,
      'B-N': null
    },
    104: {
      'B-': 100,
      'B-N': null
    },
    105: {
      'B-': 100,
      'B-N': null
    },
    106: {
      'B-': 100,
      'B-N': null
    }
  },
  64: {
    70: null,
    71: {
      'EC+B+': 100,
      'ECP': 2
    },
    72: null,
    73: {
      'EC+B+': 100,
      'ECP': null
    },
    74: {
      'EC+B+': 100
    },
    75: {
      'EC+B+': 100,
      'ECP': 0
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100,
      'B+P': 0.03
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'A': 100
    },
    85: {
      'EC+B+': 100,
      'A': 0.00043
    },
    86: {
      'A': 100
    },
    87: {
      'EC': 100,
      'A': 0.0000008
    },
    88: {
      'A': 100
    },
    89: {
      'EC': 100
    },
    95: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100
    },
    105: {
      'B-': 100,
      'B-N': null
    },
    106: {
      'B-': 100,
      'B-N': null
    },
    107: {
      'B-': 100,
      'B-N': null
    },
    108: {
      'B-': 100,
      'B-N': null
    }
  },
  65: {
    70: {
      'P': 100,
      'EC+B+': null
    },
    73: {
      'EC+B+': 100
    },
    74: {
      'EC+B+': 0,
      'ECP': null,
      'P': null
    },
    75: {
      'EC+B+': 100,
      'ECP': 0.26
    },
    76: {
      'EC+B+': 100
    },
    77: {
      'EC+B+': 100,
      'B+P': 0.0022
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100
    },
    80: null,
    81: {
      'EC+B+': 100
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'EC+B+': 83.3,
      'A': 16.7
    },
    85: {
      'EC+B+': 100,
      'A': 0.05
    },
    86: {
      'EC+B+': 99.9905,
      'A': 0.0095
    },
    87: {
      'EC+B+': 100,
      'A': 0.0000007
    },
    88: {
      'EC+B+': 100
    },
    89: {
      'EC+B+': 100,
      'B-': 0.1
    },
    90: {
      'EC': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC': 100
    },
    93: {
      'EC+B+': 83.4,
      'B-': 16.6
    },
    95: {
      'B-': 100
    },
    96: {
      'B-': 100
    },
    97: {
      'B-': 100
    },
    98: {
      'B-': 100
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100,
      'B-N': null
    },
    105: {
      'B-': 100,
      'B-N': null
    },
    106: {
      'B-': 100,
      'B-N': null
    },
    107: {
      'B-': 100,
      'B-N': null
    },
    108: {
      'B-': 100,
      'B-N': null
    },
    109: {
      'B-': 100,
      'B-N': null
    }
  },
  66: {
    73: {
      'EC+B+': 100,
      'ECP': 11
    },
    74: {
      'EC+B+': null
    },
    75: {
      'EC+B+': 100,
      'B+P': null
    },
    76: {
      'EC+B+': 100,
      'ECP': 0.06
    },
    77: {
      'EC+B+': 100,
      'ECP': null
    },
    78: {
      'EC+B+': 100,
      'ECP': null
    },
    79: {
      'EC+B+': 100,
      'ECP': 50
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100,
      'B+P': 0.05
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'EC+B+': 64,
      'A': 36
    },
    85: {
      'EC+B+': 94.4,
      'A': 5.6
    },
    86: {
      'EC+B+': 99.9,
      'A': 0.1
    },
    87: {
      'EC+B+': 99.9906,
      'A': 0.0094
    },
    88: {
      'A': 100
    },
    89: {
      'EC+B+': 100
    },
    91: {
      'EC+B+': 100
    },
    93: {
      'EC': 100
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100
    },
    105: {
      'B-': 100
    },
    106: {
      'B-': null
    },
    107: {
      'B-': 100
    },
    108: {
      'B-': null
    },
    109: {
      'B-': 100,
      'B-N': null
    },
    110: {
      'B-': 100,
      'B-N': null
    }
  },
  67: {
    73: {
      'P': 100
    },
    74: {
      'P': 100
    },
    75: {
      'EC+B+': 100,
      'ECP': 0,
      'P': 0
    },
    76: {
      'ECP': null,
      'EC+B+': null
    },
    77: {
      'EC+B+': 100,
      'ECP': null
    },
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100,
      'ECP': null
    },
    80: {
      'EC+B+': 100
    },
    81: {
      'EC+B+': 100
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'EC+B+': 78,
      'A': 22
    },
    85: {
      'EC+B+': 88,
      'A': 12
    },
    86: {
      'EC+B+': 99.949,
      'A': 0.051
    },
    87: {
      'EC+B+': 99.981,
      'A': 0.019
    },
    88: {
      'EC+B+': 100
    },
    89: {
      'EC+B+': 100
    },
    90: {
      'EC+B+': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC': 100
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC': 100
    },
    97: {
      'EC+B+': 60,
      'B-': 40
    },
    99: {
      'B-': 100
    },
    100: {
      'B-': 100
    },
    101: {
      'B-': 100
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100
    },
    105: {
      'B-': 100
    },
    106: {
      'B-': 100
    },
    107: {
      'B-': 100,
      'B-N': null
    },
    108: {
      'B-': 100,
      'B-N': null
    },
    109: {
      'B-N': null,
      'B-': null
    },
    110: {
      'B-': 100,
      'B-N': null
    },
    111: {
      'B-': 100,
      'B-N': null
    }
  },
  68: {
    75: null,
    76: {
      'EC+B+': 100
    },
    77: null,
    78: {
      'EC+B+': 100
    },
    79: {
      'EC+B+': 100,
      'B+P': 0
    },
    80: {
      'EC+B+': 100,
      'ECP': 0.15
    },
    81: {
      'EC+B+': 100,
      'ECP': 7
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'A': 90,
      'EC+B+': 10
    },
    85: {
      'A': 53,
      'EC+B+': 47
    },
    86: {
      'EC+B+': 99.53,
      'A': 0.47
    },
    87: {
      'EC+B+': 99.978,
      'A': 0.022
    },
    88: {
      'EC+B+': 100,
      'A': 0.000017
    },
    89: {
      'EC+B+': 100
    },
    90: {
      'EC': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC': 100
    },
    93: {
      'EC+B+': 100
    },
    95: {
      'EC+B+': 100
    },
    97: {
      'EC': 100
    },
    101: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100
    },
    105: {
      'B-': 100
    },
    106: {
      'B-': 100
    },
    107: {
      'B-': 100
    },
    108: {
      'B-': null
    },
    109: {
      'B-': 100
    },
    110: {
      'B-': null
    },
    111: {
      'B-': 100
    },
    112: {
      'B-': 100,
      'B-N': null
    }
  },
  69: {
    75: {
      'P': 0
    },
    76: {
      'P': 100
    },
    77: {
      'EC+B+': null,
      'P': null
    },
    78: {
      'EC+B+': 85,
      'P': 15
    },
    79: {
      'EC+B+': 100
    },
    80: {
      'EC+B+': 100,
      'ECP': 0.2
    },
    81: {
      'EC+B+': 100,
      'ECP': 1.2
    },
    82: {
      'EC+B+': 100
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'A': 91,
      'EC+B+': 9
    },
    85: {
      'A': 54,
      'EC+B+': 46
    },
    86: {
      'EC+B+': 99.17,
      'A': 0.83
    },
    87: {
      'EC+B+': 99.936,
      'A': 0.064
    },
    88: {
      'EC+B+': 100
    },
    89: {
      'EC+B+': 100
    },
    90: {
      'EC+B+': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC+B+': 100
    },
    95: {
      'EC+B+': 100,
      'B+': 39
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC': 100
    },
    99: {
      'EC+B+': 99.99,
      'B-': 0.01
    },
    101: {
      'B-': 99.869,
      'EC': 0.131
    },
    102: {
      'B-': 100
    },
    103: {
      'B-': 100
    },
    104: {
      'B-': 100
    },
    105: {
      'B-': 100
    },
    106: {
      'B-': 100
    },
    107: {
      'B-': 100
    },
    108: {
      'B-': 100
    },
    109: {
      'B-': null
    },
    110: {
      'B-': null
    },
    111: {
      'B-': 100
    },
    112: {
      'B-': null,
      'B-N': null
    }
  },
  70: {
    79: {
      'ECP': 100,
      'EC+B+': 100
    },
    80: null,
    81: {
      'EC+B+': 100,
      'ECP': 0
    },
    82: {
      'EC+B+': 100,
      'B+P': null
    },
    83: {
      'EC+B+': 90,
      'A': 10,
      'B+P': 0.008
    },
    84: {
      'A': 92.6,
      'EC+B+': 7.4
    },
    85: {
      'A': 89,
      'EC+B+': 11
    },
    86: {
      'EC+B+': 90,
      'A': 10
    },
    87: {
      'EC+B+': 99.5,
      'A': 0.5
    },
    88: {
      'EC+B+': 100,
      'A': 0.0021
    },
    89: {
      'EC+B+': 100
    },
    90: {
      'EC+B+': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC': 100
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC': 100
    },
    97: {
      'EC+B+': 100
    },
    99: {
      'EC': 100
    },
    105: {
      'B-': 100
    },
    107: {
      'B-': 100
    },
    108: {
      'B-': 100
    },
    109: {
      'B-': 100
    },
    110: {
      'B-': 100
    },
    111: {
      'B-': null
    },
    112: {
      'B-': null
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': null
    },
    115: {
      'B-': null
    }
  },
  71: {
    79: {
      'P': 70.9,
      'EC+B+': 29.1
    },
    80: {
      'P': 63.4,
      'EC+B+': 36.6
    },
    81: {
      'EC+B+': 100,
      'B+P': 15
    },
    82: {
      'EC+B+': null,
      'A': null
    },
    83: null,
    84: {
      'A': 90,
      'EC+B+': 10
    },
    85: {
      'A': 95,
      'EC+B+': 5
    },
    86: {
      'A': 0
    },
    87: {
      'EC+B+': 99.09,
      'A': 0.91
    },
    88: {
      'EC+B+': 100,
      'A': 0.1
    },
    89: {
      'EC+B+': 100,
      'A': 0.0001
    },
    90: {
      'EC+B+': 100
    },
    91: {
      'EC+B+': 100
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC+B+': 100
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC+B+': 100
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC+B+': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC': 100
    },
    103: {
      'EC+B+': 100
    },
    105: {
      'B-': 100
    },
    106: {
      'B-': 100
    },
    107: {
      'B-': 100
    },
    108: {
      'B-': 100
    },
    109: {
      'B-': 100
    },
    110: {
      'B-': 100
    },
    111: {
      'B-': 100
    },
    112: {
      'B-': 100
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': null
    },
    115: {
      'B-': null
    },
    116: {
      'B-': null,
      'B-N': null
    },
    117: {
      'B-': 100
    }
  },
  72: {
    79: null,
    81: null,
    82: {
      'EC+B+': 100,
      'A': 0
    },
    83: {
      'EC+B+': 100
    },
    84: {
      'A': 100
    },
    85: {
      'A': 94,
      'EC+B+': 14
    },
    86: {
      'EC+B+': 55.7,
      'A': 44.3
    },
    87: {
      'EC+B+': 65,
      'A': 35
    },
    88: {
      'EC+B+': 99.3,
      'A': 0.7
    },
    89: {
      'EC+B+': 99.87,
      'A': 0.13
    },
    90: {
      'EC+B+': 99.992,
      'A': 0.008
    },
    91: {
      'EC+B+': 100,
      'A': 0.0001
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC+B+': 100
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC': 100
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'A': 100
    },
    103: {
      'EC': 100
    },
    109: {
      'B-': 100
    },
    110: {
      'B-': 100
    },
    111: {
      'IT': 100,
      'B-': 100
    },
    112: {
      'B-': 100
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': 100
    },
    115: {
      'B-': 100
    },
    116: {
      'B-': 100
    },
    117: {
      'B-': 100
    },
    118: {
      'B-': 100
    }
  },
  73: {
    82: {
      'P': 100
    },
    83: {
      'P': 71,
      'EC+B+': 29
    },
    84: {
      'A': 96.6,
      'P': 3.4
    },
    85: {
      'A': 91,
      'EC+B+': 9
    },
    86: {
      'EC+B+': 66,
      'A': 34
    },
    87: {
      'A': 34
    },
    88: {
      'A': null,
      'EC+B+': null
    },
    89: {
      'EC+B+': 99.926,
      'A': 0.074,
      'ECP': null
    },
    90: {
      'EC+B+': 99.8,
      'A': 0.2
    },
    91: {
      'EC+B+': 100,
      'A': null
    },
    92: {
      'EC+B+': 100
    },
    93: {
      'EC+B+': 100
    },
    94: {
      'EC+B+': 100
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC+B+': 100
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC+B+': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC+B+': 100
    },
    103: {
      'EC+B+': 100
    },
    104: {
      'EC+B+': 100
    },
    105: {
      'EC+B+': 100
    },
    106: {
      'EC': 100
    },
    107: {
      'EC': 85,
      'B-': 15
    },
    109: {
      'B-': 100
    },
    110: {
      'B-': 100
    },
    111: {
      'B-': 100
    },
    112: {
      'B-': 100
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': 100
    },
    115: {
      'B-': 100
    },
    116: {
      'B-': 100
    },
    117: {
      'B-': 100
    },
    118: {
      'B-': null
    },
    119: {
      'B-': 100
    },
    120: {
      'B-': 100,
      'B-N': null
    },
    121: {
      'B-': 100,
      'B-N': null
    }
  },
  74: {
    83: {
      'EC': null
    },
    84: {
      'A': 100
    },
    85: {
      'A': 99.9,
      'EC+B+': 0.1
    },
    86: {
      'A': 87,
      'EC+B+': 13
    },
    87: {
      'A': 73,
      'EC+B+': 27
    },
    88: {
      'EC+B+': 54.8,
      'A': 45.2
    },
    89: {
      'EC+B+': 86,
      'A': 14
    },
    90: {
      'EC+B+': 96.2,
      'A': 3.8
    },
    91: {
      'EC+B+': 99.8,
      'A': 0.2
    },
    92: {
      'EC+B+': 99.965,
      'A': 0.035
    },
    93: {
      'EC+B+': 99.96,
      'A': 0.04
    },
    94: {
      'EC+B+': 100,
      'A': 0.0032
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC+B+': 100
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC+B+': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC': 100
    },
    103: {
      'EC+B+': 100
    },
    104: {
      'EC': 100
    },
    105: {
      'EC+B+': 100
    },
    106: {
      'A': 100
    },
    107: {
      'EC': 100
    },
    109: {
      'A': null
    },
    111: {
      'B-': 100
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': 100
    },
    115: {
      'B-': 100
    },
    116: {
      'B-': 100
    },
    118: {
      'B-': 100
    },
    119: {
      'B-': 100
    },
    120: {
      'B-': 100
    },
    121: {
      'B-': null
    },
    122: {
      'B-': null
    },
    123: {
      'B-': null
    }
  },
  75: {
    84: null,
    85: {
      'P': 89,
      'A': 11
    },
    86: {
      'P': 100,
      'A': 1.4
    },
    87: {
      'A': 94,
      'EC+B+': 6
    },
    88: {
      'EC+B+': 68,
      'A': 32
    },
    89: {
      'A': 58,
      'EC+B+': 42
    },
    90: {
      'EC+B+': 86,
      'A': 14
    },
    91: {
      'EC+B+': 76,
      'A': 24
    },
    92: {
      'EC+B+': 99,
      'A': 1
    },
    93: {
      'EC+B+': 100,
      'A': 0.005
    },
    94: {
      'EC+B+': 100,
      'A': 0.01
    },
    95: {
      'EC+B+': 100
    },
    96: {
      'EC+B+': 100
    },
    97: {
      'EC+B+': 100
    },
    98: {
      'EC+B+': 100
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC+B+': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC+B+': 100
    },
    103: {
      'EC+B+': 100
    },
    104: {
      'EC+B+': 100
    },
    105: {
      'EC+B+': 100
    },
    106: {
      'EC+B+': 100
    },
    107: {
      'EC+B+': 100
    },
    108: {
      'EC': 100
    },
    109: {
      'EC+B+': 100
    },
    111: {
      'B-': 92.53,
      'EC': 7.47
    },
    112: {
      'B-': 100,
      'A': 0.0001
    },
    113: {
      'B-': 100
    },
    114: {
      'B-': 100
    },
    115: {
      'B-': 100
    },
    116: {
      'B-': 100
    },
    117: {
      'B-': 100
    },
    118: null,
    119: {
      'B-': 100
    },
    120: {
      'B-': 100
    },
    121: {
      'B-': 100
    },
    122: {
      'B-': null
    },
    123: {
      'B-N': null,
      'B-': null
    },
    124: {
      'B-N': null,
      'B-': null
    }
  },
  76: {
    85: {
      'A': 100
    },
    86: {
      'A': 99
    },
    87: {
      'A': 100,
      'EC+B+': null
    },
    88: {
      'A': 96,
      'EC+B+': 4
    },
    89: {
      'A': 90,
      'EC+B+': 10
    },
    90: {
      'A': 72,
      'EC+B+': 28
    },
    91: {
      'A': 57,
      'EC+B+': 43
    },
    92: {
      'EC+B+': 57,
      'A': 43
    },
    93: {
      'EC+B+': 86.3,
      'A': 13.7
    },
    94: {
      'EC+B+': 90.5,
      'A': 9.5
    },
    95: {
      'EC+B+': 98.2,
      'A': 1.8
    },
    96: {
      'EC+B+': 99.8,
      'A': 0.2
    },
    97: {
      'EC+B+': 99.6,
      'A': 0.4
    },
    98: {
      'EC': 100,
      'A': 0.02
    },
    99: {
      'EC+B+': 100
    },
    100: {
      'EC+B+': 100
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC+B+': 100,
      'A': 0
    },
    103: {
      'EC+B+': 100
    },
    104: {
      'EC+B+': 100
    },
    105: {
      'EC+B+': 100
    },
    106: {
      'EC': 100
    },
    107: {
      'EC+B+': 100
    },
    108: {
      'A': null,
      '2B+': null
    },
    109: {
      'EC': 100
    },
    110: {
      'A': 100
    },
    115: {
      'B-': 100
    },
    117: {
      'B-': 100
    },
    118: {
      'B-': 100
    },
    119: {
      'B-': null
    },
    120: {
      'B-': 100
    },
    121: {
      'B-': 100
    },
    122: {
      'B-': 100
    },
    123: {
      'B-': 100
    },
    124: {
      'B-': 100
    },
    125: {
      'B-': null
    },
    126: {
      'B-': null
    },
    127: {
      'B-': 100,
      'B-N': null
    }
  },
  77: {
    87: {
      'EC+B+': null,
      'A': null,
      'P': null
    },
    88: {
      'A': null,
      'P': null
    },
    89: {
      'A': 93,
      'P': 7
    },
    90: {
      'A': 48,
      'P': 32,
      'EC+B+': 20
    },
    91: {
      'A': 100,
      'EC+B+': null,
      'P': null
    },
    92: {
      'A': 45,
      'P': null,
      'EC+B+': null
    },
    93: {
      'EC+B+': 94.8,
      'A': 5.2
    },
    94: {
      'EC+B+': 85,
      'A': 15
    },
    95: {
      'EC+B+': 98,
      'A': 2
    },
    96: {
      'EC+B+': 93,
      'A': 7
    },
    97: {
      'EC': 99.5,
      'A': 0.5
    },
    98: {
      'EC+B+': 99.15,
      'A': 0.85
    },
    99: {
      'EC+B+': 96.9,
      'A': 3.1
    },
    100: {
      'EC+B+': 99.94,
      'A': 0.06
    },
    101: {
      'EC+B+': 100
    },
    102: {
      'EC+B+': 100
    },
    103: {
      'EC+B+': 100
    },
    104: {
      'EC+B+': 100
    },
    105: {
      'EC+B+': 100
    },
    106: {
      'EC+B+': 100
    },
    107: {
      'EC+B+': 100
    },
    108: {
      'EC+B+': 100
    },
    109: {
      'EC+B+': 100
    },
    110: {
      'EC+B+': 100
    },
    111: {
      'EC+B+': 100
    },
    112: {
      'EC': 100
    },
    113: {
      'EC+B+': 100,
      'B+': 0.002
    },
    115: {
      'B-': 95.24,
      'EC': 4.76
    },
    117: {
      'B-': 100
    },
    118: {
      'B-': 100
    },
    119: {
      'B-': 100
    },
    120: {
      'B-': 100
    },
    121: {
      'B-': 100
    },
    122: {
      'B-': null
    },
    123: {
      'B-': null
    },
    124: {
      'B-': null
    },
    125: {
      'B-': 100
    },
    126: {
      'B-': 100
    },
    127: {
      'B-N': null,
      'B-': null
    },
    128: {
      'B-': 100,
      'B-N': null
    }
  },
  78: {
    87: {
      'A': 100
    },
    88: {
      'A': 100
    },
    89: {
      'A': 100
    },
    90: {
      'A': 100
    },
    91: {
      'A': 100
    },
    92: {
      'A': 98,
      'EC+B+': 2
    },
    93: {
      'A': 90,
      'EC+B+': 10
    },
    94: {
      'A': 94,
      'EC+B+': 6
    },
    95: {
      'A': 86,
      'EC+B+': 16
    },
    96: {
      'A': 76,
      'EC+B+': 24
    },
    97: {
      'A': 64,
      'EC+B+': 36
    },
    98: {
      'EC+B+': 60,
      'A': 40
    },
    99: {
      'EC+B+': 94.3,
      'A': 5.7
    },
    100: {
      'EC+B+': 92.3,
      'A': 7.7
    },
    101: {
      'EC+B+': 99.76,
      'A': 0.24
    },
    102: {
      'EC+B+': 99.7,
      'A': 0.3
    },
    103: {
      'EC+B+': 100,
      'A': 0.08
    },
    104: {
      'EC+B+': 99.962,
      'A': 0.038
    },
    105: {
      'EC+B+': 100,
      'A': 0.0096
    },
    106: {
      'EC+B+': 100,
      'A': 0.001
    },
    107: {
      'EC+B+': 100
    },
    108: {
      'EC+B+': 100,
      'A': 0.00014
    },
    109: {
      'EC+B+': 100
    },
    110: {
      'EC+B+': 99.999974,
      'A': 0.000026
    },
    111: {
      'EC+B+': 100
    },
    112: {
      'A': 100
    },
    113: {
      'EC': 100
    },
    115: {
      'EC': 100
    },
    119: {
      'B-': 100
    },
    121: {
      'B-': 100
    },
    122: {
      'B-': 100
    },
    123: {
      'B-': 100
    },
    124: {
      'B-': 100
    },
    125: {
      'B-': 100
    },
    126: {
      'B-': 100
    },
    127: {
      'B-': 100,
      'B-N': null
    },
    128: {
      'B-N': null,
      'B-': null
    },
    129: {
      'B-N': null,
      'B-': null
    },
    130: {
      'B-N': null,
      'B-': null
    }
  },
  79: {
    91: {
      'P': 89,
      'A': 11
    },
    92: {
      'P': 100
    },
    93: {
      'A': 100,
      'P': null,
      'EC+B+': null
    },
    94: {
      'A': 94,
      'P': null,
      'EC+B+': null
    },
    95: {
      'A': 0
    },
    96: {
      'A': 90
    },
    97: null,
    98: {
      'EC+B+': 60,
      'A': 40
    },
    99: {
      'EC+B+': 60,
      'A': 40
    },
    100: {
      'EC+B+': 78,
      'A': 22
    },
    101: {
      'EC+B+': 98.2,
      'A': 1.8
    },
    102: {
      'EC+B+': 97.3,
      'A': 2.7
    },
    103: {
      'EC+B+': 99.87,
      'A': 0.13
    },
    104: {
      'EC+B+': 99.45,
      'A': 0.55
    },
    105: {
      'EC+B+': 100,
      'A': 0.016
    },
    106: {
      'EC+B+': 99.74,
      'A': 0.26
    },
    107: {
      'EC+B+': 100,
      'A': 0.0008
    },
    108: {
      'EC+B+': 100,
      'A': 0.003
    },
    109: {
      'EC+B+': 100
    },
    110: {
      'EC+B+': 100,
      'A': 0.00003
    },
    111: {
      'EC+B+': 100,
      'A': 0.000001
    },
    112: {
      'EC+B+': 100
    },
    113: {
      'EC+B+': 100
    },
    114: {
      'EC+B+': 100
    },
    115: {
      'EC+B+': 100
    },
    116: {
      'EC': 100
    },
    117: {
      'EC+B+': 93,
      'B-': 7
    },
    119: {
      'B-': 100
    },
    120: {
      'B-': 100
    },
    121: {
      'B-': 100
    },
    122: {
      'B-': 100
    },
    123: {
      'B-': 100
    },
    124: {
      'B-': 100
    },
    125: {
      'B-': 100
    },
    126: {
      'B-': 100
    },
    127: {
      'B-': 100
    },
    128: {
      'B-': null,
      'B-N': null
    },
    129: {
      'B-N': null,
      'B-': null
    },
    130: {
      'B-': 100
    },
    131: {
      'B-N': null,
      'B-': null
    }
  },
  80: {
    90: {
      'A': 100
    },
    91: {
      'A': 100
    },
    92: {
      'A': 100
    },
    93: {
      'A': 100
    },
    94: {
      'A': 99.6
    },
    95: {
      'A': 100
    },
    96: {
      'A': 94
    },
    97: {
      'A': 100
    },
    98: {
      'A': 70,
      'EC+B+': 30
    },
    99: {
      'A': 55,
      'EC+B+': 45,
      'ECP': 0.15
    },
    100: {
      'EC+B+': 52,
      'A': 48
    },
    101: {
      'EC+B+': 73,
      'A': 27,
      'ECP': 0.013
    },
    102: {
      'EC+B+': 86.2,
      'A': 13.8
    },
    103: {
      'EC+B+': 88.3,
      'A': 11.7,
      'ECP': 0.00026
    },
    104: {
      'EC+B+': 98.89,
      'A': 1.11
    },
    105: {
      'EC+B+': 94,
      'A': 6
    },
    106: {
      'EC+B+': 99.984,
      'A': 0.016
    },
    107: {
      'EC+B+': 100,
      'A': 0.00037
    },
    108: {
      'EC+B+': 99.999963,
      'A': 0.000037
    },
    109: {
      'EC+B+': 100,
      'A': 0.00003
    },
    110: {
      'EC+B+': 100,
      'A': 0.00000034
    },
    111: {
      'EC+B+': 100
    },
    112: {
      'EC': 100
    },
    113: {
      'EC+B+': 100
    },
    114: {
      'EC': 100
    },
    115: {
      'EC+B+': 100
    },
    117: {
      'EC': 100
    },
    123: {
      'B-': 100
    },
    125: {
      'B-': 100
    },
    126: {
      'B-': 100
    },
    127: {
      'B-': 100
    },
    128: {
      'B-': 100
    },
    129: {
      'B-': 100
    },
    130: null,
    131: {
      'B-N': null,
      'B-': null
    },
    132: {
      'B-': 100,
      'B-N': null
    },
    133: {
      'B-N': null,
      'B-': null
    },
    134: {
      'B-': 100,
      'B-N': null
    },
    135: {
      'B-N': null,
      'B-': null
    },
    136: {
      'B-N': null,
      'B-': null
    }
  },
  81: {
    95: {
      'P': 100
    },
    96: {
      'A': 73,
      'P': 27
    },
    97: {
      'A': 53,
      'EC+B+': 47
    },
    98: {
      'A': 100,
      'P': null,
      'EC+B+': null
    },
    99: {
      'EC+B+': 94,
      'A': 6,
      'ECSF': 0.0032
    },
    100: {
      'A': 10
    },
    101: {
      'EC+B+': 97.5,
      'A': 5
    },
    102: {
      'EC+B+': 0,
      'A': null
    },
    103: {
      'EC+B+': 97.9,
      'A': 2.1
    },
    104: {
      'EC+B+': null
    },
    105: {
      'EC+B+': 100,
      'A': 0.006
    },
    106: {
      'EC+B+': 100,
      'A': 0.03
    },
    107: {
      'EC+B+': 100
    },
    108: {
      'EC+B+': 100
    },
    109: {
      'EC+B+': 100
    },
    110: null,
    111: {
      'EC+B+': 100
    },
    112: {
      'EC+B+': 100
    },
    113: {
      'EC+B+': 100,
      'A': 0.0000001
    },
    114: {
      'EC+B+': 100
    },
    115: {
      'EC+B+': 100
    },
    116: {
      'EC+B+': 100
    },
    117: {
      'EC+B+': 100
    },
    118: {
      'EC+B+': 100
    },
    119: {
      'EC+B+': 100
    },
    120: {
      'EC': 100
    },
    121: {
      'EC+B+': 100
    },
    123: {
      'B-': 97.08,
      'EC+B+': 2.92
    },
    125: {
      'B-': 100
    },
    126: {
      'B-': 100
    },
    127: {
      'B-': 100
    },
    128: {
      'B-': 100
    },
    129: {
      'B-': 100,
      'B-N': 0.007
    },
    130: {
      'B-': 100,
      'B-N': null
    },
    131: {
      'B-': 100,
      'B-N': 1.8
    },
    132: {
      'B-': 100,
      'B-N': null
    },
    133: {
      'B-': 100,
      'B-N': 34
    },
    134: {
      'B-N': null,
      'B-': null
    },
    135: {
      'B-': null,
      'B-N': null
    },
    136: {
      'B-': 100,
      'B-N': null
    }
  },
  82: {
    96: {
      'A': 100
    },
    97: {
      'A': 100
    },
    98: {
      'A': 100
    },
    99: {
      'A': 100
    },
    100: {
      'A': 98,
      'EC+B+': 2
    },
    101: {
      'A': 90
    },
    102: {
      'A': 80,
      'EC+B+': 20
    },
    103: {
      'A': 34,
      'EC+B+': null
    },
    104: {
      'EC+B+': 60,
      'A': 40
    },
    105: {
      'EC+B+': 90.5,
      'A': 9.5
    },
    106: {
      'EC+B+': 91.5,
      'A': 8.5
    },
    107: {
      'EC+B+': 100,
      'A': 0.4
    },
    108: {
      'EC+B+': 99.6,
      'A': 0.4
    },
    109: {
      'EC+B+': 99.987,
      'A': 0.013
    },
    110: {
      'EC+B+': 99.9941,
      'A': 0.0059
    },
    111: {
      'EC+B+': null
    },
    112: {
      'EC+B+': 100,
      'A': 0.0000073
    },
    113: {
      'EC+B+': 100
    },
    114: {
      'EC+B+': 100,
      'A': 0.00003
    },
    115: {
      'EC+B+': 100
    },
    116: {
      'EC+B+': 100
    },
    117: {
      'EC+B+': 100
    },
    118: {
      'EC': 100
    },
    119: {
      'EC+B+': 100
    },
    120: {
      'EC': 100,
      'A': 1
    },
    121: {
      'EC': 100
    },
    122: {
      'A': null
    },
    123: {
      'EC': 100
    },
    127: {
      'B-': 100
    },
    128: {
      'B-': 100,
      'A': 0.0000019
    },
    129: {
      'B-': 100
    },
    130: {
      'B-': 100
    },
    131: {
      'B-': 100
    },
    132: {
      'B-': 100
    },
    133: {
      'B-': 100
    },
    134: {
      'B-': null
    },
    135: {
      'B-': 100
    },
    136: {
      'B-': 100
    },
    137: {
      'B-': 100
    },
    138: {
      'B-': null
    }
  },
  83: {
    101: {
      'A': 100
    },
    102: {
      'P': 90,
      'A': 10
    },
    103: {
      'A': 100
    },
    104: {
      'A': 100
    },
    105: {
      'A': 100
    },
    106: {
      'A': 100
    },
    107: {
      'A': 90,
      'EC+B+': 10,
      'B+F': 0.000023
    },
    108: {
      'A': 51,
      'EC+B+': 49
    },
    109: {
      'EC+B+': 88,
      'A': 12
    },
    110: {
      'EC+B+': 96.5,
      'A': 3.5
    },
    111: {
      'EC+B+': 99.54,
      'A': 0.46
    },
    112: {
      'EC+B+': 99.97,
      'A': 0.03
    },
    113: {
      'EC+B+': 100,
      'A': 0.00115
    },
    114: {
      'EC+B+': 100,
      'A': 0.0001
    },
    115: {
      'EC+B+': 100
    },
    116: {
      'EC+B+': 100
    },
    117: {
      'EC+B+': 100
    },
    118: {
      'EC+B+': 100
    },
    119: {
      'EC+B+': 100
    },
    120: {
      'EC+B+': 100
    },
    121: {
      'EC+B+': 100
    },
    122: {
      'EC+B+': 100
    },
    123: {
      'EC+B+': 100
    },
    124: {
      'EC+B+': 100
    },
    125: {
      'EC+B+': 100
    },
    126: {
      'A': 100
    },
    127: {
      'B-': 100,
      'A': 0.000132
    },
    128: {
      'A': 99.724,
      'B-': 0.276
    },
    129: {
      'B-': 64.06,
      'A': 35.94
    },
    130: {
      'B-': 97.8,
      'A': 2.2
    },
    131: {
      'B-': 99.979,
      'A': 0.021,
      'B-A': 0.003
    },
    132: {
      'B-': 100
    },
    133: {
      'B-': 100
    },
    134: {
      'B-': 100
    },
    135: {
      'B-': 100
    },
    136: {
      'B-': 100
    },
    137: {
      'B-': null
    },
    138: {
      'B-N': null,
      'B-': null
    },
    139: {
      'B-N': null,
      'B-': null
    },
    140: {
      'B-N': null,
      'B-': null
    },
    141: {
      'B-': null,
      'B-N': null
    }
  },
  84: {
    102: {
      'A': 100
    },
    103: {
      'A': 100
    },
    104: {
      'A': 100
    },
    105: {
      'A': 100
    },
    106: {
      'A': 100
    },
    107: {
      'A': 99
    },
    108: {
      'A': 99.5,
      'EC+B+': 0.5
    },
    109: {
      'A': 100
    },
    110: {
      'A': 93,
      'EC+B+': 7
    },
    111: {
      'A': 94,
      'EC+B+': 6
    },
    112: {
      'A': 98,
      'EC+B+': 2
    },
    113: {
      'EC+B+': 56,
      'A': 44
    },
    114: {
      'A': 57,
      'EC+B+': 43
    },
    115: {
      'EC+B+': 92.5,
      'A': 7.5
    },
    116: {
      'EC+B+': 88.9,
      'A': 11.1
    },
    117: {
      'EC+B+': 98.87,
      'A': 1.13
    },
    118: {
      'EC+B+': 98.08,
      'A': 1.92
    },
    119: {
      'EC+B+': 99.89,
      'A': 0.11
    },
    120: {
      'EC+B+': 99.33,
      'A': 0.67
    },
    121: {
      'EC+B+': 99.96,
      'A': 0.04
    },
    122: {
      'EC+B+': 94.55,
      'A': 5.45
    },
    123: {
      'EC+B+': 99.979,
      'A': 0.021
    },
    124: {
      'A': 99.996,
      'EC+B+': 0.004
    },
    125: {
      'A': 99.546,
      'EC+B+': 0.454
    },
    126: {
      'A': 100
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 99.99977,
      'B-': 0.00023
    },
    132: {
      'A': 100
    },
    133: {
      'A': 95,
      'B-': 5
    },
    134: {
      'A': 99.98,
      'B-': 0.02
    },
    135: {
      'B-': 71.8,
      'A': 28.2
    },
    136: {
      'B-': null
    },
    137: {
      'B-': 100
    },
    138: null,
    139: {
      'B-': null
    },
    140: {
      'B-': null
    },
    141: {
      'B-': null
    },
    142: {
      'B-': null
    },
    143: {
      'B-': null
    }
  },
  85: {
    106: {
      'A': 100
    },
    107: {
      'A': 100
    },
    108: {
      'A': 100
    },
    109: {
      'A': 100,
      'ECF': 0.8,
      'EC+B+': null
    },
    110: {
      'A': 100
    },
    111: {
      'A': 95.1,
      'EC+B+': 4.9
    },
    112: {
      'A': 96.1,
      'EC+B+': 3.9
    },
    113: {
      'A': 90,
      'EC+B+': 10
    },
    114: {
      'A': 90,
      'EC+B+': 10
    },
    115: {
      'A': 52,
      'EC+B+': 48
    },
    116: {
      'A': 71,
      'EC+B+': 29
    },
    117: {
      'EC+B+': 63,
      'A': 37
    },
    118: {
      'EC+B+': 69,
      'A': 31
    },
    119: {
      'EC+B+': 96.09,
      'A': 3.91
    },
    120: {
      'EC+B+': 90,
      'A': 10
    },
    121: {
      'EC+B+': 99.1,
      'A': 0.9
    },
    122: {
      'EC+B+': 91.4,
      'A': 8.6
    },
    123: {
      'EC+B+': 99.45,
      'A': 0.55
    },
    124: {
      'EC+B+': 95.9,
      'A': 4.1
    },
    125: {
      'EC+B+': 99.825,
      'A': 0.175
    },
    126: {
      'EC': 58.2,
      'A': 41.8
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100,
      'B-': 0.006,
      'EC': 0.0000003
    },
    132: {
      'A': 99.993,
      'B-': 0.007
    },
    133: {
      'A': 99.95,
      'B-': 0.05
    },
    134: {
      'A': 93.6,
      'B-': 6.4
    },
    135: {
      'B-': 92,
      'A': 8
    },
    136: {
      'B-': 100
    },
    137: {
      'B-': 100
    },
    138: {
      'B-': 100
    },
    139: {
      'B-': null
    },
    140: {
      'B-': null
    },
    141: {
      'B-': null
    },
    142: {
      'B-': null,
      'B-N': null
    },
    143: {
      'B-': null
    },
    144: {
      'B-': null,
      'B-N': null
    }
  },
  86: {
    107: {
      'A': 100
    },
    108: {
      'A': 100
    },
    109: {
      'A': 100
    },
    110: {
      'A': 99.9,
      'EC+B+': 0.06
    },
    111: {
      'A': 100
    },
    112: {
      'EC+B+': null,
      'A': null
    },
    113: {
      'A': 94,
      'EC+B+': 6
    },
    114: {
      'A': 86,
      'EC+B+': 14
    },
    115: {
      'EC+B+': null,
      'A': null
    },
    116: {
      'A': 78,
      'EC+B+': 22
    },
    117: {
      'A': 66,
      'EC+B+': 34
    },
    118: {
      'A': 72.4,
      'EC+B+': 27.6
    },
    119: {
      'EC+B+': 75.4,
      'A': 24.6
    },
    120: {
      'A': 62,
      'EC+B+': 38
    },
    121: {
      'EC+B+': 79,
      'A': 21
    },
    122: {
      'A': 62,
      'EC+B+': 38
    },
    123: {
      'EC+B+': 83,
      'A': 17
    },
    124: {
      'A': 96,
      'EC+B+': 4
    },
    125: {
      'EC': 72.6,
      'A': 27.4
    },
    126: {
      'A': 100
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100
    },
    132: {
      'A': 100
    },
    133: {
      'A': 100
    },
    134: {
      'A': 100
    },
    135: {
      'B-': 78,
      'A': 22
    },
    136: {
      'A': 100
    },
    137: {
      'B-': 100
    },
    138: {
      'B-': 100
    },
    139: {
      'B-': 100
    },
    140: {
      'B-': 100
    },
    141: {
      'B-': 100
    },
    142: {
      'B-': 100
    },
    143: {
      'B-': 100
    }
  },
  87: {
    110: {
      'A': 100
    },
    111: {
      'A': 100
    },
    112: {
      'A': 0,
      'EC+B+': null
    },
    113: {
      'A': 100
    },
    114: {
      'A': 100
    },
    115: {
      'A': 100
    },
    116: {
      'A': 100
    },
    117: {
      'A': 92,
      'EC+B+': 8
    },
    118: {
      'A': 98.5,
      'EC+B+': 1.5
    },
    119: {
      'A': 84,
      'EC': 16
    },
    120: {
      'A': 95,
      'EC+B+': 5
    },
    121: {
      'A': 89,
      'EC+B+': 11
    },
    122: {
      'A': 89,
      'EC+B+': 11
    },
    123: {
      'A': 60,
      'EC+B+': 40
    },
    124: {
      'A': 80,
      'EC': 20
    },
    125: {
      'EC+B+': 57,
      'A': 43
    },
    126: {
      'A': 99.44,
      'EC+B+': 0.56
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100,
      'EC': 0.0000002
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100
    },
    132: {
      'A': 100
    },
    133: {
      'A': 99.65,
      'B-': 0.35
    },
    134: {
      'A': 100,
      'B-': 0.1
    },
    135: {
      'B-': 100
    },
    136: {
      'B-': 99.994,
      'A': 0.006
    },
    137: {
      'B-': 100
    },
    138: {
      'B-': 100
    },
    139: {
      'B-': 100
    },
    140: {
      'B-': 100
    },
    141: {
      'B-': 100
    },
    142: {
      'B-': 100
    },
    143: {
      'B-': 100
    },
    144: {
      'B-': 100
    },
    145: {
      'B-': 100
    },
    146: {
      'B-': 100,
      'B-N': null
    }
  },
  88: {
    113: {
      'A': 100,
      'EC+B+': null
    },
    114: {
      'A': 100
    },
    115: {
      'A': 100
    },
    116: {
      'A': 100
    },
    117: {
      'A': 100
    },
    118: {
      'A': 100
    },
    119: {
      'A': 86,
      'EC+B+': 14
    },
    120: {
      'A': 95,
      'EC+B+': 5
    },
    121: {
      'A': 100
    },
    122: {
      'A': 96,
      'EC+B+': 4
    },
    123: {
      'A': 93,
      'EC+B+': 7
    },
    124: {
      'A': 85,
      'EC+B+': 15
    },
    125: {
      'A': 80,
      'EC+B+': 20
    },
    126: {
      'A': 99.941,
      'EC': 0.059
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100,
      'EC': 0.00000001
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100
    },
    132: {
      'A': 100
    },
    133: {
      'A': 100
    },
    134: {
      'A': 100,
      '14C': 0.00000003
    },
    135: {
      'A': 100,
      '14C': 0.000000089
      // '14C': 0.000000077 // TODO: how to handle two of the same decay?
    },
    136: {
      'A': 100,
      '14C': 0.000000004
    },
    137: {
      'B-': 100,
      'A': 0.026
    },
    138: {
      'A': 100,
      '14C': 3.20E-09
    },
    139: {
      'B-': 100
    },
    140: {
      'B-': 100
    },
    141: {
      'B-': 100,
      'A': 100
    },
    142: {
      'B-': 100
    },
    143: {
      'B-': 100
    },
    144: {
      'B-': 100
    },
    145: {
      'B-': 100
    },
    146: {
      'B-': 100
    }
  },
  89: {
    116: {
      'A': 100
    },
    117: {
      'A': 100
    },
    118: {
      'A': 100
    },
    119: {
      'A': 99,
      'EC': 1
    },
    120: {
      'A': 100
    },
    121: {
      'A': 100,
      'EC+B+': null
    },
    122: {
      'A': 100,
      'EC+B+': 0.2
    },
    123: {
      'A': 95,
      'EC+B+': 5
    },
    124: {
      'A': 100
    },
    125: {
      'A': 89,
      'EC': 11
    },
    126: {
      'A': 99.91,
      'EC+B+': 0.09
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100,
      'EC+B+': 2
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100,
      'EC': 0.0005
    },
    132: {
      'A': 100
    },
    133: {
      'A': 99,
      'EC+B+': 1
    },
    134: {
      'A': 99,
      'EC': 1
    },
    135: {
      'EC': 90.9,
      'A': 9.1
    },
    136: {
      'A': 100,
      '14C': 5.30E-10
    },
    137: {
      'B-': 83,
      'EC': 17,
      'A': 0.006
    },
    138: {
      'B-': 98.62,
      'A': 1.38
    },
    139: {
      'B-': 100
    },
    140: {
      'B-': 100
    },
    141: {
      'B-': 100,
      'B-F': 0.0000012
    },
    142: {
      'B-': 100
    },
    143: {
      'B-': 100
    },
    144: {
      'B-': 100
    },
    145: {
      'B-': 100
    },
    146: null
  },
  90: {
    118: {
      'A': 100
    },
    119: {
      'A': 100
    },
    120: {
      'A': 100,
      'EC+B+': null
    },
    121: {
      'EC+B+': null,
      'A': null
    },
    122: {
      'A': 100
    },
    123: {
      'A': 100
    },
    124: {
      'A': 100
    },
    125: {
      'A': 100
    },
    126: {
      'A': 100,
      'EC+B+': 0.01
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100,
      'EC': 0.0000002
    },
    131: {
      'A': 100
    },
    132: {
      'A': 100
    },
    133: {
      'A': 100
    },
    134: {
      'A': 100
    },
    135: {
      'A': 90,
      'EC': 10
    },
    136: {
      'A': 100
    },
    137: {
      'A': 100
    },
    138: {
      'A': 100
    },
    139: {
      'A': 100
    },
    140: {
      'A': 100,
      '24NE': 5.80E-11,
      'SF': 4.00E-12
    },
    141: {
      'B-': 100,
      'A': 4.00E-11
    },
    142: {
      'A': 100,
      'SF': 1.10E-09
    },
    143: {
      'B-': 100
    },
    144: {
      'B-': 100
    },
    145: {
      'B-': 100
    },
    146: {
      'B-': 100
    }
  },
  91: {
    120: {
      'P': null,
      'A': null,
      'EC+B+': null
    },
    121: {
      'A': 100
    },
    122: {
      'A': 100
    },
    123: {
      'A': 100
    },
    124: {
      'A': 100
    },
    125: {
      'A': 98,
      'EC': 2
    },
    126: {
      'A': 100
    },
    127: {
      'A': 100
    },
    128: {
      'A': 100
    },
    129: {
      'A': 100,
      'EC+B+': 0.0000003
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100
    },
    132: {
      'A': 100
    },
    133: {
      'A': 100
    },
    134: {
      'A': 100
    },
    135: {
      'A': 74,
      'EC+B+': 26
    },
    136: {
      'A': 85,
      'EC': 15
    },
    137: {
      'EC+B+': 98.15,
      'A': 1.85
    },
    138: {
      'EC': 99.52,
      'A': 0.48
    },
    139: {
      'EC+B+': 92.2,
      'B-': 7.8,
      'A': 0.0032
    },
    140: {
      'A': 100,
      'SF': 3.00E-10
    },
    141: {
      'B-': 100,
      'EC': null
    },
    142: {
      'B-': 100
    },
    143: {
      'B-': 100
    },
    144: {
      'B-': 100
    },
    145: {
      'B-': 100,
      '|b{+-}fission': 0.00000006
    },
    146: {
      'B-': 100
    }
  },
  92: {
    122: {
      'A': 100
    },
    123: {
      'A': 0,
      'EC+B+': null
    },
    124: {
      'A': 100
    },
    125: {
      'A': 100,
      'EC+B+': null
    },
    126: {
      'A': 100
    },
    127: {
      'A': 100
    },
    129: {
      'A': 100
    },
    130: {
      'A': 100
    },
    131: {
      'A': 100,
      'EC+B+': 0.2
    },
    132: {
      'A': 100
    },
    133: {
      'A': 100
    },
    134: {
      'A': 100
    },
    135: {
      'A': 100
    },
    136: {
      'A': 95,
      'EC': 5
    },
    137: {
      'EC': 80,
      'A': 20
    },
    138: {
      'A': 100,
      '{+22}Ne': 4.80E-12
    },
    139: {
      'EC': 100,
      'A': 0.004
    },
    140: {
      'A': 100,
      '{+24}Ne': 8.90E-10,
      'SF': 2.70E-12
    },
    141: {
      'A': 100,
      '24NE': 7.20E-11,
      'SF': 6.00E-11
    },
    142: {
      'A': 100,
      'SF': 1.64E-09,
      'Mg': 1.40E-11
    },
    143: {
      'A': 100,
      'SF': 0.000000007,
      '{+25}Ne': 8.00E-10
    },
    144: {
      'A': 100,
      'SF': 0.000000094
    },
    145: {
      'B-': 100
    },
    146: {
      'A': 100,
      'SF': 0.0000545
    }
  }
};
/* eslint-enable quote-props */

// Table which contains information about various attributes of isotopes.  This data was obtained from the National
// Institute of Standards and Technology (NIST) at the URL
//
// http://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&ascii=html&isotype=some
//
// ...though manual post-processing was necessary to remove data and get it into the format below.  This table only
// contains isotope data for the first eighteen elemtns.  The original csv of this data can be found in
// buildanatom/model/AtomIdentifier.java.
//
// This table has the following format:
// keys of type atomic number
//  subkeys of type mass number
//    subkeys of type atomicMass and abundance, which hold the values for each isotope.
const ISOTOPE_INFO_TABLE = {
  1: { // atomic number
    1: { // massNumber
      atomicMass: 1.00782503207,
      abundance: 0.999885
    },
    2: {
      atomicMass: 2.0141017778,
      abundance: 0.000115
    },
    3: {
      atomicMass: 3.0160492777,
      // Use trace abundance, since Wikipedia just says "trace" and the NIST table contained it but didn't state
      // abundance.
      abundance: TRACE_ABUNDANCE
    }
  },
  2: {
    3: {
      atomicMass: 3.0160293191,
      abundance: 0.00000134
    },
    4: {
      atomicMass: 4.00260325415,
      abundance: 0.99999866
    }
  },
  3: {
    6: {
      atomicMass: 6.015122795,
      abundance: 0.0759
    },
    7: {
      atomicMass: 7.01600455,
      abundance: 0.9241
    }
  },
  4: {
    7: {
      atomicMass: 7.016929828,
      abundance: TRACE_ABUNDANCE
    },
    9: {
      atomicMass: 9.0121822,
      abundance: 1.0000
    },
    10: {
      atomicMass: 10.013533818,
      abundance: TRACE_ABUNDANCE
    }
  },
  5: {
    10: {
      atomicMass: 10.0129370,
      abundance: 0.199
    },
    11: {
      atomicMass: 11.0093054,
      abundance: 0.801
    }
  },
  6: {
    12: {
      atomicMass: 12.0000000,
      abundance: 0.9893
    },
    13: {
      atomicMass: 13.0033548378,
      abundance: 0.0107
    },
    14: {
      atomicMass: 14.003241989,
      // Use trace abundance, since Wikipedia just says "trace" and the NIST table contained it but didn't state
      // abundance.
      abundance: TRACE_ABUNDANCE
    }
  },
  7: {
    14: {
      atomicMass: 14.0030740048,
      abundance: 0.99636
    },
    15: {
      atomicMass: 15.0001088982,
      abundance: 0.00364
    }
  },
  8: {
    16: {
      atomicMass: 15.99491461956,
      abundance: 0.99757
    },
    17: {
      atomicMass: 16.99913170,
      abundance: 0.00038
    },
    18: {
      atomicMass: 17.9991610,
      abundance: 0.00205
    }
  },
  9: {
    18: {
      atomicMass: 18.0009380,
      abundance: TRACE_ABUNDANCE
    },
    19: {
      atomicMass: 18.99840322,
      abundance: 1.0000
    }
  },
  10: {
    20: {
      atomicMass: 19.9924401754,
      abundance: 0.9048
    },
    21: {
      atomicMass: 20.99384668,
      abundance: 0.0027
    },
    22: {
      atomicMass: 21.991385114,
      abundance: 0.0925
    }
  },
  11: {
    23: {
      atomicMass: 22.9897692809,
      abundance: 1.0000
    }
  },
  12: {
    24: {
      atomicMass: 23.985041700,
      abundance: 0.7899
    },
    25: {
      atomicMass: 24.98583692,
      abundance: 0.1000
    },
    26: {
      atomicMass: 25.982592929,
      abundance: 0.1101
    }
  },
  13: {
    27: {
      atomicMass: 26.98153863,
      abundance: 1.0000
    }
  },
  14: {
    28: {
      atomicMass: 27.9769265325,
      abundance: 0.92223
    },
    29: {
      atomicMass: 28.976494700,
      abundance: 0.04685
    },
    30: {
      atomicMass: 29.97377017,
      abundance: 0.03092
    }
  },
  15: {
    31: {
      atomicMass: 30.97376163,
      abundance: 1.0000
    }
  },
  16: {
    32: {
      atomicMass: 31.97207100,
      abundance: 0.9499
    },
    33: {
      atomicMass: 32.97145876,
      abundance: 0.0075
    },
    34: {
      atomicMass: 33.96786690,
      abundance: 0.0425
    },
    36: {
      atomicMass: 35.96708076,
      abundance: 0.0001
    }
  },
  17: {
    35: {
      atomicMass: 34.96885268,
      abundance: 0.7576
    },
    37: {
      atomicMass: 36.96590259,
      abundance: 0.2424
    }
  },
  18: {
    36: {
      atomicMass: 35.967545106,
      abundance: 0.003365
    },
    38: {
      atomicMass: 37.9627324,
      abundance: 0.000632
    },
    40: {
      atomicMass: 39.9623831225,
      abundance: 0.996003
    }
  }
};

// Table which maps atomic numbers to standard atomic mass (a.k.a. standard atomic weight).  This was obtained from
// the URL below and subsequently post-processed to remove unneeded data:
//
// http://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&ascii=ascii2&isotype=some
const standardMassTable = [
  0, // 0, NO ELEMENT
  1.00794, // 1, HYDROGEN
  4.002602, // 2, HELIUM
  6.941, // 3, LITHIUM
  9.012182, // 4, BERYLLIUM
  10.811, // 5, BORON
  12.0107, // 6, CARBON
  14.0067, // 7, NITROGEN
  15.9994, // 8, OXYGEN
  18.9984032, // 9, FLUORINE
  20.1797, // 10, NEON
  22.98976928, // 11, SODIUM
  24.3050, // 12, MAGNESIUM
  26.9815386, // 13, ALUMINUM
  28.0855, // 14, SILICON
  30.973762, // 15, PHOSPHORUS
  32.065, // 16, SULFUR
  35.453, // 17, CHLORINE
  39.948, // 18, ARGON
  39.0983, // 19, POTASSIUM
  40.078, // 20, CALCIUM
  44.955912, // 21, SCANDIUM
  47.867, // 22, TITANIUM
  50.9415, // 23, VANADIUM
  51.9961, // 24, CHROMIUM
  54.938045, // 25, MANGANESE
  55.845, // 26, IRON
  58.933195, // 27, COBALT
  58.6934, // 28, NICKEL
  63.546, // 29, COPPER
  65.38, // 30, ZINC
  69.723, // 31, GALLIUM
  72.64, // 32, GERMANIUM
  74.9216, // 33, ARSENIC
  78.96, // 34, SELENIUM
  79.904, // 35, BROMINE
  83.798, // 36, KRYPTON
  85.4678, // 37, RUBIDIUM
  87.62, // 38, STRONTIUM
  88.90585, // 39, YTTRIUM
  91.224, // 40, ZIRCONIUM
  92.90638, // 41, NIOBIUM
  95.96, // 42, MOLYBDENUM
  98, // 43, TECHNETIUM
  101.07, // 44, RUTHENIUM
  102.9055, // 45, RHODIUM
  106.42, // 46, PALLADIUM
  107.8682, // 47, SILVER
  112.411, // 48, CADMIUM
  114.818, // 49, INDIUM
  118.71, // 50, TIN
  121.76, // 51, ANTIMONY
  127.6, // 52, TELLURIUM
  126.90447, // 53, IODINE
  131.293, // 54, XENON
  132.9054519, // 55, CAESIUM
  137.327, // 56, BARIUM
  138.90547, // 57, LANTHANUM
  140.116, // 58, CERIUM
  140.90765, // 59, PRASEODYMIUM
  144.242, // 60, NEODYMIUM
  145, // 61, PROMETHIUM
  150.36, // 62, SAMARIUM
  151.964, // 63, EUROPIUM
  157.25, // 64, GADOLINIUM
  158.92535, // 65, TERBIUM
  162.5, // 66, DYSPROSIUM
  164.93032, // 67, HOLMIUM
  167.259, // 68, ERBIUM
  168.93421, // 69, THULIUM
  173.054, // 70, YTTERBIUM
  174.9668, // 71, LUTETIUM
  178.49, // 72, HAFNIUM
  180.94788, // 73, TANTALUM
  183.84, // 74, TUNGSTEN
  186.207, // 75, RHENIUM
  190.23, // 76, OSMIUM
  192.217, // 77, IRIDIUM
  195.084, // 78, PLATINUM
  196.966569, // 79, GOLD
  200.59, // 80, MERCURY
  204.3833, // 81, THALLIUM
  207.2, // 82, LEAD
  208.9804 // 83, BISMUTH
];

// HalfLifeConstants is an object with the half-life constants of unstable nuclides. If the half-life of an unstable
// nuclide is unknown, null is set as a placeholder. The half-life is in seconds and some numbers are in scientific
// notation. The data was obtained from the Nuclear Data Services (NDS) of the International Atomic Energy Agency (IAEA)
// at the url https://www-nds.iaea.org/relnsd/NdsEnsdf/QueryForm.html.
//
// The object is first indexed by the proton number, and then by the neutron number. For example, a nuclide with 1 proton
// and 4 neutrons ( HalfLifeConstants[ 1 ][ 4 ] ) would have a half-life of 8.60826E-23 seconds.
const HalfLifeConstants = {
  0: {
    0: null, // a placeholder to allow a nuclide with 0 protons and 0 neutrons to exist as a base case
    1: 613.9,
    4: 1.75476E-22,
    6: null
  },
  1: {
    2: 388781328,
    3: null,
    4: 8.60826E-23,
    5: 2.94347E-22,
    6: 5.06931E-21
  },
  2: {
    3: 7.04071E-22,
    4: 0.8067,
    5: 3.04158E-21,
    6: 0.1191,
    7: null,
    8: 1.52079E-21
  },
  3: {
    1: null,
    2: 3.70925E-22,
    5: 0.8399,
    6: 0.1783,
    7: null,
    8: 0.00875,
    9: null
  },
  4: {
    2: 4.95911E-21,
    3: 4598208,
    4: 8.19098E-17,
    6: 4.7651E+13,
    7: 13.76,
    8: 0.02146,
    9: 2.7E-21,
    10: 0.00435,
    11: 7.86617E-22,
    12: 5.70297E-22
  },
  5: {
    2: 5.69585E-22,
    3: 0.77,
    4: 8.44885E-19,
    7: 0.0202,
    8: 0.01733,
    9: 0.0125,
    10: 0.00993,
    11: 4.56238E-21,
    12: 0.00508,
    13: null,
    14: 0.00292,
    15: 9.12475E-22,
    16: 7.60396E-22
  },
  6: {
    2: 3.50952E-21,
    3: 0.1265,
    4: 19.29,
    5: 1221.84,
    8: 1.79874E+11,
    9: 2.449,
    10: 0.747,
    11: 0.193,
    12: 0.092,
    13: 0.0463,
    14: 0.0163,
    16: 0.0061
  },
  7: {
    3: 1.82495E-22,
    4: 5.49684E-22,
    5: 0.011,
    6: 597.9,
    9: 7.13,
    10: 4.173,
    11: 0.619,
    12: 0.336,
    13: 0.1344,
    14: 0.084,
    15: 0.023,
    16: 0.0141,
    17: 0.000000052
  },
  8: {
    3: 3.50952E-22,
    4: 6.33663E-21,
    5: 0.00858,
    6: 70.606,
    7: 122.24,
    11: 26.88,
    12: 13.51,
    13: 3.42,
    14: 2.25,
    15: 0.097,
    16: 0.065,
    18: 4.5E-12
  },
  9: {
    4: 4.51721E-22,
    5: 5.0136E-22,
    6: 6.91269E-22,
    7: 1.14059E-20,
    8: 64.49,
    9: 6586.2,
    11: 11.07,
    12: 4.158,
    13: 4.23,
    14: 2.23,
    15: 0.39,
    16: 0.08,
    17: 0.0082,
    18: 0.005,
    19: 4.6E-20,
    20: 0.0025,
    21: null,
    22: 0.00000026
  },
  10: {
    5: 7.73284E-22,
    6: 5.70297E-21,
    7: 0.1092,
    8: 1.672,
    9: 17.22,
    13: 37.25,
    14: 202.8,
    15: 0.602,
    16: 0.197,
    17: 0.0315,
    18: 0.02,
    19: 0.015,
    20: 0.0073,
    21: 0.0034,
    22: 0.0035,
    23: 0.00000018,
    24: 0.00000006
  },
  11: {
    6: null,
    7: 2.28119E-21,
    8: 1.14059E-20,
    9: 0.4479,
    10: 22.49,
    11: 82104810,
    13: 53989.2,
    14: 59.1,
    15: 1.07128,
    16: 0.301,
    17: 0.0305,
    18: 0.0441,
    19: 0.048,
    20: 0.01735,
    21: 0.0132,
    22: 0.008,
    23: 0.0055,
    24: 0.0018,
    25: 0.00000018,
    26: 0.00000006
  },
  12: {
    7: 4.00209E-12,
    8: 0.0904,
    9: 0.122,
    10: 3.8755,
    11: 11.3046,
    15: 567.48,
    16: 75294,
    17: 1.3,
    18: 0.335,
    19: 0.236,
    20: 0.086,
    21: 0.0905,
    22: 0.02,
    23: 0.0113,
    24: 0.0076,
    25: 0.008,
    26: null,
    27: 0.00000018,
    28: null
  },
  13: {
    8: 0.000000035,
    9: 0.0911,
    10: 0.446,
    11: 2.053,
    12: 7.183,
    13: 2.26263E+13,
    15: 134.7,
    16: 393.6,
    17: 3.62,
    18: 0.644,
    19: 0.033,
    20: 0.0417,
    21: 0.0563,
    22: 0.0383,
    23: 0.09,
    24: 0.0107,
    25: 0.009,
    26: 0.0076,
    27: 0.00000026,
    28: null,
    29: 0.00000017,
    30: 0.00000017
  },
  14: {
    8: 0.029,
    9: 0.0423,
    10: 0.14,
    11: 0.22,
    12: 2.2453,
    13: 4.15,
    17: 9441.6,
    18: 4954437378,
    19: 6.11,
    20: 2.77,
    21: 0.78,
    22: 0.45,
    23: 0.09,
    24: 0.063,
    25: 0.0475,
    26: 0.033,
    27: 0.02,
    28: 0.0125,
    29: 0.00000006,
    30: 0.00000036
  },
  15: {
    10: 0.00000003,
    11: 0.0437,
    12: 0.26,
    13: 0.2703,
    14: 4.142,
    15: 149.88,
    17: 1232755.2,
    18: 2190240,
    19: 12.43,
    20: 47.3,
    21: 5.6,
    22: 2.31,
    23: 0.64,
    24: 0.28,
    25: 0.15,
    26: 0.101,
    27: 0.0485,
    28: 0.0365,
    29: 0.0185,
    30: 0.0000002,
    31: null
  },
  16: {
    10: 0.000000079,
    11: 0.0155,
    12: 0.125,
    13: 0.188,
    14: 1.178,
    15: 2.5534,
    19: 7548768,
    21: 303,
    22: 10218,
    23: 11.5,
    24: 8.8,
    25: 1.99,
    26: 1.016,
    27: 0.265,
    28: 0.1,
    29: 0.068,
    30: 0.05,
    32: 0.0000002
  },
  17: {
    12: 0.00000002,
    13: 0.00000003,
    14: 0.19,
    15: 0.298,
    16: 2.511,
    17: 1.5266,
    19: 9.5081E+12,
    21: 2233.8,
    22: 3372,
    23: 81,
    24: 38.4,
    25: 6.8,
    26: 3.13,
    27: 0.56,
    28: 0.413,
    29: 0.232,
    30: 0.101,
    31: 0.0000002,
    32: 0.00000017,
    33: null,
    34: null,
    35: null
  },
  18: {
    12: 1E-11,
    13: 0.0144,
    14: 0.098,
    15: 0.173,
    16: 0.8438,
    17: 1.7756,
    19: 3024950.4,
    21: 8457256161,
    23: 6576.6,
    24: 1038222865,
    25: 322.2,
    26: 712.2,
    27: 21.48,
    28: 8.4,
    29: 1.23,
    30: 0.475,
    31: 0.17,
    32: 0.106,
    33: null,
    34: null,
    35: 0.00000062
  },
  19: {
    14: 0.000000025,
    15: 0.000000025,
    16: 0.178,
    17: 0.341,
    18: 1.225,
    19: 459.06,
    21: 3.9383E+16,
    23: 44478,
    24: 80280,
    25: 1327.8,
    26: 1068.6,
    27: 105,
    28: 17.5,
    29: 6.8,
    30: 1.26,
    31: 0.472,
    32: 0.365,
    33: 0.11,
    34: 0.03,
    35: 0.01,
    36: 0.00000036,
    37: 0.00000062
  },
  20: {
    14: 0.000000035,
    15: 0.0257,
    16: 0.1012,
    17: 0.1811,
    18: 0.44376,
    19: 0.8603,
    21: 3.13676E+12,
    25: 14049504,
    27: 391910.4,
    28: 5.99582E+26,
    29: 523.08,
    30: 13.45,
    31: 10,
    32: 4.6,
    33: 0.461,
    34: 0.107,
    35: 0.022,
    36: 0.011,
    37: 0.00000062,
    38: 0.00000062
  },
  21: {
    17: null,
    18: 0.0000003,
    19: 0.1823,
    20: 0.5963,
    21: 0.68079,
    22: 14007.6,
    23: 14292,
    25: 7239456,
    26: 289370.88,
    27: 157212,
    28: 3430.8,
    29: 102.5,
    30: 12.4,
    31: 8.2,
    32: 2.6,
    33: 0.526,
    34: 0.105,
    35: 0.026,
    36: 0.013,
    37: 0.012,
    38: null,
    40: null
  },
  22: {
    16: 0.00000012,
    17: 0.0285,
    18: 0.0524,
    19: 0.0819,
    20: 0.20865,
    21: 0.509,
    22: 1865014325,
    23: 11088,
    29: 345.6,
    30: 102,
    31: 32.7,
    32: 2.1,
    33: 1.3,
    34: 0.2,
    35: 0.098,
    36: 0.058,
    37: 0.0285,
    38: 0.022,
    39: 0.015,
    40: 0.00000062,
    41: 0.00000036,
    42: 0.00000062
  },
  23: {
    19: 0.000000055,
    20: 0.0793,
    21: 0.111,
    22: 0.547,
    23: 0.4225,
    24: 1956,
    25: 1380110.4,
    26: 28512000,
    27: 8.36259E+24,
    29: 224.58,
    30: 92.58,
    31: 49.8,
    32: 6.54,
    33: 0.216,
    34: 0.32,
    35: 0.191,
    36: 0.097,
    37: 0.122,
    38: 0.0483,
    39: 0.0336,
    40: 0.017,
    41: 0.015,
    42: 0.00000036,
    43: 0.00000036,
    44: 0.00000062
  },
  24: {
    18: 0.0133,
    19: 0.0212,
    20: 0.0428,
    21: 0.0609,
    22: 0.26,
    23: 0.5,
    24: 77616,
    25: 2538,
    26: 4.1024E+25,
    27: 2393625.6,
    31: 209.82,
    32: 356.4,
    33: 21.1,
    34: 7,
    35: 0.74,
    36: 0.49,
    37: 0.234,
    38: 0.206,
    39: 0.129,
    40: 0.043,
    41: 0.027,
    42: 0.024,
    44: 0.00000036,
    45: 0.00000062,
    46: 0.00000062
  },
  25: {
    19: 0.000000105,
    20: null,
    21: 0.0362,
    22: 0.1,
    23: 0.1581,
    24: 0.382,
    25: 0.28319,
    26: 2772,
    27: 483062.4,
    28: 1.16761E+14,
    29: 26974080,
    31: 9284.04,
    32: 85.4,
    33: 3,
    34: 4.59,
    35: 0.28,
    36: 0.709,
    37: 0.092,
    38: 0.275,
    39: 0.09,
    40: 0.092,
    41: 0.065,
    42: 0.047,
    43: 0.028,
    44: 0.016,
    45: 0.0199,
    46: 0.000000637,
    47: 0.00000062,
    48: null
  },
  26: {
    19: 0.00189,
    20: 0.013,
    21: 0.0218,
    22: 0.044,
    23: 0.0647,
    24: 0.152,
    25: 0.305,
    26: 29790,
    27: 510.6,
    29: 86592204.87,
    33: 3843936,
    34: 8.26791E+13,
    35: 358.8,
    36: 68,
    37: 6.1,
    38: 2,
    39: 0.81,
    40: 0.44,
    41: 0.6,
    42: 0.188,
    43: 0.11,
    44: 0.065,
    45: 0.028,
    46: 0.00000015,
    47: 0.0129,
    48: 0.0082,
    49: 0.00000062
  },
  27: {
    23: 0.0388,
    24: 0.0688,
    25: 0.104,
    26: 0.24,
    27: 0.19328,
    28: 63108,
    29: 6673190.4,
    30: 23478336,
    31: 6122304,
    33: 166344192,
    34: 5936.4,
    35: 92.4,
    36: 27.4,
    37: 0.3,
    38: 1.16,
    39: 0.2,
    40: 0.425,
    41: 0.2,
    42: 0.227,
    43: 0.112,
    44: 0.08,
    45: 0.0599,
    46: 0.0407,
    47: 0.0313,
    48: 0.03,
    49: 0.0217,
    50: 0.013
  },
  28: {
    20: 0.0021,
    21: 0.0075,
    22: 0.0185,
    23: 0.0238,
    24: 0.0408,
    25: 0.0552,
    26: 0.1142,
    27: 0.2047,
    28: 524880,
    29: 128160,
    31: 2.39833E+12,
    35: 3193560909,
    37: 9063,
    38: 196560,
    39: 21,
    40: 29,
    41: 11.4,
    42: 6,
    43: 2.56,
    44: 1.57,
    45: 0.84,
    46: 0.5077,
    47: 0.344,
    48: 0.238,
    49: 0.1589,
    50: 0.11,
    51: 0.043,
    52: 0.024,
    54: null
  },
  29: {
    24: 0.00000013,
    25: 0.000000075,
    26: 0.04,
    27: 0.093,
    28: 0.1963,
    29: 3.204,
    30: 81.5,
    31: 1422,
    32: 12020.4,
    33: 580.2,
    35: 45723.6,
    37: 307.2,
    38: 222588,
    39: 30.9,
    40: 171,
    41: 44.5,
    42: 19.4,
    43: 6.63,
    44: 4.2,
    45: 1.63,
    46: 1.224,
    47: 0.641,
    48: 0.4698,
    49: 0.335,
    50: 0.241,
    51: 0.1136,
    52: 0.0732,
    53: 0.033
  },
  30: {
    24: 0.00159,
    25: 0.02,
    26: 0.03,
    27: 0.04,
    28: 0.0867,
    29: 0.1786,
    30: 142.8,
    31: 89.1,
    32: 33094.8,
    33: 2308.2,
    35: 21075552,
    39: 3384,
    40: 1.19916E+26,
    41: 147,
    42: 167400,
    43: 24.5,
    44: 95.6,
    45: 10.2,
    46: 5.7,
    47: 2.08,
    48: 1.47,
    49: 0.746,
    50: 0.5619,
    51: 0.32,
    52: 0.166,
    53: 0.117,
    54: 0.000000633,
    55: 0.000000637
  },
  31: {
    28: 0.000000043,
    29: 0.07,
    30: 0.167,
    31: 0.116121,
    32: 32.4,
    33: 157.62,
    34: 912,
    35: 34164,
    36: 281810.88,
    37: 4062.6,
    39: 1268.4,
    41: 50760,
    42: 17496,
    43: 487.2,
    44: 126,
    45: 32.6,
    46: 13.2,
    47: 5.09,
    48: 2.848,
    49: 1.9,
    50: 1.217,
    51: 0.6,
    52: 0.3081,
    53: 0.085,
    54: 0.092,
    55: 0.043,
    56: 0.000000634
  },
  32: {
    27: 0.0133,
    28: 0.00000011,
    29: 0.044,
    30: 0.129,
    31: 0.15,
    32: 63.7,
    33: 30.9,
    34: 8136,
    35: 1134,
    36: 23408352,
    37: 140580,
    39: 987552,
    43: 4966.8,
    45: 40359.6,
    46: 5280,
    47: 18.98,
    48: 29.5,
    49: 7.6,
    50: 4,
    51: 1.85,
    52: 0.954,
    53: 0.503,
    54: 0.226,
    55: 0.14,
    56: 0.0000003,
    57: 0.0000003,
    58: null
  },
  33: {
    30: 0.000000043,
    31: 0.018,
    32: 0.128,
    33: 0.09577,
    34: 42.5,
    35: 151.6,
    36: 912,
    37: 3156,
    38: 235080,
    39: 93600,
    40: 6937920,
    41: 1535328,
    43: 94464,
    44: 139644,
    45: 5442,
    46: 540.6,
    47: 15.2,
    48: 33.3,
    49: 19.1,
    50: 13.4,
    51: 4.2,
    52: 2.021,
    53: 0.945,
    54: 0.484,
    55: 0.2,
    56: 0.0000003,
    57: null,
    58: null,
    59: null
  },
  34: {
    30: 0.00000018,
    31: 0.033,
    32: 0.042,
    33: 0.136,
    34: 35.5,
    35: 27.4,
    36: 2466,
    37: 284.4,
    38: 725760,
    39: 25740,
    41: 10348992,
    45: 1.03191E+13,
    47: 1107,
    48: 3.02946E+27,
    49: 1338,
    50: 195.6,
    51: 32.9,
    52: 14.3,
    53: 5.5,
    54: 1.53,
    55: 0.43,
    56: 0.195,
    57: 0.27,
    58: null,
    59: null,
    60: 0.00000015,
    61: 0.000000392
  },
  35: {
    34: 0.000000024,
    35: 0.0791,
    36: 21.4,
    37: 78.6,
    38: 204,
    39: 1524,
    40: 5802,
    41: 58320,
    42: 205344,
    43: 387,
    45: 1060.8,
    47: 127015.2,
    48: 8546.4,
    49: 1905.6,
    50: 174,
    51: 55.1,
    52: 55.68,
    53: 16.34,
    54: 4.357,
    55: 1.91,
    56: 0.543,
    57: 0.314,
    58: 0.102,
    59: 0.07,
    60: 0.00000015,
    61: 0.00000015,
    62: null,
    63: null,
    66: null
  },
  36: {
    33: 0.028,
    34: 0.04,
    35: 0.1,
    36: 17.1,
    37: 27.3,
    38: 690,
    39: 276,
    40: 53280,
    41: 4275,
    43: 126144,
    45: 7.22654E+12,
    49: 338889828,
    51: 4578,
    52: 10170,
    53: 189,
    54: 32.32,
    55: 8.57,
    56: 1.84,
    57: 1.286,
    58: 0.212,
    59: 0.114,
    60: 0.08,
    61: 0.063,
    62: 0.043,
    63: 0.013,
    64: 0.007,
    65: 0.000000635,
    66: null
  },
  37: {
    35: 0.000000103,
    36: 0.000000081,
    37: 0.064776,
    38: 19,
    39: 36.5,
    40: 226.8,
    41: 1059.6,
    42: 1374,
    43: 33.4,
    44: 16459.2,
    45: 75.45,
    46: 7447680,
    47: 2835648,
    49: 1610668.8,
    50: 1.56838E+18,
    51: 1066.38,
    52: 919.2,
    53: 158,
    54: 58.2,
    55: 4.48,
    56: 5.84,
    57: 2.702,
    58: 0.3777,
    59: 0.203,
    60: 0.1691,
    61: 0.115,
    62: 0.054,
    63: 0.052,
    64: 0.032,
    65: 0.037,
    66: 0.023,
    67: null,
    68: null,
    69: null
  },
  38: {
    35: 0.025,
    36: 0.027,
    37: 0.088,
    38: 7.89,
    39: 9,
    40: 160,
    41: 135,
    42: 6378,
    43: 1338,
    44: 2190240,
    45: 116676,
    47: 5602953.6,
    51: 4368643.2,
    52: 912310729.9,
    53: 34740,
    54: 9399.6,
    55: 445.8,
    56: 75.3,
    57: 23.9,
    58: 1.07,
    59: 0.429,
    60: 0.653,
    61: 0.269,
    62: 0.2,
    63: 0.118,
    64: 0.069,
    65: 0.053,
    66: 0.053,
    67: 0.039,
    68: 0.02,
    69: 0.000000395,
    70: null
  },
  39: {
    37: 0.0000002,
    38: 0.057,
    39: 0.053,
    40: 14.8,
    41: 30.1,
    42: 70.4,
    43: 8.3,
    44: 424.8,
    45: 2370,
    46: 9648,
    47: 53064,
    48: 287280,
    49: 9212486.4,
    51: 230580,
    52: 5055264,
    53: 12744,
    54: 36648,
    55: 1122,
    56: 618,
    57: 5.34,
    58: 3.75,
    59: 0.548,
    60: 1.484,
    61: 0.732,
    62: 0.45,
    63: 0.36,
    64: 0.23,
    65: 0.197,
    66: 0.107,
    67: 0.079,
    68: 0.0335,
    69: 0.03,
    70: 0.025,
    71: null,
    72: null
  },
  40: {
    37: null,
    38: 0.00000017,
    39: 0.056,
    40: 4.6,
    41: 5.5,
    42: 32,
    43: 42,
    44: 1548,
    45: 471.6,
    46: 59400,
    47: 6048,
    48: 7205760,
    49: 282276,
    53: 5.08067E+13,
    55: 5532364.8,
    56: 6.31139E+26,
    57: 60296.4,
    58: 30.7,
    59: 2.1,
    60: 7.1,
    61: 2.3,
    62: 2.9,
    63: 1.3,
    64: 1.2,
    65: 0.66,
    66: 0.18,
    67: 0.146,
    68: 0.0774,
    69: 0.056,
    70: 0.0375,
    71: 0.024,
    72: 0.03,
    73: null,
    74: null
  },
  41: {
    40: 0.0000002,
    41: 0.05,
    42: 3.9,
    43: 9.8,
    44: 20.5,
    45: 88,
    46: 222,
    47: 870,
    48: 7308,
    49: 52560,
    50: 21458709663,
    51: 1.09503E+15,
    53: 6.40606E+11,
    54: 3023222.4,
    55: 84060,
    56: 4326,
    57: 2.86,
    58: 15,
    59: 1.4,
    60: 7.1,
    61: 4.3,
    62: 1.5,
    63: 4.9,
    64: 2.91,
    65: 1.02,
    66: 0.3,
    67: 0.198,
    68: 0.108,
    69: 0.082,
    70: 0.054,
    71: 0.033,
    72: 0.032,
    73: 0.017,
    74: 0.023,
    75: null,
    76: null
  },
  42: {
    39: 0.00000045,
    40: null,
    41: 0.006,
    42: 2.3,
    43: 3.2,
    44: 19.1,
    45: 14.1,
    46: 480,
    47: 126.6,
    48: 20016,
    49: 929.4,
    51: 1.26228E+11,
    57: 237326.4,
    58: 2.21214E+26,
    59: 876.6,
    60: 678,
    61: 67.5,
    62: 60,
    63: 36.3,
    64: 8.73,
    65: 3.5,
    66: 1.09,
    67: 0.61,
    68: 0.296,
    69: 0.186,
    70: 0.12,
    71: 0.08,
    72: 0.058,
    73: 0.0455,
    74: 0.032,
    75: 0.022,
    76: 0.019,
    77: null
  },
  43: {
    42: 0.0000001,
    43: 0.055,
    44: 2.2,
    45: 6.4,
    46: 12.8,
    47: 49.2,
    48: 188.4,
    49: 255,
    50: 9900,
    51: 17580,
    52: 72000,
    53: 369792,
    54: 1.32855E+14,
    55: 1.32539E+14,
    56: 6.66167E+12,
    57: 15.65,
    58: 853.2,
    59: 5.28,
    60: 54.2,
    61: 1098,
    62: 458.4,
    63: 35.6,
    64: 21.2,
    65: 5.17,
    66: 0.91,
    67: 0.9,
    68: 0.29,
    69: 0.271,
    70: 0.152,
    71: 0.1,
    72: 0.078,
    73: 0.057,
    74: 0.0445,
    75: 0.03,
    76: 0.022,
    77: 0.021,
    78: 0.022,
    79: null
  },
  44: {
    41: 0.00000045,
    42: 0.000000438,
    44: 1.2,
    45: 1.5,
    46: 11.7,
    47: 8,
    48: 219,
    49: 59.7,
    50: 3108,
    51: 5914.8,
    53: 244512,
    59: 3390940.8,
    61: 15980.4,
    62: 32123520,
    63: 225,
    64: 273,
    65: 34.4,
    66: 12.04,
    67: 2.12,
    68: 1.75,
    69: 0.8,
    70: 0.54,
    71: 0.318,
    72: 0.204,
    73: 0.151,
    74: 0.099,
    75: 0.0695,
    76: 0.045,
    77: 0.029,
    78: 0.025,
    79: 0.019,
    80: 0.015,
    81: null
  },
  45: {
    44: 0.00000012,
    45: 0.029,
    46: 1.47,
    47: 4.66,
    48: 12.2,
    49: 70.6,
    50: 301.2,
    51: 594,
    52: 1842,
    53: 523.2,
    54: 1391040,
    55: 73800,
    56: 104137855.7,
    57: 17910720,
    59: 42.3,
    60: 127227.6,
    61: 30.07,
    62: 1302,
    63: 16.8,
    64: 80.8,
    65: 3.35,
    66: 11,
    67: 3.6,
    68: 2.8,
    69: 1.85,
    70: 0.99,
    71: 0.68,
    72: 0.44,
    73: 0.266,
    74: 0.171,
    75: 0.132,
    76: 0.151,
    77: 0.0000003,
    78: 0.0422,
    79: 0.03,
    80: 0.0265,
    81: 0.019,
    82: 0.02,
    83: null
  },
  46: {
    44: null,
    45: null,
    46: 1,
    47: 1,
    48: 9,
    49: 5,
    50: 122,
    51: 186,
    52: 1062,
    53: 1284,
    54: 313632,
    55: 30492,
    57: 1468022.4,
    61: 2.0512E+14,
    63: 48924,
    65: 1404,
    66: 75744,
    67: 93,
    68: 145.2,
    69: 25,
    70: 11.8,
    71: 4.3,
    72: 1.9,
    73: 0.92,
    74: 0.492,
    75: 0.285,
    76: 0.175,
    77: 0.109,
    78: 0.038,
    79: 0.057,
    80: 0.0486,
    81: 0.038,
    82: 0.035,
    83: 0.031,
    84: null,
    85: null
  },
  47: {
    45: null,
    46: 0.000000228,
    47: 0.026,
    48: 1.75,
    49: 4.4,
    50: 25.5,
    51: 47.5,
    52: 124,
    53: 120.6,
    54: 666,
    55: 774,
    56: 3942,
    57: 4152,
    58: 3567456,
    59: 1437.6,
    61: 142.92,
    63: 24.56,
    64: 643680,
    65: 11268,
    66: 19332,
    67: 4.6,
    68: 1200,
    69: 230,
    70: 72.8,
    71: 3.76,
    72: 2.1,
    73: 1.23,
    74: 0.78,
    75: 0.529,
    76: 0.299,
    77: 0.191,
    78: 0.159,
    79: 0.052,
    80: 0.109,
    81: 0.058,
    82: 0.046,
    83: 0.042,
    84: 0.035,
    85: 0.028
  },
  48: {
    46: 0.00000076,
    47: 0.032,
    48: 1.03,
    49: 2.8,
    50: 9.3,
    51: 16,
    52: 49.1,
    53: 81.6,
    54: 330,
    55: 438,
    56: 3462,
    57: 3330,
    59: 23400,
    61: 39908160,
    65: 2.53718E+23,
    67: 192456,
    68: 1.04138E+27,
    69: 8964,
    70: 3018,
    71: 161.4,
    72: 50.8,
    73: 13.5,
    74: 5.24,
    75: 2.1,
    76: 1.25,
    77: 0.68,
    78: 0.515,
    79: 0.37,
    80: 0.28,
    81: 0.154,
    82: 0.162,
    83: 0.068,
    84: 0.084,
    85: 0.057,
    86: 0.065
  },
  49: {
    47: null,
    48: 0.036,
    49: 0.03,
    50: 3.1,
    51: 5.65,
    52: 15.1,
    53: 23.3,
    54: 65,
    55: 108,
    56: 304.2,
    57: 372,
    58: 1944,
    59: 3480,
    60: 14972.4,
    61: 17712,
    62: 242326.08,
    63: 892.8,
    65: 71.9,
    66: 1.39166E+22,
    67: 14.1,
    68: 2592,
    69: 5,
    70: 144,
    71: 3.08,
    72: 23.1,
    73: 1.5,
    74: 6.15,
    75: 3.12,
    76: 2.36,
    77: 1.53,
    78: 1.09,
    79: 0.84,
    80: 0.611,
    81: 0.29,
    82: 0.28,
    83: 0.2,
    84: 0.165,
    85: 0.14,
    86: 0.101,
    87: 0.085,
    88: 0.065
  },
  50: {
    49: 0.00000076,
    50: 1.18,
    51: 1.7,
    52: 3.8,
    53: 7,
    54: 20.8,
    55: 32.7,
    56: 115,
    57: 174,
    58: 618,
    59: 1086,
    60: 14954.4,
    61: 2118,
    63: 9943776,
    71: 97308,
    73: 11162880,
    75: 832896,
    76: 7.25809E+12,
    77: 7560,
    78: 3544.2,
    79: 133.8,
    80: 223.2,
    81: 56,
    82: 39.7,
    83: 1.46,
    84: 1.05,
    85: 0.515,
    86: 0.345,
    87: 0.19,
    88: 0.14,
    89: 0.13,
    90: null
  },
  51: {
    52: 0.000000049,
    53: 0.44,
    54: 1.22,
    55: 0.6,
    56: 4,
    57: 7.4,
    58: 17.2,
    59: 23.6,
    60: 75,
    61: 53.5,
    62: 400.2,
    63: 209.4,
    64: 1926,
    65: 948,
    66: 10080,
    67: 216,
    68: 137484,
    69: 953.4,
    71: 235336.32,
    73: 5201280,
    74: 87051673.72,
    75: 1067040,
    76: 332640,
    77: 32580,
    78: 15717.6,
    79: 2370,
    80: 1381.8,
    81: 167.4,
    82: 140.4,
    83: 0.78,
    84: 1.679,
    85: 0.923,
    86: 0.45,
    87: 0.348,
    88: 0.093,
    89: 0.173,
    90: null,
    91: 0.053
  },
  52: {
    52: 0.000000018,
    53: 0.00000062,
    54: 0.00007,
    55: 0.0031,
    56: 2.1,
    57: 4.4,
    58: 18.6,
    59: 19.3,
    60: 120,
    61: 102,
    62: 912,
    63: 348,
    64: 8964,
    65: 3720,
    66: 518400,
    67: 57780,
    69: 1656288,
    71: 2.90324E+24,
    75: 33660,
    76: 2.42988E+32,
    77: 4176,
    78: 2.493E+28,
    79: 1500,
    80: 276825.6,
    81: 750,
    82: 2508,
    83: 19,
    84: 17.63,
    85: 2.49,
    86: 1.4,
    87: 1.6,
    88: 0.348,
    90: null,
    91: 0.000000408,
    92: null,
    93: null
  },
  53: {
    55: 0.036,
    56: 0.0000928,
    57: 0.664,
    58: 2.5,
    59: 3.34,
    60: 6.6,
    61: 2.1,
    62: 78,
    63: 2.91,
    64: 133.2,
    65: 822,
    66: 1146,
    67: 4896,
    68: 7632,
    69: 217.8,
    70: 47602.8,
    71: 360806.4,
    72: 5132764.8,
    73: 1117152,
    75: 1499.4,
    76: 4.95444E+14,
    77: 44496,
    78: 693377.28,
    79: 8262,
    80: 74988,
    81: 3150,
    82: 23688,
    83: 83.4,
    84: 24.5,
    85: 6.26,
    86: 2.28,
    87: 0.86,
    88: 0.43,
    89: 0.222,
    90: 0.13,
    91: 0.0000003,
    92: 0.000000407,
    93: 0.094,
    94: null
  },
  54: {
    54: 0.000054,
    55: 0.013,
    56: 0.093,
    57: 0.74,
    58: 2.7,
    59: 2.74,
    60: 10,
    61: 18,
    62: 59,
    63: 61,
    64: 228,
    65: 348,
    66: 2400,
    67: 2406,
    68: 72360,
    69: 7380,
    70: 5.04911E+21,
    71: 60840,
    73: 3140294.4,
    79: 453384,
    80: 1.8303E+30,
    81: 32904,
    82: 6.83207E+28,
    83: 229.08,
    84: 848.4,
    85: 39.68,
    86: 13.6,
    87: 1.73,
    88: 1.23,
    89: 0.511,
    90: 1.15,
    91: 0.188,
    92: 0.146,
    93: 0.1,
    94: 0.0000004,
    95: null,
    96: null
  },
  55: {
    57: 0.00049,
    58: 0.0000177,
    59: 0.57,
    60: 1.4,
    61: 0.7,
    62: 8.4,
    63: 14,
    64: 43,
    65: 61.3,
    66: 155,
    67: 21.18,
    68: 351.6,
    69: 30.9,
    70: 2802,
    71: 98.4,
    72: 22500,
    73: 218.4,
    74: 115416,
    75: 1752.6,
    76: 837129.6,
    77: 559872,
    79: 65171363.52,
    80: 7.25809E+13,
    81: 1124064,
    82: 949232333.3,
    83: 1950,
    84: 556.2,
    85: 63.7,
    86: 24.84,
    87: 1.684,
    88: 1.791,
    89: 0.994,
    90: 0.587,
    91: 0.322,
    92: 0.23,
    93: 0.146,
    94: 0.113,
    95: 0.084,
    96: 0.069,
    97: 0.05
  },
  56: {
    58: 0.43,
    59: 0.45,
    60: 1.3,
    61: 1.75,
    62: 5.5,
    63: 5.4,
    64: 24,
    65: 29.7,
    66: 117,
    67: 144,
    68: 660,
    69: 198,
    70: 6000,
    71: 762,
    72: 209952,
    73: 8028,
    75: 993600,
    76: 9.46708E+28,
    77: 332957126,
    83: 4975.8,
    84: 1101686.4,
    85: 1096.2,
    86: 636,
    87: 14.5,
    88: 11.5,
    89: 4.31,
    90: 2.21,
    91: 0.894,
    92: 0.612,
    93: 0.344,
    94: 0.259,
    95: 0.167,
    96: 0.139,
    97: 0.116,
    98: 0.053
  },
  57: {
    60: 0.0235,
    63: 2.8,
    64: 5.3,
    65: 8.6,
    66: 16.3,
    67: 21,
    68: 64.8,
    69: 54,
    70: 306,
    71: 310.8,
    72: 696,
    73: 522,
    74: 3540,
    75: 17280,
    76: 14083.2,
    77: 387,
    78: 70200,
    79: 592.2,
    80: 1.89342E+12,
    81: 3.25036E+18,
    83: 145029.312,
    84: 14112,
    85: 5466,
    86: 852,
    87: 40.8,
    88: 24.8,
    89: 6.1,
    90: 4.06,
    91: 1.26,
    92: 1.05,
    93: 0.59,
    94: 0.457,
    95: 0.298,
    96: 0.245,
    97: 0.161,
    98: 0.101,
    99: 0.084,
    100: null
  },
  58: {
    63: 1.1,
    64: null,
    65: 3.8,
    66: 6,
    67: 9.7,
    68: 51,
    69: 34,
    70: 235.8,
    71: 210,
    72: 1374,
    73: 618,
    74: 12636,
    75: 5820,
    76: 273024,
    77: 63720,
    79: 32400,
    80: 1.3885E+24,
    81: 11891232,
    83: 2808950.4,
    84: 1.57785E+24,
    85: 118940.4,
    86: 24616224,
    87: 180.6,
    88: 809.4,
    89: 56.4,
    90: 56.8,
    91: 5.3,
    92: 4,
    93: 1.76,
    94: 1.4,
    95: 0.865,
    96: 0.722,
    97: 0.313,
    98: 0.233,
    99: 0.18,
    100: 0.099
  },
  59: {
    62: 0.01,
    65: 1.2,
    66: 3.3,
    67: 3.14,
    68: 4.2,
    69: 2.84,
    70: 30,
    71: 40,
    72: 90.6,
    73: 96,
    74: 390,
    75: 1020,
    76: 1440,
    77: 786,
    78: 4608,
    79: 87,
    80: 15876,
    81: 203.4,
    83: 68832,
    84: 1172448,
    85: 1036.8,
    86: 21542.4,
    87: 1445.4,
    88: 804,
    89: 137.4,
    90: 135.6,
    91: 6.19,
    92: 18.9,
    93: 3.57,
    94: 4.29,
    95: 2.3,
    96: 1.47,
    97: 0.444,
    98: 0.295,
    99: 0.181,
    100: 0.13,
    101: 0.17,
    102: null
  },
  60: {
    65: 0.65,
    66: null,
    67: 1.8,
    68: 5,
    69: 6.7,
    70: 13,
    71: 25.4,
    72: 94,
    73: 70,
    74: 510,
    75: 744,
    76: 3039,
    77: 2310,
    78: 18144,
    79: 1782,
    80: 291168,
    81: 8964,
    84: 7.22654E+22,
    87: 948672,
    89: 6220.8,
    90: 2.87168E+26,
    91: 746.4,
    92: 684,
    93: 31.6,
    94: 25.9,
    95: 8.9,
    96: 5.26,
    97: 1.15,
    98: 0.82,
    99: 0.485,
    100: 0.439,
    101: 0.22,
    102: 0.31,
    103: null
  },
  61: {
    67: 1,
    68: 2.4,
    69: 2.6,
    70: 6.3,
    71: 6.2,
    72: 13.5,
    73: 5,
    74: 49,
    75: 300,
    76: 144,
    77: 10,
    78: 249,
    79: 9.2,
    80: 1254,
    81: 40.5,
    82: 22896000,
    83: 31363200,
    84: 558557589.8,
    85: 174509800.6,
    86: 82786439.6,
    87: 463795.2,
    88: 191088,
    89: 9712.8,
    90: 102240,
    91: 247.2,
    92: 315,
    93: 160.8,
    94: 41.5,
    95: 26.7,
    96: 10.56,
    97: 4.8,
    98: 1.5,
    99: 0.725,
    100: 1.05,
    101: 0.63,
    102: 0.43,
    103: null,
    104: null
  },
  62: {
    67: 0.55,
    68: null,
    69: 1.2,
    70: 4,
    71: 2.89,
    72: 9.5,
    73: 10.3,
    74: 47,
    75: 45,
    76: 186,
    77: 154.2,
    78: 889.2,
    79: 612,
    80: 4349.4,
    81: 525,
    83: 29376000,
    84: 2.14587E+15,
    85: 3.34503E+18,
    86: 2.20898E+23,
    89: 2840123338,
    91: 166622.4,
    93: 1330.8,
    94: 33840,
    95: 481.8,
    96: 318,
    97: 11.37,
    98: 9.6,
    99: 4.8,
    100: 2.4,
    101: 1.23,
    102: 1.43,
    103: 0.98,
    104: 0.8,
    105: null,
    106: null
  },
  63: {
    67: 0.0009,
    68: 0.0178,
    69: null,
    71: 0.5,
    72: 1.5,
    73: 3.3,
    74: 11,
    75: 12.1,
    76: 17.9,
    77: 1.51,
    78: 40.7,
    79: 2.34,
    80: 155.4,
    81: 10.2,
    82: 512352,
    83: 398304,
    84: 2082240,
    85: 4708800,
    86: 8043840,
    87: 1164450568,
    88: 5.36468E+25,
    89: 426554968.4,
    91: 271421120.3,
    92: 149990069.2,
    93: 1312416,
    94: 54648,
    95: 2754,
    96: 1086,
    97: 42.6,
    98: 26,
    99: 10.6,
    100: 7.7,
    101: 4.15,
    102: 2.3,
    103: 1.7,
    104: 1.3,
    105: 0.2,
    106: null
  },
  64: {
    70: null,
    71: 1.1,
    72: 0.0000002,
    73: 2.2,
    74: 4.7,
    75: 5.8,
    76: 15.8,
    77: 14,
    78: 70.2,
    79: 39,
    80: 268.2,
    81: 1380,
    82: 4170528,
    83: 137016,
    84: 2243697437,
    85: 801792,
    86: 5.64869E+13,
    87: 10704960,
    88: 3.40815E+21,
    89: 20770560,
    95: 66524.4,
    97: 219.6,
    98: 504,
    99: 68,
    100: 45,
    101: 10.3,
    102: 4.8,
    103: 4.26,
    104: 3.03,
    105: 0.75,
    106: 0.41,
    107: null,
    108: null
  },
  65: {
    70: 0.00094,
    73: 0.0000002,
    74: 1.6,
    75: 2.29,
    76: 3.5,
    77: 0.597,
    78: 12,
    79: 1,
    80: null,
    81: 8,
    82: 5904,
    83: 3600,
    84: 14824.8,
    85: 12528,
    86: 63392.4,
    87: 63000,
    88: 202176,
    89: 77400,
    90: 459648,
    91: 462240,
    92: 2240541744,
    93: 5680246675,
    95: 6246720,
    96: 595296,
    97: 456,
    98: 1170,
    99: 180,
    100: 126.6,
    101: 25.1,
    102: 19.4,
    103: 8.2,
    104: 5.1,
    105: 0.96,
    106: 1.24,
    107: 0.76,
    108: null,
    109: null
  },
  66: {
    73: 0.6,
    74: null,
    75: 0.9,
    76: 2.3,
    77: 5.6,
    78: 9.1,
    79: 6,
    80: 33.2,
    81: 67,
    82: 198,
    83: 252,
    84: 430.2,
    85: 1074,
    86: 8568,
    87: 23040,
    88: 9.46708E+13,
    89: 35640,
    91: 29304,
    93: 12476160,
    99: 8395.2,
    100: 293760,
    101: 372,
    102: 522,
    103: 39,
    104: 55,
    105: 4.1,
    106: 0.00000016,
    107: 1.43,
    108: 0.00000016,
    109: null,
    110: null
  },
  67: {
    73: 0.006,
    74: 0.0041,
    75: 0.4,
    76: null,
    77: 0.7,
    78: 2.4,
    79: 3.32,
    80: 5.8,
    81: 2.2,
    82: 21.1,
    83: 72,
    84: 35.2,
    85: 161.8,
    86: 120.6,
    87: 705.6,
    88: 2880,
    89: 3360,
    90: 756,
    91: 678,
    92: 1983,
    93: 1536,
    94: 8928,
    95: 900,
    96: 1.44215E+11,
    97: 1728,
    99: 96566.4,
    100: 11160,
    101: 179.4,
    102: 283.2,
    103: 165.6,
    104: 53,
    105: 25,
    106: 6.9,
    107: 3.2,
    108: 1.9,
    109: 0.00000016,
    110: null,
    111: null
  },
  68: {
    75: null,
    76: 0.0000002,
    77: null,
    78: 1.7,
    79: 2.5,
    80: 4.6,
    81: 4,
    82: 18.5,
    83: 23.5,
    84: 10.3,
    85: 37.1,
    86: 223.8,
    87: 318,
    88: 1170,
    89: 1119,
    90: 8244,
    91: 2160,
    92: 102888,
    93: 11556,
    95: 4500,
    97: 37296,
    101: 811468.8,
    103: 27057.6,
    104: 177480,
    105: 84,
    106: 192,
    107: 72,
    108: 0.00000016,
    109: null,
    110: 0.00000016,
    111: null,
    112: null
  },
  69: {
    75: 0.0000019,
    76: 0.00000317,
    77: 0.068,
    78: 0.58,
    79: 0.7,
    80: 0.9,
    81: 2.2,
    82: 4.17,
    83: 8,
    84: 1.48,
    85: 8.1,
    86: 21.6,
    87: 83.8,
    88: 217.8,
    89: 238.8,
    90: 547.8,
    91: 564,
    92: 1812,
    93: 1302,
    94: 6516,
    95: 117,
    96: 108216,
    97: 27720,
    98: 799200,
    99: 8043840,
    101: 11111040,
    102: 60589297.87,
    103: 228960,
    104: 29664,
    105: 324,
    106: 912,
    107: 114,
    108: 95,
    109: 0.0000003,
    110: 0.00000016,
    111: 0.0000003,
    112: 0.00000016
  },
  70: {
    79: 0.7,
    80: 0.0000002,
    81: 1.6,
    82: 3.03,
    83: 4.2,
    84: 0.409,
    85: 1.793,
    86: 26.1,
    87: 38.6,
    88: 89.4,
    89: 100.2,
    90: 288,
    91: 252,
    92: 1132.2,
    93: 663,
    94: 4548,
    95: 594,
    96: 204120,
    97: 1050,
    99: 2766355.2,
    105: 361584,
    107: 6879.6,
    108: 4440,
    109: 480,
    110: 144,
    111: 0.00000016,
    112: 0.00000016,
    113: 0.000000222,
    114: 0.00000016,
    115: 0.00000016
  },
  71: {
    79: 0.045,
    80: 0.0806,
    81: 0.7,
    82: 0.9,
    83: null,
    84: 0.068,
    85: 0.494,
    86: 6.8,
    87: 10.6,
    88: 12.1,
    89: 36.1,
    90: 77,
    91: 82.2,
    92: 238.2,
    93: 188.4,
    94: 644.4,
    95: 159,
    96: 3090,
    97: 330,
    98: 122616,
    99: 173836.8,
    100: 712540.8,
    101: 578880,
    102: 43232988.59,
    103: 104453425,
    105: 1.18654E+18,
    106: 574067.52,
    107: 1704,
    108: 16524,
    109: 342,
    110: 210,
    111: 120,
    112: 58,
    113: 19,
    114: 0.00000016,
    115: 0.00000016,
    116: 0.00000016,
    117: null
  },
  72: {
    79: null,
    81: null,
    82: 2,
    83: 0.843,
    84: 0.023,
    85: 0.115,
    86: 2.85,
    87: 5.6,
    88: 13.6,
    89: 18.4,
    90: 39.4,
    91: 40,
    92: 111,
    93: 76,
    94: 406.2,
    95: 123,
    96: 1557,
    97: 194.4,
    98: 57636,
    99: 43560,
    100: 59011451.57,
    101: 84960,
    102: 6.31139E+22,
    103: 6048000,
    109: 3662496,
    110: 2.80857E+14,
    111: 3664.8,
    112: 14832,
    113: 210,
    114: 156,
    115: null,
    116: null,
    117: null,
    118: null
  },
  73: {
    82: 0.0029,
    83: 0.106,
    84: 0.0101,
    85: 0.055,
    86: 0.83,
    87: 1.55,
    88: null,
    89: 3.57,
    90: 10.6,
    91: 14.2,
    92: 31,
    93: 34.4,
    94: 80,
    95: 120,
    96: 294,
    97: 405.6,
    98: 1398,
    99: 2208,
    100: 11304,
    101: 4104,
    102: 37800,
    103: 29124,
    104: 202896,
    105: 8496,
    106: 57433605.27,
    107: 29354.4,
    109: 9913536,
    110: 440640,
    111: 31320,
    112: 2964,
    113: 630,
    114: null,
    115: 19.6,
    116: null,
    117: 5.3,
    118: 0.0000003,
    119: 2.2,
    120: null,
    121: null
  },
  74: {
    83: 0.275,
    84: 0.00125,
    85: 0.0073,
    86: 0.091,
    87: 0.409,
    88: 1.19,
    89: 2.67,
    90: 6.3,
    91: 5.1,
    92: 19.2,
    93: 19.9,
    94: 50.9,
    95: 74,
    96: 145.2,
    97: 142.8,
    98: 396,
    99: 456,
    100: 1992,
    101: 2112,
    102: 9000,
    103: 7944,
    104: 1866240,
    105: 2223,
    106: 5.68025E+25,
    107: 10471680,
    109: 2.11431E+28,
    111: 6488640,
    113: 86400,
    114: 6028992,
    115: 696,
    116: 1800,
    118: null,
    119: null,
    120: null,
    121: 0.00000016,
    122: 0.00000016,
    123: 0.00000016
  },
  75: {
    84: null,
    85: 0.000612,
    86: 0.00044,
    87: 0.107,
    88: 0.39,
    89: 0.7,
    90: 1.6,
    91: 2.25,
    92: 5.9,
    93: 4.4,
    94: 8.1,
    95: 9.2,
    96: 15.2,
    97: 15,
    98: 118.8,
    99: 144,
    100: 353.4,
    101: 318,
    102: 840,
    103: 792,
    104: 1170,
    105: 147.6,
    106: 71640,
    107: 231120,
    108: 6048000,
    109: 3058560,
    111: 321261.12,
    112: 1.36641E+18,
    113: 61218,
    114: 87480,
    115: 180,
    116: 588,
    117: 16,
    118: null,
    119: 5,
    120: 6,
    121: 3,
    122: 0.00000016,
    123: 0.00000016,
    124: 0.00000016
  },
  76: {
    85: 0.00064,
    86: 0.0021,
    87: 0.0055,
    88: 0.021,
    89: 0.071,
    90: 0.213,
    91: 0.81,
    92: 2.1,
    93: 3.43,
    94: 7.37,
    95: 8.3,
    96: 19.2,
    97: 22.4,
    98: 44,
    99: 84,
    100: 216,
    101: 180,
    102: 300,
    103: 390,
    104: 1290,
    105: 6300,
    106: 78624,
    107: 46800,
    108: 1.76719E+21,
    109: 8087040,
    110: 6.31139E+22,
    115: 1330560,
    117: 107388,
    118: 189341555.8,
    119: 390,
    120: 2094,
    121: 168,
    122: null,
    123: 5,
    124: 6,
    125: 0.00000016,
    126: 0.00000016,
    127: null
  },
  77: {
    87: null,
    88: 0.000001,
    89: 0.0105,
    90: 0.0352,
    91: 0.222,
    92: 0.353,
    93: 0.87,
    94: 3.2,
    95: 4.4,
    96: 9,
    97: 7.9,
    98: 9,
    99: 8.7,
    100: 29.8,
    101: 12,
    102: 79,
    103: 90,
    104: 294,
    105: 900,
    106: 3480,
    107: 11124,
    108: 51840,
    109: 59904,
    110: 37800,
    111: 149400,
    112: 1140480,
    113: 1017792,
    115: 6378825.6,
    117: 69048,
    118: 8244,
    119: 52,
    120: 348,
    121: 8,
    122: 6,
    123: 0.0000003,
    124: 0.0000003,
    125: 11,
    126: null,
    127: 0.00000016,
    128: null
  },
  78: {
    87: 0.00026,
    88: 0.0003,
    89: 0.0007,
    90: 0.00202,
    91: 0.007,
    92: 0.0138,
    93: 0.0455,
    94: 0.0976,
    95: 0.382,
    96: 0.889,
    97: 2.53,
    98: 6.33,
    99: 10,
    100: 20.7,
    101: 21.2,
    102: 56,
    103: 52,
    104: 160.2,
    105: 390,
    106: 1038,
    107: 4254,
    108: 7488,
    109: 8460,
    110: 877824,
    111: 39132,
    112: 1.56838E+19,
    113: 244512,
    115: 1577846299,
    119: 71609.4,
    121: 1848,
    122: 45360,
    123: 150,
    124: 158400,
    125: 22,
    126: 10.3,
    127: null,
    128: 0.00000016,
    129: 0.00000016,
    130: 0.00000016
  },
  79: {
    91: 0.00029,
    92: 0.000022,
    93: 0.022,
    94: 0.0263,
    95: 0.12,
    96: null,
    97: null,
    98: 1.501,
    99: 2.6,
    100: 7.1,
    101: 8.4,
    102: 13.7,
    103: 15.5,
    104: 42.8,
    105: 20.6,
    106: 255,
    107: 642,
    108: 498,
    109: 530.4,
    110: 1722,
    111: 2568,
    112: 11448,
    113: 17784,
    114: 63540,
    115: 136872,
    116: 16071264,
    117: 532820.16,
    119: 232770.24,
    120: 271209.6,
    121: 2904,
    122: 1560,
    123: 28.4,
    124: 60,
    125: 39.8,
    126: 32,
    127: 40,
    128: 0.0000003,
    129: 0.0000003,
    130: 0.0000003,
    131: 0.0000003
  },
  80: {
    90: 0.00008,
    91: 0.000059,
    92: 0.000231,
    93: 0.0008,
    94: 0.0021,
    95: 0.0106,
    96: 0.0203,
    97: 0.117,
    98: 0.2665,
    99: 1.05,
    100: 2.59,
    101: 3.6,
    102: 10.83,
    103: 9.4,
    104: 30.87,
    105: 49.1,
    106: 82.8,
    107: 114,
    108: 195,
    109: 456,
    110: 1200,
    111: 2940,
    112: 17460,
    113: 13680,
    114: 14105945911,
    115: 37908,
    117: 230904,
    123: 4027104,
    125: 308.4,
    126: 499.2,
    127: 174,
    128: 2460,
    129: 36,
    130: null,
    131: 0.0000003,
    132: null,
    133: 0.0000003,
    134: null,
    135: 0.0000003,
    136: 0.0000003
  },
  81: {
    95: 0.0052,
    96: 0.018,
    97: 0.254,
    98: 0.23,
    99: 1.09,
    100: 3.2,
    101: 3.1,
    102: 6.9,
    103: 10.1,
    104: 19.5,
    105: 27.5,
    106: 51,
    107: 71,
    108: 138,
    109: 156,
    110: null,
    111: 576,
    112: 1296,
    113: 1980,
    114: 4176,
    115: 6624,
    116: 10224,
    117: 19080,
    118: 26712,
    119: 93960,
    120: 262837.44,
    121: 1063584,
    123: 119379851,
    125: 252.12,
    126: 286.2,
    127: 183.18,
    128: 129.72,
    129: 78,
    130: 88,
    131: 30.9,
    132: 46,
    133: 11,
    134: 0.0000003,
    135: 0.0000003,
    136: null
  },
  82: {
    96: 0.00012,
    97: 0.0035,
    98: 0.0041,
    99: 0.045,
    100: 0.055,
    101: 0.535,
    102: 0.49,
    103: 6.3,
    104: 4.82,
    105: 15.2,
    106: 25.5,
    107: 39,
    108: 71,
    109: 79.8,
    110: 210,
    111: null,
    112: 642,
    113: 900,
    114: 2220,
    115: 486,
    116: 8640,
    117: 5400,
    118: 77400,
    119: 33588,
    120: 1.65674E+12,
    121: 186912,
    122: 4.41797E+24,
    123: 5.36468E+14,
    127: 11642.4,
    128: 700563756.6,
    129: 2166,
    130: 38239.2,
    131: 612,
    132: 1623.6,
    133: 147,
    134: 0.0000003,
    135: 19.9,
    136: 15,
    137: null,
    138: 0.0000003
  },
  83: {
    101: 0.013,
    102: 0.000058,
    103: 0.015,
    104: 0.037,
    105: 0.06,
    106: 0.688,
    107: 6.3,
    108: 12.4,
    109: 34.6,
    110: 63.6,
    111: 95,
    112: 183,
    113: 308,
    114: 559.8,
    115: 618,
    116: 1620,
    117: 2184,
    118: 6180,
    119: 6156,
    120: 42336,
    121: 40392,
    122: 1288224,
    123: 539395.2,
    124: 995621014.5,
    125: 1.16129E+13,
    126: 6.34294E+26,
    127: 433036.8,
    128: 128.4,
    129: 3633,
    130: 2735.4,
    131: 1182.6,
    132: 456,
    133: 135,
    134: 98.5,
    135: 33,
    136: 22,
    137: 0.0000003,
    138: 0.0000003,
    139: 0.0000003,
    140: 0.0000003,
    141: 0.0000003
  },
  84: {
    102: 0.000028,
    103: 0.0014,
    104: 0.00027,
    105: 0.0035,
    106: 0.00245,
    107: 0.022,
    108: 0.0322,
    109: 0.399,
    110: 0.392,
    111: 4.64,
    112: 5.8,
    113: 84,
    114: 105.6,
    115: 328.2,
    116: 690.6,
    117: 936,
    118: 2676,
    119: 2202,
    120: 12668.4,
    121: 6264,
    122: 760320,
    123: 20880,
    124: 91451971.47,
    125: 3913058821,
    126: 11955686.4,
    127: 0.516,
    128: 2.943E-07,
    129: 0.00000372,
    130: 0.00016346,
    131: 0.001781,
    132: 0.145,
    133: 1.53,
    134: 185.82,
    135: 620,
    136: 0.0000003,
    137: 112,
    138: 550,
    139: 0.0000003,
    140: 0.0000003,
    141: 0.0000003,
    142: 0.0000003,
    143: 0.0000003
  },
  85: {
    106: 0.0017,
    107: 0.088,
    108: 0.028,
    109: 0.286,
    110: 0.29,
    111: 0.388,
    112: 0.388,
    113: 4.2,
    114: 7.03,
    115: 43,
    116: 85.2,
    117: 184,
    118: 444,
    119: 547.2,
    120: 1614,
    121: 1836,
    122: 6516,
    123: 5868,
    124: 19512,
    125: 29160,
    126: 25970.4,
    127: 0.314,
    128: 0.000000125,
    129: 0.000000558,
    130: 0.0001,
    131: 0.0003,
    132: 0.0326,
    133: 1.28,
    134: 56,
    135: 222.6,
    136: 138,
    137: 54,
    138: 50,
    139: 78,
    140: 0.0000003,
    141: 0.0000003,
    142: 0.0000003,
    143: 0.0000003,
    144: 0.0000003
  },
  86: {
    107: 0.00115,
    108: 0.00078,
    109: 0.006,
    110: 0.0044,
    111: 0.065,
    112: 0.065,
    113: 0.59,
    114: 1.03,
    115: 7,
    116: 9.7,
    117: 44.2,
    118: 74.5,
    119: 170,
    120: 340.2,
    121: 555,
    122: 1461,
    123: 1728,
    124: 8640,
    125: 52560,
    126: 1434,
    127: 0.0195,
    128: 0.000000259,
    129: 0.0000023,
    130: 0.000045,
    131: 0.00054,
    132: 0.03375,
    133: 3.96,
    134: 55.6,
    135: 1500,
    136: 330350.4,
    137: 1458,
    138: 6420,
    139: 279.6,
    140: 444,
    141: 20.2,
    142: 65,
    143: 12
  },
  87: {
    110: 0.0006,
    111: 0.015,
    112: 0.012,
    113: 0.049,
    114: 0.062,
    115: 0.3,
    116: 0.55,
    117: 1.8,
    118: 3.9,
    119: 16,
    120: 14.8,
    121: 59.1,
    122: 50.5,
    123: 190.8,
    124: 186,
    125: 1200,
    126: 34.82,
    127: 0.0055,
    128: 0.000000086,
    129: 0.0000007,
    130: 0.000022,
    131: 0.0011,
    132: 0.024,
    133: 27.4,
    134: 294,
    135: 852,
    136: 1320,
    137: 199.8,
    138: 237,
    139: 49,
    140: 148.2,
    141: 38,
    142: 50.2,
    143: 19.1,
    144: 17.6,
    145: 5.5,
    146: 0.9
  },
  88: {
    113: 0.0016,
    114: 0.016,
    115: 0.031,
    116: 0.057,
    117: 0.21,
    118: 0.24,
    119: 1.35,
    120: 1.3,
    121: 4.8,
    122: 3.7,
    123: 13,
    124: 13,
    125: 163.8,
    126: 2.438,
    127: 0.00166,
    128: 0.000000182,
    129: 0.0000016,
    130: 0.00002591,
    131: 0.009,
    132: 0.018,
    133: 28,
    134: 38,
    135: 987552,
    136: 313796.16,
    137: 1287360,
    138: 50491081559,
    139: 2532,
    140: 181452324.4,
    141: 240,
    142: 5580,
    143: 104,
    144: 252,
    145: 30,
    146: 30
  },
  89: {
    116: 0.02,
    117: 0.022,
    118: 0.027,
    119: 0.095,
    120: 0.087,
    121: 0.35,
    122: 0.21,
    123: 0.88,
    124: 0.738,
    125: 8.2,
    126: 0.17,
    127: 0.00044,
    128: 0.000000069,
    129: 0.00000103,
    130: 0.0000118,
    131: 0.0264,
    132: 0.052,
    133: 5,
    134: 126,
    135: 10008,
    136: 857088,
    137: 105732,
    138: 687057392.3,
    139: 22140,
    140: 3762,
    141: 122,
    142: 450,
    143: 119,
    144: 143,
    145: 44,
    146: 62
  },
  90: {
    118: 0.0017,
    119: 0.0025,
    120: 0.016,
    121: 0.037,
    122: 0.0317,
    123: 0.144,
    124: 0.087,
    125: 1.2,
    126: 0.026,
    127: 0.000252,
    128: 0.000000122,
    129: 0.000001025,
    130: 0.0000097,
    131: 0.00174,
    132: 0.00224,
    133: 0.6,
    134: 1.04,
    135: 525,
    136: 1834.2,
    137: 1615420.8,
    138: 60324219.69,
    139: 2.48669E+11,
    140: 2.37939E+12,
    141: 91872,
    142: 4.41797E+17,
    143: 1309.8,
    144: 2082240,
    145: 432,
    146: 2238
  },
  91: {
    120: 0.0000003,
    121: 0.0051,
    122: 0.0053,
    123: 0.017,
    124: 0.014,
    125: 0.15,
    126: 0.0038,
    127: 0.000109,
    128: 0.000000054,
    129: 0.00000078,
    130: 0.0000059,
    131: 0.0029,
    132: 0.0051,
    133: 0.846,
    134: 1.7,
    135: 108,
    136: 2298,
    137: 79200,
    138: 129600,
    139: 1503360,
    140: 1.0338E+12,
    141: 114048,
    142: 2330640,
    143: 24120,
    144: 1464,
    145: 546,
    146: 522
  },
  92: {
    122: 0.00052,
    123: 0.0007,
    124: 0.0045,
    125: 0.016,
    126: 0.00065,
    127: 0.00006,
    129: 0.00000066,
    130: 0.0000047,
    131: 0.000018,
    132: 0.00084,
    133: 0.069,
    134: 0.268,
    135: 66,
    136: 546,
    137: 3480,
    138: 1747872,
    139: 362880,
    140: 2174272200,
    141: 5.02355E+12,
    142: 7.74723E+12,
    143: 2.22161E+16,
    144: 7.39063E+14,
    145: 583372.8,
    146: 1.40996E+17
  }
};

const AtomIdentifier = {

  // Get the chemical symbol for an atom with the specified number of protons.
  getSymbol: function( numProtons ) {
    return symbolTable[ numProtons ];
  },

  /**
   * Get the internationalized element name for an atom with the specified number of protons.
   * @param {number} numProtons
   * @returns {string}
   */
  getName: function( numProtons ) {
    return nameTable[ numProtons ];
  },

  /**
   * Get the English name for an atom with the specified number of protons, lowercased with no whitespace and suitable
   * for usage in PhET-iO data stream
   * @param {number} numProtons
   * @returns {string}
   */
  getEnglishName: function( numProtons ) {
    return englishNameTable[ numProtons ];
  },

  // Identifies whether a given atomic nucleus is stable.
  isStable: function( numProtons, numNeutrons ) {
    const tableEntry = stableElementTable[ numProtons ];
    if ( typeof ( tableEntry ) === 'undefined' ) {
      return false;
    }
    return $.inArray( numNeutrons, tableEntry ) > -1;
  },

  getNumNeutronsInMostCommonIsotope: function( atomicNumber ) {
    return numNeutronsInMostStableIsotope[ atomicNumber ] || 0;
  },

  getStandardAtomicMass: function( numProtons ) {
    return standardMassTable[ numProtons ];
  },

  /**
   * Get the atomic mass of an isotope fom an isotope key.   Input parameters are the number of protons and neutrons
   * which hold the information necessary to determine isotope information.
   *
   * @param {number} protons
   * @param {number} neutrons
   */
  getIsotopeAtomicMass: function( protons, neutrons ) {
    if ( protons !== 0 ) {
      const tableEntry = ISOTOPE_INFO_TABLE[ protons ][ protons + neutrons ];
      if ( typeof ( tableEntry ) === 'undefined' ) {
        // Atom defined by that number of protons and neutrons is not stable, so return -1.
        return -1;
      }
      return tableEntry.atomicMass;
    }
    else {
      return -1;
    }
  },

  /**
   * Returns the natural abundance of the specified isotope on present day Earth (year 2018) as a proportion (NOT a
   * percentage) with the specified number of decimal places.
   *
   * @param {NumberAtom} isotope
   * @param {number} numDecimalPlaces - number of decimal places in the result
   * @returns {number}
   * @public
   */
  getNaturalAbundance: function( isotope, numDecimalPlaces ) {
    assert && assert( numDecimalPlaces !== undefined, 'must specify number of decimal places for proportion' );
    let abundanceProportion = 0;
    if ( isotope.protonCountProperty.get() > 0 &&
         ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ] !== undefined ) {

      // the configuration is in the table, get it and round it to the needed number of decimal places
      abundanceProportion = Utils.toFixedNumber(
        ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ].abundance,
        numDecimalPlaces
      );
    }

    return abundanceProportion;
  },

  /**
   * Returns true if the isotope exists only in trace amounts on present day Earth (~year 2018), false if there is
   * more or less than that.  The definition that is used for deciding which isotopes exist in trace amounts is from
   * https://en.wikipedia.org/wiki/Trace_radioisotope.
   * @param {NumberAtom} isotope
   * @returns {boolean}
   * @public
   */
  existsInTraceAmounts: function( isotope ) {
    const tableEntry = ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ];
    return tableEntry !== undefined && tableEntry.abundance === TRACE_ABUNDANCE;
  },

  /**
   * Get a list of all isotopes for the given atomic number.
   *
   * @param atomicNumber
   * @return
   */
  getAllIsotopesOfElement: function( atomicNumber ) {
    const isotopesList = [];

    for ( const massNumber in ISOTOPE_INFO_TABLE[ atomicNumber ] ) {
      const numNeutrons = massNumber - atomicNumber;
      const moleculeNumberList = [ atomicNumber, numNeutrons, atomicNumber ];

      isotopesList.push( moleculeNumberList );
    }

    return isotopesList;
  },

  /**
   * Get a list of all isotopes that are considered stable.  This is needed
   * because the complete list of isotopes used by this class includes some
   * that exist on earth but are not stable, such as carbon-14.
   *
   * @param atomicNumber
   * @return
   */
  getStableIsotopesOfElement: function( atomicNumber ) {
    const isotopesList = this.getAllIsotopesOfElement( atomicNumber );
    const stableIsotopesList = [];

    for ( const isotopeIndex in isotopesList ) {
      const numProtons = isotopesList[ isotopeIndex ][ 0 ];
      const numNeutrons = isotopesList[ isotopeIndex ][ 1 ];

      if ( this.isStable( numProtons, numNeutrons ) ) {
        stableIsotopesList.push( [ numProtons, numNeutrons, numProtons ] );
      }
    }

    return stableIsotopesList;
  },

  // Get the half-life of a nuclide with the specified number of protons and neutrons.
  getNuclideHalfLife: function( numProtons, numNeutrons ) {
    if ( !HalfLifeConstants[ numProtons ] ) {
      return undefined;
    }
    return HalfLifeConstants[ numProtons ][ numNeutrons ];
  },

  // Identifies whether a given nuclide exists
  doesExist: function( numProtons, numNeutrons ) {
    const isStable = this.isStable( numProtons, numNeutrons );
    const halfLife = this.getNuclideHalfLife( numProtons, numNeutrons );
    return !( !isStable && halfLife === undefined );
  },

  // Return if the next isotope of the given nuclide exists
  doesNextIsotopeExist: function( numProtons, numNeutrons ) {
    return this.getNuclideHalfLife( numProtons, numNeutrons + 1 ) !== undefined ||
      this.isStable( numProtons, numNeutrons + 1 );

  },

  // Return if the previous isotope of the given nuclide exists
  doesPreviousIsotopeExist: function( numProtons, numNeutrons ) {
    return this.getNuclideHalfLife( numProtons, numNeutrons - 1 ) !== undefined ||
           this.isStable( numProtons, numNeutrons - 1 );
  },

  // Return if the next isotone of the given nuclide exists
  doesNextIsotoneExist: function( numProtons, numNeutrons ) {
    return this.getNuclideHalfLife( numProtons + 1, numNeutrons ) !== undefined ||
           this.isStable( numProtons + 1, numNeutrons );
  },

  // Return if the previous isotone of the given nuclide exists
  doesPreviousIsotoneExist: function( numProtons, numNeutrons ) {
    return this.getNuclideHalfLife( numProtons - 1, numNeutrons ) !== undefined ||
           this.isStable( numProtons - 1, numNeutrons );
  },

  // Return if the nuclide of the given nuclide minus one proton and minus one neutrons exists
  doesPreviousNuclideExist: function( numProtons, numNeutrons ) {
    return this.getNuclideHalfLife( numProtons - 1, numNeutrons - 1 ) !== undefined ||
           this.isStable( numProtons - 1, numNeutrons - 1 );
  },

  // Get the available decays for an unstable nuclide. Returns an empty array if the decays are unknown or if the
  // nuclide does not exist or is stable.
  getAvailableDecays: function( numProtons, numNeutrons ) {
    const allDecaysAndPercents = DECAYS_INFO_TABLE[ numProtons ][ numNeutrons ];

    // undefined means the nuclide is stable or does not exist, meaning there are no available decays
    // null the nuclide is unstable and the available decays are unknown
    if ( allDecaysAndPercents === undefined || allDecaysAndPercents === null ) {
      return [];
    }

    // the nuclide is unstable and the available decays are known
    else {
      const allDecays = Object.keys( allDecaysAndPercents );
      const basicDecays = [];
      for ( let i = 0; i < allDecays.length; i++ ) {
        switch( allDecays[ i ] ) {
          case 'B-':
            if ( basicDecays.indexOf( 'BETA_MINUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_MINUS_DECAY' );
            }
            break;
          case '2B-':
            break;
          case 'EC+B+':
            if ( basicDecays.indexOf( 'BETA_PLUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_PLUS_DECAY' );
            }
            break;
          case 'EC':
            if ( basicDecays.indexOf( 'BETA_PLUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_PLUS_DECAY' );
            }
            break;
          case 'B+':
            if ( basicDecays.indexOf( 'BETA_PLUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_PLUS_DECAY' );
            }
            break;
          case 'B++EC':
            break;
          case '2EC':
            if ( basicDecays.indexOf( 'BETA_PLUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_PLUS_DECAY' );
            }
            break;
          case '2B+':
            break;
          case 'A':
            if ( basicDecays.indexOf( 'ALPHA_DECAY' ) === -1 ) {
              basicDecays.push( 'ALPHA_DECAY' );
            }
            break;
          case 'P':
            if ( basicDecays.indexOf( 'PROTON_EMISSION' ) === -1 ) {
              basicDecays.push( 'PROTON_EMISSION' );
            }
            break;
          case 'N':
            if ( basicDecays.indexOf( 'NEUTRON_EMISSION' ) === -1 ) {
              basicDecays.push( 'NEUTRON_EMISSION' );
            }
            break;
          case '2P':
            if ( basicDecays.indexOf( 'PROTON_EMISSION' ) === -1 ) {
              basicDecays.push( 'PROTON_EMISSION' );
            }
            break;
          case '2N':
            if ( basicDecays.indexOf( 'NEUTRON_EMISSION' ) === -1 ) {
              basicDecays.push( 'NEUTRON_EMISSION' );
            }
            break;
          case 'B+A':
            if ( basicDecays.indexOf( 'BETA_PLUS_DECAY' ) === -1 ) {
              basicDecays.push( 'BETA_PLUS_DECAY' );
            }
            break;
          case 'ECA':
            break;
          case 'B-A':
            break;
          case 'B-N':
            break;
          case 'B-2N':
            break;
          case 'B-3N':
            break;
          case 'B-4N':
            break;
          case 'ECP':
            break;
          case 'B+P':
            break;
          case 'B-P':
            break;
          case 'EC2P':
            break;
          case 'B+2P':
            break;
          case '24Ne':
            break;
          case '34Si':
            break;
          case '12C':
            break;
          case 'B-F':
            break;
          default:
            break;
        }
      }
      return basicDecays;
    }
  },

  getAtomicRadius: function( numElectrons ) {
    return mapElectronCountToRadius[ numElectrons ];
  }
};

shred.register( 'AtomIdentifier', AtomIdentifier );
export default AtomIdentifier;