// Copyright 2014-2020, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Color from '../../../scenery/js/util/Color.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// Map of particle type to color information
const PARTICLE_COLORS = {
  proton: PhetColorScheme.RED_COLORBLIND,
  neutron: Color.GRAY,
  electron: Color.BLUE
};

class ParticleNode extends Node {

  /**
   * @param {string} particleType - proton, neutron, or electron
   * @param {number} radius
   * @param {Object} [options]
   */
  constructor( particleType, radius, options ) {

    options = merge( {
      tandem: Tandem.OPTIONAL
    }, options );

    super( options );

    let baseColor = PARTICLE_COLORS[ particleType ];
    if ( baseColor === undefined ) {
      assert && assert( false, 'Unrecognized particle type: ' + particleType );
      baseColor = 'black';
    }

    // Create the node a circle with a gradient.
    this.addChild( new Circle( radius, {
      fill: new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, baseColor.colorUtilsBrighter( 0.5 ) )
        .addColorStop( 1, baseColor.colorUtilsDarker( 0.5 ) ),
      stroke: baseColor.darkerColor( 0.5 ),
      cursor: 'pointer'
    } ) );
  }
}

shred.register( 'ParticleNode', ParticleNode );
export default ParticleNode;