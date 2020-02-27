// Copyright 2014-2019, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

/**
 * @param {string} particleType - proton, neutron, or electron
 * @param {number} radius
 * @param {Object} [options]
 * @constructor
 */
function ParticleNode( particleType, radius, options ) {

  options = merge( {
    tandem: Tandem.OPTIONAL
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
inherit( Node, ParticleNode );
export default ParticleNode;