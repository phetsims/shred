// Copyright 2015-2019, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( require => {
  'use strict';

  const AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const shred = require( 'SHRED/shred' );

  /**
   * @param {Particle} isotope
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function IsotopeNode( isotope, radius, options ) {
    options = _.extend( {
      showLabel: true
    }, options );

    Node.call( this, options ); // Call super constructor.

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
      const label = new RichText( ' <sup>' + isotope.massNumber + '</sup>' + symbol, {
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

  shred.register( 'IsotopeNode', IsotopeNode );
  // Inherit from Node.
  return inherit( Node, IsotopeNode );
} );