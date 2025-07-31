// Copyright 2014-2025, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient. This type does not
 * track a particle, use ParticleView for that. Basically this is just an icon.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import Color from '../../../scenery/js/util/Color.js';
import ColorProperty from '../../../scenery/js/util/ColorProperty.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import { PARTICLE_COLORS, ParticleTypeString } from '../model/Particle.js';
import shred from '../shred.js';

type SelfOptions = {
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

    const ownsColorProperty = providedOptions && !providedOptions.colorProperty;

    const options = optionize<ParticleNodeOptions, SelfOptions, CircleOptions>()( {

      cursor: 'pointer',

      typeProperty: null,

      colorProperty: new ColorProperty( baseColor ),

      // Since we're doing a radial gradient, we found that using the same base color as stroke works best for contrast
      stroke: baseColor
    }, providedOptions );

    assert && assert( options.fill === undefined, 'fill will be set programmatically and should not be specified' );
    assert && assert( options.lineWidth === undefined, 'line width will be set programmatically and should not be specified' );

    super( radius, options );

    options.colorProperty.link( color => {

      // Create the fill that will be used to make the particles look 3D when not in high-contrast mode.
      this.fill = new RadialGradient(
        -radius * 0.4, -radius * 0.4, 0,
        -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, color );
      this.stroke = options.stroke;
      this.lineWidth = 1;
    } );

    this.disposeParticleNode = () => {
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