// Copyright 2014-2019, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( require => {
  'use strict';

  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {string} particleType - proton, neutron, or electron
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function ParticleNode( particleType, radius, options ) {

    options = merge( {
      tandem: Tandem.optional
    }, options );

    Node.call( this, options ); // Call super constructor.

    const colors = { proton: PhetColorScheme.RED_COLORBLIND, neutron: 'gray', electron: 'blue' };
    let baseColor = colors[ particleType ];
    if ( baseColor === undefined ) {
      assert && assert( false, 'Unrecognized particle type: ' + particleType );
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
