// Copyright 2014-2026, University of Colorado Boulder
/**
 * AtomIdentifier is an object that can be used to identify various things about an atom given its configuration, such
 * as its name, chemical symbols, and stable isotopes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg
 * @author Luisa Vargas
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../axon/js/DynamicProperty.js';
import Property from '../../axon/js/Property.js';
import TProperty from '../../axon/js/TProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import { toFixedNumber } from '../../dot/js/util/toFixedNumber.js';
import affirm from '../../perennial-alias/js/browser-and-node/affirm.js';
import AtomConfig from './model/AtomConfig.js';
import type { TReadOnlyNumberAtom } from './model/NumberAtom.js';
import shred from './shred.js';
import { DecayAmount, DECAYS_INFO_TABLE, englishNameTable, HalfLifeConstants, ISOTOPE_INFO_TABLE, mapElectronCountToRadius, nameTable, numNeutronsInMostStableIsotope, stableElementTable, standardMassTable, symbolTable, TRACE_ABUNDANCE } from './ShredData.js';
import ShredFluent from './ShredFluent.js';

// TODO REVIEW: It is not given that the order (p,n,e) will be necessarily respected, it feels like weak type safety.
//  Why not have an explicit type interface form? Or a simple class with only those three properties? AtomConfig?
//  I suspect there might be a good reason within the "Compact", so maybe elaborate on that reason in a comment here.
//  https://github.com/phetsims/isotopes-and-atomic-mass/issues/103
// Compact identifier for an isotope.  Order is [ number of protons, number of neutrons, number of electrons ].
export type IsotopeInfoIdentifier = [ number, number, number ];

export type DecayTypeString = 'BETA_MINUS_DECAY' | 'BETA_PLUS_DECAY' | 'ALPHA_DECAY' | 'PROTON_EMISSION' | 'NEUTRON_EMISSION';
export type DecayPercentageTuple = readonly [ DecayTypeString, DecayAmount ];

class AtomIdentifier {

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
    const nameProperty = AtomIdentifier.getName( numProtons );
    const massNumber = numProtons + numNeutrons;
    return new DerivedProperty( [ nameProperty ], ( name: string ) => `${name}-${massNumber}` );
  }

  /**
   * Get <sup>mass</sup> and symbol. i.e. <sup>14</sup>C for Carbon-14
   */
  public static getMassAndSymbol( numProtons: number, numNeutrons: number ): string {
    const symbol = AtomIdentifier.getSymbol( numProtons );
    const massNumber = numProtons + numNeutrons;
    return `<sup>${massNumber}</sup>${symbol}`;
  }

  /**
   * Creates a property that listens both to the protonCount (updates element name when a proton is added/removed)
   * but also listens to the locale (updates when Hydrogen goes to Hidrógeno).
   */
  public static createDynamicNameProperty( protonCountProperty: TReadOnlyProperty<number> ): DynamicProperty<string, number, TReadOnlyProperty<string>> {
    const currentElementStringProperty = new Property( AtomIdentifier.getName( protonCountProperty.value ), { reentrant: true } );
    const elementDynamicStringProperty = new DynamicProperty<string, number, TReadOnlyProperty<string>>( currentElementStringProperty );

    // Update the element name based on the proton count.
    protonCountProperty.link( protonCount => {
      currentElementStringProperty.value = AtomIdentifier.getName( protonCount );
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
    const symbol = AtomIdentifier.getSymbol( protonCount ).split( '' ).join( ' ' );
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

  // Identifies whether a given atomic nucleus is stable.
  public static isStable( numProtons: number, numNeutrons: number ): boolean {
    const tableEntry = stableElementTable[ numProtons ];
    if ( typeof ( tableEntry ) === 'undefined' ) {
      return false;
    }

    return tableEntry.includes( numNeutrons );
  }

  public static getNumNeutronsInMostCommonIsotope( atomicNumber: number ): number {
    return numNeutronsInMostStableIsotope[ atomicNumber ] || 0;
  }

  public static getStandardAtomicMass( numProtons: number ): number {
    return standardMassTable[ numProtons ];
  }

  /**
   * Get the atomic mass of an isotope given its proton and neutron counts.   Input parameters are the number of protons
   * and neutrons which hold the information necessary to determine isotope information.
   */
  public static getIsotopeAtomicMass( protons: number, neutrons: number ): number {
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
  }

  /**
   * Returns the natural abundance of the specified isotope on present day Earth (year 2018) as a proportion (NOT a
   * percentage) with the specified number of decimal places.
   */
  public static getNaturalAbundance( isotope: TReadOnlyNumberAtom, numDecimalPlaces: number ): number {
    affirm( numDecimalPlaces !== undefined, 'must specify number of decimal places for proportion' );
    let abundanceProportion = 0;
    if ( isotope.protonCountProperty.get() > 0 &&
         ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ] !== undefined ) {

      // the configuration is in the table, get it and round it to the needed number of decimal places
      abundanceProportion = toFixedNumber(
        ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ].abundance,
        numDecimalPlaces
      );
    }

    return abundanceProportion;
  }

  /**
   * Returns true if the isotope exists only in trace amounts on present day Earth (~year 2018), false if there is
   * more or less than that.  The definition that is used for deciding which isotopes exist in trace amounts is from
   * https://en.wikipedia.org/wiki/Trace_radioisotope.
   */
  public static existsInTraceAmounts( isotope: TReadOnlyNumberAtom ): boolean {
    const tableEntry = ISOTOPE_INFO_TABLE[ isotope.protonCountProperty.get() ][ isotope.massNumberProperty.get() ];
    return tableEntry !== undefined && tableEntry.abundance === TRACE_ABUNDANCE;
  }

  /**
   * Get a list of all isotopes for the given atomic number.
   *
   * @param atomicNumber
   * @return
   */
  public static getAllIsotopesOfElement( atomicNumber: number ): IsotopeInfoIdentifier[] {
    const isotopesList: IsotopeInfoIdentifier[] = [];

    for ( const massNumber in ISOTOPE_INFO_TABLE[ atomicNumber ] ) {

      // parseInt was that best I could think of to support TypeScript
      const numNeutrons = Number.parseInt( massNumber, 10 ) - atomicNumber; // eslint-disable-line phet/bad-sim-text

      isotopesList.push( [ atomicNumber, numNeutrons, atomicNumber ] );
    }

    return isotopesList;
  }

  /**
   * Get a list of all isotopes that are considered stable.  This is needed because the complete list of isotopes used
   * by this class includes some that exist on earth but are not stable, such as carbon-14.
   *
   * @param atomicNumber
   * @return
   */
  public static getStableIsotopesOfElement( atomicNumber: number ): AtomConfig[] {
    const isotopesList = this.getAllIsotopesOfElement( atomicNumber );
    const stableIsotopesList: AtomConfig[] = [];

    isotopesList.forEach( isotopeIdentifier => {
      const numProtons = isotopeIdentifier[ 0 ];
      const numNeutrons = isotopeIdentifier[ 1 ];

      if ( this.isStable( numProtons, numNeutrons ) ) {
        stableIsotopesList.push( new AtomConfig( numProtons, numNeutrons, numProtons ) );
      }
    } );

    return stableIsotopesList;
  }

  // Get the half-life of a nuclide in seconds with the specified number of protons and neutrons.
  // Return -1 if the half-life data is unknown.
  // Return null if there does not exist an entry in HalfLifeConstants for a given proton or neutron number.
  public static getNuclideHalfLife( numProtons: number, numNeutrons: number ): number | null {
    if ( !HalfLifeConstants.hasOwnProperty( numProtons ) || !HalfLifeConstants[ numProtons ].hasOwnProperty( numNeutrons ) ) {
      return null;
    }
    else if ( HalfLifeConstants[ numProtons ][ numNeutrons ] === null ) {
      return -1;
    }
    return HalfLifeConstants[ numProtons ][ numNeutrons ];
  }

  // Identifies whether a given nuclide exists
  public static doesExist( numProtons: number, numNeutrons: number ): boolean {
    const isStable = this.isStable( numProtons, numNeutrons );
    const halfLife = this.getNuclideHalfLife( numProtons, numNeutrons );
    return !( !isStable && halfLife === null );
  }

  // Return if the next isotope of the given nuclide exists
  public static doesNextIsotopeExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons, numNeutrons + 1 ) !== null ||
           this.isStable( numProtons, numNeutrons + 1 );

  }

  // Return if the previous isotope of the given nuclide exists
  public static doesPreviousIsotopeExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons, numNeutrons - 1 ) !== null ||
           this.isStable( numProtons, numNeutrons - 1 );
  }

  // Return if the next isotone of the given nuclide exists
  public static doesNextIsotoneExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons + 1, numNeutrons ) !== null ||
           this.isStable( numProtons + 1, numNeutrons );
  }

  // Return if the previous isotone of the given nuclide exists
  public static doesPreviousIsotoneExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons - 1, numNeutrons ) !== null ||
           this.isStable( numProtons - 1, numNeutrons );
  }

  // Return if the nuclide of the given nuclide plus one proton and plus one neutron exists
  public static doesNextNuclideExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons + 1, numNeutrons + 1 ) !== null ||
           this.isStable( numProtons + 1, numNeutrons + 1 );
  }

  // Return if the nuclide of the given nuclide minus one proton and minus one neutron exists
  public static doesPreviousNuclideExist( numProtons: number, numNeutrons: number ): boolean {
    return this.getNuclideHalfLife( numProtons - 1, numNeutrons - 1 ) !== null ||
           this.isStable( numProtons - 1, numNeutrons - 1 );
  }

  // Get the available decays, and likelihood percents of those decays, for an unstable nuclide. Returns an empty array
  // if the decays are unknown or if the nuclide does not exist or is stable.
  // The first value in the map is the most likely decay (has a decay likelihood of 100%).
  // Please note that you could end up with 2 entries for the same DecayTypeString where one is null and the other is a percent
  public static getAvailableDecaysAndPercents( numProtons: number, numNeutrons: number ): DecayPercentageTuple[] {
    const allDecaysAndPercents = DECAYS_INFO_TABLE[ numProtons ][ numNeutrons ];

    // undefined means the nuclide is stable or does not exist, meaning there are no available decays
    // null the nuclide is unstable and the available decays are unknown
    if ( allDecaysAndPercents === undefined || allDecaysAndPercents === null ) {
      return [];
    }

    // the nuclide is unstable and the available decays are known
    else {
      const allDecays = Object.keys( allDecaysAndPercents );
      const basicDecays: DecayPercentageTuple[] = [];
      const notAlreadyInBasicDecays = ( forDecayString: DecayTypeString ) => {
        return _.every( basicDecays, decay => decay[ 0 ] !== forDecayString || decay[ 1 ] === null );
      };

      for ( let i = 0; i < allDecays.length; i++ ) {
        switch( allDecays[ i ] ) {
          case 'B-':

            if ( notAlreadyInBasicDecays( 'BETA_MINUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_MINUS_DECAY', allDecaysAndPercents[ 'B-' ] ] );
            }
            break;
          case '2B-':
            break;
          case 'EC+B+':
            if ( notAlreadyInBasicDecays( 'BETA_PLUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_PLUS_DECAY', allDecaysAndPercents[ 'EC+B+' ] ] );
            }
            break;
          case 'EC':

            if ( notAlreadyInBasicDecays( 'BETA_PLUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_PLUS_DECAY', allDecaysAndPercents.EC ] );
            }
            break;
          case 'B+':

            if ( notAlreadyInBasicDecays( 'BETA_PLUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_PLUS_DECAY', allDecaysAndPercents[ 'B+' ] ] );
            }
            break;
          case 'B++EC':
            break;
          case '2EC':

            if ( notAlreadyInBasicDecays( 'BETA_PLUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_PLUS_DECAY', allDecaysAndPercents[ '2EC' ] ] );
            }
            break;
          case '2B+':
            break;
          case 'A':
            if ( notAlreadyInBasicDecays( 'ALPHA_DECAY' ) ) {
              basicDecays.push( [ 'ALPHA_DECAY', allDecaysAndPercents.A ] );
            }
            break;
          case 'P':
            if ( notAlreadyInBasicDecays( 'PROTON_EMISSION' ) ) {
              basicDecays.push( [ 'PROTON_EMISSION', allDecaysAndPercents.P ] );
            }
            break;
          case 'N':
            if ( notAlreadyInBasicDecays( 'NEUTRON_EMISSION' ) ) {
              basicDecays.push( [ 'NEUTRON_EMISSION', allDecaysAndPercents.N ] );
            }
            break;
          case '2P':
            if ( notAlreadyInBasicDecays( 'PROTON_EMISSION' ) ) {
              basicDecays.push( [ 'PROTON_EMISSION', allDecaysAndPercents[ '2P' ] ] );
            }
            break;
          case '2N':
            if ( notAlreadyInBasicDecays( 'NEUTRON_EMISSION' ) ) {
              basicDecays.push( [ 'NEUTRON_EMISSION', allDecaysAndPercents[ '2N' ] ] );
            }
            break;
          case 'B+A':
            if ( notAlreadyInBasicDecays( 'BETA_PLUS_DECAY' ) ) {
              basicDecays.push( [ 'BETA_PLUS_DECAY', allDecaysAndPercents[ 'B+A' ] ] );
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
  }

  public static getAtomicRadius( numElectrons: number ): number {
    return mapElectronCountToRadius[ numElectrons ];
  }
}

shred.register( 'AtomIdentifier', AtomIdentifier );
export default AtomIdentifier;

