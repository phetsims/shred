// Copyright 2015-2022, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Circle, Node, RadialGradient, RichText } from '../../../scenery/js/imports.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';

/**
 * @param {Particle} isotope
 * @param {number} radius
 * @param {Object} [options]
 * @constructor
 */
class IsotopeNode extends Node {
  constructor( isotope, radius, options ) {
    options = merge( {
      showLabel: true
    }, options );

    // Call super constructor.
    super( options );

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
      const symbol = AtomIdentifier.getSymbol( isotope.protonCount );
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