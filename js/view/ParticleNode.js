// Copyright 2014-2022, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import { Circle } from '../../../scenery/js/imports.js';
import { Color } from '../../../scenery/js/imports.js';
import { RadialGradient } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import Easing from '../../../twixt/js/Easing.js';
import shred from '../shred.js';
import Animation from '../../../twixt/js/Animation.js';
import Utils from '../../../dot/js/Utils.js';

// constants
const DEFAULT_LINE_WIDTH = 0.5;
const HIGH_CONTRAST_LINE_WIDTH = 2;

// map of particle type to color information
const PARTICLE_COLORS = {
  proton: PhetColorScheme.RED_COLORBLIND,
  neutron: Color.GRAY,
  electron: Color.BLUE,
  positron: Color.GREEN
};

// color gradient between the color of a proton and a neutron
const NUCLEON_COLOR_GRADIENT = [
  PARTICLE_COLORS.proton,
  new Color( '#e06020' ), // 1/4 point
  new Color( '#c06b40' ), // half-way point
  new Color( '#a07660' ), // 3/4 point
  PARTICLE_COLORS.neutron
];

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

      typeProperty: null,

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

    // function to change the color of a particle
    const changeParticleColor = newColor => {

      // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
      const gradientFill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, newColor );

      // Set the options for the default look.
      const nonHighContrastStroke = newColor.colorUtilsDarker( 0.33 );
      const newOptions = {};
      newOptions.fill = gradientFill;
      newOptions.stroke = nonHighContrastStroke;

      this.mutate( newOptions );
    };

    //  keep track of the index in the nucleonColorChange gradient
    const colorGradientIndexNumberProperty = new NumberProperty( 0 );

    // change the color of the particle if its type changes
    options.typeProperty && options.typeProperty.lazyLink( type => {

      let nucleonChangeColorChange;
      if ( type === 'proton' ) {
        nucleonChangeColorChange = NUCLEON_COLOR_GRADIENT.slice().reverse();
      }
      else if ( type === 'neutron' ) {
        nucleonChangeColorChange = NUCLEON_COLOR_GRADIENT.slice();
      }

      if ( type === 'neutron' || type === 'proton' ) {

        // animate through the values in nucleonColorChange to 'slowly' change the color of the nucleon
        const colorChangeAnimation = new Animation( {
          from: colorGradientIndexNumberProperty.initialValue,
          to: nucleonChangeColorChange.length - 1,
          setValue: indexValue => { colorGradientIndexNumberProperty.value = indexValue; },
          duration: 1,
          easing: Easing.LINEAR
        } );

        colorGradientIndexNumberProperty.link( indexValue => {

          // the value is close to an integer
          if ( Math.floor( indexValue * 10 ) / 10 % 1 === 0 ) {
            changeParticleColor( nucleonChangeColorChange[ Utils.toFixed( indexValue, 0 ) ] );
          }
        } );

        colorChangeAnimation.start();
      }
      else {

        // Get the color to use as the basis for the gradients, fills, strokes and such.
        const baseColor = PARTICLE_COLORS[ type ];
        assert && assert( baseColor, `Unrecognized particle type: ${type}` );

        changeParticleColor( baseColor );
      }
    } );

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