// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from shred-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import shred from './shred.js';
import ShredStrings from './ShredStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( ShredStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'protonsColon', 'protonsColonStringProperty' );
addToMapIfDefined( 'neutronsColon', 'neutronsColonStringProperty' );
addToMapIfDefined( 'electronsColon', 'electronsColonStringProperty' );
addToMapIfDefined( 'hydrogen', 'hydrogenStringProperty' );
addToMapIfDefined( 'helium', 'heliumStringProperty' );
addToMapIfDefined( 'lithium', 'lithiumStringProperty' );
addToMapIfDefined( 'beryllium', 'berylliumStringProperty' );
addToMapIfDefined( 'boron', 'boronStringProperty' );
addToMapIfDefined( 'carbon', 'carbonStringProperty' );
addToMapIfDefined( 'nitrogen', 'nitrogenStringProperty' );
addToMapIfDefined( 'oxygen', 'oxygenStringProperty' );
addToMapIfDefined( 'fluorine', 'fluorineStringProperty' );
addToMapIfDefined( 'neon', 'neonStringProperty' );
addToMapIfDefined( 'sodium', 'sodiumStringProperty' );
addToMapIfDefined( 'magnesium', 'magnesiumStringProperty' );
addToMapIfDefined( 'aluminum', 'aluminumStringProperty' );
addToMapIfDefined( 'silicon', 'siliconStringProperty' );
addToMapIfDefined( 'phosphorus', 'phosphorusStringProperty' );
addToMapIfDefined( 'sulfur', 'sulfurStringProperty' );
addToMapIfDefined( 'chlorine', 'chlorineStringProperty' );
addToMapIfDefined( 'argon', 'argonStringProperty' );
addToMapIfDefined( 'potassium', 'potassiumStringProperty' );
addToMapIfDefined( 'calcium', 'calciumStringProperty' );
addToMapIfDefined( 'scandium', 'scandiumStringProperty' );
addToMapIfDefined( 'titanium', 'titaniumStringProperty' );
addToMapIfDefined( 'vanadium', 'vanadiumStringProperty' );
addToMapIfDefined( 'chromium', 'chromiumStringProperty' );
addToMapIfDefined( 'manganese', 'manganeseStringProperty' );
addToMapIfDefined( 'iron', 'ironStringProperty' );
addToMapIfDefined( 'cobalt', 'cobaltStringProperty' );
addToMapIfDefined( 'nickel', 'nickelStringProperty' );
addToMapIfDefined( 'copper', 'copperStringProperty' );
addToMapIfDefined( 'zinc', 'zincStringProperty' );
addToMapIfDefined( 'gallium', 'galliumStringProperty' );
addToMapIfDefined( 'germanium', 'germaniumStringProperty' );
addToMapIfDefined( 'arsenic', 'arsenicStringProperty' );
addToMapIfDefined( 'selenium', 'seleniumStringProperty' );
addToMapIfDefined( 'bromine', 'bromineStringProperty' );
addToMapIfDefined( 'krypton', 'kryptonStringProperty' );
addToMapIfDefined( 'rubidium', 'rubidiumStringProperty' );
addToMapIfDefined( 'strontium', 'strontiumStringProperty' );
addToMapIfDefined( 'yttrium', 'yttriumStringProperty' );
addToMapIfDefined( 'zirconium', 'zirconiumStringProperty' );
addToMapIfDefined( 'niobium', 'niobiumStringProperty' );
addToMapIfDefined( 'molybdenum', 'molybdenumStringProperty' );
addToMapIfDefined( 'technetium', 'technetiumStringProperty' );
addToMapIfDefined( 'ruthenium', 'rutheniumStringProperty' );
addToMapIfDefined( 'rhodium', 'rhodiumStringProperty' );
addToMapIfDefined( 'palladium', 'palladiumStringProperty' );
addToMapIfDefined( 'silver', 'silverStringProperty' );
addToMapIfDefined( 'cadmium', 'cadmiumStringProperty' );
addToMapIfDefined( 'indium', 'indiumStringProperty' );
addToMapIfDefined( 'tin', 'tinStringProperty' );
addToMapIfDefined( 'antimony', 'antimonyStringProperty' );
addToMapIfDefined( 'tellurium', 'telluriumStringProperty' );
addToMapIfDefined( 'iodine', 'iodineStringProperty' );
addToMapIfDefined( 'xenon', 'xenonStringProperty' );
addToMapIfDefined( 'cesium', 'cesiumStringProperty' );
addToMapIfDefined( 'barium', 'bariumStringProperty' );
addToMapIfDefined( 'lanthanum', 'lanthanumStringProperty' );
addToMapIfDefined( 'cerium', 'ceriumStringProperty' );
addToMapIfDefined( 'praseodymium', 'praseodymiumStringProperty' );
addToMapIfDefined( 'neodymium', 'neodymiumStringProperty' );
addToMapIfDefined( 'promethium', 'promethiumStringProperty' );
addToMapIfDefined( 'samarium', 'samariumStringProperty' );
addToMapIfDefined( 'europium', 'europiumStringProperty' );
addToMapIfDefined( 'gadolinium', 'gadoliniumStringProperty' );
addToMapIfDefined( 'terbium', 'terbiumStringProperty' );
addToMapIfDefined( 'dysprosium', 'dysprosiumStringProperty' );
addToMapIfDefined( 'holmium', 'holmiumStringProperty' );
addToMapIfDefined( 'erbium', 'erbiumStringProperty' );
addToMapIfDefined( 'thulium', 'thuliumStringProperty' );
addToMapIfDefined( 'ytterbium', 'ytterbiumStringProperty' );
addToMapIfDefined( 'lutetium', 'lutetiumStringProperty' );
addToMapIfDefined( 'hafnium', 'hafniumStringProperty' );
addToMapIfDefined( 'tantalum', 'tantalumStringProperty' );
addToMapIfDefined( 'tungsten', 'tungstenStringProperty' );
addToMapIfDefined( 'rhenium', 'rheniumStringProperty' );
addToMapIfDefined( 'osmium', 'osmiumStringProperty' );
addToMapIfDefined( 'iridium', 'iridiumStringProperty' );
addToMapIfDefined( 'platinum', 'platinumStringProperty' );
addToMapIfDefined( 'gold', 'goldStringProperty' );
addToMapIfDefined( 'mercury', 'mercuryStringProperty' );
addToMapIfDefined( 'thallium', 'thalliumStringProperty' );
addToMapIfDefined( 'lead', 'leadStringProperty' );
addToMapIfDefined( 'bismuth', 'bismuthStringProperty' );
addToMapIfDefined( 'polonium', 'poloniumStringProperty' );
addToMapIfDefined( 'astatine', 'astatineStringProperty' );
addToMapIfDefined( 'radon', 'radonStringProperty' );
addToMapIfDefined( 'francium', 'franciumStringProperty' );
addToMapIfDefined( 'radium', 'radiumStringProperty' );
addToMapIfDefined( 'actinium', 'actiniumStringProperty' );
addToMapIfDefined( 'thorium', 'thoriumStringProperty' );
addToMapIfDefined( 'protactinium', 'protactiniumStringProperty' );
addToMapIfDefined( 'uranium', 'uraniumStringProperty' );
addToMapIfDefined( 'neptunium', 'neptuniumStringProperty' );
addToMapIfDefined( 'plutonium', 'plutoniumStringProperty' );
addToMapIfDefined( 'americium', 'americiumStringProperty' );
addToMapIfDefined( 'curium', 'curiumStringProperty' );
addToMapIfDefined( 'berkelium', 'berkeliumStringProperty' );
addToMapIfDefined( 'californium', 'californiumStringProperty' );
addToMapIfDefined( 'einsteinium', 'einsteiniumStringProperty' );
addToMapIfDefined( 'fermium', 'fermiumStringProperty' );
addToMapIfDefined( 'mendelevium', 'mendeleviumStringProperty' );
addToMapIfDefined( 'nobelium', 'nobeliumStringProperty' );
addToMapIfDefined( 'lawrencium', 'lawrenciumStringProperty' );
addToMapIfDefined( 'rutherfordium', 'rutherfordiumStringProperty' );
addToMapIfDefined( 'dubnium', 'dubniumStringProperty' );
addToMapIfDefined( 'seaborgium', 'seaborgiumStringProperty' );
addToMapIfDefined( 'bohrium', 'bohriumStringProperty' );
addToMapIfDefined( 'hassium', 'hassiumStringProperty' );
addToMapIfDefined( 'meitnerium', 'meitneriumStringProperty' );
addToMapIfDefined( 'darmstadtium', 'darmstadtiumStringProperty' );
addToMapIfDefined( 'roentgenium', 'roentgeniumStringProperty' );
addToMapIfDefined( 'copernicium', 'coperniciumStringProperty' );
addToMapIfDefined( 'nihonium', 'nihoniumStringProperty' );
addToMapIfDefined( 'flerovium', 'fleroviumStringProperty' );
addToMapIfDefined( 'moscovium', 'moscoviumStringProperty' );
addToMapIfDefined( 'livermorium', 'livermoriumStringProperty' );
addToMapIfDefined( 'tennessine', 'tennessineStringProperty' );
addToMapIfDefined( 'oganesson', 'oganessonStringProperty' );
addToMapIfDefined( 'minusSignIon', 'minusSignIonStringProperty' );
addToMapIfDefined( 'neutralAtom', 'neutralAtomStringProperty' );
addToMapIfDefined( 'positiveSignIon', 'positiveSignIonStringProperty' );
addToMapIfDefined( 'stable', 'stableStringProperty' );
addToMapIfDefined( 'unstable', 'unstableStringProperty' );
addToMapIfDefined( 'periodicTable', 'periodicTableStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const ShredFluent = {
  protonsColonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'protonsColon', _.get( ShredStrings, 'protonsColonStringProperty' ) ),
  neutronsColonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'neutronsColon', _.get( ShredStrings, 'neutronsColonStringProperty' ) ),
  electronsColonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'electronsColon', _.get( ShredStrings, 'electronsColonStringProperty' ) ),
  hydrogenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'hydrogen', _.get( ShredStrings, 'hydrogenStringProperty' ) ),
  heliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'helium', _.get( ShredStrings, 'heliumStringProperty' ) ),
  lithiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'lithium', _.get( ShredStrings, 'lithiumStringProperty' ) ),
  berylliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'beryllium', _.get( ShredStrings, 'berylliumStringProperty' ) ),
  boronStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'boron', _.get( ShredStrings, 'boronStringProperty' ) ),
  carbonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'carbon', _.get( ShredStrings, 'carbonStringProperty' ) ),
  nitrogenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'nitrogen', _.get( ShredStrings, 'nitrogenStringProperty' ) ),
  oxygenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'oxygen', _.get( ShredStrings, 'oxygenStringProperty' ) ),
  fluorineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'fluorine', _.get( ShredStrings, 'fluorineStringProperty' ) ),
  neonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'neon', _.get( ShredStrings, 'neonStringProperty' ) ),
  sodiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sodium', _.get( ShredStrings, 'sodiumStringProperty' ) ),
  magnesiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'magnesium', _.get( ShredStrings, 'magnesiumStringProperty' ) ),
  aluminumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'aluminum', _.get( ShredStrings, 'aluminumStringProperty' ) ),
  siliconStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'silicon', _.get( ShredStrings, 'siliconStringProperty' ) ),
  phosphorusStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'phosphorus', _.get( ShredStrings, 'phosphorusStringProperty' ) ),
  sulfurStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sulfur', _.get( ShredStrings, 'sulfurStringProperty' ) ),
  chlorineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'chlorine', _.get( ShredStrings, 'chlorineStringProperty' ) ),
  argonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'argon', _.get( ShredStrings, 'argonStringProperty' ) ),
  potassiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'potassium', _.get( ShredStrings, 'potassiumStringProperty' ) ),
  calciumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'calcium', _.get( ShredStrings, 'calciumStringProperty' ) ),
  scandiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'scandium', _.get( ShredStrings, 'scandiumStringProperty' ) ),
  titaniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'titanium', _.get( ShredStrings, 'titaniumStringProperty' ) ),
  vanadiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'vanadium', _.get( ShredStrings, 'vanadiumStringProperty' ) ),
  chromiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'chromium', _.get( ShredStrings, 'chromiumStringProperty' ) ),
  manganeseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'manganese', _.get( ShredStrings, 'manganeseStringProperty' ) ),
  ironStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iron', _.get( ShredStrings, 'ironStringProperty' ) ),
  cobaltStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'cobalt', _.get( ShredStrings, 'cobaltStringProperty' ) ),
  nickelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'nickel', _.get( ShredStrings, 'nickelStringProperty' ) ),
  copperStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'copper', _.get( ShredStrings, 'copperStringProperty' ) ),
  zincStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'zinc', _.get( ShredStrings, 'zincStringProperty' ) ),
  galliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'gallium', _.get( ShredStrings, 'galliumStringProperty' ) ),
  germaniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'germanium', _.get( ShredStrings, 'germaniumStringProperty' ) ),
  arsenicStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'arsenic', _.get( ShredStrings, 'arsenicStringProperty' ) ),
  seleniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'selenium', _.get( ShredStrings, 'seleniumStringProperty' ) ),
  bromineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'bromine', _.get( ShredStrings, 'bromineStringProperty' ) ),
  kryptonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'krypton', _.get( ShredStrings, 'kryptonStringProperty' ) ),
  rubidiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rubidium', _.get( ShredStrings, 'rubidiumStringProperty' ) ),
  strontiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'strontium', _.get( ShredStrings, 'strontiumStringProperty' ) ),
  yttriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'yttrium', _.get( ShredStrings, 'yttriumStringProperty' ) ),
  zirconiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'zirconium', _.get( ShredStrings, 'zirconiumStringProperty' ) ),
  niobiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'niobium', _.get( ShredStrings, 'niobiumStringProperty' ) ),
  molybdenumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'molybdenum', _.get( ShredStrings, 'molybdenumStringProperty' ) ),
  technetiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'technetium', _.get( ShredStrings, 'technetiumStringProperty' ) ),
  rutheniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ruthenium', _.get( ShredStrings, 'rutheniumStringProperty' ) ),
  rhodiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rhodium', _.get( ShredStrings, 'rhodiumStringProperty' ) ),
  palladiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'palladium', _.get( ShredStrings, 'palladiumStringProperty' ) ),
  silverStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'silver', _.get( ShredStrings, 'silverStringProperty' ) ),
  cadmiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'cadmium', _.get( ShredStrings, 'cadmiumStringProperty' ) ),
  indiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'indium', _.get( ShredStrings, 'indiumStringProperty' ) ),
  tinStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tin', _.get( ShredStrings, 'tinStringProperty' ) ),
  antimonyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'antimony', _.get( ShredStrings, 'antimonyStringProperty' ) ),
  telluriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tellurium', _.get( ShredStrings, 'telluriumStringProperty' ) ),
  iodineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iodine', _.get( ShredStrings, 'iodineStringProperty' ) ),
  xenonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'xenon', _.get( ShredStrings, 'xenonStringProperty' ) ),
  cesiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'cesium', _.get( ShredStrings, 'cesiumStringProperty' ) ),
  bariumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'barium', _.get( ShredStrings, 'bariumStringProperty' ) ),
  lanthanumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'lanthanum', _.get( ShredStrings, 'lanthanumStringProperty' ) ),
  ceriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'cerium', _.get( ShredStrings, 'ceriumStringProperty' ) ),
  praseodymiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'praseodymium', _.get( ShredStrings, 'praseodymiumStringProperty' ) ),
  neodymiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'neodymium', _.get( ShredStrings, 'neodymiumStringProperty' ) ),
  promethiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'promethium', _.get( ShredStrings, 'promethiumStringProperty' ) ),
  samariumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'samarium', _.get( ShredStrings, 'samariumStringProperty' ) ),
  europiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'europium', _.get( ShredStrings, 'europiumStringProperty' ) ),
  gadoliniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'gadolinium', _.get( ShredStrings, 'gadoliniumStringProperty' ) ),
  terbiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'terbium', _.get( ShredStrings, 'terbiumStringProperty' ) ),
  dysprosiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dysprosium', _.get( ShredStrings, 'dysprosiumStringProperty' ) ),
  holmiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'holmium', _.get( ShredStrings, 'holmiumStringProperty' ) ),
  erbiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'erbium', _.get( ShredStrings, 'erbiumStringProperty' ) ),
  thuliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'thulium', _.get( ShredStrings, 'thuliumStringProperty' ) ),
  ytterbiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ytterbium', _.get( ShredStrings, 'ytterbiumStringProperty' ) ),
  lutetiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'lutetium', _.get( ShredStrings, 'lutetiumStringProperty' ) ),
  hafniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'hafnium', _.get( ShredStrings, 'hafniumStringProperty' ) ),
  tantalumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tantalum', _.get( ShredStrings, 'tantalumStringProperty' ) ),
  tungstenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tungsten', _.get( ShredStrings, 'tungstenStringProperty' ) ),
  rheniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rhenium', _.get( ShredStrings, 'rheniumStringProperty' ) ),
  osmiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'osmium', _.get( ShredStrings, 'osmiumStringProperty' ) ),
  iridiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iridium', _.get( ShredStrings, 'iridiumStringProperty' ) ),
  platinumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'platinum', _.get( ShredStrings, 'platinumStringProperty' ) ),
  goldStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'gold', _.get( ShredStrings, 'goldStringProperty' ) ),
  mercuryStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mercury', _.get( ShredStrings, 'mercuryStringProperty' ) ),
  thalliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'thallium', _.get( ShredStrings, 'thalliumStringProperty' ) ),
  leadStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'lead', _.get( ShredStrings, 'leadStringProperty' ) ),
  bismuthStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'bismuth', _.get( ShredStrings, 'bismuthStringProperty' ) ),
  poloniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'polonium', _.get( ShredStrings, 'poloniumStringProperty' ) ),
  astatineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'astatine', _.get( ShredStrings, 'astatineStringProperty' ) ),
  radonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'radon', _.get( ShredStrings, 'radonStringProperty' ) ),
  franciumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'francium', _.get( ShredStrings, 'franciumStringProperty' ) ),
  radiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'radium', _.get( ShredStrings, 'radiumStringProperty' ) ),
  actiniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'actinium', _.get( ShredStrings, 'actiniumStringProperty' ) ),
  thoriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'thorium', _.get( ShredStrings, 'thoriumStringProperty' ) ),
  protactiniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'protactinium', _.get( ShredStrings, 'protactiniumStringProperty' ) ),
  uraniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'uranium', _.get( ShredStrings, 'uraniumStringProperty' ) ),
  neptuniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'neptunium', _.get( ShredStrings, 'neptuniumStringProperty' ) ),
  plutoniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'plutonium', _.get( ShredStrings, 'plutoniumStringProperty' ) ),
  americiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'americium', _.get( ShredStrings, 'americiumStringProperty' ) ),
  curiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'curium', _.get( ShredStrings, 'curiumStringProperty' ) ),
  berkeliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'berkelium', _.get( ShredStrings, 'berkeliumStringProperty' ) ),
  californiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'californium', _.get( ShredStrings, 'californiumStringProperty' ) ),
  einsteiniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'einsteinium', _.get( ShredStrings, 'einsteiniumStringProperty' ) ),
  fermiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'fermium', _.get( ShredStrings, 'fermiumStringProperty' ) ),
  mendeleviumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mendelevium', _.get( ShredStrings, 'mendeleviumStringProperty' ) ),
  nobeliumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'nobelium', _.get( ShredStrings, 'nobeliumStringProperty' ) ),
  lawrenciumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'lawrencium', _.get( ShredStrings, 'lawrenciumStringProperty' ) ),
  rutherfordiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rutherfordium', _.get( ShredStrings, 'rutherfordiumStringProperty' ) ),
  dubniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dubnium', _.get( ShredStrings, 'dubniumStringProperty' ) ),
  seaborgiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'seaborgium', _.get( ShredStrings, 'seaborgiumStringProperty' ) ),
  bohriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'bohrium', _.get( ShredStrings, 'bohriumStringProperty' ) ),
  hassiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'hassium', _.get( ShredStrings, 'hassiumStringProperty' ) ),
  meitneriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meitnerium', _.get( ShredStrings, 'meitneriumStringProperty' ) ),
  darmstadtiumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'darmstadtium', _.get( ShredStrings, 'darmstadtiumStringProperty' ) ),
  roentgeniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'roentgenium', _.get( ShredStrings, 'roentgeniumStringProperty' ) ),
  coperniciumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'copernicium', _.get( ShredStrings, 'coperniciumStringProperty' ) ),
  nihoniumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'nihonium', _.get( ShredStrings, 'nihoniumStringProperty' ) ),
  fleroviumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'flerovium', _.get( ShredStrings, 'fleroviumStringProperty' ) ),
  moscoviumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'moscovium', _.get( ShredStrings, 'moscoviumStringProperty' ) ),
  livermoriumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'livermorium', _.get( ShredStrings, 'livermoriumStringProperty' ) ),
  tennessineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tennessine', _.get( ShredStrings, 'tennessineStringProperty' ) ),
  oganessonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'oganesson', _.get( ShredStrings, 'oganessonStringProperty' ) ),
  minusSignIonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'minusSignIon', _.get( ShredStrings, 'minusSignIonStringProperty' ) ),
  neutralAtomStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'neutralAtom', _.get( ShredStrings, 'neutralAtomStringProperty' ) ),
  positiveSignIonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'positiveSignIon', _.get( ShredStrings, 'positiveSignIonStringProperty' ) ),
  stableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'stable', _.get( ShredStrings, 'stableStringProperty' ) ),
  unstableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'unstable', _.get( ShredStrings, 'unstableStringProperty' ) ),
  periodicTableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'periodicTable', _.get( ShredStrings, 'periodicTableStringProperty' ) )
};

export default ShredFluent;

shred.register('ShredFluent', ShredFluent);
