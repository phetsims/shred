// Copyright 2014-2026, University of Colorado Boulder
/**
 * AtomInfoUtils is an object that can be used to provide various information about an atom given its configuration,
 * such as its atomic mass, stable isotopes, and decay paths.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg
 * @author Luisa Vargas
 * @author Agustín Vallejo
 */

import { toFixedNumber } from '../../dot/js/util/toFixedNumber.js';
import affirm from '../../perennial-alias/js/browser-and-node/affirm.js';
import { DecayAmount, DECAYS_INFO_TABLE, HalfLifeConstants, ISOTOPE_INFO_TABLE, mapElectronCountToRadius, numNeutronsInMostStableIsotope, stableElementTable, standardMassTable, TRACE_ABUNDANCE } from './AtomData.js';
import AtomConfig from './model/AtomConfig.js';
import type { TReadOnlyNumberAtom } from './model/NumberAtom.js';

export type DecayTypeString = 'BETA_MINUS_DECAY' | 'BETA_PLUS_DECAY' | 'ALPHA_DECAY' | 'PROTON_EMISSION' | 'NEUTRON_EMISSION';
export type DecayPercentageTuple = readonly [ DecayTypeString, DecayAmount ];

class AtomInfoUtils {

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
      const tableEntry = ISOTOPE_INFO_TABLE.get( protons )?.get( protons + neutrons );
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
   * Returns the natural abundance of the specified isotope on present day Earth (circa 2020) as a proportion (NOT a
   * percentage) with the specified number of decimal places.
   */
  public static getNaturalAbundance( isotope: TReadOnlyNumberAtom, numDecimalPlaces: number ): number {
    affirm( numDecimalPlaces !== undefined, 'must specify number of decimal places for proportion' );
    let abundanceProportion = 0;
    const protonCount = isotope.protonCountProperty.get();
    const massNumber = isotope.massNumberProperty.get();
    if ( isotope.protonCountProperty.get() > 0 &&
         ISOTOPE_INFO_TABLE.has( protonCount ) && ISOTOPE_INFO_TABLE.get( protonCount )!.has( massNumber ) ) {

      // The configuration is in the table, so get it and round it to the needed number of decimal places.
      abundanceProportion = toFixedNumber(
        ISOTOPE_INFO_TABLE.get( protonCount )!.get( massNumber )!.abundance,
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
    const protonCount = isotope.protonCountProperty.get();
    const massNumber = isotope.massNumberProperty.get();
    return protonCount > 0 &&
           ISOTOPE_INFO_TABLE.has( protonCount ) &&
           ISOTOPE_INFO_TABLE.get( protonCount )!.has( massNumber ) &&
           ISOTOPE_INFO_TABLE.get( protonCount )!.get( massNumber )!.abundance === TRACE_ABUNDANCE;
  }

  /**
   * Get a list of all isotopes for the given atomic number.
   *
   * @param atomicNumber
   * @return
   */
  public static getAllIsotopesOfElement( atomicNumber: number ): AtomConfig[] {
    const isotopesList: AtomConfig[] = [];

    const isotopeEntries = ISOTOPE_INFO_TABLE.get( atomicNumber );
    if ( isotopeEntries ) {
      for ( const [ massNumber ] of isotopeEntries ) {
        const numNeutrons = massNumber - atomicNumber;

        // Add the isotope, assuming a neutral atom (number of electrons = number of protons).
        isotopesList.push( new AtomConfig( atomicNumber, numNeutrons, atomicNumber ) );
      }
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
      const numProtons = isotopeIdentifier.protonCount;
      const numNeutrons = isotopeIdentifier.neutronCount;

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

export default AtomInfoUtils;
