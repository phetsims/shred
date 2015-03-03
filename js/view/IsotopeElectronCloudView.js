//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that represents the electron shells in an isotope as a "cloud" that grows and shrinks depending on the number
 * of electrons that it contains.  This particular class implements behavior needed for the Isotopes simulation, which
 * is somewhat different from that needed for Build an Atom.  Note that the name 'IsotopeElectronCloudView' was chosen
 * in order to keep up with electron cloud naming conventions in Build an Atom (i.e. ElectronCloudView,
 * ElectronShellView).
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */


define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var dot = require( 'DOT/dot' );
  var Property = require( 'AXON/Property' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // class data
  var MAX_ELECTRONS = 10; // For neon.

  /**
   * Constructor for the Isotope Electron Cloud.
   *
   * @param {NumberAtom} numberAtom
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function IsotopeElectronCloudView( numberAtom, modelViewTransform ) {

    // Call super constructor.
    Node.call( this, { pickable: false } );

    // carry this through the scope
    var thisNode = this;

    // create the electron cloud as a circle - position, radius, and gradients updated below
    var electronCloud = new Circle( 0 );
    this.addChild( electronCloud );

    var updateElectronCloud = function( numElectrons ) {

      // function that maps alpha color values to number of electrons in current atom
      var electronCountToAlphaMapping = new dot.LinearFunction( 0, MAX_ELECTRONS, 80, 110 );
      var alpha = 0; // if there are no electrons, be transparent.

      if ( numElectrons === 0 ) {
        electronCloud.radius = 1E-5; // Arbitrary non-zero value.
        electronCloud.fill = 'transparent';
      }

      else {
        alpha = electronCountToAlphaMapping( numElectrons );
        // TODO: This should probably be done implicitly in the mapping.
        alpha /= 255; // Convert value to fraction of 255 for compliance with HTML5 radial gradient.

        var radius = thisNode.getElectronShellDiameter( numElectrons ) / 2;
        electronCloud.radius = radius;
        electronCloud.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
          .addColorStop( 0.33, 'rgba( 0, 0, 255, 0 )' )
          .addColorStop( 1, 'rgba( 0, 0, 255, ' + alpha + ' )' );
      }
    };
    updateElectronCloud( numberAtom.electronCount );

    // Update the cloud size as electrons come and go.
    numberAtom.electronCountProperty.link( function( length ) {
      updateElectronCloud( length );
    } );

  }

  // Inherit from Node.
  return inherit( Node, IsotopeElectronCloudView, {

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
        var minChangedRadius = 15;
        var maxChangedRadius = 38;

        var compressionFunction = new LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
        return compressionFunction( value );
      };

      if ( numElectrons in mapElectronCountToRadius ) {
        return reduceRadiusRange( mapElectronCountToRadius[ numElectrons ] );
      }
      else {
        if ( numElectrons > MAX_ELECTRONS ) {
          console.error( "Warning: Atom has more than supported number of electrons, " + numElectrons );
        }
        return 0;
      }
    }
  } );

} );

// TODO: Keeping it here for reference until the cloud diameter mapping looks good.
//
//  /**
//   * Maps a number of electrons to a diameter in screen coordinates for the
//   * electron shell.  This mapping function is based on the real size
//   * relationships between the various atoms, but has some tweakable
//   * parameters to reduce the range and scale to provide values that
//   * are usable for our needs on the canvas.
//   */
//  private double getElectronShellDiameter( int numElectrons ) {
//    if ( mapElectronCountToRadius.containsKey( numElectrons ) ) {
//      return reduceRadiusRange( mapElectronCountToRadius.get( numElectrons ) );
//    }
//    else {
//      if ( numElectrons > MAX_ELECTRONS ) {
//        System.out.println( getClass().getName() + " - Warning: Atom has more than supported number of electrons, " + numElectrons );
//      }
//      return 0;
//    }
//  }
//
//  // This data structure maps atomic number of atomic radius.  The values
//  // are the covalent radii, and were taken from a Wikipedia entry entitled
//  // "Atomic radii of the elements".  Values are in picometers.
//  private static Map<Integer, Double> mapElectronCountToRadius = new HashMap<Integer, Double>() {{
//    put( 1, 38d );   // Hydrogen
//    put( 2, 32d );   // Helium
//    put( 3, 134d );  // Lithium
//    put( 4, 90d );   // Beryllium
//    put( 5, 82d );   // Boron
//    put( 6, 77d );   // Carbon
//    put( 7, 75d );   // Nitrogen
//    put( 8, 73d );   // Oxygen
//    put( 9, 71d );   // Fluorine
//    put( 10, 69d );  // Neon
//  }};
//
//  // Determine the min and max radii of the supported atoms.
//  private static double minShellRadius, maxShellRadius;
//
//  static {
//    minShellRadius = Double.MAX_VALUE;
//    maxShellRadius = 0;
//    for ( Double radius : mapElectronCountToRadius.values() ) {
//      if ( radius > maxShellRadius ) {
//        maxShellRadius = radius;
//      }
//      if ( radius < minShellRadius ) {
//        minShellRadius = radius;
//      }
//    }
//  }
//
//  /**
//   * This method increases the value of the smaller radius values and
//   * decreases the value of the larger ones.  This effectively reduces
//   * the range of radii values used.
//   * <p/>
//   * This is a very specialized function for the purposes of this class.
//   */
//  private double reduceRadiusRange( double value ) {
//    // The following two factors define the way in which an input value is
//    // increased or decreased.  These values can be adjusted as needed
//    // to make the cloud size appear as desired.
//    double minChangedRadius = 40;
//    double maxChangedRadius = 100;
//
//    Function.LinearFunction compressionFunction = new Function.LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
//    return compressionFunction.evaluate( value );
//  }
//}
