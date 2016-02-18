// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */
define( function( require ) {
  'use strict';

  var shred = require( 'SHRED/shred' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TandemDragHandler = require( 'SUN/TandemDragHandler' );
  var IsotopeNode = require( 'SHRED/view/IsotopeNode' );
  var ParticleNode = require( 'SHRED/view/ParticleNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  // Optimization - create a sort of cache for particle nodes.
  var particleNodes = {};

  function getParticleNode( particle, mvt ) {
    var id;
    if ( particle.type === 'Isotope' ) {
      id = 'id-' + particle.type + '-' + particle.radius + '-' + mvt.modelToViewDeltaX( particle.radius ) + '-' + particle.color + '-' + particle.massNumber + '-' + particle.protonCount;
    }
    else {
      id = 'id-' + particle.type + '-' + particle.radius + '-' + mvt.modelToViewDeltaX( particle.radius );
    }
    if ( !particleNodes[ id ] ) {
      if ( particle.type === 'Isotope' ) {
        particleNodes[ id ] = new IsotopeNode( particle, mvt.modelToViewDeltaX( particle.radius ), { showLabel: particle.showLabel } );
      }
      else {
        particleNodes[ id ] = new ParticleNode( particle.type, mvt.modelToViewDeltaX( particle.radius ) );
      }
    }

    return particleNodes[ id ];
//    return new ParticleNode( particle.type, mvt.modelToViewDeltaX( particle.radius ) );

    // TODO: Below is an alternative way to create the particle nodes.  This
    // approach converts the node to an image.  It was used for a while, but
    // was found to be incompatible with using CSS transforms to move the
    // particles because they became fuzzy.  However, I (jblanco) hate to
    // remove this code immediately in case using CSS transforms doesn't pan
    // out.  So keep for now, delete when new approach is proven.  This note
    // was written on 10/1/2013.

//    // Scale up before rasterization so it won't be too pixellated/fuzzy
//    var scale = 2;
//    var viewRadius = mvt.modelToViewDeltaX( particle.radius );
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
   * @param particle
   * @param {ModelViewTransform2} mvt
   * @param {Tandem} tandem
   * @constructor
   */
  function ParticleView( particle, mvt, tandem ) {

    Node.call( this ); // Call super constructor.
    var thisParticleView = this;

    // Set up fields.
    this.particle = particle; // @public
    this.mvt = mvt; // @private

    // Add the particle representation.
    this.addChild( getParticleNode( particle, mvt ) );

    // Listen to the model position and update.
    particle.positionProperty.link( function( position ) {
      thisParticleView.translation = thisParticleView.mvt.modelToViewPosition( position );
    } );

    // Add a drag handler
    this.addInputListener( new TandemDragHandler( {
      tandem: tandem ? tandem.createTandem( 'inputListener' ) : null,

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        particle.setPositionAndDestination( particle.position.plus( mvt.viewToModelDelta( translationParams.delta ) ) );
        return translationParams.position;
      },
      start: function( event, trail ) {
        thisParticleView.particle.userControlled = true;
      },
      end: function( event, trail ) {
        thisParticleView.particle.userControlled = false;
      }
    } ) );
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView );
} );
