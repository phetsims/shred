// Copyright 2014-2023, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient. This type does not
 * track a particle, use ParticleView for that. Basically this is just an icon.
 */

import Utils from '../../../dot/js/Utils.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import { Circle, CircleOptions, Color, ColorProperty, RadialGradient } from '../../../scenery/js/imports.js';
import shred from '../shred.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import { ParticleTypeString } from '../model/Particle.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Multilink from '../../../axon/js/Multilink.js';

// constants
const DEFAULT_LINE_WIDTH = 0.5;
const HIGH_CONTRAST_LINE_WIDTH = 2;

// map of particle type to color information
const PARTICLE_COLORS: Record<ParticleTypeString, Color> = {
  proton: PhetColorScheme.RED_COLORBLIND,
  neutron: Color.GRAY,
  electron: Color.BLUE,
  positron: Color.GREEN,
  Isotope: Color.BLACK
};

// color gradient between the color of a proton and a neutron
const NUCLEON_COLOR_GRADIENT = [
  PARTICLE_COLORS.proton,
  new Color( '#e06020' ), // 1/4 point
  new Color( '#c06b40' ), // half-way point
  new Color( '#a07660' ), // 3/4 point
  PARTICLE_COLORS.neutron
];


type SelfOptions = {

  // {BooleanProperty|null} - if provided, this is used to set the particle node into and out of high contrast mode
  highContrastProperty?: TReadOnlyProperty<boolean>;
  typeProperty?: TReadOnlyProperty<ParticleTypeString> | null;
  colorGradientIndexNumberProperty?: TReadOnlyProperty<number> | null;
};
type ParticleNodeOptions = SelfOptions & CircleOptions;

class ParticleNode extends Circle {
  private readonly disposeParticleNode: VoidFunction;

  public constructor( particleType: ParticleTypeString, radius: number, providedOptions?: ParticleNodeOptions ) {

    const ownsHighContrastProperty = providedOptions && !providedOptions.highContrastProperty;
    const options = optionize<ParticleNodeOptions, SelfOptions, CircleOptions>()( {

      cursor: 'pointer',

      highContrastProperty: new BooleanProperty( false ),

      typeProperty: null,

      colorGradientIndexNumberProperty: null
    }, providedOptions );

    assert && assert( options.fill === undefined, 'fill will be set programmatically and should not be specified' );
    assert && assert( options.stroke === undefined, 'stroke will be set programmatically and should not be specified' );
    assert && assert( options.lineWidth === undefined, 'line width will be set programmatically and should not be specified' );

    // Get the color to use as the basis for the gradients, fills, strokes and such.
    const baseColor = PARTICLE_COLORS[ particleType ];
    assert && assert( baseColor, `Unrecognized particle type: ${particleType}` );

    const colorProperty = new ColorProperty( baseColor );
    super( radius, options );

    const colorMultilink = Multilink.multilink( [
      colorProperty,
      options.highContrastProperty
    ], ( color, highContrast ) => {

      // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
      const gradientFill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, color );

      // Set the options for the default look.
      const nonHighContrastStroke = color.colorUtilsDarker( 0.33 );
      this.fill = highContrast ? colorProperty.value : gradientFill;
      this.stroke = highContrast ? colorProperty.value.colorUtilsDarker( 0.5 ) : nonHighContrastStroke;
      this.lineWidth = highContrast ? HIGH_CONTRAST_LINE_WIDTH : DEFAULT_LINE_WIDTH;
    } );


    // change the color of the particle
    options.colorGradientIndexNumberProperty && options.colorGradientIndexNumberProperty.link( indexValue => {
      const typeProperty = options.typeProperty!;
      if ( typeProperty.value === 'proton' || typeProperty.value === 'neutron' ) {

        let nucleonChangeColorChange: Color[] = [ Color.BLACK ];
        if ( typeProperty.value === 'proton' ) {
          nucleonChangeColorChange = NUCLEON_COLOR_GRADIENT.slice().reverse();
        }
        else if ( typeProperty.value === 'neutron' ) {
          nucleonChangeColorChange = NUCLEON_COLOR_GRADIENT.slice();
        }

        // the value is close to an integer
        if ( Math.floor( indexValue * 10 ) / 10 % 1 === 0 ) {
          colorProperty.value = nucleonChangeColorChange[ Utils.toFixed( indexValue, 0 ) as unknown as number ];
        }
      }
    } );

    this.disposeParticleNode = () => {
      colorMultilink.dispose();
      ownsHighContrastProperty && options.highContrastProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeParticleNode();
    super.dispose();
  }
}

shred.register( 'ParticleNode', ParticleNode );
export default ParticleNode;