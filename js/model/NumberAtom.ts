// Copyright 2014-2025, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which represent the quantity of the various subatomic
 * particles (i.e. protons, neutrons and electrons).
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import TProperty from '../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import BooleanIO from '../../../tandem/js/types/BooleanIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';

type SelfOptions = {
  protonCount?: number;
  neutronCount?: number;
  electronCount?: number;
};

export type NumberAtomOptions = SelfOptions & PhetioObjectOptions;

type NumberAtomLike = {
  protonCount: number;
  neutronCount: number;
  electronCount: number;
};

export type TNumberAtom = {
  protonCountProperty: TProperty<number>;
  neutronCountProperty: TProperty<number>;
  electronCountProperty: TProperty<number>;
  chargeProperty: TReadOnlyProperty<number>;
  massNumberProperty: TReadOnlyProperty<number>;
  particleCountProperty: TReadOnlyProperty<number>;
  elementNameStringProperty: TReadOnlyProperty<string>;
  nucleusStableProperty: TReadOnlyProperty<boolean>;
};

// Define a fully read-only version of the TNumberAtom type.
type AllReadOnly<T> = {
  [K in keyof T]: T[K] extends TProperty<infer U> ? TReadOnlyProperty<U> : T[K];
};
export type TReadOnlyNumberAtom = AllReadOnly<TNumberAtom>;

class NumberAtom extends PhetioObject implements TNumberAtom {
  public readonly protonCountProperty: Property<number>;
  public readonly neutronCountProperty: Property<number>;
  public readonly electronCountProperty: Property<number>;
  public readonly chargeProperty: TReadOnlyProperty<number>;
  public readonly massNumberProperty: TReadOnlyProperty<number>;
  public readonly particleCountProperty: TReadOnlyProperty<number>;
  public readonly elementNameStringProperty: TReadOnlyProperty<string>;
  public readonly nucleusStableProperty: TReadOnlyProperty<boolean>;
  public readonly atomUpdated: Emitter; // events emitted by instances of this type

  public constructor( providedOptions?: NumberAtomOptions ) {

    const options = optionize<NumberAtomOptions, SelfOptions, PhetioObjectOptions>()( {
      protonCount: 0,
      neutronCount: 0,
      electronCount: 0
    }, providedOptions );

    super( options );

    this.protonCountProperty = new NumberProperty( options.protonCount, {
      tandem: options.tandem?.createTandem( 'protonCountProperty' ),
      numberType: 'Integer',
      phetioReadOnly: true
    } );
    this.neutronCountProperty = new NumberProperty( options.neutronCount, {
      tandem: options.tandem?.createTandem( 'neutronCountProperty' ),
      numberType: 'Integer',
      phetioReadOnly: true
    } );
    this.electronCountProperty = new NumberProperty( options.electronCount, {
      tandem: options.tandem?.createTandem( 'electronCountProperty' ),
      numberType: 'Integer',
      phetioReadOnly: true
    } );

    this.chargeProperty = new DerivedProperty( [ this.protonCountProperty, this.electronCountProperty ],
      ( ( protonCount, electronCount ) => {
        return protonCount - electronCount;
      } ), {
        tandem: options.tandem?.createTandem( 'chargeProperty' ),
        phetioValueType: NumberIO
      }
    );

    this.massNumberProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty ],
      ( ( protonCount, neutronCount ) => {
        return protonCount + neutronCount;
      } ), {
        tandem: options.tandem?.createTandem( 'massNumberProperty' ),
        phetioValueType: NumberIO
      }
    );

    this.particleCountProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      ( protonCount, neutronCount, electronCount ) => protonCount + neutronCount + electronCount
    );

    // The element name is derived from the proton count, since the number of protons determines the element.
    this.elementNameStringProperty = new DerivedStringProperty(
      [ this.protonCountProperty ],
      protonCount => AtomIdentifier.getEnglishName( protonCount ),
      {
        tandem: options.tandem?.createTandem( 'elementNameStringProperty' )
      }
    );

    // Update the stability state changes.
    this.nucleusStableProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty ],
      ( protonCount, neutronCount ) => protonCount + neutronCount > 0 ?
                                       AtomIdentifier.isStable( protonCount, neutronCount ) :
                                       true,
      {
        tandem: options.tandem?.createTandem( 'nucleusStableProperty' ),
        phetioValueType: BooleanIO
      }
    );

    this.atomUpdated = new Emitter( {
      tandem: options.tandem?.createTandem( 'atomUpdatedEmitter' )
    } );
  }

  public get protonCount(): number {
    return this.protonCountProperty.value;
  }

  public get neutronCount(): number {
    return this.neutronCountProperty.value;
  }

  public get electronCount(): number {
    return this.electronCountProperty.value;
  }

  /**
   * compare with another atom
   */
  public equals( otherAtom: NumberAtomLike ): boolean {
    return this.protonCount === otherAtom.protonCount &&
           this.neutronCount === otherAtom.neutronCount &&
           this.electronCount === otherAtom.electronCount;
  }

  public getIsotopeAtomicMass(): number {
    return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
  }

  public setSubAtomicParticleCount( protonCount: number, neutronCount: number, electronCount: number ): void {
    this.protonCountProperty.set( protonCount );
    this.electronCountProperty.set( electronCount );
    this.neutronCountProperty.set( neutronCount );
    this.atomUpdated.emit();
  }

  public override dispose(): void {
    super.dispose();
    this.chargeProperty.dispose();
    this.massNumberProperty.dispose();
    this.particleCountProperty.dispose();
    this.elementNameStringProperty.dispose();
    this.nucleusStableProperty.dispose();

    // Dispose these afterward, since they are dependencies to the above DerivedProperties.
    this.protonCountProperty.dispose();
    this.neutronCountProperty.dispose();
    this.electronCountProperty.dispose();

    this.atomUpdated.dispose();
  }
}

shred.register( 'NumberAtom', NumberAtom );
export default NumberAtom;