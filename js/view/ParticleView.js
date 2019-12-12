// Copyright 2014-2019, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const IsotopeNode = require( 'SHRED/view/IsotopeNode' );
  const merge = require( 'PHET_CORE/merge' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleNode = require( 'SHRED/view/ParticleNode' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );

  // helper factory function
  function createParticleNode( particle, modelViewTransform, tandem ) {
    let particleNode;
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

    options = merge( {
      dragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED
    }, options );

    Node.call( this ); // Call super constructor.
    const self = this;

    // Set up fields.
    this.particle = particle; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // Add the particle representation.
    const particleNode = createParticleNode(
      particle,
      modelViewTransform,
      options.tandem.createTandem( 'particleRepresentation' )
    );
    this.addChild( particleNode );

    // Listen to the model position and update.
    const updateParticlePosition = function( position ) {
      self.translation = self.modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    // Add a drag handler
    const movableDragHandler = new MovableDragHandler( particle.destinationProperty, {
      tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

      startDrag: function( event, trail ) {
        self.particle.userControlledProperty.set( true );

        // if there is an animation in progress, cancel it be setting the destination to the position
        if ( !particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
          particle.destinationProperty.set( particle.positionProperty.get() );
        }
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
    } );
    this.addInputListener( movableDragHandler );
    this.mutate( options );

    // @private called by dispose
    this.disposeParticleView = function() {
      particle.positionProperty.unlink( updateParticlePosition );
      particleNode.dispose();
      movableDragHandler.dispose();
    };
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView, {
    dispose: function() {
      this.disposeParticleView();
      Node.prototype.dispose.call( this );
    }
  } );
} );
