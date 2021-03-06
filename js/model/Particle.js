// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model representation of a particle.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import merge from '../../../phet-core/js/merge.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';

// constants
const DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

class Particle extends PhetioObject {

  /**
   * @param {string} type
   * @param {Object} [options]
   */
  constructor( type, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      maxZLayer: Number.POSITIVE_INFINITY, // for phet-io, can take on values 0-maxZLayer (inclusive)
      phetioType: Particle.ParticleIO,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.type = type;

    // @public
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem && options.tandem.createTandem( 'positionProperty' )
    } );

    // @public
    this.destinationProperty = new Vector2Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem && options.tandem.createTandem( 'destinationProperty' )
    } );

    // @public
    this.radiusProperty = new NumberProperty( type === 'electron' ? ShredConstants.ELECTRON_RADIUS : ShredConstants.NUCLEON_RADIUS, {
      tandem: options.tandem && options.tandem.createTandem( 'radiusProperty' ),
      phetioDocumentation: 'The radius of the particle.  Changes to radius may not be reflected in view.'
    } );

    // @public
    this.animationVelocityProperty = new NumberProperty( DEFAULT_PARTICLE_VELOCITY, {
      tandem: options.tandem && options.tandem.createTandem( 'animationVelocityProperty' ),
      range: new Range( 0, 10 * DEFAULT_PARTICLE_VELOCITY ), // limited for the PhET-iO Studio wrapper, code can handle any value
      units: 'view-coordinates/s'
    } );

    // @public
    this.userControlledProperty = new BooleanProperty( false, {
      tandem: options.tandem && options.tandem.createTandem( 'userControlledProperty' )
    } );

    // @public Used in view, integer value, higher means further back.
    this.zLayerProperty = new NumberProperty( 0, {
      isValidValue: function( value ) {
        return value >= 0 && value <= options.maxZLayer;
      },
      tandem: options.tandem && options.tandem.createTandem( 'zLayerProperty' ),
      numberType: 'Integer',
      range: new Range( 0, options.maxZLayer )
    } );

    // @private
    this.disposeParticle = () => {
      this.positionProperty.dispose();
      this.destinationProperty.dispose();
      this.radiusProperty.dispose();
      this.animationVelocityProperty.dispose();
      this.userControlledProperty.dispose();
      this.zLayerProperty.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeParticle();
    super.dispose();
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
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
      }
    }
  }

  // @public
  moveImmediatelyToDestination() {
    this.positionProperty.set( this.destinationProperty.get() );
  }

  /**
   * @param {Vector2} newPosition
   * @public
   */
  setPositionAndDestination( newPosition ) {
    assert && assert( newPosition instanceof Vector2, 'Attempt to set non-vector position.' );
    if ( newPosition instanceof Vector2 ) {
      this.destinationProperty.set( newPosition );
      this.moveImmediatelyToDestination();
    }
  }
}

// @public
Particle.MAX_LAYERS = 5;

Particle.ParticleIO = new IOType( 'ParticleIO', {
  valueType: Particle,
  documentation: 'The model for a single particle such as an electron, proton, or neutron.',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

shred.register( 'Particle', Particle );
export default Particle;