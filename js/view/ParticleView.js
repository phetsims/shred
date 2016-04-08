// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var IsotopeNode = require( 'SHRED/view/IsotopeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticleNode = require( 'SHRED/view/ParticleNode' );
  var shred = require( 'SHRED/shred' );
  var TandemDragHandler = require( 'SUN/TandemDragHandler' );

  function getParticleNode( particle, modelViewTransform ) {
    var particleNode;
    if ( particle.type === 'Isotope' ) {
      particleNode = new IsotopeNode( particle, modelViewTransform.modelToViewDeltaX( particle.radius ), { showLabel: particle.showLabel } );
    }
    else {
      particleNode = new ParticleNode( particle.type, modelViewTransform.modelToViewDeltaX( particle.radius ) );
    }
    return particleNode;

    // TODO: Below is an alternative way to create the particle nodes.  This
    // approach converts the node to an image.  It was used for a while, but
    // was found to be incompatible with using CSS transforms to move the
    // particles because they became fuzzy.  However, I (jblanco) hate to
    // remove this code immediately in case using CSS transforms doesn't pan
    // out.  So keep for now, delete when new approach is proven.  This note
    // was written on 10/1/2013.

//    // Scale up before rasterization so it won't be too pixellated/fuzzy
//    var scale = 2;
//    var viewRadius = modelViewTransform.modelToViewDeltaX( particle.radius );
//    var scaledRadius = viewRadius * scale;
//    var particleNode = new ParticleNode( particle.type, scaledRadius );
//    var node = new Node( { cursor: 'pointer' } );
//    particleNode.toImage( function( im, x, y ) {
//      //Scale back down so the image will be the desired size
//      var image = new Image( im, { x: -x, y: -y } );
//      image.scale( 1 / scale, 1 / scale, true );
//      node.addChild( image );
//    }, scaledRadius + 1, scaledRadius + 1, 2 * ( scaledRadius + 1 ), 2 * ( scaledRadius + 1 ) );
//    return node;
  }

  /**
   *
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function ParticleView( particle, modelViewTransform, options ) {

    options = _.extend( {
      tandem: null
    }, options );
    Node.call( this ); // Call super constructor.
    var thisParticleView = this;

    // Set up fields.
    this.particle = particle; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // Add the particle representation.
    this.addChild( getParticleNode( particle, modelViewTransform ) );

    // Listen to the model position and update.
    var particlePosition = function( position ) {
      thisParticleView.translation = thisParticleView.modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( particlePosition );

    // Add a drag handler
    this.addInputListener( new TandemDragHandler( {
      tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        particle.setPositionAndDestination( particle.position.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
        return translationParams.position;
      },
      start: function( event, trail ) {
        thisParticleView.particle.userControlled = true;
      },
      end: function( event, trail ) {
        thisParticleView.particle.userControlled = false;
      }
    } ) );
    this.mutate( options );

    this.particleViewDispose = function(){
      particle.positionProperty.unlink( particlePosition );
    };
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView, {
    dispose: function(){
      this.particleViewDispose();
    }
  } );
} );
