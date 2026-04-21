// Copyright 2015-2026, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not track a particle, use ParticleView for that.
 *
 * @author Aadish Gupta
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import AtomNameUtils from '../AtomNameUtils.js';
import Particle from '../model/Particle.js';

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
      stroke: new DerivedProperty( [ isotope.colorProperty ], color => color.colorUtilsDarker( 0.5 ) ),
      lineWidth: 0.5,
      cursor: 'pointer'
    } );
    this.addChild( isotopeSphere );

    if ( options.showLabel ) {

      const symbol = AtomNameUtils.getSymbol( options.protonCount );

      const label = new RichText( ` <sup>${options.massNumber}</sup>${symbol}`, {
        font: new PhetFont( 10 ),

        // Make sure the text doesn't go beyond the sphere boundaries. The multiplier is empirically determined.
        maxWidth: 2 * radius * 0.85
      } );
      label.centerX = isotopeSphere.centerX;
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

export default IsotopeNode;
