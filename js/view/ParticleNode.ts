// Copyright 2014-2023, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient. This type does not
 * track a particle, use ParticleView for that. Basically this is just an icon.
 */

import Utils from '../../../dot/js/Utils.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import { Circle, CircleOptions, Color, RadialGradient } from '../../../scenery/js/imports.js';
import shred from '../shred.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import { ParticleTypeString } from '../model/Particle.js';

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
  highContrastProperty?: TReadOnlyProperty<boolean> | null;
  typeProperty?: TReadOnlyProperty<ParticleTypeString> | null;
  colorGradientIndexNumberProperty?: TReadOnlyProperty<number> | null;
};
type ParticleNodeOptions = SelfOptions & CircleOptions;

class ParticleNode extends Circle {
  private readonly disposeParticleNode: VoidFunction;

  public constructor( particleType: ParticleTypeString, radius: number, providedOptions?: ParticleNodeOptions ) {

    const options = optionize<ParticleNodeOptions, SelfOptions, CircleOptions>()( {

      cursor: 'pointer',

      highContrastProperty: null,

      typeProperty: null,

      colorGradientIndexNumberProperty: null
    }, providedOptions );

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
    const changeParticleColor = ( newColor: Color ) => {

      // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
      const gradientFill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, newColor );

      // Set the options for the default look.
      const nonHighContrastStroke = newColor.colorUtilsDarker( 0.33 );

      this.mutate( {
        fill: gradientFill,
        stroke: nonHighContrastStroke
      } );
    };

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
          changeParticleColor( nucleonChangeColorChange[ Utils.toFixed( indexValue, 0 ) as unknown as number ] );
        }
      }
    } );

    // If a highContrastProperty is provided, update the particle appearance based on its value.
    // Set up the fill and the strokes based on whether the highContrastProperty option is provided.
    let highContrastListener: ( ( highContrast: boolean ) => void ) | null = null;
    if ( options.highContrastProperty ) {
      highContrastListener = highContrast => {
        this.fill = highContrast ? baseColor : gradientFill;
        this.stroke = highContrast ? baseColor.colorUtilsDarker( 0.5 ) : nonHighContrastStroke;
        this.lineWidth = highContrast ? HIGH_CONTRAST_LINE_WIDTH : DEFAULT_LINE_WIDTH;
      };
      options.highContrastProperty.link( highContrastListener );
    }

    this.disposeParticleNode = () => {
      if ( highContrastListener ) {
        options.highContrastProperty!.unlink( highContrastListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeParticleNode();
    super.dispose();
  }
}

shred.register( 'ParticleNode', ParticleNode );
export default ParticleNode;