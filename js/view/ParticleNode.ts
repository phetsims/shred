// Copyright 2014-2025, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient. This type does not
 * track a particle, use ParticleView for that. Basically this is just an icon.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Multilink from '../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import Color from '../../../scenery/js/util/Color.js';
import ColorProperty from '../../../scenery/js/util/ColorProperty.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import { PARTICLE_COLORS, ParticleTypeString } from '../model/Particle.js';
import shred from '../shred.js';

type SelfOptions = {

  // {BooleanProperty|null} - if provided, this is used to set the particle node into and out of high contrast mode
  highContrastProperty?: TReadOnlyProperty<boolean>;
  typeProperty?: TReadOnlyProperty<ParticleTypeString> | null;
  colorProperty?: TReadOnlyProperty<Color>;
};
type ParticleNodeOptions = SelfOptions & CircleOptions;

class ParticleNode extends Circle {
  private readonly disposeParticleNode: VoidFunction;

  public constructor( particleType: ParticleTypeString, radius: number, providedOptions?: ParticleNodeOptions ) {

    // Get the color to use as the basis for the gradients, fills, strokes and such.
    const baseColor = PARTICLE_COLORS[ particleType ];
    assert && assert( baseColor, `Unrecognized particle type: ${particleType}` );

    const ownsHighContrastProperty = providedOptions && !providedOptions.highContrastProperty;
    const ownsColorProperty = providedOptions && !providedOptions.colorProperty;

    const options = optionize<ParticleNodeOptions, SelfOptions, CircleOptions>()( {

      cursor: 'pointer',

      highContrastProperty: new BooleanProperty( false ),

      typeProperty: null,

      colorProperty: new ColorProperty( baseColor ),

      stroke: baseColor.colorUtilsDarker( 0.33 )
    }, providedOptions );

    assert && assert( options.fill === undefined, 'fill will be set programmatically and should not be specified' );
    assert && assert( options.lineWidth === undefined, 'line width will be set programmatically and should not be specified' );

    super( radius, options );

    const colorMultilink = Multilink.multilink( [
      options.colorProperty,
      options.highContrastProperty
    ], ( color, highContrast ) => {

      // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
      const gradientFill = new RadialGradient(
        -radius * 0.4, -radius * 0.4, 0,
        -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, color );

      // Set the options for the default look.
      this.fill = highContrast ? options.colorProperty.value : gradientFill;
      this.stroke = options.stroke;
      this.lineWidth = 1;
    } );

    this.disposeParticleNode = () => {
      colorMultilink.dispose();
      ownsHighContrastProperty && options.highContrastProperty.dispose();
      ownsColorProperty && options.colorProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeParticleNode();
    super.dispose();
  }
}

shred.register( 'ParticleNode', ParticleNode );
export default ParticleNode;