// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IsotopeNode = require( 'SHRED/view/IsotopeNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticleNode = require( 'SHRED/view/ParticleNode' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );

  // helper factory function
  function createParticleNode( particle, modelViewTransform, tandem ) {
    var particleNode;
    if ( particle.type === 'Isotope' ) {
      particleNode = new IsotopeNode(
        particle,
        modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
        { showLabel: particle.showLabel, tandem: tandem }
      );
    }
    else {
      particleNode = new ParticleNode(
        particle.type,
        modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
        { tandem: tandem }
      );
    }
    return particleNode;
  }

  /**
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function ParticleView( particle, modelViewTransform, options ) {

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.tandemRequired()
    }, options );

    Node.call( this ); // Call super constructor.
    var self = this;

    // Set up fields.
    this.particle = particle; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // Add the particle representation.
    this.addChild( createParticleNode(
      particle,
      modelViewTransform,
      options.tandem.createTandem( 'particleRepresentation' )
    ) );

    // Listen to the model position and update.
    var updateParticlePosition = function( position ) {
      self.translation = self.modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    // Add a drag handler
    this.addInputListener( new MovableDragHandler( particle.destinationProperty, {
      tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

      startDrag: function( event, trail ) {
        self.particle.userControlledProperty.set( true );
      },
      onDrag: function( event, trail ) {
        // update the position immediately to match the destination (i.e. don't animate)
        self.particle.moveImmediatelyToDestination();
      },
      endDrag: function( event, trail ) {
        self.particle.userControlledProperty.set( false );
      },
      modelViewTransform: modelViewTransform,
      dragBounds: options.dragBounds
    } ) );
    this.mutate( options );

    // @private
    this.disposeParticleView = function(){
      particle.positionProperty.unlink( updateParticlePosition );
    };
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView, {
    dispose: function(){
      this.disposeParticleView();
      Node.prototype.dispose.call( this );
    }
  } );
} );
