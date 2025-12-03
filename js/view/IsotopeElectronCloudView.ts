// Copyright 2015-2025, University of Colorado Boulder

/**
 * Node that represents the electron shells in an isotope as a "cloud" that grows and shrinks depending on the number
 * of electrons that it contains.  This particular class implements behavior needed for the Isotopes simulation, which
 * is somewhat different from that needed for Build an Atom.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg
 * @author Aadish Gupta
 */

import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { TReadOnlyNumberAtom } from '../model/NumberAtom.js';
import shred from '../shred.js';

type IsotopeElectronCloudViewOptions = CircleOptions;

// This data structure maps the number of electrons to a radius for an atom.  It assumes a stable, neutral atom.
// The basic values are the covalent radii that were taken from a Wikipedia entry entitled "Atomic radii of the
// elements" which, at the time of this writing, can be found here:
// https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page).
// The values are in picometers.  In practice, the difference between the radii worked out to be a bit too much
// visually, so there are some 'tweak factors' for a few of the elements.
const MAP_ELECTRON_COUNT_TO_RADIUS = new Map<number, number>( [
  [ 1, 38 ],
  [ 2, 32 ],
  [ 3, 134 ],
  [ 4, 90 ],
  [ 5, 82 ],
  [ 6, 77 ],
  [ 7, 75 ],
  [ 8, 73 ],
  [ 9, 71 ],
  [ 10, 69 ]
] );

// The following is a set adjustment factors for the radii above.  They were empirically determined to keep the range of
// sizes visually reasonable.  This is separate from the radius values above so that we could use real values there.
// Adjustment factors are assumed to be 1 for any number of electrons not listed here.
const RADIUS_ADJUSTMENT_FACTORS = new Map<number, number>( [
  [ 1, 1.75 ],
  [ 2, 1.85 ],
  [ 4, 1.35 ],
  [ 5, 1.4 ],
  [ 6, 1.45 ],
  [ 7, 1.45 ],
  [ 8, 1.45 ],
  [ 9, 1.45 ],
  [ 10, 1.45 ]
] );

class IsotopeElectronCloudView extends Circle {
  private readonly disposeIsotopeElectronCloudView: VoidFunction;

  public constructor(
    numberAtom: TReadOnlyNumberAtom,
    modelViewTransform: ModelViewTransform2,
    providedOptions?: IsotopeElectronCloudViewOptions
  ) {

    const options = optionize<IsotopeElectronCloudViewOptions, EmptySelfOptions, CircleOptions>()( {
      pickable: false,
      tandem: Tandem.REQUIRED
    }, providedOptions );
    affirm( !options.pickable, 'IsotopeElectronCloudView cannot be pickable' );

    // Call super constructor using dummy radius - actual radius is updated below.
    super( 1, options );

    const updateNode = ( numElectrons: number ) => {
      if ( numElectrons === 0 ) {
        this.radius = 1E-5; // arbitrary non-zero value
        this.fill = 'transparent';
      }
      else {
        affirm(
          MAP_ELECTRON_COUNT_TO_RADIUS.has( numElectrons ),
          `Atom has more than supported number of electrons, ${numElectrons}`
        );
        const radiusAdjustmentFactor = RADIUS_ADJUSTMENT_FACTORS.get( numElectrons ) || 1;
        const radiusInModelUnits = MAP_ELECTRON_COUNT_TO_RADIUS.get( numElectrons )! * radiusAdjustmentFactor;
        this.radius = modelViewTransform.modelToViewDeltaX( radiusInModelUnits );
        this.fill = new RadialGradient( 0, 0, 0, 0, 0, this.radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 0 )' )
          .addColorStop( 1, 'rgba( 0, 0, 255, 0.4 )' );
      }
    };
    updateNode( numberAtom.electronCountProperty.get() );

    // Update the cloud size as electrons come and go.
    numberAtom.protonCountProperty.link( updateNode );

    this.disposeIsotopeElectronCloudView = function() {
      numberAtom.protonCountProperty.unlink( updateNode );
    };
  }

  public override dispose(): void {
    this.disposeIsotopeElectronCloudView();
    super.dispose();
  }
}

shred.register( 'IsotopeElectronCloudView', IsotopeElectronCloudView );
export default IsotopeElectronCloudView;