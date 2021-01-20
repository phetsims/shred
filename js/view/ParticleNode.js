// Copyright 2014-2015, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var DEFAULT_LINE_WIDTH = 0.5;

  /**
   * @param {string} particleType - proton, neutron, or electron
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function ParticleNode( particleType, radius, options ) {

    options = _.extend( {
      tandem: Tandem.tandemRequired()
    }, options );

    Node.call( this, options ); // Call super constructor.

    var colors = {
      proton: PhetColorScheme.RED_COLORBLIND,
      neutron: Color.gray,
      electron: Color.blue
    };
    var baseColor = colors[ particleType ];
    if ( baseColor === undefined ) {
      assert && assert( false, 'Unrecognized particle type: ' + particleType );
      baseColor = 'black';
    }
    var gradientFill = new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
      .addColorStop( 0, 'white' )
      .addColorStop( 1, baseColor );
    var nonHighContrastStroke = baseColor.colorUtilsDarker( 0.33 );

    // Create the circle node.
    var circle = new Circle( radius, {
      fill: gradientFill,
      stroke: nonHighContrastStroke,
      lineWidth: DEFAULT_LINE_WIDTH,
      cursor: 'pointer'
    } );
    this.addChild( circle );

    // If a highContrastProperty is provided, update the particle appearance based on its value.
    var highContrastListener = null;
    if ( options.highContrastProperty ) {
      highContrastListener = function( highContrast ) {
        circle.fill = highContrast ? baseColor : gradientFill;
        circle.stroke = highContrast ? baseColor.colorUtilsDarker( 0.5 ) : nonHighContrastStroke;
        circle.lineWidth = highContrast ? 2 : DEFAULT_LINE_WIDTH;
      };
      options.highContrastProperty.link( highContrastListener );
    }

    // @private - internal dispose function
    this.disposeParticleNode = function(){
      if ( highContrastListener ) {
        options.highContrastProperty.unlink( highContrastListener );
      }
    };
  }

  shred.register( 'ParticleNode', ParticleNode );

  // Inherit from Node.
  return inherit( Node, ParticleNode );
} );
