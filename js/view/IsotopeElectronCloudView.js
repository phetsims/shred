// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node that represents the electron shells in an isotope as a "cloud" that grows and shrinks depending on the number
 * of electrons that it contains.  This particular class implements behavior needed for the Isotopes simulation, which
 * is somewhat different from that needed for Build an Atom.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 * @author Aadish Gupta
 */

import LinearFunction from '../../../dot/js/LinearFunction.js';
import merge from '../../../phet-core/js/merge.js';
import { Circle, RadialGradient } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// constants
const MAX_ELECTRONS = 10; // For neon.

class IsotopeElectronCloudView extends Circle {

  /**
   * Constructor for the Isotope Electron Cloud.
   *
   * @param {NumberAtom} numberAtom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( numberAtom, modelViewTransform, options ) {

    options = merge( {
      pickable: false,
      tandem: Tandem.REQUIRED
    }, options );
    assert && assert( !options.pickable, 'IsotopeElectronCloudView cannot be pickable' );

    // Call super constructor using dummy radius and actual is updated below.
    super( 1, options );

    const updateNode = numElectrons => {
      if ( numElectrons === 0 ) {
        this.radius = 1E-5; // Arbitrary non-zero value.
        this.fill = 'transparent';
      }
      else {
        this.radius = modelViewTransform.modelToViewDeltaX( this.getElectronShellDiameter( numElectrons ) / 2 );
        // empirically determined adjustment factor according to the weighing scale
        this.radius = this.radius * 1.2;
        this.fill = new RadialGradient( 0, 0, 0, 0, 0, this.radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 0 )' )
          .addColorStop( 1, 'rgba( 0, 0, 255, 0.4 )' );
      }
    };
    updateNode( numberAtom.electronCountProperty.get() );

    // Update the cloud size as electrons come and go.
    numberAtom.protonCountProperty.link( updateNode );

    // @private
    this.disposeIsotopeElectronCloudView = function() {
      numberAtom.protonCountProperty.unlink( updateNode );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeIsotopeElectronCloudView();
    super.dispose();
  }

  /**
   * Maps a number of electrons to a diameter in screen coordinates for the electron shell.  This mapping function is
   * based on the real size relationships between the various atoms, but has some tweakable parameters to reduce the
   * range and scale to provide values that are usable for our needs on the canvas.
   * @param {number} numElectrons
   * @public
   */
  getElectronShellDiameter( numElectrons ) {

    // This data structure maps the number of electrons to a radius for an atom.  It assumes a stable, neutral atom.
    // The basic values are the covalent radii, and were taken from a Wikipedia entry entitled "Atomic radii of the
    // elements" which, at the time of this writing, can be found here:
    // https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page).
    // The values are in picometers.  In practice, the difference between the radii worked out to be a bit too much
    // visually, so there are some 'tweak factors' for a few of the elements.
    const mapElectronCountToRadius = {
      1: 38,
      2: 32,
      3: 134 * 0.75,
      4: 90 * 0.97,
      5: 82,
      6: 77,
      7: 75,
      8: 73,
      9: 71,
      10: 69
    };

    // Determine the min and max radii of the supported atoms.
    let minShellRadius = Number.MAX_VALUE;
    let maxShellRadius = 0;

    for ( const radius in mapElectronCountToRadius ) {
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
    const reduceRadiusRange = function( value ) {
      // The following two factors define the way in which an input value is increased or decreased.  These values
      // can be adjusted as needed to make the cloud size appear as desired.
      const minChangedRadius = 40;
      const maxChangedRadius = 55;

      const compressionFunction = new LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
      return compressionFunction.evaluate( value );
    };

    if ( numElectrons in mapElectronCountToRadius ) {
      return reduceRadiusRange( mapElectronCountToRadius[ numElectrons ] );
    }
    else {
      assert && assert( numElectrons <= MAX_ELECTRONS, `Atom has more than supported number of electrons, ${numElectrons}` );
      return 0;
    }
  }
}

shred.register( 'IsotopeElectronCloudView', IsotopeElectronCloudView );
export default IsotopeElectronCloudView;