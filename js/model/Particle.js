// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model representation of a particle.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import PropertyIO from '../../../axon/js/PropertyIO.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ParticleIO from './ParticleIO.js';

// constants
const DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

/**
 * @param {string} type
 * @param {Object} [options]
 * @constructor
 */
function Particle( type, options ) {

  options = merge( {
    tandem: Tandem.REQUIRED,
    maxZLayer: Number.POSITIVE_INFINITY, // for phet-io, can take on values 0-maxZLayer (inclusive)
    phetioType: ParticleIO,
    phetioState: false
  }, options );

  PhetioObject.call( this, options );

  this.type = type; // @public (read-only)

  // @public
  this.positionProperty = new Vector2Property( Vector2.ZERO, {
    useDeepEquality: true,
    tandem: options.tandem && options.tandem.createTandem( 'positionProperty' )
  } );
  this.destinationProperty = new Vector2Property( Vector2.ZERO, {
    useDeepEquality: true,
    tandem: options.tandem && options.tandem.createTandem( 'destinationProperty' )
  } );
  this.radiusProperty = new NumberProperty( type === 'electron' ? ShredConstants.ELECTRON_RADIUS : ShredConstants.NUCLEON_RADIUS, {
    tandem: options.tandem && options.tandem.createTandem( 'radiusProperty' ),
    phetioDocumentation: 'The radius of the particle.  Changes to radius may not be reflected in view.'
  } );
  this.animationVelocityProperty = new NumberProperty( DEFAULT_PARTICLE_VELOCITY, {
    tandem: options.tandem && options.tandem.createTandem( 'animationVelocityProperty' ),
    range: new Range( 0, 10 * DEFAULT_PARTICLE_VELOCITY ), // limited for the PhET-iO Studio wrapper, code can handle any value
    units: 'view-coordinates/second'
  } );
  this.userControlledProperty = new BooleanProperty( false, {
    tandem: options.tandem && options.tandem.createTandem( 'userControlledProperty' )
  } );
  this.zLayerProperty = new Property( 0, {
    isValidValue: function( value ) {
      return value >= 0 && value <= options.maxZLayer;
    },
    tandem: options.tandem && options.tandem.createTandem( 'zLayerProperty' ),
    numberType: 'Integer',
    range: new Range( 0, options.maxZLayer ),
    phetioType: PropertyIO( NumberIO )
  } ); // Used in view, integer value, higher means further back.
}

shred.register( 'Particle', Particle );

inherit( PhetioObject, Particle, {

  /**
   * @param {number} dt
   * @public
   */
  step: function( dt ) {
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
  },

  // @public
  moveImmediatelyToDestination: function() {
    this.positionProperty.set( this.destinationProperty.get() );
  },

  /**
   * @param {Vector2} newPosition
   * @public
   */
  setPositionAndDestination: function( newPosition ) {
    assert && assert( newPosition instanceof Vector2, 'Attempt to set non-vector position.' );
    if ( newPosition instanceof Vector2 ) {
      this.destinationProperty.set( newPosition );
      this.moveImmediatelyToDestination();
    }
  },
  dispose: function() {
    this.positionProperty.dispose();
    this.destinationProperty.dispose();
    this.radiusProperty.dispose();
    this.animationVelocityProperty.dispose();
    this.userControlledProperty.dispose();
    this.zLayerProperty.dispose();
    PhetioObject.prototype.dispose.call( this );
  }
}, {
  MAX_LAYERS: 5
} );

export default Particle;