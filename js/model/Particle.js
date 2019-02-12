// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model representation of a particle.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ParticleIO = require( 'SHRED/model/ParticleIO' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var shred = require( 'SHRED/shred' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // constants
  var DEFAULT_PARTICLE_VELOCITY = 200; // Basically in pixels/sec.

  /**
   * @param {string} type
   * @param {Object} options
   * @constructor
   */
  function Particle( type, options ) {

    options = _.extend( {
      tandem: Tandem.required,
      maxZLayer: Number.POSITIVE_INFINITY, // for phet-io, can take on values 0-maxZLayer (inclusive)
      phetioType: ParticleIO,
      phetioState: false
    }, options );

    PhetioObject.call( this, options );

    this.type = type; // @public (read-only)

    // @public
    this.positionProperty = new Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem && options.tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );
    this.destinationProperty = new Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem && options.tandem.createTandem( 'destinationProperty' ),
      phetioType: PropertyIO( Vector2IO )
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

  return inherit( PhetioObject, Particle, {

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      if ( !this.userControlledProperty.get() ) {
        var position = this.positionProperty.get();
        var destination = this.destinationProperty.get();
        var velocity = this.animationVelocityProperty.get();
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
} );
