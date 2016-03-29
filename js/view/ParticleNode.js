// Copyright 2014-2015, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( function( require ) {
  'use strict';

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var shred = require( 'SHRED/shred' );

  /**
   * @param {String} particleType - proton, neutron, or electron
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function ParticleNode( particleType, radius, options ) {

    Node.call( this, options ); // Call super constructor.

    var colors = { proton: PhetColorScheme.RED_COLORBLIND, neutron: 'gray', electron: 'blue' };
    var baseColor = colors[ particleType ];
    if ( baseColor === undefined ) {
      console.error( 'Unrecognized particle type: ' + particleType );
      baseColor = 'black';
    }

    // Create the node a circle with a gradient.
    this.addChild( new Circle( radius, {
      fill: new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, baseColor ),
      cursor: 'pointer'
    } ) );
  }

  shred.register( 'ParticleNode', ParticleNode );

  // Inherit from Node.
  return inherit( Node, ParticleNode );
} );
