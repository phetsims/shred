// Copyright 2014-2023, University of Colorado Boulder

/**
 * Model representation of a particle.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import optionize from '../../../phet-core/js/optionize.js';
import TProperty from '../../../axon/js/TProperty.js';

// used to give each particle a unique ID
let nextParticleId = 1;

// constants
const DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

type SelfOptions = {
  maxZLayer?: number;
};

export type ParticleOptions = SelfOptions & PhetioObjectOptions;

class Particle extends PhetioObject {

  public static readonly MAX_LAYERS = 5;

  //IDs needed for map-like lookup
  public readonly id = nextParticleId++;

  // TODO: investigate getting rid of this and using userControlledProperty
  // Fires when the user stops dragging a particle.
  public readonly dragEndedEmitter = new Emitter( { parameters: [ { valueType: Particle } ] } );
  public readonly typeProperty: TProperty<string>;

  // Fires when the particle reaches its destination via animation in step
  public readonly animationEndedEmitter = new Emitter();

  public readonly inputEnabledProperty: TProperty<boolean> = new BooleanProperty( true );

  // Keep track of the index in the nucleonColorChange gradient.  The default is 4 since there are 5 colors
  // in the color gradient array. See the NUCLEON_COLOR_GRADIENT array in ParticleNode.js.
  public readonly colorGradientIndexNumberProperty = new NumberProperty( 4 );
  public readonly positionProperty: TProperty<Vector2>;
  public readonly destinationProperty: TProperty<Vector2>;
  public readonly radiusProperty: TProperty<number>;
  public readonly animationVelocityProperty: TProperty<number>;
  public readonly userControlledProperty: TProperty<boolean>;

  // Used in view, integer value, higher means further back.
  public readonly zLayerProperty: TProperty<number>;
  private readonly disposeParticle: () => void;

  // Assigned by other parties as a way to clean up animations.
  public particleAtomRemovalListener: null | ( ( userControlled: boolean ) => void ) = null;

  public constructor( type: string, providedOptions?: ParticleOptions ) {

    const options = optionize<ParticleOptions, SelfOptions, PhetioObjectOptions>()( {
      tandem: Tandem.REQUIRED,
      maxZLayer: Number.POSITIVE_INFINITY, // for phet-io, can take on values 0-maxZLayer (inclusive)
      phetioType: Particle.ParticleIO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.typeProperty = new StringProperty( type );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem && options.tandem.createTandem( 'positionProperty' )
    } );

    this.destinationProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem && options.tandem.createTandem( 'destinationProperty' )
    } );

    this.radiusProperty = new NumberProperty(
      type === 'electron' || type === 'positron' ? ShredConstants.ELECTRON_RADIUS : ShredConstants.NUCLEON_RADIUS,
      {
        tandem: options.tandem && options.tandem.createTandem( 'radiusProperty' ),
        phetioDocumentation: 'The radius of the particle.  Changes to radius may not be reflected in view.'
      }
    );

    this.animationVelocityProperty = new NumberProperty( DEFAULT_PARTICLE_VELOCITY, {
      tandem: options.tandem && options.tandem.createTandem( 'animationVelocityProperty' ),
      range: new Range( 0, 10 * DEFAULT_PARTICLE_VELOCITY ), // limited for the PhET-iO Studio wrapper, code can handle any value
      units: 'view-coordinates/s'
    } );

    this.userControlledProperty = new BooleanProperty( false, {
      tandem: options.tandem && options.tandem.createTandem( 'userControlledProperty' )
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
      this.colorGradientIndexNumberProperty.dispose();
      this.positionProperty.dispose();
      this.destinationProperty.dispose();
      this.radiusProperty.dispose();
      this.animationVelocityProperty.dispose();
      this.userControlledProperty.dispose();
      this.zLayerProperty.dispose();
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
      }
      else if ( distanceToDestination > 0 ) {
        // Less than one time step away, so just go to the destination.
        this.moveImmediatelyToDestination();
        this.animationEndedEmitter.emit();
      }
    }
  }

  public get type(): string { return this.typeProperty.value; }

  public moveImmediatelyToDestination(): void {
    this.positionProperty.set( this.destinationProperty.get() );
  }

  public setPositionAndDestination( newPosition: Vector2 ): void {
    if ( newPosition instanceof Vector2 ) { // TODO: remove this check, let TypeScript do the work
      this.destinationProperty.set( newPosition );
      this.moveImmediatelyToDestination();
    }
  }

  public static ParticleIO = new IOType( 'ParticleIO', {
    valueType: Particle,
    documentation: 'The model for a single particle such as an electron, proton, or neutron.',
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}


shred.register( 'Particle', Particle );
export default Particle;