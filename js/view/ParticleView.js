// Copyright 2014-2020, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */

import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import DragListener from '../../../scenery/js/listeners/DragListener.js';
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

  // add a drag listener
  const dragListener = new DragListener( {

    positionProperty: particle.destinationProperty,
    tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

    start: function( event, trail ) {
      self.particle.userControlledProperty.set( true );

      // if there is an animation in progress, cancel it be setting the destination to the position
      if ( !particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
        particle.destinationProperty.set( particle.positionProperty.get() );
      }
    },

    drag: () => {

      // Because the destination property is what is being set by the drag listener, we need to tell the particle to go
      // immediately to its destination when a drag occurs.
      self.particle.moveImmediatelyToDestination();
    },

    end: function( event, trail ) {
      self.particle.userControlledProperty.set( false );
    },

    transform: modelViewTransform,
    dragBoundsProperty: options.dragBounds ? new Property( options.dragBounds ) : null
  } );
  this.addInputListener( dragListener );
  this.mutate( options );

  // @private called by dispose
  this.disposeParticleView = function() {
    particle.positionProperty.unlink( updateParticlePosition );
    particleNode.dispose();
    dragListener.dispose();
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