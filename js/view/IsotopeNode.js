// Copyright 2015, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( function( require ) {
  'use strict';

  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var shred = require( 'SHRED/shred' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

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

    var baseColor = isotope.color;
    if ( baseColor === undefined ) {
      console.error( 'Unrecognized particle: ' + isotope.type );
      baseColor = 'black';
    }

    // Create the node a circle with a gradient.
    var isotopeSphere = new Circle( radius, {
      fill: baseColor,
      cursor: 'pointer'
    } );
    this.addChild( isotopeSphere );

    if ( options.showLabel ) {
      var symbol = AtomIdentifier.getSymbol( isotope.protonCount );
      var label = new SubSupText( ' <sup>' + isotope.massNumber + '</sup>' + symbol, {
        font: new PhetFont( 10 ),
        maxWidth: 2 * radius - 2 // making sure that text doesn't goes beyond the sphere boundaries, -2 is empirically determined
      } );
      label.centerX = isotopeSphere.centerX - 1; // empirically determined -1 to make it appear centered
      label.centerY = isotopeSphere.centerY;
      isotopeSphere.addChild( label );
      isotopeSphere.fill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, baseColor );
    }
    else{
      isotopeSphere.stroke = 'black';
    }
  }

  shred.register( 'IsotopeNode', IsotopeNode );
  // Inherit from Node.
  return inherit( Node, IsotopeNode );
} );