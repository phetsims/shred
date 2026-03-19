// Copyright 2026, University of Colorado Boulder

/**
 * AtomConfig is an immutable configuration for the subatomic particles that comprise an atom, namely the protons,
 * neutrons, and electrons.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import AtomInfoUtils from '../AtomInfoUtils.js';
import shred from '../shred.js';
import NumberAtom, { TReadOnlyNumberAtom } from './NumberAtom.js';

class AtomConfig {

  public readonly protonCount: number;
  public readonly neutronCount: number;
  public readonly electronCount: number;

  public constructor( numProtons: number, numNeutrons: number, numElectrons: number ) {
    this.protonCount = numProtons;
    this.neutronCount = numNeutrons;
    this.electronCount = numElectrons;
  }

  /**
   * Compare two atom configurations, return true if the particle counts are the same.
   */
  public equals( AtomConfig: AtomConfig ): boolean {
    return this.protonCount === AtomConfig.protonCount &&
           this.neutronCount === AtomConfig.neutronCount &&
           this.electronCount === AtomConfig.electronCount;
  }

  /**
   * Get the atomic mass for this nucleus configuration.
   */
  public getAtomicMass(): number {
    return AtomInfoUtils.getIsotopeAtomicMass( this.protonCount, this.neutronCount );
  }

  /**
   * Get the mass number for this atom configuration, which is the sum of the number of protons and neutrons.
   */
  public getMassNumber(): number {
    return this.protonCount + this.neutronCount;
  }

  /**
   * Get the charge for this atom configuration, which is the number of protons minus the number of electrons.
   */
  public getCharge(): number {
    return this.protonCount - this.electronCount;
  }

  /**
   * String representation, useful for debugging.
   */
  public toString(): string {
    return `protonCount: ${this.protonCount}, neutronCount: ${this.neutronCount}, electronCount: ${this.electronCount}`;
  }

  /**
   * Convert this AtomConfig to a NumberAtom.  This is useful for interoperability with other parts of the code that use
   * NumberAtom to represent atom configurations.
   */
  public toNumberAtom(): NumberAtom {
    return new NumberAtom( {
      protonCount: this.protonCount,
      neutronCount: this.neutronCount,
      electronCount: this.electronCount
    } );
  }

  /**
   * Create an AtomConfig from a TReadOnlyNumberAtom.
   */
  public static getConfiguration( atom: TReadOnlyNumberAtom ): AtomConfig {
    return new AtomConfig(
      atom.protonCountProperty.value,
      atom.neutronCountProperty.value,
      atom.electronCountProperty.value
    );
  }
}

shred.register( 'AtomConfig', AtomConfig );

export default AtomConfig;