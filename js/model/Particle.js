// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model representation of a particle.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var SharedConstants = require( 'SHRED/SharedConstants' );
  var shred = require( 'SHRED/shred' );
  var Vector2 = require( 'DOT/Vector2' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

  /**
   * @param {String} type
   * @param {Object} options
   * @constructor
   */
  function Particle( type, options ) {

    options = _.extend( {
      tandem: null
    }, options );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    var propertySetOptions = options.tandem ? {
      tandemSet: { position: options.tandem.createTandem( 'positionProperty' ) }
    } : {};
    // @public
    PropertySet.call( this, {
      type: type,
      position: Vector2.ZERO,
      destination: Vector2.ZERO,
      radius: type === 'electron' ? SharedConstants.ELECTRON_RADIUS : SharedConstants.NUCLEON_RADIUS,
      velocity: DEFAULT_PARTICLE_VELOCITY,
      userControlled: false,
      zLayer: 0 // Used in view, integer value, higher means further back.
    }, propertySetOptions );
  }

  shred.register( 'Particle', Particle );
  return inherit( PropertySet, Particle, {
    /**
     * @param {Number} dt
     * @public
     */
    step: function( dt ) {
      if ( !this.userControlled ) {
        var distanceToDestination = this.position.distance( this.destination );
        if ( distanceToDestination > dt * this.velocity ) {
          // This was broken up into individual steps in an attempt to solve an issue where complex vector operations
          // sometimes didn't work.
          var stepMagnitude = this.velocity * dt;
          var stepAngle = Math.atan2( this.destination.y - this.position.y, this.destination.x - this.position.x );
          var stepVector = Vector2.createPolar( stepMagnitude, stepAngle );

          // Move a step toward the destination.
          this.position = this.position.plus( stepVector );
        }
        else if ( distanceToDestination > 0 ) {
          // Less than one time step away, so just go to the destination.
          this.position = this.destination;
        }
      }
    },

    // @public
    moveImmediatelyToDestination: function() {
      this.position = this.destination;
    },

    /**
     * @param {Vector2} newPosition
     * @public
     */
    setPositionAndDestination: function( newPosition ) {
      assert && assert( newPosition instanceof Vector2, 'Attempt to set non-vector position.' );
      if ( newPosition instanceof Vector2 ) {
        this.destination = newPosition;
        this.moveImmediatelyToDestination();
      }
    }
  } );
} );
