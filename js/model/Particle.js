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
  var Property = require( 'AXON/Property' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var shred = require( 'SHRED/shred' );
  var Vector2 = require( 'DOT/Vector2' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  // constants
  var DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

  /**
   * @param {string} type
   * @param {Object} options
   * @constructor
   */
  function Particle( type, options ) {

    options = _.extend( {
      tandem: null
    }, options );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    // @public
    this.typeProperty = new Property( type );
    this.positionProperty = new Property( Vector2.ZERO, {
      tandem: options.tandem && options.tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );
    this.destinationProperty = new Property( Vector2.ZERO );
    this.radiusProperty = new Property( type === 'electron' ?
                                        ShredConstants.ELECTRON_RADIUS : ShredConstants.NUCLEON_RADIUS );

    this.velocityProperty = new Property( DEFAULT_PARTICLE_VELOCITY );
    this.userControlledProperty = new Property( false );
    this.zLayerProperty = new Property( 0 ); // Used in view, integer value, higher means further back.
  }

  shred.register( 'Particle', Particle );
  return inherit( Object, Particle, {
    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      if ( !this.userControlledProperty.get() ) {
        var position = this.positionProperty.get();
        var destination = this.destinationProperty.get();
        var velocity = this.velocityProperty.get();
        var distanceToDestination = position.distance( destination );
        if ( distanceToDestination > dt * velocity ) {
          // This was broken up into individual steps in an attempt to solve an issue where complex vector operations
          // sometimes didn't work.
          var stepMagnitude = velocity * dt;
          var stepAngle = Math.atan2( destination.y - position.y, destination.x - position.x );
          var stepVector = Vector2.createPolar( stepMagnitude, stepAngle );

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
    }
  } );
} );
