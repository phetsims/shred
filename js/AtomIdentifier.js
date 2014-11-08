/*
 * //  Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Object that can be used to identify various things about an atom given its
 * configuration, i.e. number of protons, neutrons, and/or electrons.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var nameTable = [
    '',
    require( 'string!SHRED/element.hydrogen.name' ),
    require( 'string!SHRED/element.helium.name' ),
    require( 'string!SHRED/element.lithium.name' ),
    require( 'string!SHRED/element.beryllium.name' ),
    require( 'string!SHRED/element.boron.name' ),
    require( 'string!SHRED/element.carbon.name' ),
    require( 'string!SHRED/element.nitrogen.name' ),
    require( 'string!SHRED/element.oxygen.name' ),
    require( 'string!SHRED/element.fluorine.name' ),
    require( 'string!SHRED/element.neon.name' ),
    require( 'string!SHRED/element.sodium.name' ),
    require( 'string!SHRED/element.magnesium.name' ),
    require( 'string!SHRED/element.aluminum.name' ),
    require( 'string!SHRED/element.silicon.name' ),
    require( 'string!SHRED/element.phosphorus.name' ),
    require( 'string!SHRED/element.sulfur.name' ),
    require( 'string!SHRED/element.chlorine.name' ),
    require( 'string!SHRED/element.argon.name' ),
    'Potassium',
    'Calcium',
    'Scandium',
    'Titanium',
    'Vanadium',
    'Chromium',
    'Manganese',
    'Iron',
    'Cobalt',
    'Nickel',
    'Copper',
    'Zinc',
    'Gallium',
    'Germanium',
    'Arsenic',
    'Selenium',
    'Bromine',
    'Krypton',
    'Rubidium',
    'Strontium',
    'Yttrium',
    'Zirconium',
    'Niobium',
    'Molybdenum',
    'Technetium',
    'Ruthenium',
    'Rhodium',
    'Palladium',
    'Silver',
    'Cadmium',
    'Indium',
    'Tin',
    'Antimony',
    'Tellurium',
    'Iodine',
    'Xenon',
    'Cesium',
    'Barium',
    'Lanthanum',
    'Cerium',
    'Praseodymium',
    'Neodymium',
    'Promethium',
    'Samarium',
    'Europium',
    'Gadolinium',
    'Terbium',
    'Dysprosium',
    'Holmium',
    'Erbium',
    'Thulium',
    'Ytterbium',
    'Lutetium',
    'Hafnium',
    'Tantalum',
    'Tungsten',
    'Rhenium',
    'Osmium',
    'Iridium',
    'Platinum',
    'Gold',
    'Mercury',
    'Thallium',
    'Lead',
    'Bismuth',
    'Polonium',
    'Astatine',
    'Radon',
    'Francium',
    'Radium',
    'Actinium',
    'Thorium',
    'Protactinium',
    'Uranium',
    'Neptunium',
    'Plutonium',
    'Americium',
    'Curium',
    'Berkelium',
    'Californium',
    'Einsteinium',
    'Fermium',
    'Mendelevium',
    'Nobelium',
    'Lawrencium',
    'Rutherfordium',
    'Dubnium',
    'Seaborgium',
    'Bohrium',
    'Hassium',
    'Meitnerium',
    'Darmstadtium',
    'Roentgenium',
    'Ununbium'
  ];

  var symbolTable = [
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
    'Cn' // 112, UNUNBIUM
  ];

  // Table of stable elements, indexed by atomic number to a list of viable numbers of neutrons.
  var stableElementTable = [
    // No element
    [],
    // Hydrogen
    [0, 1],
    // Helium
    [1, 2],
    // Lithium
    [3, 4] ,
    // Beryllium
    [5],
    // Boron
    [5, 6],
    // Carbon
    [6, 7],
    // Nitrogen
    [7, 8],
    // Oxygen
    [8, 9, 10],
    // Fluorine
    [10],
    // Neon
    [10, 11, 12]
  ];

  var numNeutronsInMostStableIsotope = [
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
    8,
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

  var massTable = [
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

  return {
    // Get the chemical symbol for an atom with the specified number of protons.
    getSymbol: function( numProtons ) {
      return symbolTable[ numProtons ];
    },

    // Get the chemical name for an atom with the specified number of protons.
    getName: function( numProtons ) {
      return nameTable[numProtons];
    },

    // Identifies whether a given atomic nucleus is stable.
    isStable: function( numProtons, numNeutrons ) {
      var tableEntry = stableElementTable[ numProtons ];
      if ( typeof( tableEntry ) === 'undefined' ) {
        return false;
      }
      return $.inArray( numNeutrons, tableEntry ) > -1;
    },

    getNumNeutronsInMostCommonIsotope: function( atomicNumber ) {
      return numNeutronsInMostStableIsotope[ atomicNumber ];
    },

    getAtomicMass: function( numProtons ) {
      return massTable[numProtons];
    }

  };
} );
