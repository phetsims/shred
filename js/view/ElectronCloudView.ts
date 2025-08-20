// Copyright 2014-2025, University of Colorado Boulder

/**
 * Node that represents the electron shell in an atom as a "cloud" that grows and shrinks depending on the number of
 * electrons it contains.  This has also been referred to as the "Schrodinger model" representation.
 *
 * @author John Blanco
 */

import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../scenery/js/listeners/DragListener.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import ParticleAtom from '../model/ParticleAtom.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';

type SelfOptions = EmptySelfOptions;
type ElectronCloudViewOptions = SelfOptions & WithRequired<CircleOptions, 'tandem'>;

// constants
const DEFAULT_RADIUS = 50; // in pm, chosen as an arbitrary value that is close to the "real" values that are used

class ElectronCloudView extends Circle {

  // function to dispose of the view, including listeners
  private readonly disposeElectronCloudView: VoidFunction;

  public constructor( atom: ParticleAtom,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: ElectronCloudViewOptions ) {

    const options = optionize<ElectronCloudViewOptions, EmptySelfOptions, CircleOptions>()( {
      cursor: 'pointer',
      fill: 'transparent',
      phetioVisiblePropertyInstrumented: false // Don't allow phet-io users to hide this.
    }, providedOptions );

    assert && assert( options.translation === undefined, 'ElectronCloudView sets translation' );
    options.translation = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    super( DEFAULT_RADIUS, options );

    // Function that updates the size of the cloud based on the number of electrons.
    const update = ( numElectrons: number ) => {
      if ( numElectrons === 0 ) {
        this.radius = 1E-5; // arbitrary non-zero value
        this.fill = 'transparent';
      }
      else {
        const minRadius = modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ) * 0.5;
        const maxRadius = modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius );
        const radius = minRadius + ( ( maxRadius - minRadius ) / ShredConstants.MAX_ELECTRONS ) * numElectrons;
        this.radius = radius;
        this.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 200 )' )
          .addColorStop( 0.9, 'rgba( 0, 0, 255, 0 )' );
      }
    };
    update( atom.electrons.length );

    // Update the cloud size as electrons come and go.
    atom.electrons.lengthProperty.link( update );

    // closure for converting a point in local coordinate frame to model coordinates
    const localViewToModel = ( point: Vector2 ) => {

      // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
      // JB, SR, and JO discussed potentially better ways to do it but didn't come up with anything at the time. If
      // this code is leveraged, this transform should be revisited for potential improvement.
      return modelViewTransform.viewToModelPosition(
        this.getParents()[ 0 ].globalToLocalPoint( point )
      );
    };

    // If the user clicks on the cloud, extract an electron.
    this.addInputListener( DragListener.createForwardingListener( event => {
      const positionInModelSpace = localViewToModel( event.pointer.point );

      const electron = atom.extractParticle( 'electron' );
      if ( electron !== null ) {
        electron.setPositionAndDestination( positionInModelSpace );
        electron.startDragEmitter.emit( event );
      }
    } ) );

    this.disposeElectronCloudView = () => {
      atom.electrons.lengthProperty.unlink( update );
    };
  }

  public override dispose(): void {
    this.disposeElectronCloudView();
    super.dispose();
  }
}

shred.register( 'ElectronCloudView', ElectronCloudView );
export default ElectronCloudView;