// Copyright 2014-2025, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which represent the quantity of the various subatomic
 * particles (i.e. protons, neutrons and electrons).
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import TProperty from '../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';

type SelfOptions = {
  protonCount?: number;
  neutronCount?: number;
  electronCount?: number;
};

type ParentOptions = Pick<PhetioObjectOptions, 'tandem'>;
export type NumberAtomOptions = SelfOptions & ParentOptions;

type NumberAtomLike = {
  protonCount: number;
  neutronCount: number;
  electronCount: number;
};

export type NumberAtomCounts = {
  protonCountProperty: TProperty<number>;
  neutronCountProperty: TProperty<number>;
  electronCountProperty: TProperty<number>;
  chargeProperty: TReadOnlyProperty<number>;
  massNumberProperty: TReadOnlyProperty<number>;
  particleCountProperty: TReadOnlyProperty<number>;
};

class NumberAtom {
  public readonly protonCountProperty: Property<number>;
  public readonly neutronCountProperty: Property<number>;
  public readonly electronCountProperty: Property<number>;
  public readonly chargeProperty: TReadOnlyProperty<number>;
  public readonly massNumberProperty: TReadOnlyProperty<number>;
  public readonly particleCountProperty: TReadOnlyProperty<number>;
  public readonly atomUpdated: Emitter; // events emitted by instances of this type

  public constructor( providedOptions?: NumberAtomOptions ) {

    const options = optionize<NumberAtomOptions, SelfOptions, ParentOptions>()( {
      protonCount: 0,
      neutronCount: 0,
      electronCount: 0
    }, providedOptions );

    this.protonCountProperty = new NumberProperty( options.protonCount, {
      tandem: options.tandem?.createTandem( 'protonCountProperty' ),
      phetioDocumentation: 'this property is updated by the model and should not be set by users',
      numberType: 'Integer'
    } );
    this.neutronCountProperty = new NumberProperty( options.neutronCount, {
      tandem: options.tandem?.createTandem( 'neutronCountProperty' ),
      numberType: 'Integer',
      phetioDocumentation: 'this property is updated by the model and should not be set by users'
    } );
    this.electronCountProperty = new NumberProperty( options.electronCount, {
      tandem: options.tandem?.createTandem( 'electronCountProperty' ),
      numberType: 'Integer',
      phetioDocumentation: 'this property is updated by the model and should not be set by users'
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

    this.particleCountProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      ( ( protonCount, neutronCount, electronCount ) => {
        return protonCount + neutronCount + electronCount;
      } ), {
        tandem: options.tandem?.createTandem( 'particleCountProperty' ),
        phetioValueType: NumberIO
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

  public getStandardAtomicMass(): number {
    return AtomIdentifier.getStandardAtomicMass( this.protonCountProperty.get() + this.neutronCountProperty.get() );
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

  public dispose(): void {
    this.chargeProperty.dispose();
    this.massNumberProperty.dispose();
    this.particleCountProperty.dispose();

    // Dispose these afterwards since they are dependencies to the above DerivedProperties
    this.protonCountProperty.dispose();
    this.neutronCountProperty.dispose();
    this.electronCountProperty.dispose();

    this.atomUpdated.dispose();
  }

  public static NumberAtomIO = new IOType<IntentionalAny, IntentionalAny>( 'NumberAtomIO', {
    valueType: NumberAtom,
    documentation: 'A value type that contains quantities of electrons, protons, and neutrons',
    toStateObject: numberAtom => ( {
      protonCount: numberAtom.protonCountProperty.get(),
      electronCount: numberAtom.electronCountProperty.get(),
      neutronCount: numberAtom.neutronCountProperty.get()
    } ),
    fromStateObject( stateObject ) {
      //TODO https://github.com/phetsims/shred/issues/39 Should this be implemented?
    }
  } );
}

shred.register( 'NumberAtom', NumberAtom );
export default NumberAtom;