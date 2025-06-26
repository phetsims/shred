// Copyright 2014-2025, University of Colorado Boulder

/**
 * Model representation of a subatomic particle, such as a proton.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import TProperty from '../../../axon/js/TProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import optionize from '../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import ColorProperty from '../../../scenery/js/util/ColorProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';

// used to give each particle a unique ID
let nextParticleId = 1;

// constants
const DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

// map of particle type to color information
export const PARTICLE_COLORS: Record<ParticleTypeString, Color> = {
  proton: PhetColorScheme.RED_COLORBLIND,
  neutron: Color.GRAY.darkerColor( 0.1 ), // Dark gray
  electron: Color.BLUE,
  positron: new Color( 53, 182, 74 ), // Darkish green
  Isotope: Color.BLACK
};

export type ParticleTypeString = 'proton' | 'neutron' | 'electron' | 'positron' | 'Isotope';

type SelfOptions = {
  maxZLayer?: number;
};

export type ParticleOptions = SelfOptions & PhetioObjectOptions;

class Particle extends PhetioObject {

  public static readonly MAX_LAYERS = 5;

  // IDs needed for map-like lookup
  public readonly id = nextParticleId++;

  public readonly typeProperty: TProperty<ParticleTypeString>;

  // Fires when the particle reaches its destination via animation in step
  public readonly animationEndedEmitter = new Emitter();

  public readonly inputEnabledProperty: TProperty<boolean> = new BooleanProperty( true );

  // The "base" color of the Particle, dependent on what type of Particle it is. We say "base" because there is a color
  // gradient applied to present a 3D graphic.
  public readonly colorProperty: TProperty<Color>;

  // The position of the particle, in model space.
  public readonly positionProperty: TProperty<Vector2>;

  // The destination of the particle, in model space. This is where the particle will move to when it is animated.
  public readonly destinationProperty: TProperty<Vector2>;

  // The radius of the particle, in model space.
  public readonly radius: number;

  // Position change per second
  public readonly animationVelocityProperty: TProperty<number>;
  public readonly userControlledProperty: TProperty<boolean>;

  // Used in view, integer value, higher means further back.
  public readonly zLayerProperty: TProperty<number>;

  private readonly disposeParticle: VoidFunction;

  // Assigned by other parties as a way to clean up animations.
  public particleAtomRemovalListener: null | ( ( userControlled: boolean ) => void ) = null;

  public constructor( type: ParticleTypeString, providedOptions?: ParticleOptions ) {

    const options = optionize<ParticleOptions, SelfOptions, PhetioObjectOptions>()( {
      tandem: Tandem.REQUIRED,
      maxZLayer: Number.POSITIVE_INFINITY, // for phet-io, can take on values 0-maxZLayer (inclusive)
      phetioType: Particle.ParticleIO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.typeProperty = new Property<ParticleTypeString>( type );

    // Can be changed in rare cases, see ParticleAtom.changeNucleonType()
    this.colorProperty = new ColorProperty( PARTICLE_COLORS[ type ] );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem && options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true // phet-io users should have no cause to set this
    } );

    this.destinationProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem && options.tandem.createTandem( 'destinationProperty' ),
      phetioReadOnly: true // phet-io users should have no cause to set this
    } );

    this.radius = type === 'electron' || type === 'positron' ?
                  ShredConstants.ELECTRON_RADIUS :
                  ShredConstants.NUCLEON_RADIUS;

    this.animationVelocityProperty = new NumberProperty( DEFAULT_PARTICLE_VELOCITY, {
      tandem: options.tandem && options.tandem.createTandem( 'animationVelocityProperty' ),
      range: new Range( 0, 100 * DEFAULT_PARTICLE_VELOCITY ), // limited for the PhET-iO Studio wrapper, code can handle any value
      units: 'view-coordinates/s'
    } );

    this.userControlledProperty = new BooleanProperty( false, {
      tandem: options.tandem && options.tandem.createTandem( 'userControlledProperty' ),
      hasListenerOrderDependencies: true // Needed for BAN, see https://github.com/phetsims/build-a-nucleus/issues/105
    } );

    this.zLayerProperty = new NumberProperty( 0, {
      isValidValue: function( value ) {
        return value >= 0 && value <= options.maxZLayer;
      },
      tandem: options.tandem && options.tandem.createTandem( 'zLayerProperty' ),
      numberType: 'Integer',
      range: new Range( 0, options.maxZLayer )
    } );

    this.disposeParticle = () => {
      this.typeProperty.dispose();
      this.colorProperty.dispose();
      this.positionProperty.dispose();
      this.destinationProperty.dispose();
      this.animationVelocityProperty.dispose();
      this.userControlledProperty.dispose();
      this.zLayerProperty.dispose();
      this.animationEndedEmitter.dispose();
    };
  }

  public override dispose(): void {
    this.disposeParticle();
    super.dispose();
  }

  public step( dt: number ): void {
    if ( !this.userControlledProperty.get() ) {
      const position = this.positionProperty.get();
      const destination = this.destinationProperty.get();
      const velocity = this.animationVelocityProperty.get();
      const distanceToDestination = position.distance( destination );
      if ( distanceToDestination > dt * velocity ) {

        // This was broken up into individual steps in an attempt to solve an issue where complex vector operations
        // sometimes didn't work.
        const stepMagnitude = velocity * dt;
        const stepAngle = Math.atan2( destination.y - position.y, destination.x - position.x );
        const stepVector = Vector2.createPolar( stepMagnitude, stepAngle );

        // Move a step toward the destination.
        this.positionProperty.set( position.plus( stepVector ) );

        // When the position and destination, are exactly equal, can just go ahead and emit the animationEndedEmitter,
        // see https://github.com/phetsims/build-a-nucleus/issues/198.
        if ( this.positionProperty.value.equals( this.destinationProperty.value ) ) {
          this.animationEndedEmitter.emit();
        }
      }
      else if ( distanceToDestination > 0 ) {
        // Less than one time step away, so just go to the destination.
        this.moveImmediatelyToDestination();
        this.animationEndedEmitter.emit();
      }
    }
  }

  public get type(): ParticleTypeString { return this.typeProperty.value; }

  public moveImmediatelyToDestination(): void {
    this.positionProperty.set( this.destinationProperty.get() );
  }

  public setPositionAndDestination( newPosition: Vector2 ): void {
    this.destinationProperty.set( newPosition );
    this.moveImmediatelyToDestination();
  }

  public static ParticleIO = new IOType<IntentionalAny, IntentionalAny>( 'ParticleIO', {
    valueType: Particle,
    documentation: 'The model for a single particle such as an electron, proton, or neutron.',
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}


shred.register( 'Particle', Particle );
export default Particle;