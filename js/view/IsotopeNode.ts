// Copyright 2015-2025, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not track a particle, use ParticleView for that.
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
  protonCount?: number;
  massNumber?: number;
};
export type IsotopeNodeOptions = SelfOptions & CircleOptions;

class IsotopeNode extends Node {

  public constructor( isotope: Particle, radius: number, providedOptions?: IsotopeNodeOptions ) {

    const options = optionize<IsotopeNodeOptions, SelfOptions, NodeOptions>()( {
      showLabel: true,
      protonCount: 1,
      massNumber: 1
    }, providedOptions );

    // Call super constructor.
    super( options );

    // Create the node a circle with a gradient.
    const isotopeSphere = new Circle( radius, {
      fill: isotope.colorProperty,
      cursor: 'pointer'
    } );
    this.addChild( isotopeSphere );

    if ( options.showLabel ) {

      const symbol = AtomIdentifier.getSymbol( options.protonCount );

      const label = new RichText( ` <sup>${options.massNumber}</sup>${symbol}`, {
        font: new PhetFont( 10 ),
        // Make sure the text doesn't go beyond the sphere boundaries. -2 is empirically determined.
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
        .addColorStop( 1, isotope.colorProperty );
    }
    else {
      isotopeSphere.stroke = 'black';
    }
  }
}

shred.register( 'IsotopeNode', IsotopeNode );
export default IsotopeNode;