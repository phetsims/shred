// Copyright 2014-2020, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import MovableDragHandler from '../../../scenery-phet/js/input/MovableDragHandler.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import IsotopeNode from './IsotopeNode.js';
import ParticleNode from './ParticleNode.js';

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
inherit( Node, ParticleView, {
  dispose: function() {
    this.disposeParticleView();
    Node.prototype.dispose.call( this );
  }
} );

export default ParticleView;