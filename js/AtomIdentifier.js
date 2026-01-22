// Copyright 2014-2016, University of Colorado Boulder

/**
 * Object that can be used to identify various things about an atom given its configuration, i.e. number of protons,
 * neutrons, and/or electrons.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';
  var shred = require( 'SHRED/shred' );
  var Util = require( 'DOT/Util' );

  // An arbitrary value used to signify a 'trace' abundance, meaning that a very small amount of this isotope is
  // present on Earth.
  var TRACE_ABUNDANCE = 0.000000000001;

  var nameTable = [
    '',
    require( 'string!SHRED/hydrogen' ),
    require( 'string!SHRED/helium' ),
    require( 'string!SHRED/lithium' ),
    require( 'string!SHRED/beryllium' ),
    require( 'string!SHRED/boron' ),
    require( 'string!SHRED/carbon' ),
    require( 'string!SHRED/nitrogen' ),
    require( 'string!SHRED/oxygen' ),
    require( 'string!SHRED/fluorine' ),
    require( 'string!SHRED/neon' ),
    require( 'string!SHRED/sodium' ),
    require( 'string!SHRED/magnesium' ),
    require( 'string!SHRED/aluminum' ),
    require( 'string!SHRED/silicon' ),
    require( 'string!SHRED/phosphorus' ),
    require( 'string!SHRED/sulfur' ),
    require( 'string!SHRED/chlorine' ),
    require( 'string!SHRED/argon' ),
    require( 'string!SHRED/potassium' ),
    require( 'string!SHRED/calcium' ),
    require( 'string!SHRED/scandium' ),
    require( 'string!SHRED/titanium' ),
    require( 'string!SHRED/vanadium' ),
    require( 'string!SHRED/chromium' ),
    require( 'string!SHRED/manganese' ),
    require( 'string!SHRED/iron' ),
    require( 'string!SHRED/cobalt' ),
    require( 'string!SHRED/nickel' ),
    require( 'string!SHRED/copper' ),
    require( 'string!SHRED/zinc' ),
    require( 'string!SHRED/gallium' ),
    require( 'string!SHRED/germanium' ),
    require( 'string!SHRED/arsenic' ),
    require( 'string!SHRED/selenium' ),
    require( 'string!SHRED/bromine' ),
    require( 'string!SHRED/krypton' ),
    require( 'string!SHRED/rubidium' ),
    require( 'string!SHRED/strontium' ),
    require( 'string!SHRED/yttrium' ),
    require( 'string!SHRED/zirconium' ),
    require( 'string!SHRED/niobium' ),
    require( 'string!SHRED/molybdenum' ),
    require( 'string!SHRED/technetium' ),
    require( 'string!SHRED/ruthenium' ),
    require( 'string!SHRED/rhodium' ),
    require( 'string!SHRED/palladium' ),
    require( 'string!SHRED/silver' ),
    require( 'string!SHRED/cadmium' ),
    require( 'string!SHRED/indium' ),
    require( 'string!SHRED/tin' ),
    require( 'string!SHRED/antimony' ),
    require( 'string!SHRED/tellurium' ),
    require( 'string!SHRED/iodine' ),
    require( 'string!SHRED/xenon' ),
    require( 'string!SHRED/cesium' ),
    require( 'string!SHRED/barium' ),
    require( 'string!SHRED/lanthanum' ),
    require( 'string!SHRED/cerium' ),
    require( 'string!SHRED/praseodymium' ),
    require( 'string!SHRED/neodymium' ),
    require( 'string!SHRED/promethium' ),
    require( 'string!SHRED/samarium' ),
    require( 'string!SHRED/europium' ),
    require( 'string!SHRED/gadolinium' ),
    require( 'string!SHRED/terbium' ),
    require( 'string!SHRED/dysprosium' ),
    require( 'string!SHRED/holmium' ),
    require( 'string!SHRED/erbium' ),
    require( 'string!SHRED/thulium' ),
    require( 'string!SHRED/ytterbium' ),
    require( 'string!SHRED/lutetium' ),
    require( 'string!SHRED/hafnium' ),
    require( 'string!SHRED/tantalum' ),
    require( 'string!SHRED/tungsten' ),
    require( 'string!SHRED/rhenium' ),
    require( 'string!SHRED/osmium' ),
    require( 'string!SHRED/iridium' ),
    require( 'string!SHRED/platinum' ),
    require( 'string!SHRED/gold' ),
    require( 'string!SHRED/mercury' ),
    require( 'string!SHRED/thallium' ),
    require( 'string!SHRED/lead' ),
    require( 'string!SHRED/bismuth' ),
    require( 'string!SHRED/polonium' ),
    require( 'string!SHRED/astatine' ),
    require( 'string!SHRED/radon' ),
    require( 'string!SHRED/francium' ),
    require( 'string!SHRED/radium' ),
    require( 'string!SHRED/actinium' ),
    require( 'string!SHRED/thorium' ),
    require( 'string!SHRED/protactinium' ),
    require( 'string!SHRED/uranium' ),
    require( 'string!SHRED/neptunium' ),
    require( 'string!SHRED/plutonium' ),
    require( 'string!SHRED/americium' ),
    require( 'string!SHRED/curium' ),
    require( 'string!SHRED/berkelium' ),
    require( 'string!SHRED/californium' ),
    require( 'string!SHRED/einsteinium' ),
    require( 'string!SHRED/fermium' ),
    require( 'string!SHRED/mendelevium' ),
    require( 'string!SHRED/nobelium' ),
    require( 'string!SHRED/lawrencium' ),
    require( 'string!SHRED/rutherfordium' ),
    require( 'string!SHRED/dubnium' ),
    require( 'string!SHRED/seaborgium' ),
    require( 'string!SHRED/bohrium' ),
    require( 'string!SHRED/hassium' ),
    require( 'string!SHRED/meitnerium' ),
    require( 'string!SHRED/darmstadtium' ),
    require( 'string!SHRED/roentgenium' ),
    require( 'string!SHRED/ununbium' ),
    require( 'string!SHRED/ununtrium' ),
    require( 'string!SHRED/flerovium' ),
    require( 'string!SHRED/ununpentium' ),
    require( 'string!SHRED/livermorium' ),
    require( 'string!SHRED/ununseptium' ),
    require( 'string!SHRED/ununoctium' )
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
    'Cn', // 112, UNUNBIUM
    'Uut', // 113, UNUTRIUM
    'Fl', // 114, FLEROVIUM
    'Uup', // 115, UNUNPENTIUM
    'Lv', // 116, LIVERMORIUM
    'Uus', // 117, UNUNSEPTIUM
    'Uuo' // 118, UNUNOCTIUM

  ];

  // Table of stable elements, indexed by atomic number to a list of viable numbers of neutrons.
  var stableElementTable = [
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
    [ 18, 20, 22 ]
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

  var ISOTOPE_INFO_TABLE = {
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
      9: {
        atomicMass: 9.0121822,
        abundance: 1.0000
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
  var standardMassTable = [
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

  var AtomIdentifier = {
    // Get the chemical symbol for an atom with the specified number of protons.
    getSymbol: function( numProtons ) {
      return symbolTable[ numProtons ];
    },

    // Get the chemical name for an atom with the specified number of protons.
    getName: function( numProtons ) {
      return nameTable[ numProtons ];
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
        var tableEntry = ISOTOPE_INFO_TABLE[ protons ][ protons + neutrons ];
        if ( typeof( tableEntry ) === 'undefined' ) {
          // Atom defined by that number of protons and neutrons is not stable, so return -1.
          return -1;
        }
      }
      else {
        return -1;
      }
      return tableEntry.atomicMass;
    },

    /**
     * Returns the natural abundance of a particular isotope.
     *
     * @param {NumberAtom} atom
     * @return {Number}
     * TODO Should we combine these two?
     */

    getNaturalAbundance: function( atom ) {
      return this.getNaturalAbundancePreciseDecimal( atom );
    },

    /**
     * Finds the precise value of the abundance and returns it.
     * @param {NumberAtom} atom
     * @returns {Number}
     */
    getNaturalAbundancePreciseDecimal: function( atom ) {
      var defaultReturnValue = Util.toFixedNumber( 0, 10 );
      if ( atom.protonCount > 0 && ISOTOPE_INFO_TABLE[ atom.protonCount ][ atom.massNumber ] !== undefined ) {
        return Util.toFixedNumber( ISOTOPE_INFO_TABLE[ atom.protonCount ][ atom.massNumber ].abundance, 10 );
      }
      return defaultReturnValue;
    },

    /**
     * Get a list of all isotopes for the given atomic number.
     *
     * @param atomicNumber
     * @return
     */
    getAllIsotopesOfElement: function( atomicNumber ) {
      // TODO May need to make immutable atom type
      var isotopesList = [];

      // TODO Document function
      for ( var massNumber in ISOTOPE_INFO_TABLE[ atomicNumber ] ) {
        var numNeutrons = massNumber - atomicNumber;
        var moleculeNumberList = [ atomicNumber, numNeutrons, atomicNumber ];

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
      var isotopesList = this.getAllIsotopesOfElement( atomicNumber );
      var stableIsotopesList = [];

      for ( var isotopeIndex in isotopesList ) {
        var numProtons = isotopesList[ isotopeIndex ][ 0 ];
        var numNeutrons = isotopesList[ isotopeIndex ][ 1 ];

        if ( this.isStable( numProtons, numNeutrons ) ) {
          stableIsotopesList.push( [ numProtons, numNeutrons, numProtons ] );
        }

      }


      return stableIsotopesList;

    }

  };

  shred.register( 'AtomIdentifier', AtomIdentifier );
  return AtomIdentifier;
} );
