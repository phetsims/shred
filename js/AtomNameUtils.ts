// Copyright 2026, University of Colorado Boulder
/**
 * Contains tables of element names and symbols, indexed by atomic number, for use in the Atom simulation.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../axon/js/DynamicProperty.js';
import Property from '../../axon/js/Property.js';
import TinyProperty from '../../axon/js/TinyProperty.js';
import TProperty from '../../axon/js/TProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import shred from './shred.js';
import ShredFluent from './ShredFluent.js';


const hydrogenStringProperty = ShredFluent.hydrogenStringProperty;
const heliumStringProperty = ShredFluent.heliumStringProperty;
const lithiumStringProperty = ShredFluent.lithiumStringProperty;
const berylliumStringProperty = ShredFluent.berylliumStringProperty;
const boronStringProperty = ShredFluent.boronStringProperty;
const carbonStringProperty = ShredFluent.carbonStringProperty;
const nitrogenStringProperty = ShredFluent.nitrogenStringProperty;
const oxygenStringProperty = ShredFluent.oxygenStringProperty;
const fluorineStringProperty = ShredFluent.fluorineStringProperty;
const neonStringProperty = ShredFluent.neonStringProperty;
const sodiumStringProperty = ShredFluent.sodiumStringProperty;
const magnesiumStringProperty = ShredFluent.magnesiumStringProperty;
const aluminumStringProperty = ShredFluent.aluminumStringProperty;
const siliconStringProperty = ShredFluent.siliconStringProperty;
const phosphorusStringProperty = ShredFluent.phosphorusStringProperty;
const sulfurStringProperty = ShredFluent.sulfurStringProperty;
const chlorineStringProperty = ShredFluent.chlorineStringProperty;
const argonStringProperty = ShredFluent.argonStringProperty;
const potassiumStringProperty = ShredFluent.potassiumStringProperty;
const calciumStringProperty = ShredFluent.calciumStringProperty;
const scandiumStringProperty = ShredFluent.scandiumStringProperty;
const titaniumStringProperty = ShredFluent.titaniumStringProperty;
const vanadiumStringProperty = ShredFluent.vanadiumStringProperty;
const chromiumStringProperty = ShredFluent.chromiumStringProperty;
const manganeseStringProperty = ShredFluent.manganeseStringProperty;
const ironStringProperty = ShredFluent.ironStringProperty;
const cobaltStringProperty = ShredFluent.cobaltStringProperty;
const nickelStringProperty = ShredFluent.nickelStringProperty;
const copperStringProperty = ShredFluent.copperStringProperty;
const zincStringProperty = ShredFluent.zincStringProperty;
const galliumStringProperty = ShredFluent.galliumStringProperty;
const germaniumStringProperty = ShredFluent.germaniumStringProperty;
const arsenicStringProperty = ShredFluent.arsenicStringProperty;
const seleniumStringProperty = ShredFluent.seleniumStringProperty;
const bromineStringProperty = ShredFluent.bromineStringProperty;
const kryptonStringProperty = ShredFluent.kryptonStringProperty;
const rubidiumStringProperty = ShredFluent.rubidiumStringProperty;
const strontiumStringProperty = ShredFluent.strontiumStringProperty;
const yttriumStringProperty = ShredFluent.yttriumStringProperty;
const zirconiumStringProperty = ShredFluent.zirconiumStringProperty;
const niobiumStringProperty = ShredFluent.niobiumStringProperty;
const molybdenumStringProperty = ShredFluent.molybdenumStringProperty;
const technetiumStringProperty = ShredFluent.technetiumStringProperty;
const rutheniumStringProperty = ShredFluent.rutheniumStringProperty;
const rhodiumStringProperty = ShredFluent.rhodiumStringProperty;
const palladiumStringProperty = ShredFluent.palladiumStringProperty;
const silverStringProperty = ShredFluent.silverStringProperty;
const cadmiumStringProperty = ShredFluent.cadmiumStringProperty;
const indiumStringProperty = ShredFluent.indiumStringProperty;
const tinStringProperty = ShredFluent.tinStringProperty;
const antimonyStringProperty = ShredFluent.antimonyStringProperty;
const telluriumStringProperty = ShredFluent.telluriumStringProperty;
const iodineStringProperty = ShredFluent.iodineStringProperty;
const xenonStringProperty = ShredFluent.xenonStringProperty;
const cesiumStringProperty = ShredFluent.cesiumStringProperty;
const bariumStringProperty = ShredFluent.bariumStringProperty;
const lanthanumStringProperty = ShredFluent.lanthanumStringProperty;
const ceriumStringProperty = ShredFluent.ceriumStringProperty;
const praseodymiumStringProperty = ShredFluent.praseodymiumStringProperty;
const neodymiumStringProperty = ShredFluent.neodymiumStringProperty;
const promethiumStringProperty = ShredFluent.promethiumStringProperty;
const samariumStringProperty = ShredFluent.samariumStringProperty;
const europiumStringProperty = ShredFluent.europiumStringProperty;
const gadoliniumStringProperty = ShredFluent.gadoliniumStringProperty;
const terbiumStringProperty = ShredFluent.terbiumStringProperty;
const dysprosiumStringProperty = ShredFluent.dysprosiumStringProperty;
const holmiumStringProperty = ShredFluent.holmiumStringProperty;
const erbiumStringProperty = ShredFluent.erbiumStringProperty;
const thuliumStringProperty = ShredFluent.thuliumStringProperty;
const ytterbiumStringProperty = ShredFluent.ytterbiumStringProperty;
const lutetiumStringProperty = ShredFluent.lutetiumStringProperty;
const hafniumStringProperty = ShredFluent.hafniumStringProperty;
const tantalumStringProperty = ShredFluent.tantalumStringProperty;
const tungstenStringProperty = ShredFluent.tungstenStringProperty;
const rheniumStringProperty = ShredFluent.rheniumStringProperty;
const osmiumStringProperty = ShredFluent.osmiumStringProperty;
const iridiumStringProperty = ShredFluent.iridiumStringProperty;
const platinumStringProperty = ShredFluent.platinumStringProperty;
const goldStringProperty = ShredFluent.goldStringProperty;
const mercuryStringProperty = ShredFluent.mercuryStringProperty;
const thalliumStringProperty = ShredFluent.thalliumStringProperty;
const leadStringProperty = ShredFluent.leadStringProperty;
const bismuthStringProperty = ShredFluent.bismuthStringProperty;
const poloniumStringProperty = ShredFluent.poloniumStringProperty;
const astatineStringProperty = ShredFluent.astatineStringProperty;
const radonStringProperty = ShredFluent.radonStringProperty;
const franciumStringProperty = ShredFluent.franciumStringProperty;
const radiumStringProperty = ShredFluent.radiumStringProperty;
const actiniumStringProperty = ShredFluent.actiniumStringProperty;
const thoriumStringProperty = ShredFluent.thoriumStringProperty;
const protactiniumStringProperty = ShredFluent.protactiniumStringProperty;
const uraniumStringProperty = ShredFluent.uraniumStringProperty;
const neptuniumStringProperty = ShredFluent.neptuniumStringProperty;
const plutoniumStringProperty = ShredFluent.plutoniumStringProperty;
const americiumStringProperty = ShredFluent.americiumStringProperty;
const curiumStringProperty = ShredFluent.curiumStringProperty;
const berkeliumStringProperty = ShredFluent.berkeliumStringProperty;
const californiumStringProperty = ShredFluent.californiumStringProperty;
const einsteiniumStringProperty = ShredFluent.einsteiniumStringProperty;
const fermiumStringProperty = ShredFluent.fermiumStringProperty;
const mendeleviumStringProperty = ShredFluent.mendeleviumStringProperty;
const nobeliumStringProperty = ShredFluent.nobeliumStringProperty;
const lawrenciumStringProperty = ShredFluent.lawrenciumStringProperty;
const rutherfordiumStringProperty = ShredFluent.rutherfordiumStringProperty;
const dubniumStringProperty = ShredFluent.dubniumStringProperty;
const seaborgiumStringProperty = ShredFluent.seaborgiumStringProperty;
const bohriumStringProperty = ShredFluent.bohriumStringProperty;
const hassiumStringProperty = ShredFluent.hassiumStringProperty;
const meitneriumStringProperty = ShredFluent.meitneriumStringProperty;
const darmstadtiumStringProperty = ShredFluent.darmstadtiumStringProperty;
const roentgeniumStringProperty = ShredFluent.roentgeniumStringProperty;
const coperniciumStringProperty = ShredFluent.coperniciumStringProperty;
const nihoniumStringProperty = ShredFluent.nihoniumStringProperty;
const fleroviumStringProperty = ShredFluent.fleroviumStringProperty;
const moscoviumStringProperty = ShredFluent.moscoviumStringProperty;
const livermoriumStringProperty = ShredFluent.livermoriumStringProperty;
const tennessineStringProperty = ShredFluent.tennessineStringProperty;
const oganessonStringProperty = ShredFluent.oganessonStringProperty;

export const nameTable = [
  new TinyProperty( '' ), // No element
  hydrogenStringProperty,
  heliumStringProperty,
  lithiumStringProperty,
  berylliumStringProperty,
  boronStringProperty,
  carbonStringProperty,
  nitrogenStringProperty,
  oxygenStringProperty,
  fluorineStringProperty,
  neonStringProperty,
  sodiumStringProperty,
  magnesiumStringProperty,
  aluminumStringProperty,
  siliconStringProperty,
  phosphorusStringProperty,
  sulfurStringProperty,
  chlorineStringProperty,
  argonStringProperty,
  potassiumStringProperty,
  calciumStringProperty,
  scandiumStringProperty,
  titaniumStringProperty,
  vanadiumStringProperty,
  chromiumStringProperty,
  manganeseStringProperty,
  ironStringProperty,
  cobaltStringProperty,
  nickelStringProperty,
  copperStringProperty,
  zincStringProperty,
  galliumStringProperty,
  germaniumStringProperty,
  arsenicStringProperty,
  seleniumStringProperty,
  bromineStringProperty,
  kryptonStringProperty,
  rubidiumStringProperty,
  strontiumStringProperty,
  yttriumStringProperty,
  zirconiumStringProperty,
  niobiumStringProperty,
  molybdenumStringProperty,
  technetiumStringProperty,
  rutheniumStringProperty,
  rhodiumStringProperty,
  palladiumStringProperty,
  silverStringProperty,
  cadmiumStringProperty,
  indiumStringProperty,
  tinStringProperty,
  antimonyStringProperty,
  telluriumStringProperty,
  iodineStringProperty,
  xenonStringProperty,
  cesiumStringProperty,
  bariumStringProperty,
  lanthanumStringProperty,
  ceriumStringProperty,
  praseodymiumStringProperty,
  neodymiumStringProperty,
  promethiumStringProperty,
  samariumStringProperty,
  europiumStringProperty,
  gadoliniumStringProperty,
  terbiumStringProperty,
  dysprosiumStringProperty,
  holmiumStringProperty,
  erbiumStringProperty,
  thuliumStringProperty,
  ytterbiumStringProperty,
  lutetiumStringProperty,
  hafniumStringProperty,
  tantalumStringProperty,
  tungstenStringProperty,
  rheniumStringProperty,
  osmiumStringProperty,
  iridiumStringProperty,
  platinumStringProperty,
  goldStringProperty,
  mercuryStringProperty,
  thalliumStringProperty,
  leadStringProperty,
  bismuthStringProperty,
  poloniumStringProperty,
  astatineStringProperty,
  radonStringProperty,
  franciumStringProperty,
  radiumStringProperty,
  actiniumStringProperty,
  thoriumStringProperty,
  protactiniumStringProperty,
  uraniumStringProperty,
  neptuniumStringProperty,
  plutoniumStringProperty,
  americiumStringProperty,
  curiumStringProperty,
  berkeliumStringProperty,
  californiumStringProperty,
  einsteiniumStringProperty,
  fermiumStringProperty,
  mendeleviumStringProperty,
  nobeliumStringProperty,
  lawrenciumStringProperty,
  rutherfordiumStringProperty,
  dubniumStringProperty,
  seaborgiumStringProperty,
  bohriumStringProperty,
  hassiumStringProperty,
  meitneriumStringProperty,
  darmstadtiumStringProperty,
  roentgeniumStringProperty,
  coperniciumStringProperty,
  nihoniumStringProperty,
  fleroviumStringProperty,
  moscoviumStringProperty,
  livermoriumStringProperty,
  tennessineStringProperty,
  oganessonStringProperty
];

// Used in PhET-iO data streams
export const englishNameTable = [
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

export const symbolTable = [
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

class AtomNameUtils {

  // Get the chemical symbol for an atom with the specified number of protons.
  public static getSymbol( numProtons: number ): string {
    return symbolTable[ numProtons ];
  }

  /**
   * Get the internationalized element name for an atom with the specified number of protons.
   */
  public static getName( numProtons: number ): TProperty<string> {
    return nameTable[ numProtons ];
  }

  /**
   * Get the name and mass string. i.e. Carbon-14 for Carbon with 6 protons and 8 neutrons.
   */
  public static getNameAndMass( numProtons: number, numNeutrons: number ): TReadOnlyProperty<string> {
    const nameProperty = AtomNameUtils.getName( numProtons );
    const massNumber = numProtons + numNeutrons;
    return new DerivedProperty( [ nameProperty ], ( name: string ) => `${name}-${massNumber}` );
  }

  /**
   * Get <sup>mass</sup> and symbol. i.e. <sup>14</sup>C for Carbon-14
   */
  public static getMassAndSymbol( numProtons: number, numNeutrons: number ): string {
    const symbol = AtomNameUtils.getSymbol( numProtons );
    const massNumber = numProtons + numNeutrons;
    return `<sup>${massNumber}</sup>${symbol}`;
  }


  /**
   * Creates a property that listens both to the protonCount (updates element name when a proton is added/removed)
   * but also listens to the locale (updates when Hydrogen goes to Hidrógeno).
   */
  public static createDynamicNameProperty( protonCountProperty: TReadOnlyProperty<number> ): DynamicProperty<string, number, TReadOnlyProperty<string>> {
    const currentElementStringProperty = new Property( AtomNameUtils.getName( protonCountProperty.value ), { reentrant: true } );
    const elementDynamicStringProperty = new DynamicProperty<string, number, TReadOnlyProperty<string>>( currentElementStringProperty );

    // Update the element name based on the proton count.
    protonCountProperty.link( protonCount => {
      currentElementStringProperty.value = AtomNameUtils.getName( protonCount );
    } );

    return elementDynamicStringProperty;
  }

  /**
   * Get the English name for an atom with the specified number of protons, lowercased with no whitespace and suitable
   * for usage in PhET-iO data stream.
   *
   */
  public static getNonLocalizedName( numProtons: number ): string {
    return englishNameTable[ numProtons ];
  }

  // Formats the chemical symbol so a screen reader can read it properly. For example "He" becomes "upper H e"
  // It's important to note that this function uses the StringProperty value directly, so it will not update
  // automatically with locale changes. It should be called again to get the updated value.
  public static getSpokenSymbol( protonCount: number, uppercase = false ): string {
    const symbol = AtomNameUtils.getSymbol( protonCount ).split( '' ).join( ' ' );
    if ( uppercase ) {
      return ShredFluent.a11y.spokenSymbolUppercase.format( {
        symbol: symbol
      } );
    }
    else {
      return ShredFluent.a11y.spokenSymbol.format( {
        symbol: symbol
      } );
    }
  }

}


shred.register( 'AtomNameUtils', AtomNameUtils );
export default AtomNameUtils;