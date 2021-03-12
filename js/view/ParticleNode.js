// Copyright 2014-2020, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Color from '../../../scenery/js/util/Color.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// constants
const DEFAULT_LINE_WIDTH = 0.5;
const HIGH_CONTRAST_LINE_WIDTH = 2;

// map of particle type to color information
const PARTICLE_COLORS = {
  proton: PhetColorScheme.RED_COLORBLIND,
  neutron: Color.GRAY,
  electron: Color.BLUE
};

class ParticleNode extends Circle {

  /**
   * @param {string} particleType - proton, neutron, or electron
   * @param {number} radius
   * @param {Object} [options]
   */
  constructor( particleType, radius, options ) {

    options = merge( {

      cursor: 'pointer',

      // {BooleanProperty|null} - if provided, this is used to set the particle node into and out of high contrast mode
      highContrastProperty: null,

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    assert && assert( options.fill === undefined, 'fill will be set programmatically and should not be specified' );
    assert && assert( options.stroke === undefined, 'stroke will be set programmatically and should not be specified' );
    assert && assert( options.lineWidth === undefined, 'line width will be set programmatically and should not be specified' );

    // Get the color to use as the basis for the gradients, fills, strokes and such.
    const baseColor = PARTICLE_COLORS[ particleType ];
    assert && assert( baseColor, `Unrecognized particle type: ${particleType}` );

    // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
    const gradientFill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
      .addColorStop( 0, 'white' )
      .addColorStop( 1, baseColor );

    // Set the options for the default look.
    const nonHighContrastStroke = baseColor.colorUtilsDarker( 0.33 );
    options.fill = gradientFill;
    options.stroke = nonHighContrastStroke;
    options.lineWidth = DEFAULT_LINE_WIDTH;

    super( radius, options );

    // If a highContrastProperty is provided, update the particle appearance based on its value.
    // Set up the fill and the strokes based on whether the highContrastProperty option is provided.
    let highContrastListener = null;
    if ( options.highContrastProperty ) {
      highContrastListener = highContrast => {
        this.fill = highContrast ? baseColor : gradientFill;
        this.stroke = highContrast ? baseColor.colorUtilsDarker( 0.5 ) : nonHighContrastStroke;
        this.lineWidth = highContrast ? HIGH_CONTRAST_LINE_WIDTH : DEFAULT_LINE_WIDTH;
      };
      options.highContrastProperty.link( highContrastListener );
    }

    // @private - internal dispose function
    this.disposeParticleNode = () => {
      if ( highContrastListener ) {
        options.highContrastProperty.unlink( highContrastListener );
      }
    };
  }

  /**
   * release memory references
   * @public
   */
  dispose() {
    this.disposeParticleNode();
    super.dispose();
  }
}

shred.register( 'ParticleNode', ParticleNode );
export default ParticleNode;