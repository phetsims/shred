// Copyright 2015, University of Colorado Boulder

/**
 * Node that represents the electron shells in an isotope as a "cloud" that grows and shrinks depending on the number
 * of electrons that it contains.  This particular class implements behavior needed for the Isotopes simulation, which
 * is somewhat different from that needed for Build an Atom.  Note that the name 'IsotopethisNodeView' was chosen
 * in order to keep up with electron cloud naming conventions in Build an Atom (i.e. thisNodeView,
 * ElectronShellView).
 *
 * @author John Blanco
 * @author Jesse Greenberg
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // constants
  var MAX_ELECTRONS = 10; // For neon.

  /**
   * Constructor for the Isotope Electron Cloud.
   *
   * @param {NumberAtom} numberAtom
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function IsotopeElectronCloudView( numberAtom, modelViewTransform ) {

    // Call super constructor using dummy radius and actual is updated below.
    Circle.call( this, 1, { pickable: false } );

    // carry this through the scope
    var thisNode = this;

    var updateNode = function( numElectrons ) {
      if ( numElectrons === 0 ) {
        thisNode.radius = 1E-5; // Arbitrary non-zero value.
        thisNode.fill = 'transparent';
      }
      else {
        thisNode.radius = modelViewTransform.modelToViewDeltaX( thisNode.getElectronShellDiameter( numElectrons ) / 2 );
        thisNode.radius = thisNode.radius * 1.2; // empirically determined adjustment factor according to the weighing scale
        thisNode.fill = new RadialGradient( 0, 0, 0, 0, 0, thisNode.radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 0 )' )
          .addColorStop( 1, 'rgba( 0, 0, 255, 0.4 )' );
      }
    };
    updateNode( numberAtom.electronCount );

    // Update the cloud size as electrons come and go.
    numberAtom.protonCountProperty.link( function( length ) {
      updateNode( length );
    } );

  }

  shred.register( 'IsotopeElectronCloudView', IsotopeElectronCloudView );
  return inherit( Circle, IsotopeElectronCloudView, {

    /**
     * Maps a number of electrons to a diameter in screen coordinates for the electron shell.  This mapping function is
     * based on the real size relationships between the various atoms, but has some tweakable parameters to reduce the
     * range and scale to provide values that are usable for our needs on the canvas.
     */
    getElectronShellDiameter: function( numElectrons ) {

      // This data structure maps atomic number of atomic radius.  The values are the covalent radii, and were taken from
      // a Wikipedia entry entitled "Atomic radii of the elements".  Values are in picometers.
      var mapElectronCountToRadius = {
        1: 38,
        2: 32,
        3: 134,
        4: 90,
        5: 82,
        6: 77,
        7: 75,
        8: 73,
        9: 71,
        10: 69
      };

      // Determine the min and max radii of the supported atoms.
      var minShellRadius = Number.MAX_VALUE;
      var maxShellRadius = 0;

      for ( var radius in mapElectronCountToRadius ) {
        if ( radius > maxShellRadius ) {
          maxShellRadius = radius;
        }
        if ( radius < minShellRadius ) {
          minShellRadius = radius;
        }
      }

      // This method increases the value of the smaller radius values and decreases the value of the larger ones.
      // This effectively reduces the range of radii values used.
      // This is a very specialized function for the purposes of this class.
      var reduceRadiusRange = function( value ) {
        // The following two factors define the way in which an input value is increased or decreased.  These values
        // can be adjusted as needed to make the cloud size appear as desired.
        var minChangedRadius = 40;
        var maxChangedRadius = 55;

        var compressionFunction = new LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
        return compressionFunction( value );
      };

      if ( numElectrons in mapElectronCountToRadius ) {
        return reduceRadiusRange( mapElectronCountToRadius[ numElectrons ] );
      }
      else {
        if ( numElectrons > MAX_ELECTRONS ) {
          console.error( 'Warning: Atom has more than supported number of electrons, ' + numElectrons );
        }
        return 0;
      }
    }


  } );

} );