// Copyright 2015, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( function( require ) {
  'use strict';

  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var shred = require( 'SHRED/shred' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * @param particleType - proton, neutron, or electron
   * @param radius
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
      fill: new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, baseColor ),
      cursor: 'pointer'
    } );
    this.addChild( isotopeSphere );

    if ( options.showLabel ) {
      var symbol = AtomIdentifier.getSymbol( isotope.protonCount );
      var label = new SubSupText( ' <sup>' + isotope.massNumber + '</sup>' + symbol, {
        font: new PhetFont( 10 )
      } );
      label.center = isotopeSphere.center;
      isotopeSphere.addChild( label );
    }
  }

  shred.register( 'IsotopeNode', IsotopeNode );
  // Inherit from Node.
  return inherit( Node, IsotopeNode );
} );