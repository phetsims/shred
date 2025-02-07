// Copyright 2015-2024, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 *
 * @author Aadish Gupta
 */

import optionize from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import AtomIdentifier from '../AtomIdentifier.js';
import Particle from '../model/Particle.js';
import shred from '../shred.js';


type SelfOptions = {
  showLabel?: boolean;
};
type IsotopeNodeOptions = SelfOptions & CircleOptions;

class IsotopeNode extends Node {
  public constructor( isotope: Particle, radius: number, providedOptions?: IsotopeNodeOptions ) {
    const options = optionize<IsotopeNodeOptions, SelfOptions, NodeOptions>()( {
      showLabel: true
    }, providedOptions );

    // Call super constructor.
    super( options );

    // @ts-expect-error - Seems like some work needs to be done here when Isotopes And Atomic Mass is converted to TypeScript
    let baseColor = isotope.color;
    if ( baseColor === undefined ) {
      assert && assert( false, 'Unrecognized Isotope' );
      baseColor = 'black';
    }

    // Create the node a circle with a gradient.
    const isotopeSphere = new Circle( radius, {
      fill: baseColor,
      cursor: 'pointer'
    } );
    this.addChild( isotopeSphere );

    if ( options.showLabel ) {
      // @ts-expect-error - Seems like some work needs to be done here when Isotopes And Atomic Mass is converted to TypeScript
      const symbol = AtomIdentifier.getSymbol( isotope.protonCount );
      // @ts-expect-error - Seems like some work needs to be done here when Isotopes And Atomic Mass is converted to TypeScript
      const label = new RichText( ` <sup>${isotope.massNumber}</sup>${symbol}`, {
        font: new PhetFont( 10 ),
        // making sure that text doesn't goes beyond the sphere boundaries, -2 is empirically determined
        maxWidth: 2 * radius - 2
      } );
      label.centerX = isotopeSphere.centerX - 1; // empirically determined -1 to make it appear centered
      label.centerY = isotopeSphere.centerY;
      isotopeSphere.addChild( label );
      isotopeSphere.fill = new RadialGradient(
        -radius * 0.4,
        -radius * 0.4,
        0,
        -radius * 0.4,
        -radius * 0.4,
        radius * 1.6
      )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, baseColor );
    }
    else {
      isotopeSphere.stroke = 'black';
    }
  }
}

shred.register( 'IsotopeNode', IsotopeNode );
export default IsotopeNode;